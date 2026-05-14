import { useState } from 'react';
import { loadTasks, saveTasks } from '../utils/storage';
import { calcNextDueDate } from '../utils/date';
export function useTasks() {
    const [tasks, setTasks] = useState(() => loadTasks());
    function addTask(draft) {
        const next = {
            ...draft,
            id: crypto.randomUUID(),
            completed: false,
            createdAt: new Date().toISOString(),
        };
        const updated = [...tasks, next];
        setTasks(updated);
        saveTasks(updated);
    }
    function deleteTask(id) {
        const updated = tasks.filter(t => t.id !== id);
        setTasks(updated);
        saveTasks(updated);
    }
    function toggleTask(id) {
        const task = tasks.find(t => t.id === id);
        if (!task)
            return;
        const updated = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
        if (!task.completed && task.recurrence !== 'none') {
            const nextDue = calcNextDueDate(task.dueDate, task.recurrence);
            const next = {
                ...task,
                id: crypto.randomUUID(),
                completed: false,
                dueDate: nextDue,
                createdAt: new Date().toISOString(),
            };
            const withNext = [...updated, next];
            setTasks(withNext);
            saveTasks(withNext);
            return;
        }
        setTasks(updated);
        saveTasks(updated);
    }
    function editTask(id, patch) {
        const updated = tasks.map(t => t.id === id ? { ...t, ...patch } : t);
        setTasks(updated);
        saveTasks(updated);
    }
    return { tasks, addTask, deleteTask, toggleTask, editTask };
}
