import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FilterBar } from './FilterBar';

describe('FilterBar Component', () => {
    it('should render all filter buttons', () => {
        const mockOnChange = vi.fn();
        render(<FilterBar currentFilter="all" onFilterChange={mockOnChange} />);

        expect(screen.getByRole('button', { name: /all/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /active/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /completed/i })).toBeInTheDocument();
    });

    it('should highlight the active filter', () => {
        const mockOnChange = vi.fn();
        render(<FilterBar currentFilter="active" onFilterChange={mockOnChange} />);

        const activeBtn = screen.getByRole('button', { name: /active/i });
        expect(activeBtn).toHaveClass('active');
    });

    it('should call onFilterChange when filter is clicked', () => {
        const mockOnChange = vi.fn();
        render(<FilterBar currentFilter="all" onFilterChange={mockOnChange} />);

        const completedBtn = screen.getByRole('button', { name: /completed/i });
        fireEvent.click(completedBtn);

        expect(mockOnChange).toHaveBeenCalledWith('completed');
    });
});
