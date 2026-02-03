import { openDB, type IDBPDatabase } from 'idb';
import type { TTask } from '../types/task';
import type { AuditEntry } from '../hooks/useAudit';

const DB_NAME = 'zero-task-db';
const DB_VERSION = 1;

export interface DBMetadata {
    key: string;
    value: any;
}

export interface AuthMetadata {
    passcodeHash: string;
    salt: string;
    isSetup: boolean;
}

/**
 * Database Schema Definition
 */
interface ZeroTaskDB {
    tasks: {
        key: string;
        value: TTask;
    };
    logs: {
        key: string;
        value: AuditEntry;
    };
    metadata: {
        key: string;
        value: DBMetadata;
    };
}

let dbPromise: Promise<IDBPDatabase<ZeroTaskDB>>;

/**
 * Initialize and upgrade the database
 */
export const initDB = () => {
    if (!dbPromise) {
        dbPromise = openDB<ZeroTaskDB>(DB_NAME, DB_VERSION, {
            upgrade(db) {
                if (!db.objectStoreNames.contains('tasks')) {
                    db.createObjectStore('tasks', { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains('logs')) {
                    db.createObjectStore('logs', { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains('metadata')) {
                    db.createObjectStore('metadata', { keyPath: 'key' });
                }
            },
        });
    }
    return dbPromise;
};

/**
 * Migration Logic: localStorage -> IndexedDB
 */
export const migrateFromLocalStorage = async () => {
    const db = await initDB();

    // Check if migration already happened
    const migrationStatus = await db.get('metadata', 'migration_complete');
    if (migrationStatus) return;

    console.log('Starting migration from localStorage to IndexedDB...');

    // Migrate Tasks
    const storedTasks = localStorage.getItem('zero-task-data');
    if (storedTasks) {
        try {
            const tasks: TTask[] = JSON.parse(storedTasks);
            const tx = db.transaction('tasks', 'readwrite');
            for (const task of tasks) {
                await tx.store.put(task);
            }
            await tx.done;
            console.log(`Migrated ${tasks.length} tasks.`);
        } catch (e) {
            console.error('Task migration failed', e);
        }
    }

    // Migrate Logs
    const storedLogs = localStorage.getItem('zero-task-audit-log');
    if (storedLogs) {
        try {
            const logs: AuditEntry[] = JSON.parse(storedLogs);
            const tx = db.transaction('logs', 'readwrite');
            for (const log of logs) {
                await tx.store.put(log);
            }
            await tx.done;
            console.log(`Migrated ${logs.length} logs.`);
        } catch (e) {
            console.error('Log migration failed', e);
        }
    }

    // Mark as complete
    await db.put('metadata', { key: 'migration_complete', value: true });

    // Optional: We keep localStorage for one session as safety, 
    // or clear it if confident. Recommendation: Clear after first successful load.
};

/**
 * Auth Helpers
 */
export const getAuthMetadata = async (): Promise<AuthMetadata | null> => {
    const db = await initDB();
    const entry = await db.get('metadata', 'auth_metadata');
    return entry ? entry.value : null;
};

export const saveAuthMetadata = async (metadata: AuthMetadata) => {
    const db = await initDB();
    await db.put('metadata', { key: 'auth_metadata', value: metadata });
};
