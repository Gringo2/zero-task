import './SearchBar.css';

interface SearchBarProps {
    searchTerm: string;
    onSearchChange: (term: string) => void;
}

/**
 * Component: SearchBar
 * 
 * Renders a search input for filtering tasks.
 * Provides instant search with live filtering.
 */
export const SearchBar = ({ searchTerm, onSearchChange }: SearchBarProps) => {
    return (
        <div className="search-bar">
            <div className="search-input-wrapper">
                <span className="search-icon">🔍</span>
                <input
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
};
