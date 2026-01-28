import './App.css';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { useTasks } from './hooks/useTasks';

/**
 * Root Component (App)
 * 
 * Acts as the "Composition Root" for the application.
 * Initializes the global state (useTasks) and passes it down
 * to child components.
 */
function App() {
  // Initialize State Hook
  const { tasks, addTask, toggleTask, deleteTask } = useTasks();

  return (
    <div className="app-container">
      {/* Header Section */}
      <header className="app-header">
        <h1 className="logo">ZERO-TASK</h1>
        <p className="subtitle">The Auditable Task Engine</p>
      </header>

      {/* Main Content Area */}
      <main className="app-content">
        {/* Form to create new tasks */}
        <TaskForm onAdd={addTask} />

        {/* List to display and manage existing tasks */}
        <TaskList
          tasks={tasks}
          onToggle={toggleTask}
          onDelete={deleteTask}
        />
      </main>

      <footer className="app-footer">
        <p>Built with System Zero Methodology</p>
      </footer>
    </div>
  );
}

export default App;
