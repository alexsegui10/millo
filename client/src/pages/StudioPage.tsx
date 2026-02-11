import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listTasks, createTask, toggleTask, deleteTask } from '../lib/apiClient';
import { Task } from '../types';
import { useNavigate } from 'react-router-dom';

export function StudioPage() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [newTaskText, setNewTaskText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch Tasks
    const { data: tasksResponse, isLoading } = useQuery({
        queryKey: ['tasks'],
        queryFn: () => listTasks(),
    });

    const tasks = tasksResponse?.data || [];
    const dailyTasks = tasks.filter((t) => t.type === 'DAILY');
    const inboxTasks = tasks.filter((t) => t.type === 'ONE_OFF');

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

    if (isLoading) return <div className="p-10 text-center">Loading Studio...</div>;

    const handleCreateTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskText.trim()) return;
        createMutation.mutate({ text: newTaskText, type: 'ONE_OFF' });
    };

    const handleCreateDaily = () => {
        const text = prompt("Enter daily routine task:");
        if (text) {
            createMutation.mutate({ text, type: 'DAILY' });
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <header>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                    Studio Command Center
                </h1>
                <p className="text-gray-500 dark:text-gray-400">Manage your daily flow and tasks.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 1. Morning Routine (Daily Tasks) */}
                <div className="bg-white dark:bg-card-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <span className="material-symbols-outlined text-yellow-500">wb_sunny</span>
                            Morning Routine
                        </h2>
                        <button onClick={handleCreateDaily} className="text-sm text-primary hover:underline">+ Add</button>
                    </div>

                    <div className="space-y-3">
                        {dailyTasks.length === 0 && <p className="text-sm text-gray-400 italic">No daily routine set.</p>}
                        {dailyTasks.map((task) => (
                            <div key={task.id} className="flex items-center gap-3 group">
                                <input
                                    type="checkbox"
                                    checked={task.isDone}
                                    onChange={(e) => toggleMutation.mutate({ id: task.id, isDone: e.target.checked })}
                                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                                />
                                <span className={`flex-1 text-sm ${task.isDone ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-200'}`}>
                                    {task.text}
                                </span>
                                <button
                                    onClick={() => deleteMutation.mutate(task.id)}
                                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity"
                                >
                                    <span className="material-symbols-outlined text-[16px]">delete</span>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. Shortcuts (Workflow) */}
                <div className="bg-white dark:bg-card-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 flex flex-col gap-4 justify-center">
                    <h2 className="text-xl font-semibold flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-purple-500">rocket_launch</span>
                        Quick Actions
                    </h2>

                    <button onClick={() => navigate('/upload')} className="w-full p-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-3 font-medium">
                        <span className="material-symbols-outlined">cloud_upload</span>
                        Upload New Assets
                    </button>

                    <button onClick={() => navigate('/content')} className="w-full p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-3 font-medium">
                        <span className="material-symbols-outlined">edit_note</span>
                        Create Content
                    </button>

                    <button onClick={() => navigate('/ideas')} className="w-full p-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all flex items-center justify-center gap-3 font-medium">
                        <span className="material-symbols-outlined">lightbulb</span>
                        Brainstorm Ideas
                    </button>
                </div>

                {/* 3. Brain Dump (Inbox) */}
                <div className="bg-white dark:bg-card-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
                    <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                        <span className="material-symbols-outlined text-gray-500">inbox</span>
                        Brain Dump
                    </h2>

                    <form onSubmit={handleCreateTask} className="flex gap-2 mb-4">
                        <input
                            type="text"
                            value={newTaskText}
                            onChange={(e) => setNewTaskText(e.target.value)}
                            placeholder="Add a quick task..."
                            className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                        />
                        <button
                            type="submit"
                            disabled={!newTaskText.trim() || createMutation.isPending}
                            className="bg-primary hover:bg-primary-dark text-white px-3 py-2 rounded-lg transition-colors flex items-center justify-center"
                        >
                            <span className="material-symbols-outlined text-[20px]">add</span>
                        </button>
                    </form>

                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                        {inboxTasks.length === 0 && <p className="text-sm text-gray-400 italic text-center py-4">Inbox zero! 🎉</p>}
                        {inboxTasks.map((task) => (
                            <div key={task.id} className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg group">
                                <input
                                    type="checkbox"
                                    checked={task.isDone}
                                    onChange={(e) => toggleMutation.mutate({ id: task.id, isDone: e.target.checked })}
                                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                                />
                                <span className={`flex-1 text-sm ${task.isDone ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-200'}`}>
                                    {task.text}
                                </span>
                                <button
                                    onClick={() => deleteMutation.mutate(task.id)}
                                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity"
                                >
                                    <span className="material-symbols-outlined text-[16px]">close</span>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
