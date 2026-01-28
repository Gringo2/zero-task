import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useTasks } from './useTasks';

describe('useTasks Hook', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    it('should initialize with empty tasks', () => {
        const { result } = renderHook(() => useTasks());
        expect(result.current.tasks).toEqual([]);
    });

    it('should add a task', () => {
        const { result } = renderHook(() => useTasks());

        act(() => {
            result.current.addTask('New Task', 'Description');
        });

        expect(result.current.tasks).toHaveLength(1);
        expect(result.current.tasks[0].title).toBe('New Task');
        expect(result.current.tasks[0].status).toBe('PENDING');
    });

    it('should toggle a task status', () => {
        const { result } = renderHook(() => useTasks());

        act(() => {
            result.current.addTask('Task to Toggle', '');
        });

        const taskId = result.current.tasks[0].id;

        act(() => {
            result.current.toggleTask(taskId);
        });

        expect(result.current.tasks[0].status).toBe('COMPLETED');

        act(() => {
            result.current.toggleTask(taskId);
        });

        expect(result.current.tasks[0].status).toBe('PENDING');
    });

    it('should delete a task', () => {
        const { result } = renderHook(() => useTasks());

        act(() => {
            result.current.addTask('Task to Delete', '');
        });

        const taskId = result.current.tasks[0].id;

        act(() => {
            result.current.deleteTask(taskId);
        });

        expect(result.current.tasks).toHaveLength(0);
    });

    it('should persist tasks to localStorage', () => {
        const { result } = renderHook(() => useTasks());

        act(() => {
            result.current.addTask('Persisted Task', '');
        });

        // Verify it was saved to localStorage
        const stored = localStorage.getItem('zero-task-data');
        expect(stored).toBeTruthy();
        const parsed = JSON.parse(stored!);
        expect(parsed[0].title).toBe('Persisted Task');
    });

    it('should hydrated tasks from localStorage', () => {
        // Setup initial storage
        const initialData = [{
            id: '123',
            title: 'Hydrated Task',
            description: '',
            status: 'PENDING',
            createdAt: 12345
        }];
        localStorage.setItem('zero-task-data', JSON.stringify(initialData));

        const { result } = renderHook(() => useTasks());

        expect(result.current.tasks).toHaveLength(1);
        expect(result.current.tasks[0].title).toBe('Hydrated Task');
    });
});
