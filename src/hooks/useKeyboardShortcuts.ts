import { useEffect, useCallback } from 'react';

/**
 * Custom Hook: useKeyboardShortcuts
 * 
 * Centralizes keyboard event listeners for global shortcuts.
 * Supports context-aware triggering (ignores inputs/textareas).
 */
interface ShortcutConfig {
    onSearch: () => void;
    onNewTask: () => void;
    onMoveSelection: (direction: 'up' | 'down') => void;
    onToggleStatus: () => void;
    onDelete: () => void;
    onEdit: () => void;
    onEscape: () => void;
    onToggleHelp: () => void;
}

export const useKeyboardShortcuts = (config: ShortcutConfig) => {
    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        // Ignore shortcuts if the user is typing in an input or textarea
        const target = event.target as HTMLElement;
        const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

        // Global Escape (always works)
        if (event.key === 'Escape') {
            config.onEscape();
            return;
        }

        // If in input, only Escape matters
        if (isInput) return;

        switch (event.key.toLowerCase()) {
            case '/':
                event.preventDefault(); // Prevent type character
                config.onSearch();
                break;
            case 'n':
                event.preventDefault();
                config.onNewTask();
                break;
            case 'j':
                config.onMoveSelection('down');
                break;
            case 'k':
                config.onMoveSelection('up');
                break;
            case 'x':
                config.onToggleStatus();
                break;
            case 'd':
                config.onDelete();
                break;
            case 'e':
                config.onEdit();
                break;
            case '?':
                config.onToggleHelp();
                break;
        }
    }, [config]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
};
