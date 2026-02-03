import './App.css';
import { TaskForm, type TaskFormHandle } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { FilterBar, type FilterType } from './components/FilterBar';
import { SearchBar, type SearchBarHandle } from './components/SearchBar';
import { useTasks } from './hooks/useTasks';
import { useState, useRef, useCallback, useMemo } from 'react';

import logo from './assets/logo.svg';
import { useTheme } from './hooks/useTheme';
import { ThemeToggle } from './components/ThemeToggle';
import { useAudit } from './hooks/useAudit';
import { SystemControls } from './components/SystemControls';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { ShortcutsLegend } from './components/ShortcutsLegend';
import { type TaskItemHandle } from './components/TaskItem';

import { useAuth } from './hooks/useAuth';
import { AuthScreen } from './components/AuthScreen';

/**
 * Root Component (App)
 */
function App() {
  // Initialize Auth
  const {
    isAuthenticated,
    isLoading: isAuthLoading,
    user,
    signup,
    login,
    logout
  } = useAuth();

  // Initialize Audit Log
  const { logs, isLoading: isAuditLoading, logAction, clearLogs } = useAudit();

  // ... rest of hooks
  const {
    tasks,
    isLoading: isTasksLoading,
    addTask,
    toggleTask,
    deleteTask,
    updateTask,
    reorderTasks,
    importTasks,
    clearTasks
  } = useTasks(logAction as any);

  const { theme, toggleTheme } = useTheme();

  // Navigation & Search state
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Keyboard Sovereignty State
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showShortcuts, setShowShortcuts] = useState(false);

  // Refs for Imperative Control
  const taskFormRef = useRef<TaskFormHandle>(null);
  const searchBarRef = useRef<SearchBarHandle>(null);
  const taskRefs = useRef(new Map<string, TaskItemHandle>());

  const isAppDataLoading = isTasksLoading || isAuditLoading || isAuthLoading;

  // Auth Handlers with Logging
  const handleLogin = async (email: string, password: string) => {
    const success = await login(email, password);
    if (success) {
      logAction('AUTH', `Sovereign session authorized for ${email}.`);
    }
    return success;
  };

  const handleSignup = async (email: string, password: string, name: string) => {
    const result = await signup(email, password, name);
    if (!result.error) {
      logAction('AUTH', `Sovereign root-of-trust established for ${name}.`);
    }
    return result;
  };

  // Derived: Filtered tasks for navigation
  const filteredTasks = useMemo(() => {
    let list = tasks;
    if (searchTerm.trim()) {
      const lower = searchTerm.toLowerCase();
      list = list.filter(t => t.title.toLowerCase().includes(lower) || t.description.toLowerCase().includes(lower));
    }
    if (filter === 'active') list = list.filter(t => t.status === 'PENDING');
    else if (filter === 'completed') list = list.filter(t => t.status === 'COMPLETED');
    return list;
  }, [tasks, searchTerm, filter]);

  const selectedTask = selectedIndex !== null ? filteredTasks[selectedIndex] : null;

  // Keyboard Event Handlers
  useKeyboardShortcuts({
    onSearch: () => {
      if (!isAuthenticated) return;
      setSelectedIndex(null);
      searchBarRef.current?.focus();
    },
    onNewTask: () => {
      if (!isAuthenticated) return;
      setSelectedIndex(null);
      taskFormRef.current?.focus();
    },
    onMoveSelection: (direction) => {
      if (!isAuthenticated || filteredTasks.length === 0) return;
      if (selectedIndex === null) {
        setSelectedIndex(direction === 'down' ? 0 : filteredTasks.length - 1);
        return;
      }
      const nextIndex = direction === 'down'
        ? (selectedIndex + 1) % filteredTasks.length
        : (selectedIndex - 1 + filteredTasks.length) % filteredTasks.length;
      setSelectedIndex(nextIndex);
    },
    onToggleStatus: () => {
      if (isAuthenticated && selectedTask) toggleTask(selectedTask.id);
    },
    onDelete: () => {
      if (isAuthenticated && selectedTask) {
        deleteTask(selectedTask.id);
        setSelectedIndex(null);
      }
    },
    onEdit: () => {
      if (isAuthenticated && selectedTask) {
        taskRefs.current.get(selectedTask.id)?.setEditing(true);
      }
    },
    onEscape: () => {
      setSelectedIndex(null);
      setSearchTerm('');
      setShowShortcuts(false);
      // Blur any active element
      (document.activeElement as HTMLElement)?.blur();
    },
    onToggleHelp: () => {
      if (isAuthenticated) setShowShortcuts(prev => !prev);
    }
  });

  const handleTaskRef = useCallback((id: string, handle: TaskItemHandle | null) => {
    if (handle) taskRefs.current.set(id, handle);
    else taskRefs.current.delete(id);
  }, []);

  // Loading State
  if (isAuthLoading) {
    return (
      <div className="app-loading">
        <div className="spinner"></div>
        <p>Probing Sovereign Layer...</p>
      </div>
    );
  }

  // Auth Gate
  if (!isAuthenticated) {
    return (
      <AuthScreen
        onLogin={handleLogin}
        onSignup={handleSignup}
      />
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-brand">
          <img src={logo} alt="Zero Task Logo" className="app-logo" />
          <div className="header-text">
            <h1 className="logo">ZERO-TASK</h1>
            <p className="subtitle">The Auditable Task Engine</p>
          </div>
        </div>
        <div className="header-actions">
          {user && <span className="user-badge">{user.name}</span>}
          <button onClick={() => logout()} className="logout-btn" title="Logout">
            ⎋
          </button>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
          <SystemControls
            tasks={tasks}
            logs={logs}
            onImport={importTasks}
            onClear={clearTasks}
            onClearLogs={clearLogs}
          />
        </div>
      </header>

      <main className="app-content">
        {isAppDataLoading ? (
          <div className="app-loading">
            <div className="spinner"></div>
            <p>Hydrating Sovereign Engine...</p>
          </div>
        ) : (
          <>
            <TaskForm ref={taskFormRef} onAdd={addTask} />
            <SearchBar ref={searchBarRef} searchTerm={searchTerm} onSearchChange={setSearchTerm} />
            <FilterBar currentFilter={filter} onFilterChange={setFilter} />
            <TaskList
              tasks={tasks}
              filter={filter}
              searchTerm={searchTerm}
              selectedTaskId={selectedTask?.id}
              onToggle={toggleTask}
              onDelete={deleteTask}
              onUpdate={updateTask}
              onReorder={reorderTasks}
              onTaskRef={handleTaskRef}
            />
          </>
        )}
      </main>

      <ShortcutsLegend isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />

      <footer className="app-footer">
        <p>Built with System Zero Methodology</p>
      </footer>
    </div>
  );
}

export default App;
