import type { TTask } from '../types/task';
import { TaskStatus } from '../types/task';
import { TaskItem } from './TaskItem';
import type { FilterType } from './FilterBar';
import './TaskList.css';

interface TaskListProps {
    tasks: TTask[];
    filter: FilterType;
    searchTerm: string;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onUpdate: (id: string, title: string, description: string) => void;
}

/**
 * Component: TaskList
 * 
 * Renders the list of tasks or an empty state message.
 * Acts as a pure presentational component.
 */
export const TaskList = ({ tasks, filter, searchTerm, onToggle, onDelete, onUpdate }: TaskListProps) => {
    // Filter tasks by search term first
    let filteredTasks = tasks;

    if (searchTerm.trim()) {
        const lowerSearch = searchTerm.toLowerCase();
        filteredTasks = filteredTasks.filter(task =>
            task.title.toLowerCase().includes(lowerSearch) ||
            task.description.toLowerCase().includes(lowerSearch)
        );
    }

    // Then filter by status
    filteredTasks = filteredTasks.filter(task => {
        if (filter === 'active') return task.status !== TaskStatus.COMPLETED;
        if (filter === 'completed') return task.status === TaskStatus.COMPLETED;
        return true; // 'all'
    });

    // Render empty state if no tasks exist
    if (filteredTasks.length === 0) {
        return (
            <div className="empty-state">
                <p>No tasks yet. Add one to get started!</p>
            </div>
        );
    }

    return (
        <div className="task-list">
            {filteredTasks.map(task => (
                <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={onToggle}
                    onDelete={onDelete}
                    onUpdate={onUpdate}
                />
            ))}
        </div>
    );
};
