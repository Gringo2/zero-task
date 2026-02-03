import { forwardRef, useImperativeHandle, useRef } from 'react';
import './SearchBar.css';

interface SearchBarProps {
    searchTerm: string;
    onSearchChange: (term: string) => void;
}

export interface SearchBarHandle {
    focus: () => void;
}

/**
 * Component: SearchBar
 * 
 * Renders a search input for filtering tasks.
 */
export const SearchBar = forwardRef<SearchBarHandle, SearchBarProps>(({ searchTerm, onSearchChange }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
        focus: () => {
            inputRef.current?.focus();
        }
    }));
    return (
        <div className="search-bar">
            <div className="search-input-wrapper">
                <span className="search-icon">🔍</span>
                <input
                    ref={inputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search tasks..."
                    className="search-input"
                />
                {searchTerm && (
                    <button
                        onClick={() => onSearchChange('')}
                        className="clear-btn"
                        aria-label="Clear search"
                    >
                        ✕
                    </button>
                )}
            </div>
        </div>
    );
});
