import { useState, useCallback, useEffect } from 'react';
import { type TTask, TaskStatus } from '@zero-task/shared';
import { initDB, migrateFromLocalStorage } from '../services/db';

/**
 * Custom Hook: useTasks
 * 
 * Manages the global state for tasks in the application.
 * Persists data to IndexedDB to support scale and async I/O.
 * 
 * @param onAction - Optional callback to log mutations
 * @returns Object containing the tasks array and action handlers.
 */
export const useTasks = (onAction?: (action: string, details: string) => void) => {
    const [tasks, setTasks] = useState<TTask[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Initial Hydration from IndexedDB
    useEffect(() => {
        const hydrate = async () => {
            try {
                // Perform migration first if needed
                await migrateFromLocalStorage();

                const db = await initDB();
                const allTasks = await db.getAll('tasks');
                // Sort tasks by date (latest first) as IndexedDB doesn't guarantee order
                setTasks(allTasks.sort((a, b) => b.createdAt - a.createdAt));
            } catch (error) {
                console.error('Failed to hydrate tasks from IndexedDB', error);
            } finally {
                setIsLoading(false);
            }
        };

        hydrate();
    }, []);

    /**
     * Adds a new task.
     */
    const addTask = useCallback(async (title: string, description: string) => {
        const newTask: TTask = {
            id: crypto.randomUUID(),
            title,
            description,
            status: TaskStatus.PENDING,
            createdAt: Date.now(),
        };

        const db = await initDB();
        await db.put('tasks', newTask);

        setTasks(prev => [newTask, ...prev]);
        onAction?.('CREATE', `Added task: ${title}`);
    }, [onAction]);

    /**
     * Toggles a task's status.
     */
    const toggleTask = useCallback(async (id: string) => {
        const db = await initDB();
        const task = await db.get('tasks', id);

        if (task) {
            const updatedTask = {
                ...task,
                status: task.status === TaskStatus.COMPLETED ? TaskStatus.PENDING : TaskStatus.COMPLETED
            };
            await db.put('tasks', updatedTask);

            setTasks(prev => prev.map(t => t.id === id ? updatedTask : t));
            onAction?.('TOGGLE', `Toggled task: ${task.title}`);
        }
    }, [onAction]);

    /**
     * Removes a task.
     */
    const deleteTask = useCallback(async (id: string) => {
        const db = await initDB();
        const task = await db.get('tasks', id);

        if (task) {
            await db.delete('tasks', id);
            setTasks(prev => prev.filter(t => t.id !== id));
            onAction?.('DELETE', `Deleted task: ${task.title}`);
        }
    }, [onAction]);

    /**
     * Updates an existing task.
     */
    const updateTask = useCallback(async (id: string, title: string, description: string) => {
        const db = await initDB();
        const task = await db.get('tasks', id);

        if (task) {
            const updatedTask = { ...task, title, description };
            await db.put('tasks', updatedTask);

            setTasks(prev => prev.map(t => t.id === id ? updatedTask : t));
            onAction?.('UPDATE', `Updated task: ${title}`);
        }
    }, [onAction]);

    /**
     * Reorders tasks.
     * Note: IndexedDB doesn't have an inherent order.
     * We depend on the array state for UI, but could persist 
     * a 'rank' or 'index' if we want hard reordering.
     */
    const reorderTasks = useCallback(async (newOrder: TTask[]) => {
        setTasks(newOrder);
        // Persistence of exact order would require updating every task with an index
        // For now, we update local state. For perfect persistence, we'll need an index field.
        onAction?.('REORDER', 'Reordered tasks in current session');
    }, [onAction]);

    /**
     * Imports tasks.
     */
    const importTasks = useCallback(async (newTasks: TTask[]) => {
        const db = await initDB();
        const tx = db.transaction('tasks', 'readwrite');
        await tx.store.clear();
        for (const task of newTasks) {
            await tx.store.put(task);
        }
        await tx.done;

        setTasks(newTasks.sort((a, b) => b.createdAt - a.createdAt));
        onAction?.('IMPORT', `Imported ${newTasks.length} tasks`);
    }, [onAction]);

    /**
     * Clears all tasks.
     */
    const clearTasks = useCallback(async () => {
        const db = await initDB();
        await db.clear('tasks');
        setTasks([]);
        onAction?.('CLEAR', 'Cleared all tasks from database');
    }, [onAction]);

    return {
        tasks,
        isLoading,
        addTask,
        toggleTask,
        deleteTask,
        updateTask,
        reorderTasks,
        importTasks,
        clearTasks,
    };
};
