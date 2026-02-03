import { useState, forwardRef, useImperativeHandle, useRef } from 'react';
import './TaskForm.css';

interface TaskFormProps {
    onAdd: (title: string, description: string) => void;
}

export interface TaskFormHandle {
    focus: () => void;
}

/**
 * Component: TaskForm
 * 
 * Handles user input for creating new tasks.
 */
export const TaskForm = forwardRef<TaskFormHandle, TaskFormProps>(({ onAdd }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
        focus: () => {
            inputRef.current?.focus();
        }
    }));
    // Local state for form inputs
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');

    /**
     * Handles form submission.
     * Validates input and triggers the onAdd callback.
     */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        // Pass data up to parent
        onAdd(title, desc);

        // Reset form
        setTitle('');
        setDesc('');
    };

    return (
        <form className="task-form" onSubmit={handleSubmit}>
            <input
                ref={inputRef}
                type="text"
                placeholder="What needs to be done?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="form-input title-input"
                required
            />
            <textarea
                placeholder="Add a description (optional)"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="form-input desc-input"
            />
            <button type="submit" className="submit-btn">
                Create Task
            </button>
        </form>
    );
});
