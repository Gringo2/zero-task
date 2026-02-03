import { useState, useCallback, useEffect } from 'react';
import { initDB } from '../services/db';

export type AuditAction = 'CREATE' | 'TOGGLE' | 'DELETE' | 'UPDATE' | 'REORDER' | 'IMPORT' | 'CLEAR' | 'AUTH' | 'SESSION_CLEAR';

export interface AuditEntry {
    id: string;
    action: AuditAction;
    timestamp: number;
    details: string;
}

const MAX_LOG_ENTRIES = 50;

/**
 * Custom Hook: useAudit
 * 
 * Manages a persistent log of system actions to ensure auditability.
 * Uses IndexedDB for storage.
 */
export const useAudit = () => {
    const [logs, setLogs] = useState<AuditEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Initial Hydration from IndexedDB
    useEffect(() => {
        const hydrate = async () => {
            try {
                const db = await initDB();
                const allLogs = await db.getAll('logs');
                // Latest first
                setLogs(allLogs.sort((a, b) => b.timestamp - a.timestamp).slice(0, MAX_LOG_ENTRIES));
            } catch (error) {
                console.error('Failed to load audit logs from IndexedDB', error);
            } finally {
                setIsLoading(false);
            }
        };

        hydrate();
    }, []);

    /**
     * Records a new action in the audit log.
     */
    const logAction = useCallback(async (action: AuditAction, details: string) => {
        const newEntry: AuditEntry = {
            id: crypto.randomUUID(),
            action,
            timestamp: Date.now(),
            details,
        };

        const db = await initDB();
        await db.put('logs', newEntry);

        setLogs(prev => [newEntry, ...prev].slice(0, MAX_LOG_ENTRIES));
    }, []);

    /**
     * Clears the audit log.
     */
    const clearLogs = useCallback(async () => {
        const db = await initDB();
        await db.clear('logs');
        setLogs([]);
    }, []);

    return {
        logs,
        isLoading,
        logAction,
        clearLogs,
    };
};
