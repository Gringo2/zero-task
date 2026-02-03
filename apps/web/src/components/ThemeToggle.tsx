import './ThemeToggle.css';
import type { Theme } from '../hooks/useTheme';

interface ThemeToggleProps {
    theme: Theme;
    onToggle: () => void;
}

/**
 * Component: ThemeToggle
 * 
 * Renders a sun/moon button to switch between light and dark themes.
 */
export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onToggle }) => {
    return (
        <button
            className="theme-toggle"
            onClick={onToggle}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
            {theme === 'light' ? '🌙' : '☀️'}
        </button>
    );
};
