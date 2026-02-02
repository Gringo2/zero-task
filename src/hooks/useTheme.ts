import { useState, useEffect } from 'react';

export type Theme = 'light' | 'dark';

/**
 * useTheme Hook
 * 
 * Manages the application's visual theme (light/dark).
 * Persists user preference to localStorage and applies it
 * via the [data-theme] attribute on the document element.
 */
export const useTheme = () => {
    // Initialize theme from localStorage or default to 'dark'
    const [theme, setTheme] = useState<Theme>(() => {
        const saved = localStorage.getItem('zero-task-theme');
        return (saved === 'light' || saved === 'dark') ? saved : 'dark';
    });

    // Apply theme to document element whenever it changes
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('zero-task-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    return { theme, toggleTheme };
};
