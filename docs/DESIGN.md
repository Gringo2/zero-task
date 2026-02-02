# System Design

## Design Philosophy: System Zero

The **ZERO-TASK** application is built on **System Zero engineering principles**, which emphasize:

1. **Auditability**: Every state change is traceable and verifiable
2. **Containment**: Self-sufficient operation without external dependencies
3. **Determinism**: Reproducible builds and predictable behavior
4. **Sovereignty**: User control over their data

## Design Patterns

### 1. Composition Root Pattern

The `App.tsx` component serves as the **Composition Root**, responsible for:
- Initializing the state management hook (`useTasks`)
- Coordinating UI state (filter, search)
- Passing callbacks to child components

**Benefits**:
- Clear dependency injection
- Centralized state initialization
- Simplified testing (mock at the root)

### 2. Custom Hook Pattern

The `useTasks` hook encapsulates all state logic:

```typescript
export const useTasks = () => {
  const [tasks, setTasks] = useState<TTask[]>(() => {
    // Hydrate from localStorage
  });

  useEffect(() => {
    // Persist to localStorage
  }, [tasks]);

  // CRUD operations
  const addTask = useCallback(...);
  const toggleTask = useCallback(...);
  const updateTask = useCallback(...);
  const deleteTask = useCallback(...);

  return { tasks, addTask, toggleTask, updateTask, deleteTask };
};
```

### 3. Theme State Pattern

The `useTheme` hook manages visual presentation:

```typescript
export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Hydrate from localStorage
  });

  useEffect(() => {
    // Apply [data-theme] to documentElement
    // Persist to localStorage
  }, [theme]);

  return { theme, toggleTheme };
};
```

**Benefits**:
- Centralized theme control
- Persistent user preference
- Decoupled from task logic

**Benefits**:
- Separation of concerns (logic vs. presentation)
- Reusable across components
- Testable in isolation

### 3. Controlled Component Pattern

All form inputs use React's **controlled component** pattern:

```typescript
<input
  type="text"
  value={title}
  onChange={(e) => setTitle(e.target.value)}
/>
```

**Benefits**:
- Single source of truth (React state)
- Predictable behavior
- Easy validation

### 4. Presentational vs. Container Pattern

Components are split into two categories:

**Presentational** (Pure UI):
- `TaskItem` - Displays a task
- `FilterBar` - Displays filter buttons
- `SearchBar` - Displays search input
- `ThemeToggle` - Displays sun/moon toggle

**Container** (State Logic):
- `App` - Manages global state
- `TaskList` - Filters and maps tasks

## State Management Strategy

### State Architecture

```mermaid
graph TD
    subgraph "Global State (Context/Hooks)"
        Tasks["tasks: TTask[]"]
        Theme["theme: 'light' | 'dark'"]
    end
    
    subgraph "UI State (App)"
        Filter["filter: FilterType"]
        Search["searchTerm: string"]
    end
    
    subgraph "Local State (Components)"
        FormTitle["TaskForm: title"]
        FormDesc["TaskForm: description"]
        EditMode["TaskItem: isEditing"]
        EditTitle["TaskItem: editTitle"]
        EditDesc["TaskItem: editDesc"]
    end
    
    Tasks --> Filter
    Tasks --> Search
    
    Filter --> Filtered[Filtered Tasks]
    Search --> Filtered
    
    Filtered --> TaskList
```

### Why localStorage?

**Advantages**:
- Zero latency (synchronous API)
- No network dependency
- Survives browser restart
- ~10MB storage limit (sufficient for thousands of tasks)

**Limitations Acknowledged**:
- Single-device only
- No multi-user support
- Vulnerable to cache clearing

**Future**: Can be extended to IndexedDB for larger datasets or CRDTs for sync.

## UI/UX Design Principles

### Glassmorphism Aesthetic

The app uses a **dark glassmorphism** design language:

```css
.glass-bg {
  background: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

**Why?**
- Modern, premium feel
- Depth perception through layering
- Reduced eye strain (dark mode)

### Design Tokens

All visual properties are centralized in `tokens.css`:

```css
:root {
  /* Colors */
  --bg-primary: #0f172a;
  --text-primary: #f8fafc;
  --accent-primary: #06b6d4;
  
  /* Spacing */
  --space-md: 1rem;
  
  /* Borders */
  --radius-md: 0.5rem;
}
```

**Benefits**:
- Consistent design language
- Easy theme switching
- Maintainable codebase

### Micro-interactions

Subtle animations enhance UX:

```css
.task-item:hover {
  transform: translateY(-2px);
  transition: transform 0.2s ease;
}
```

## Testing Strategy

### Test Pyramid

```mermaid
graph TB
    subgraph "Test Pyramid"
        E2E["E2E Tests<br/>0 tests<br/>Future"]
        Integration["Integration Tests<br/>0 tests<br/>Not needed yet"]
        Component["Component Tests<br/>12 tests<br/>TaskForm, FilterBar, SearchBar"]
        Unit["Unit Tests<br/>7 tests<br/>useTasks hook"]
    end
    
    E2E --- Integration
    Integration --- Component
    Component --- Unit
    
    style Unit fill:#48bb78,stroke:#2f855a,color:#000
    style Component fill:#4299e1,stroke:#2c5282,color:#000
    style Integration fill:#ed8936,stroke:#c05621,color:#000
    style E2E fill:#f56565,stroke:#c53030,color:#fff
```

### Test Coverage

| Layer | Coverage | Tools |
|-------|----------|-------|
| **Unit Tests** | 7 tests | Vitest |
| **Component Tests** | 12 tests | React Testing Library |
| **E2E Tests** | 0 tests | Playwright (future) |

**Philosophy**: Focus on critical paths (state mutations, user interactions) over 100% coverage.

## Error Handling

### Input Validation

```typescript
const addTask = useCallback((title: string, description: string) => {
  if (!title.trim()) return; // Silent fail
  // ... create task
}, []);
```

**Strategy**: Fail silently for UX (no error modals), but prevent invalid state.

### Persistence Errors

```typescript
try {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
} catch (e) {
  console.error('Failed to persist tasks', e);
  // Degrade gracefully (in-memory only)
}
```

## Performance Optimizations

### 1. React.memo for TaskItem

```typescript
export const TaskItem = React.memo(({ task, onToggle, ... }) => {
  // Only re-render if task object changes
});
```

### 2. useCallback for Stable References

```typescript
const addTask = useCallback((title, desc) => {
  // Function reference stays stable across renders
}, []);
```

### 3. Vite Code Splitting

Vite automatically splits vendor code for optimal caching.

## Accessibility Considerations

- **Semantic HTML**: `<button>`, `<input>`, `<label>`
- **ARIA Labels**: `aria-label="Delete task"`
- **Keyboard Navigation**: Tab order preserved
- **Color Contrast**: WCAG AA compliant

## Scalability Considerations

| Aspect | Current | Future |
|--------|---------|--------|
| **Storage** | localStorage (10MB) | IndexedDB (unlimited) |
| **Search** | Client-side filter | Full-text search index |
| **Sync** | Single-device | CRDT-based multi-device |
| **Users** | Single-user | Multi-tenant with auth |

## Security Design

1. **No Server**: Eliminates server-side attack vectors
2. **CSP Headers**: Nginx can add Content Security Policy
3. **XSS Protection**: React escapes all user input
4. **No Secrets**: No API keys or tokens in client code

## Deployment Design

### Docker Multi-Stage Build

**Stage 1: Build**
- Install dependencies
- Compile TypeScript
- Bundle assets

**Stage 2: Production**
- Copy only `/dist` output
- Serve via Nginx
- Minimal attack surface

**Result**: 50MB production image vs. 500MB+ with node_modules.
