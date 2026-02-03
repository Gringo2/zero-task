import './App.css';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { FilterBar, type FilterType } from './components/FilterBar';
import { SearchBar } from './components/SearchBar';
import { useTasks } from './hooks/useTasks';
import { useState } from 'react';

import logo from './assets/logo.svg';
import { useTheme } from './hooks/useTheme';
import { ThemeToggle } from './components/ThemeToggle';

/**
 * Root Component (App)
 * 
 * Acts as the "Composition Root" for the application.
 * Initializes the global state (useTasks, useTheme) and passes it down
 * to child components.
 */
function App() {
  // Initialize State Hooks
  const { tasks, addTask, toggleTask, deleteTask, updateTask, reorderTasks } = useTasks();
  const { theme, toggleTheme } = useTheme();

  // Filter state
  const [filter, setFilter] = useState<FilterType>('all');

  // Search state
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="app-container">
      {/* Header Section */}
      <header className="app-header">
        <div className="header-brand">
          <img src={logo} alt="Zero Task Logo" className="app-logo" />
          <div className="header-text">
            <h1 className="logo">ZERO-TASK</h1>
            <p className="subtitle">The Auditable Task Engine</p>
          </div>
        </div>
        <div className="header-actions">
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="app-content">
        {/* Form to create new tasks */}
        <TaskForm onAdd={addTask} />

        {/* Search Bar */}
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

        {/* Filter Controls */}
        <FilterBar currentFilter={filter} onFilterChange={setFilter} />

        {/* List to display and manage existing tasks */}
        <TaskList
          tasks={tasks}
          filter={filter}
          searchTerm={searchTerm}
          onToggle={toggleTask}
          onDelete={deleteTask}
          onUpdate={updateTask}
          onReorder={reorderTasks}
        />
      </main>

      <footer className="app-footer">
        <p>Built with System Zero Methodology</p>
      </footer>
    </div>
  );
}

export default App;
