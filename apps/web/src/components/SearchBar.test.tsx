import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SearchBar } from './SearchBar';

describe('SearchBar Component', () => {
    it('should render search input', () => {
        const mockOnChange = vi.fn();
        render(<SearchBar searchTerm="" onSearchChange={mockOnChange} />);

        expect(screen.getByPlaceholderText('Search tasks...')).toBeInTheDocument();
    });

    it('should call onSearchChange when typing', () => {
        const mockOnChange = vi.fn();
        render(<SearchBar searchTerm="" onSearchChange={mockOnChange} />);

        const input = screen.getByPlaceholderText('Search tasks...');
        fireEvent.change(input, { target: { value: 'test search' } });

        expect(mockOnChange).toHaveBeenCalledWith('test search');
    });

    it('should show clear button when search term exists', () => {
        const mockOnChange = vi.fn();
        render(<SearchBar searchTerm="test" onSearchChange={mockOnChange} />);

        const clearBtn = screen.getByLabelText('Clear search');
        expect(clearBtn).toBeInTheDocument();
    });

    it('should hide clear button when search term is empty', () => {
        const mockOnChange = vi.fn();
        render(<SearchBar searchTerm="" onSearchChange={mockOnChange} />);

        const clearBtn = screen.queryByLabelText('Clear search');
        expect(clearBtn).not.toBeInTheDocument();
    });

    it('should clear search when clear button is clicked', () => {
        const mockOnChange = vi.fn();
        render(<SearchBar searchTerm="test" onSearchChange={mockOnChange} />);

        const clearBtn = screen.getByLabelText('Clear search');
        fireEvent.click(clearBtn);

        expect(mockOnChange).toHaveBeenCalledWith('');
    });
});
