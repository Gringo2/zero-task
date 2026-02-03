import type { TTask } from '../types/task';
import { TaskStatus } from '../types/task';
import { useState } from 'react';
import './TaskItem.css';
import { Reorder, motion, useMotionValue } from 'framer-motion';

interface TaskItemProps {
    task: TTask;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onUpdate: (id: string, title: string, description: string) => void;
    isDragEnabled?: boolean;
}

/**
 * Component: TaskItem
 * 
 * Renders a single task card with animations.
 * Supports drag reordering via Framer Motion.
 */
export const TaskItem = ({ task, onToggle, onDelete, onUpdate, isDragEnabled = false }: TaskItemProps) => {
    const isCompleted = task.status === TaskStatus.COMPLETED;
    const y = useMotionValue(0);

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
        <Reorder.Item
            value={task}
            id={task.id}
            style={{ y }}
            dragListener={isDragEnabled}
            className={`task-item ${isCompleted ? 'completed' : ''}`}
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            whileDrag={{ scale: 1.02, zIndex: 10, boxShadow: "0 8px 16px rgba(0,0,0,0.2)" }}
            layout
        >
            <div className="task-content">
                {/* Animated Checkbox */}
                <motion.div
                    className="task-checkbox-wrapper"
                    onClick={() => onToggle(task.id)}
                    whileTap={{ scale: 0.9 }}
                >
                    <input
                        type="checkbox"
                        checked={isCompleted}
                        onChange={() => { }} // Handled by wrapper click
                        className="task-checkbox"
                    />
                </motion.div>

                {/* Task Details */}
                {isEditing ? (
                    <div className="task-edit">
                        <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="edit-title-input"
                            autoFocus
                        />
                        <textarea
                            value={editDesc}
                            onChange={(e) => setEditDesc(e.target.value)}
                            className="edit-desc-input"
                        />
                    </div>
                ) : (
                    <div className="task-text">
                        <h3 className="task-title" onClick={() => setIsEditing(true)}>
                            {task.title}
                        </h3>
                        {task.description && <p className="task-desc">{task.description}</p>}
                    </div>
                )}
            </div>

            {/* Actions */}
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
                        <motion.button
                            onClick={() => onDelete(task.id)}
                            className="delete-btn"
                            aria-label="Delete task"
                            whileHover={{ scale: 1.1, color: "var(--danger)" }}
                            whileTap={{ scale: 0.9 }}
                        >
                            &times;
                        </motion.button>
                    </>
                )}
            </div>
        </Reorder.Item>
    );
};
