# System & Persistence Logic: The Immortal State

This document details the internal system mechanics for data durability and visual themes. In **ZERO-TASK**, we aim for the **Immortal State**—data that lives on the user's hardware, independent of cloud availability.

## 🧩 Conceptual Alignment
- **Local Sovereignty**: Data never leaves the browser's `localStorage` boundaries.
- **Zero-Flicker UX**: The theme engine is optimized for early-hydration to prevent visual artifacts on load.

## Functional Mapping
| Requirement | Logic Description | Implementation Reference |
|-------------|-------------------|--------------------------|
| **FR-7.x** | Persistent storage | `useTasks.ts` |
| **FR-8.x** | Visual Theme Engine | `useTheme.ts` |

---

## 1. Persistence Logic (FR-7)

### 1.1 The Sync Cycle
Persistence is handled via the **Web Storage API (localStorage)**.

1. **Hydration**: On app mount, the system reads `zero-task-data`.
    - If found: Parse JSON and initialize state.
    - If missing: Initialize with empty array `[]`.
2. **Synchronization**: Every state change triggers an effect that serializes the entire task array to JSON and writes it to `localStorage`.

### 1.2 Constraint Handling
- **Failure Mode**: If `localStorage` is blocked or full, the system logs a console error and continues in-memory only. This ensures the app remains functional for the current session, maintaining the "System Zero" principle of graceful degradation.

---

## 2. Theme Engine Logic (FR-8)

### 2.1 Theme Propagation
The theme engine uses **CSS Variables** and **Data Attributes** for a zero-JS-cost styling update (once applied).

1. **State**: The `theme` variable holds either `light` or `dark`.
2. **Propagation**: The engine applies `[data-theme]` to the `document.documentElement`.
3. **Transition**: A global transition rule in `tokens.css` ensures all variable-linked colors fade smoothly, creating a "Liquid State" transition.

### 2.2 Persistence
Theme preference is stored separately in `zero-task-theme` to ensure the user's visual preference is restored immediately upon page load, preventing "theme flickers".

---

## 3. Persistence Diagram

```mermaid
sequenceDiagram
    participant UI as React UI
    participant Hook as useTasks/useTheme
    participant LS as localStorage

    Note over UI, LS: App Initialization
    Hook->>LS: getItem('zero-task-data')
    LS-->>Hook: Return JSON String
    Hook->>UI: Set Initial State

    Note over UI, LS: State Update Action
    UI->>Hook: Mutation Callback
    Hook->>Hook: Update State
    Hook->>LS: setItem('zero-task-data', JSON)
    Hook->>UI: Re-render
```
