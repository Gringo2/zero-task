import type { TTask } from '../types/task';
import { TaskStatus } from '../types/task';
import { useState } from 'react';
import './TaskItem.css';

interface TaskItemProps {
    task: TTask;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onUpdate: (id: string, title: string, description: string) => void;
}

/**
 * Component: TaskItem
 * 
 * Renders a single task card.
 * Handles the display logic for completed state.
 */
export const TaskItem = ({ task, onToggle, onDelete, onUpdate }: TaskItemProps) => {
    const isCompleted = task.status === TaskStatus.COMPLETED;

    // Edit mode state
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(task.title);
    const [editDesc, setEditDesc] = useState(task.description);

    const handleSave = () => {
        if (editTitle.trim()) {
            onUpdate(task.id, editTitle, editDesc);
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setEditTitle(task.title);
        setEditDesc(task.description);
        setIsEditing(false);
    };

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
                {isEditing ? (
                    <div className="task-edit">
                        <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="edit-title-input"
                        />
                        <textarea
                            value={editDesc}
                            onChange={(e) => setEditDesc(e.target.value)}
                            className="edit-desc-input"
                        />
                    </div>
                ) : (
                    <div className="task-text">
                        <h3 className="task-title">{task.title}</h3>
                        <p className="task-desc">{task.description}</p>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="task-actions">
                {isEditing ? (
                    <>
                        <button onClick={handleSave} className="save-btn" aria-label="Save task">
                            ✓
                        </button>
                        <button onClick={handleCancel} className="cancel-btn" aria-label="Cancel edit">
                            ✕
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="edit-btn"
                            aria-label="Edit task"
                        >
                            ✎
                        </button>
                        <button
                            onClick={() => onDelete(task.id)}
                            className="delete-btn"
                            aria-label="Delete task"
                        >
                            &times;
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};
