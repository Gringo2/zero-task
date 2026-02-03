import { motion, AnimatePresence } from 'framer-motion';
import './ShortcutsLegend.css';

interface ShortcutsLegendProps {
    isOpen: boolean;
    onClose: () => void;
}

const SHORTCUTS = [
    { key: 'j', desc: 'Next task' },
    { key: 'k', desc: 'Previous task' },
    { key: '/', desc: 'Focus search' },
    { key: 'n', desc: 'New task' },
    { key: 'x', desc: 'Toggle status' },
    { key: 'd', desc: 'Delete task' },
    { key: 'e', desc: 'Edit task' },
    { key: 'Esc', desc: 'Close/Clear' },
    { key: '?', desc: 'Show shortcuts' },
];

/**
 * Component: ShortcutsLegend
 * 
 * Provides a visual cheat sheet for keyboard shortcuts.
 */
export const ShortcutsLegend = ({ isOpen, onClose }: ShortcutsLegendProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="shortcuts-overlay" onClick={onClose}>
                    <motion.div
                        className="shortcuts-modal"
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <header className="shortcuts-header">
                            <h2>Keyboard Sovereignty</h2>
                            <button className="close-shortcuts" onClick={onClose}>✕</button>
                        </header>
                        <div className="shortcuts-grid">
                            {SHORTCUTS.map((s) => (
                                <div key={s.key} className="shortcut-item">
                                    <kbd className="shortcut-key">{s.key}</kbd>
                                    <span className="shortcut-desc">{s.desc}</span>
                                </div>
                            ))}
                        </div>
                        <footer className="shortcuts-footer">
                            <p>Master the instrument. Reach for Zero friction.</p>
                        </footer>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
