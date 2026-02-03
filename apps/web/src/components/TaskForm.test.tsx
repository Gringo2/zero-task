import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TaskForm } from './TaskForm';

describe('TaskForm Component', () => {
    it('should render input fields', () => {
        render(<TaskForm onAdd={() => { }} />);

        expect(screen.getByPlaceholderText('What needs to be done?')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Add a description (optional)')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /create task/i })).toBeInTheDocument();
    });

    it('should call onAdd with correct values when submitted', () => {
        const mockOnAdd = vi.fn();
        render(<TaskForm onAdd={mockOnAdd} />);

        const titleInput = screen.getByPlaceholderText('What needs to be done?');
        const descInput = screen.getByPlaceholderText('Add a description (optional)');
        const submitBtn = screen.getByRole('button', { name: /create task/i });

        fireEvent.change(titleInput, { target: { value: 'New Test Task' } });
        fireEvent.change(descInput, { target: { value: 'Test Description' } });
        fireEvent.click(submitBtn);

        expect(mockOnAdd).toHaveBeenCalledWith('New Test Task', 'Test Description');
    });

    it('should clear inputs after submission', () => {
        render(<TaskForm onAdd={() => { }} />);

        const titleInput = screen.getByPlaceholderText('What needs to be done?') as HTMLInputElement;
        const submitBtn = screen.getByRole('button', { name: /create task/i });

        fireEvent.change(titleInput, { target: { value: 'Task to Clear' } });
        fireEvent.click(submitBtn);

        expect(titleInput.value).toBe('');
    });

    it('should not submit if title is empty', () => {
        const mockOnAdd = vi.fn();
        render(<TaskForm onAdd={mockOnAdd} />);

        const submitBtn = screen.getByRole('button', { name: /create task/i });
        fireEvent.click(submitBtn);

        expect(mockOnAdd).not.toHaveBeenCalled();
    });
});
