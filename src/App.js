import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useTasks } from './hooks/useTasks';
import { TaskForm } from './components/TaskForm/TaskForm';
import { FilterBar } from './components/FilterBar/FilterBar';
import { TaskList } from './components/TaskList/TaskList';
import { isOverdue } from './utils/date';
const DEFAULT_FILTERS = {
    priority: 'all',
    category: 'all',
    showCompleted: true,
    routineOnly: false,
};
export default function App() {
    const { tasks, addTask, deleteTask, toggleTask, editTask } = useTasks();
    const [filters, setFilters] = useState(DEFAULT_FILTERS);
    const availableCategories = Array.from(new Set(tasks.flatMap(t => t.categories))).sort();
    const filteredTasks = tasks
        .filter(t => filters.showCompleted || !t.completed)
        .filter(t => filters.priority === 'all' || t.priority === filters.priority)
        .filter(t => filters.category === 'all' || t.categories.includes(filters.category))
        .filter(t => !filters.routineOnly || t.recurrence !== 'none')
        .sort((a, b) => {
        if (a.completed !== b.completed)
            return a.completed ? 1 : -1;
        if (a.dueDate && b.dueDate)
            return a.dueDate.localeCompare(b.dueDate);
        if (a.dueDate)
            return -1;
        if (b.dueDate)
            return 1;
        return a.createdAt.localeCompare(b.createdAt);
    });
    const activeCount = tasks.filter(t => !t.completed).length;
    const completedCount = tasks.filter(t => t.completed).length;
    const overdueCount = tasks.filter(t => !t.completed && t.dueDate != null && isOverdue(t.dueDate)).length;
    useEffect(() => {
        document.title = activeCount > 0 ? `(${activeCount}) Daily Tasks` : 'Daily Tasks';
    }, [activeCount]);
    function handleEdit(id, patch) {
        editTask(id, patch);
    }
    return (_jsxs("div", { className: "app", children: [_jsxs("header", { className: "app-header", children: [_jsx("h1", { className: "app-header__title", children: "Daily Tasks" }), _jsx("p", { className: "app-header__subtitle", children: "\u30B7\u30F3\u30D7\u30EB\u306A\u65E5\u5E38\u30BF\u30B9\u30AF\u7BA1\u7406" })] }), _jsxs("main", { className: "app-main", children: [_jsx(TaskForm, { existingCategories: availableCategories, onAdd: addTask }), _jsx(FilterBar, { filters: filters, availableCategories: availableCategories, taskCounts: { total: activeCount, completed: completedCount, overdue: overdueCount }, onChange: setFilters }), _jsx(TaskList, { tasks: filteredTasks, existingCategories: availableCategories, onToggle: toggleTask, onDelete: deleteTask, onEdit: handleEdit })] })] }));
}
