import type { TTask } from '../types/task';
import { TaskStatus } from '../types/task';
import './TaskItem.css';

interface TaskItemProps {
    task: TTask;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
}

/**
 * Component: TaskItem
 * 
 * Renders a single task card.
 * Handles the display logic for completed state.
 */
export const TaskItem = ({ task, onToggle, onDelete }: TaskItemProps) => {
    const isCompleted = task.status === TaskStatus.COMPLETED;

    return (
        <div className={`task-item ${isCompleted ? 'completed' : ''}`}>
            <div className="task-content">
                {/* Checkbox for toggling status */}
                <input
                    type="checkbox"
                    checked={isCompleted}
                    onChange={() => onToggle(task.id)}
                    className="task-checkbox"
                />

                {/* Task Details */}
                <div className="task-text">
                    <h3 className="task-title">{task.title}</h3>
                    <p className="task-desc">{task.description}</p>
                </div>
            </div>

            {/* Delete Action */}
            <button
                onClick={() => onDelete(task.id)}
                className="delete-btn"
                aria-label="Delete task"
            >
                &times;
            </button>
        </div>
    );
};
