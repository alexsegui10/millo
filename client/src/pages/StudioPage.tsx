import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    DndContext,
    DragOverlay,
    useSensors,
    useSensor,
    PointerSensor,
    KeyboardSensor,
    closestCorners,
    DragStartEvent,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { listTasks, createTask, toggleTask, deleteTask } from '../lib/apiClient';
import { Task, TaskType } from '../types';
import { useNavigate } from 'react-router-dom';

// --- Sortable Item Component ---
function SortableTask({ task, id, onDelete }: { task: Task; id: string; onDelete: (id: string) => void }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-3 cursor-grab active:cursor-grabbing group hover:shadow-md transition-shadow relative overflow-hidden`}
        >
            <div className="flex items-start justify-between">
                <div className="flex-1 pr-4">
                    <div className="flex items-center gap-2 mb-1">
                        <span
                            className={`text-xs font-bold px-2 py-0.5 rounded-full ${task.type === 'DAILY'
                                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                                }`}
                        >
                            {task.type === 'DAILY' ? 'DAILY' : 'ONE-OFF'}
                        </span>
                        <span className="text-xs text-gray-400">
                            {new Date(task.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                    <p className="text-gray-800 dark:text-gray-200 font-medium leading-snug">
                        {task.text}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onPointerDown={(e) => {
                            e.stopPropagation(); // Prevent drag start
                            onDelete(id);
                        }}
                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                    <span className="material-symbols-outlined text-gray-300 dark:text-gray-600 group-hover:text-gray-400">
                        drag_indicator
                    </span>
                </div>
            </div>

            {/* Visual indicator for drag */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/50 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
    );
}

// --- Status Column Component ---
function TaskColumn({
    id,
    title,
    tasks,
    icon,
    colorClass,
    onDelete,
}: {
    id: string;
    title: string;
    tasks: Task[];
    icon: string;
    colorClass: string;
    onDelete: (id: string) => void;
}) {
    return (
        <div className="bg-gray-50/50 dark:bg-gray-800/20 rounded-2xl p-4 flex flex-col h-full border border-dashed border-gray-200 dark:border-gray-700/50">
            <div className="flex items-center gap-2 mb-4 px-2">
                <div className={`p-2 rounded-lg ${colorClass} bg-opacity-20`}>
                    <span className={`material-symbols-outlined text-lg ${colorClass.replace('bg-', 'text-')}`}>
                        {icon}
                    </span>
                </div>
                <h3 className="font-bold text-gray-700 dark:text-gray-200">
                    {title} <span className="ml-2 text-xs font-normal text-gray-400 bg-white dark:bg-gray-800 px-2 py-0.5 rounded-full border border-gray-100 dark:border-gray-700">{tasks.length}</span>
                </h3>
            </div>

            <SortableContext
                id={id}
                items={tasks.map((t) => t.id)}
                strategy={verticalListSortingStrategy}
            >
                <div className="flex-1 space-y-3 min-h-[100px]">
                    {tasks.map((task) => (
                        <SortableTask key={task.id} id={task.id} task={task} onDelete={onDelete} />
                    ))}
                    {tasks.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm italic py-8 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-xl">
                            Empty list
                        </div>
                    )}
                </div>
            </SortableContext>
        </div>
    );
}

// --- Main Page Component ---
export function StudioPage() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [activeId, setActiveId] = useState<string | null>(null);
    const [newTaskText, setNewTaskText] = useState('');
    const [taskType, setTaskType] = useState<TaskType>('ONE_OFF');

    // Sensors for Drag and Drop
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    // Fetch Tasks
    const { data: tasksResponse, isLoading } = useQuery({
        queryKey: ['tasks'],
        queryFn: () => listTasks(),
    });

    const tasks = tasksResponse?.data || [];

    // Derived state for columns
    const todoTasks = useMemo(() => tasks.filter((t) => !t.isDone), [tasks]);
    const doneTasks = useMemo(() => tasks.filter((t) => t.isDone), [tasks]);

    // Mutations
    const createMutation = useMutation({
        mutationFn: createTask,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            setNewTaskText('');
        },
    });

    const toggleMutation = useMutation({
        mutationFn: ({ id, isDone }: { id: string; isDone: boolean }) => toggleTask(id, isDone),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
    });

    const deleteMutation = useMutation({
        mutationFn: deleteTask,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
    });

    const handleDelete = (id: string) => {
        deleteMutation.mutate(id);
    };


    // Handlers
    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) {
            setActiveId(null);
            return;
        }

        const activeTask = tasks.find((t) => t.id === active.id);
        if (!activeTask) return;

        // Determine target container (column)
        // The over.id could be a container ID ('todo-column', 'done-column') OR a task ID
        let targetContainerId = over.id;

        // Check if dropping over a task instead of container
        const overTask = tasks.find((t) => t.id === over.id);
        if (overTask) {
            // If dropping over a task, assume the target is that task's status
            targetContainerId = overTask.isDone ? 'done-column' : 'todo-column';
        }

        // Determine intended status
        const isTargetDone = targetContainerId === 'done-column';

        // Only update if status changed
        if (activeTask.isDone !== isTargetDone) {
            toggleMutation.mutate({ id: activeTask.id, isDone: isTargetDone });
        }

        setActiveId(null);
    };

    const handleCreateTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskText.trim()) return;
        createMutation.mutate({ text: newTaskText, type: taskType });
    };

    if (isLoading) return (
        <div className="flex items-center justify-center p-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    );

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8 min-h-screen">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500 tracking-tight">
                        Studio Flow
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Drag tasks to complete them.
                    </p>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2">
                    <button onClick={() => navigate('/upload')} className="rounded-xl px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 flex items-center gap-2 transition-colors shadow-sm">
                        <span className="material-symbols-outlined text-[18px]">cloud_upload</span> Upload
                    </button>
                    <button onClick={() => navigate('/content')} className="rounded-xl px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 flex items-center gap-2 transition-colors shadow-sm">
                        <span className="material-symbols-outlined text-[18px]">edit_note</span> Content
                    </button>
                </div>
            </header>

            {/* Task Input */}
            <div className="bg-white dark:bg-gray-800 p-1 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 max-w-3xl mx-auto transform hover:-translate-y-1 transition-transform duration-300">
                <form onSubmit={handleCreateTask} className="flex items-center gap-2 p-1">
                    <div className="relative group">
                        <select
                            value={taskType}
                            onChange={(e) => setTaskType(e.target.value as TaskType)}
                            className="appearance-none bg-gray-50 dark:bg-gray-900 border-none rounded-xl py-3 pl-4 pr-8 text-sm font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-primary cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            <option value="ONE_OFF">Inbox</option>
                            <option value="DAILY">Daily</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-sm">expand_more</span>
                    </div>

                    <input
                        type="text"
                        value={newTaskText}
                        onChange={(e) => setNewTaskText(e.target.value)}
                        placeholder="What needs to be done?"
                        className="flex-1 bg-transparent border-none focus:ring-0 text-lg placeholder-gray-400 text-gray-800 dark:text-gray-100"
                        autoFocus
                    />

                    <button
                        type="submit"
                        disabled={!newTaskText.trim() || createMutation.isPending}
                        className="bg-gradient-to-r from-primary to-purple-600 text-white rounded-xl p-3 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="material-symbols-outlined">add</span>
                    </button>
                </form>
            </div>

            {/* Kanban Board */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full min-h-[500px]">
                    {/* To Do Column */}
                    <TaskColumn
                        id="todo-column"
                        title="To Do"
                        tasks={todoTasks}
                        icon="checklist"
                        colorClass="bg-blue-500"
                        onDelete={handleDelete}
                    />

                    {/* Done Column */}
                    <TaskColumn
                        id="done-column"
                        title="Completed"
                        tasks={doneTasks}
                        icon="done_all"
                        colorClass="bg-green-500"
                        onDelete={handleDelete}
                    />
                </div>

                {/* Overlay while dragging */}
                <DragOverlay>
                    {activeId ? (
                        <div className="opacity-90 scale-105">
                            <SortableTask task={tasks.find(t => t.id === activeId)!} id={activeId} onDelete={handleDelete} />
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}
