import { useState, useCallback, useEffect } from 'react';
import type { TTask } from '../types/task';
import { TaskStatus } from '../types/task';

const STORAGE_KEY = 'zero-task-data';

/**
 * Custom Hook: useTasks
 * 
 * Manages the global state for tasks in the application.
 * Persists data to localStorage to survive page reloads.
 * 
 * @param onAction - Optional callback to log mutations
 * @returns Object containing the tasks array and action handlers.
 */
export const useTasks = (onAction?: (action: string, details: string) => void) => {
    // State: Array of task objects
    // Initialize from localStorage to allow persistence
    const [tasks, setTasks] = useState<TTask[]>(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Failed to load tasks', error);
            return [];
        }
    });

    // Effect: Sync tasks to localStorage whenever they change
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        } catch (error) {
            console.error('Failed to save tasks', error);
        }
    }, [tasks]);

    /**
     * Adds a new task to the list.
     * Generates a unique ID and timestamp.
     * 
     * @param title - The title of the task
     * @param description - Optional description
     */
    const addTask = useCallback((title: string, description: string) => {
        const newTask: TTask = {
            id: crypto.randomUUID(),
            title,
            description,
            status: TaskStatus.PENDING,
            createdAt: Date.now(),
        };
        // Use functional update to ensure we have the latest state
        setTasks(prev => [newTask, ...prev]);
        onAction?.('CREATE', `Added task: ${title}`);
    }, [onAction]);

    /**
     * Toggles a task's status between PENDING and COMPLETED.
     * 
     * @param id - The UUID of the task to toggle
     */
    const toggleTask = useCallback((id: string) => {
        setTasks(prev => {
            const task = prev.find(t => t.id === id);
            if (task) {
                onAction?.('TOGGLE', `Toggled task: ${task.title}`);
            }
            return prev.map(task =>
                task.id === id
                    ? { ...task, status: task.status === TaskStatus.COMPLETED ? TaskStatus.PENDING : TaskStatus.COMPLETED }
                    : task
            );
        });
    }, [onAction]);

    /**
     * Removes a task from the list by ID.
     * 
     * @param id - The UUID of the task to delete
     */
    const deleteTask = useCallback((id: string) => {
        setTasks(prev => {
            const task = prev.find(t => t.id === id);
            if (task) {
                onAction?.('DELETE', `Deleted task: ${task.title}`);
            }
            return prev.filter(task => task.id !== id);
        });
    }, [onAction]);

    /**
     * Updates an existing task's title and description.
     * 
     * @param id - The UUID of the task to update
     * @param title - New title
     * @param description - New description
     */
    const updateTask = useCallback((id: string, title: string, description: string) => {
        setTasks(prev => {
            onAction?.('UPDATE', `Updated task: ${title}`);
            return prev.map(task =>
                task.id === id
                    ? { ...task, title, description }
                    : task
            );
        });
    }, [onAction]);

    /**
     * Reorders tasks in the list.
     * Used for drag-and-drop persistence.
     * 
     * @param newOrder - The new array of tasks
     */
    const reorderTasks = useCallback((newOrder: TTask[]) => {
        setTasks(newOrder);
        onAction?.('REORDER', 'Reordered tasks via drag-and-drop');
    }, [onAction]);

    /**
     * Imports tasks from an external JSON array.
     * 
     * @param newTasks - Array of TTask objects
     */
    const importTasks = useCallback((newTasks: TTask[]) => {
        setTasks(newTasks);
        onAction?.('IMPORT', `Imported ${newTasks.length} tasks from backup`);
    }, [onAction]);

    /**
     * Clears all tasks from the system.
     */
    const clearTasks = useCallback(() => {
        setTasks([]);
        onAction?.('CLEAR', 'Cleared all tasks from system');
    }, [onAction]);

    return {
        tasks,
        addTask,
        toggleTask,
        deleteTask,
        updateTask,
        reorderTasks,
        importTasks,
        clearTasks,
    };
};
