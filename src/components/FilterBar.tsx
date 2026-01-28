import './FilterBar.css';

export type FilterType = 'all' | 'active' | 'completed';

interface FilterBarProps {
    currentFilter: FilterType;
    onFilterChange: (filter: FilterType) => void;
}

/**
 * Component: FilterBar
 * 
 * Renders filter buttons for task list.
 * Allows switching between All, Active, and Completed views.
 */
export const FilterBar = ({ currentFilter, onFilterChange }: FilterBarProps) => {
    return (
        <div className="filter-bar">
            <button
                className={`filter-btn ${currentFilter === 'all' ? 'active' : ''}`}
                onClick={() => onFilterChange('all')}
            >
                All
            </button>
            <button
                className={`filter-btn ${currentFilter === 'active' ? 'active' : ''}`}
                onClick={() => onFilterChange('active')}
            >
                Active
            </button>
            <button
                className={`filter-btn ${currentFilter === 'completed' ? 'active' : ''}`}
                onClick={() => onFilterChange('completed')}
            >
                Completed
            </button>
        </div>
    );
};
