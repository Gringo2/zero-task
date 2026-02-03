import type { TTask } from '../types/task';
import { TaskStatus } from '../types/task';
import { TaskItem, type TaskItemHandle } from './TaskItem';
import type { FilterType } from './FilterBar';
import './TaskList.css';
import { AnimatePresence, Reorder } from 'framer-motion';

interface TaskListProps {
    tasks: TTask[];
    filter: FilterType;
    searchTerm: string;
    selectedTaskId?: string;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onUpdate: (id: string, title: string, description: string) => void;
    onReorder: (newOrder: TTask[]) => void;
    onTaskRef?: (id: string, handle: TaskItemHandle | null) => void;
}

/**
 * Component: TaskList
 * 
 * Renders the list of tasks with Framer Motion animations.
 */
export const TaskList = ({
    tasks,
    filter,
    searchTerm,
    selectedTaskId,
    onToggle,
    onDelete,
    onUpdate,
    onReorder,
    onTaskRef
}: TaskListProps) => {
    // Filter tasks
    let filteredTasks = tasks;

    if (searchTerm.trim()) {
        const lowerSearch = searchTerm.toLowerCase();
        filteredTasks = filteredTasks.filter(task =>
            task.title.toLowerCase().includes(lowerSearch) ||
            task.description.toLowerCase().includes(lowerSearch)
        );
    }

    if (filter === 'active') {
        filteredTasks = filteredTasks.filter(task => task.status === TaskStatus.PENDING);
    } else if (filter === 'completed') {
        filteredTasks = filteredTasks.filter(task => task.status === TaskStatus.COMPLETED);
    }

    const isReorderEnabled = filter === 'all' && !searchTerm.trim();

    if (filteredTasks.length === 0) {
        return (
            <div className="task-list-empty" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                <p>No tasks found.</p>
            </div>
        );
    }

    return (
        <Reorder.Group
            axis="y"
            values={tasks}
            onReorder={isReorderEnabled ? onReorder : () => { }}
            className="task-list"
        >
            <AnimatePresence initial={false} mode='popLayout'>
                {filteredTasks.map((task) => (
                    <TaskItem
                        key={task.id}
                        ref={(handle) => onTaskRef?.(task.id, handle)}
                        task={task}
                        isSelected={task.id === selectedTaskId}
                        onToggle={onToggle}
                        onDelete={onDelete}
                        onUpdate={onUpdate}
                        isDragEnabled={isReorderEnabled}
                    />
                ))}
            </AnimatePresence>
        </Reorder.Group>
    );
};
