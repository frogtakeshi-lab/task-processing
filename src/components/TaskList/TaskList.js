import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { TaskItem } from '../TaskItem/TaskItem';
import './TaskList.css';
export function TaskList({ tasks, existingCategories, onToggle, onDelete, onEdit }) {
    if (tasks.length === 0) {
        return (_jsxs("div", { className: "task-list__empty", children: [_jsx("p", { children: "\u30BF\u30B9\u30AF\u304C\u3042\u308A\u307E\u305B\u3093" }), _jsx("p", { className: "task-list__empty-hint", children: "\u4E0A\u306E\u30D5\u30A9\u30FC\u30E0\u304B\u3089\u30BF\u30B9\u30AF\u3092\u8FFD\u52A0\u3057\u307E\u3057\u3087\u3046" })] }));
    }
    return (_jsx("ul", { className: "task-list", role: "list", children: tasks.map(task => (_jsx(TaskItem, { task: task, existingCategories: existingCategories, onToggle: onToggle, onDelete: onDelete, onEdit: onEdit }, task.id))) }));
}
