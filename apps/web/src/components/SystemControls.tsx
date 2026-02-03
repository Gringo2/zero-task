import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type TTask, type AuditEntry } from '@zero-task/shared';
import './SystemControls.css';

interface SystemControlsProps {
    tasks: TTask[];
    logs: AuditEntry[];
    onImport: (tasks: TTask[]) => void;
    onClear: () => void;
    onClearLogs: () => void;
}

/**
 * Component: SystemControls
 * 
 * Provides a central panel for data sovereignty (export/import) 
 * and system auditability (history log).
 */
export const SystemControls = ({ tasks, logs, onImport, onClear, onClearLogs }: SystemControlsProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showConfirmClear, setShowConfirmClear] = useState(false);

    // Function to export tasks to JSON file
    const handleExport = () => {
        const dataStr = JSON.stringify(tasks, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        const exportFileDefaultName = `zero-task-backup-${new Date().toISOString().split('T')[0]}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    // Function to handle JSON file import
    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                const importedTasks = JSON.parse(content);
                if (Array.isArray(importedTasks)) {
                    onImport(importedTasks);
                    alert(`Successfully imported ${importedTasks.length} tasks.`);
                } else {
                    alert('Invalid file format. Please upload a valid JSON array of tasks.');
                }
            } catch (error) {
                console.error('Import failed', error);
                alert('Failed to parse file. Ensure it is a valid JSON file.');
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="system-controls-wrapper">
            {/* Toggle Button */}
            <button
                className={`system-toggle-btn ${isOpen ? 'active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="System Controls"
            >
                ⚙️
            </button>

            {/* Main Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="system-panel glass-panel"
                        initial={{ opacity: 0, x: 300 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 300 }}
                        transition={{ type: 'spring', damping: 20 }}
                    >
                        <div className="panel-header">
                            <h2>System Control Engine</h2>
                            <button className="close-panel" onClick={() => setIsOpen(false)}>&times;</button>
                        </div>

                        <div className="panel-content">
                            {/* Sovereignty Section */}
                            <section className="panel-section">
                                <h3>📦 Data Sovereignty</h3>
                                <div className="button-group">
                                    <button onClick={handleExport} className="panel-btn export-btn">
                                        Export JSON
                                    </button>
                                    <label className="panel-btn import-label">
                                        Import JSON
                                        <input type="file" accept=".json" onChange={handleImport} hidden />
                                    </label>
                                </div>
                            </section>

                            {/* Audit Section */}
                            <section className="panel-section audit-section">
                                <div className="section-header">
                                    <h3>📜 Audit Inspector</h3>
                                    <button onClick={onClearLogs} className="mini-btn">Clear</button>
                                </div>
                                <div className="audit-log">
                                    {logs.length === 0 ? (
                                        <p className="empty-log">No actions recorded.</p>
                                    ) : (
                                        <ul>
                                            {logs.map(log => (
                                                <li key={log.id} className="audit-item">
                                                    <span className="audit-time">
                                                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                                    </span>
                                                    <span className={`audit-badge ${log.action.toLowerCase()}`}>
                                                        {log.action}
                                                    </span>
                                                    <span className="audit-details">{log.details}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </section>

                            {/* Danger Zone */}
                            <section className="panel-section danger-zone">
                                <h3>⚠️ Critical Ops</h3>
                                {!showConfirmClear ? (
                                    <button onClick={() => setShowConfirmClear(true)} className="panel-btn danger-btn">
                                        Nuke System Data
                                    </button>
                                ) : (
                                    <div className="confirm-clear">
                                        <p>Are you absolutely sure?</p>
                                        <div className="button-group">
                                            <button onClick={() => { onClear(); setShowConfirmClear(false); }} className="panel-btn danger-btn">YES, DESTROY</button>
                                            <button onClick={() => setShowConfirmClear(false)} className="panel-btn cancel-btn">CANCEL</button>
                                        </div>
                                    </div>
                                )}
                            </section>
                        </div>

                        <div className="panel-footer">
                            <p>System Zero v1.2 | Audit-Ready</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Backdrop for closing */}
            {isOpen && <div className="panel-backdrop" onClick={() => setIsOpen(false)} />}
        </div>
    );
};
