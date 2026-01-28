import type { TTask } from '../types/task';
import { TaskItem } from './TaskItem';
import './TaskList.css';

interface TaskListProps {
    tasks: TTask[];
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
}

/**
 * Component: TaskList
 * 
 * Renders the list of tasks or an empty state message.
 * Acts as a pure presentational component.
 */
export const TaskList = ({ tasks, onToggle, onDelete }: TaskListProps) => {
    // Render empty state if no tasks exist
    if (tasks.length === 0) {
        return (
            <div className="empty-state">
                <p>No tasks yet. Add one to get started!</p>
            </div>
        );
    }

    return (
        <div className="task-list">
            {tasks.map(task => (
                <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={onToggle}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
};
