export type AuditAction = 'CREATE' | 'TOGGLE' | 'DELETE' | 'UPDATE' | 'REORDER' | 'IMPORT' | 'CLEAR' | 'AUTH' | 'SESSION_CLEAR' | 'ASSIGN' | 'UNASSIGN';

export interface AuditEntry {
    id: string;
    action: AuditAction;
    timestamp: number;
    details: string;
    userId?: string; // ID of the user who performed the action
}
