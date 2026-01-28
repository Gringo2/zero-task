/**
 * Enum-like object for Task Statuses.
 * Used to ensure type safety and consistency across the app.
 */
export const TaskStatus = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
} as const;

// Derive the value type from the TaskStatus object
export type TaskStatusType = typeof TaskStatus[keyof typeof TaskStatus];

/**
 * Domain Entity: Task
 * Represents a single unit of work in the system.
 */
export interface TTask {
  id: string;          // Unique Identifier (UUID)
  title: string;       // Short summary
  description: string; // Detailed information
  status: TaskStatusType; // Current state of the task
  createdAt: number;   // Timestamp (ms since epoch)
}
