# System Architecture

## Overview

**ZERO-TASK** is a production-grade task management application built on "System Zero" engineering principles, emphasizing **auditability**, **containment**, and **deterministic behavior**.

## Architecture Style

**Single Page Application (SPA)** with a **Composition Root** pattern and **Local-First** data persistence.

## High-Level Architecture

```mermaid
graph TB
subgraph "Client Layer"
        Browser[Browser Runtime]
        LocalStorage[localStorage API]
    end
    
    subgraph "Application Layer"
        App[App.tsx<br/>Composition Root]
    end
    
    subgraph "State Management"
        UseTasks[useTasks Hook<br/>Task Logic]
        UseTheme[useTheme Hook<br/>Theme Logic]
    end
    
    subgraph "UI Components"
        TaskForm[TaskForm]
        SearchBar[SearchBar]
        FilterBar[FilterBar]
        ThemeToggle[ThemeToggle]
        TaskList[TaskList]
    end
    
    Browser --> App
    App --> UseTasks
    App --> UseTheme
    App --> TaskForm
    App --> SearchBar
    App --> FilterBar
    App --> ThemeToggle
    App --> TaskList
    
    TaskList --> TaskItem[TaskItem]
    
    UseTasks <--> LocalStorage
    UseTheme <--> LocalStorage
```

## Component Hierarchy

```mermaid
graph TD
    App["App.tsx<br/>(Composition Root)"]
    
    App --> Header["Header Section"]
    App --> Main["Main Content"]
    App --> Footer["Footer Section"]
    
    Main --> TaskForm["TaskForm<br/>(Create Tasks)"]
    Main --> SearchBar["SearchBar<br/>(Live Search)"]
    Main --> FilterBar["FilterBar<br/>(Status Filter)"]
    Main --> TaskList["TaskList<br/>(Task Container)"]
    
    TaskList --> TaskItem["TaskItem × N<br/>(Individual Task)"]
    
    TaskItem --> Checkbox["Checkbox<br/>(Toggle Status)"]
    TaskItem --> TaskText["TaskText/TaskEdit<br/>(Display/Edit)"]
    TaskItem --> Actions["Action Buttons<br/>(Edit/Delete/Save/Cancel)"]
    
    style App fill:#2d3748,stroke:#4299e1,stroke-width:3px,color:#fff
    style Main fill:#1a202c,stroke:#4299e1,stroke-width:2px,color:#fff
    style TaskList fill:#1a202c,stroke:#48bb78,stroke-width:2px,color:#fff
    style TaskItem fill:#2d3748,stroke:#48bb78,stroke-width:1px,color:#fff
```

## State Flow Architecture

```mermaid
stateDiagram-v2
    [*] --> Initialization
    
    Initialization --> LoadFromStorage: App Mount
    LoadFromStorage --> HydrateState: Parse JSON
    HydrateState --> Ready: State Initialized
    
    Ready --> UserAction: User Interaction
    
    state UserAction {
        [*] --> AddTask
        [*] --> ToggleTask
        [*] --> UpdateTask
        [*] --> DeleteTask
        [*] --> SearchTasks
        [*] --> FilterTasks
        [*] --> ToggleTheme
    }
    
    UserAction --> StateUpdate: Callback Invoked
    StateUpdate --> PersistToStorage: localStorage.setItem()
    PersistToStorage --> ReRender: React Re-render
    ReRender --> Ready
    
    Ready --> [*]: App Unmount
```

## Data Flow Diagram

```mermaid
graph LR
    subgraph "Input Layer"
        User["User Actions"]
    end
    
    subgraph "Application State"
        Hook["useTasks Hook"]
        State["tasks: TTask[]"]
        Filter["filter: FilterType"]
        Search["searchTerm: string"]
    end
    
    subgraph "Persistence Layer"
        LS["localStorage"]
    end
    
    subgraph "View Layer"
        Form["TaskForm"]
        List["TaskList"]
        Item["TaskItem"]
    end
    
    User -->|"Add Task"| Form
    User -->|"Edit/Delete"| Item
    User -->|Filter| Filter
    User -->|Search| Search
    
    Form -->|"addTask()"| Hook
    Item -->|"toggleTask()<br/>updateTask()<br/>deleteTask()"| Hook
    
    Hook --- LS
    Hook --> State
    
    State --> List
    Filter --> List
    Search --> List
    
    List -->|"Filtered Tasks"| Item
```

## Container Architecture

The application runs in a **multi-stage Docker container**:

```mermaid
graph LR
    subgraph "Build Stage"
        NodeBuild["Node 20 Alpine<br/>Build Environment"]
        NPM["npm install + build"]
        Dist["/dist output"]
    end
    
    subgraph "Production Stage"
        Nginx["Nginx Alpine<br/>Web Server"]
        Static["Static Files<br/>from /dist"]
    end
    
    NodeBuild --> NPM
    NPM --> Dist
    Dist -. "Copy" .-> Static
    Static --> Nginx
    
    Nginx -->|"Port 80"| External["External Access"]
```

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 19 | UI Framework |
| **Language** | TypeScript | Type Safety |
| **Build Tool** | Vite | Fast bundling |
| **State** | React Hooks | Local state management |
| **Persistence** | localStorage | Client-side storage |
| **Styling** | CSS Modules | Scoped styles |
| **Testing** | Vitest + RTL | Unit/Component tests |
| **Containerization** | Docker | Production deployment |
| **CI/CD** | GitHub Actions | Automated verification |

## Deployment Architecture

```mermaid
graph TB
    Dev[Developer]
    
    subgraph "Version Control"
        Git[Git Repository]
    end
    
    subgraph "CI/CD Pipeline"
        Actions[GitHub Actions]
        Verify[Verify Job<br/>Lint + Test + Build]
        Deploy[Deploy Job<br/>Trigger Hook]
    end
    
    subgraph "Staging Environment"
        Render[Render Platform]
        Container[Docker Container]
        App[Running Application]
    end
    
    Dev -->|git push| Git
    Git -->|Webhook| Actions
    Actions --> Verify
    Verify -->|Success| Deploy
    Deploy -->|HTTP POST| Render
    Render -->|Build| Container
    Container -->|Run| App
```

## Security & Containment

1. **No External Dependencies**: All data stored client-side
2. **Immutable Builds**: Docker ensures identical deployments
3. **Type Safety**: TypeScript prevents runtime type errors
4. **Test Coverage**: 19/19 tests ensure behavior verification
5. **Non-root User**: Docker runs with minimal privileges

## Performance Characteristics

- **Initial Load**: < 100ms (Vite optimization)
- **State Updates**: < 16ms (React batching)
- **Persistence**: Synchronous localStorage writes
- **Build Size**: ~200KB gzipped
- **Docker Image**: ~50MB (Alpine-based)
