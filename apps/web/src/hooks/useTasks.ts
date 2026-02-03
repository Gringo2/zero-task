import { useState, useCallback, useEffect } from 'react';
import { type TTask } from '@zero-task/shared';
import { apiClient } from '../lib/api-client';

/**
 * Custom Hook: useTasks
 * 
 * Manages the global state for tasks in the application.
 * Persists data to the backend API.
 * 
 * @param onAction - Optional callback to log mutations
 * @returns Object containing the tasks array and action handlers.
 */
export const useTasks = (onAction?: (action: string, details: string) => void) => {
    const [tasks, setTasks] = useState<TTask[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Initial Hydration from API
    const fetchTasks = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await apiClient.api.tasks.$get();
            if (res.ok) {
                const data = await res.json() as TTask[];
                setTasks(data);
            }
        } catch (error) {
            console.error('Failed to fetch tasks from API', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    /**
     * Adds a new task.
     */
    const addTask = useCallback(async (title: string, description: string) => {
        try {
            const res = await apiClient.api.tasks.$post({
                json: { title, description }
            });

            if (res.ok) {
                const newTask = await res.json() as TTask;
                setTasks(prev => [newTask, ...prev]);
                onAction?.('CREATE', `Added task: ${title}`);
            }
        } catch (error) {
            console.error('Failed to add task', error);
        }
    }, [onAction]);

    /**
     * Toggles a task's status.
     */
    const toggleTask = useCallback(async (id: string) => {
        try {
            const res = await apiClient.api.tasks[':id'].toggle.$patch({
                param: { id }
            });

            if (res.ok) {
                const updatedTask = await res.json() as TTask;
                setTasks(prev => prev.map(t => t.id === id ? updatedTask : t));
                onAction?.('TOGGLE', `Toggled task: ${updatedTask.title}`);
            }
        } catch (error) {
            console.error('Failed to toggle task', error);
        }
    }, [onAction]);

    /**
     * Removes a task.
     */
    const deleteTask = useCallback(async (id: string) => {
        try {
            const res = await apiClient.api.tasks[':id'].$delete({
                param: { id }
            });

            if (res.ok) {
                setTasks(prev => prev.filter(t => t.id !== id));
                onAction?.('DELETE', `Deleted task with ID: ${id}`);
            }
        } catch (error) {
            console.error('Failed to delete task', error);
        }
    }, [onAction]);

    /**
     * Updates an existing task.
     */
    const updateTask = useCallback(async (id: string, title: string, description: string) => {
        // Note: Update endpoint not yet implemented in backend in this phase
        // For now, we'll keep the local state update if we want, or implement the endpoint
        console.warn('Update task API not yet fully implemented');
        setTasks(prev => prev.map(t => t.id === id ? { ...t, title, description } : t));
    }, []);

    /**
     * Reorders tasks.
     */
    const reorderTasks = useCallback(async (newOrder: TTask[]) => {
        setTasks(newOrder);
        onAction?.('REORDER', 'Reordered tasks in current session');
    }, [onAction]);

    /**
     * Imports tasks.
     * Note: For now, we'll clear local and not sync all to server (destructive)
     */
    const importTasks = useCallback(async (newTasks: TTask[]) => {
        setTasks(newTasks);
        onAction?.('IMPORT', `Imported ${newTasks.length} tasks locally`);
    }, [onAction]);

    /**
     * Clears all tasks.
     */
    const clearTasks = useCallback(async () => {
        // Not implemented in backend yet
        setTasks([]);
        onAction?.('CLEAR', 'Cleared all tasks locally');
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
        refresh: fetchTasks
    };
};
