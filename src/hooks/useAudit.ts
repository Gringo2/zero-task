import { useState, useCallback, useEffect } from 'react';

export type AuditAction = 'CREATE' | 'TOGGLE' | 'DELETE' | 'UPDATE' | 'REORDER' | 'IMPORT' | 'CLEAR';

export interface AuditEntry {
    id: string;
    action: AuditAction;
    timestamp: number;
    details: string;
}

const AUDIT_STORAGE_KEY = 'zero-task-audit-log';
const MAX_LOG_ENTRIES = 50;

/**
 * Custom Hook: useAudit
 * 
 * Manages a persistent log of system actions to ensure auditability.
 */
export const useAudit = () => {
    const [logs, setLogs] = useState<AuditEntry[]>(() => {
        try {
            const stored = localStorage.getItem(AUDIT_STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Failed to load audit logs', error);
            return [];
        }
    });

    // Persist logs to localStorage
    useEffect(() => {
        localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(logs));
    }, [logs]);

    /**
     * Records a new action in the audit log.
     */
    const logAction = useCallback((action: AuditAction, details: string) => {
        const newEntry: AuditEntry = {
            id: crypto.randomUUID(),
            action,
            timestamp: Date.now(),
            details,
        };

        setLogs(prev => [newEntry, ...prev].slice(0, MAX_LOG_ENTRIES));
    }, []);

    /**
     * Clears the audit log.
     */
    const clearLogs = useCallback(() => {
        setLogs([]);
    }, []);

    return {
        logs,
        logAction,
        clearLogs,
    };
};
