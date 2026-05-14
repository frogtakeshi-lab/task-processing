import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Badge } from '../Badge/Badge';
import { formatDueDate, isOverdue, isDueSoon, todayISO } from '../../utils/date';
import './TaskItem.css';
const PRIORITY_LABELS = { high: '高', medium: '中', low: '低' };
const RECURRENCE_LABELS = { none: 'なし', daily: '毎日', weekly: '毎週', monthly: '毎月' };
export function TaskItem({ task, existingCategories, onToggle, onDelete, onEdit }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(task.title);
    const [editPriority, setEditPriority] = useState(task.priority);
    const [editCategories, setEditCategories] = useState(task.categories.join(', '));
    const [editDueDate, setEditDueDate] = useState(task.dueDate ?? '');
    const [editRecurrence, setEditRecurrence] = useState(task.recurrence);
    function startEdit() {
        setEditTitle(task.title);
        setEditPriority(task.priority);
        setEditCategories(task.categories.join(', '));
        setEditDueDate(task.dueDate ?? '');
        setEditRecurrence(task.recurrence);
        setIsEditing(true);
    }
    function saveEdit() {
        const trimmed = editTitle.trim();
        if (!trimmed)
            return;
        onEdit(task.id, {
            title: trimmed,
            priority: editPriority,
            categories: editCategories.split(',').map(s => s.trim()).filter(Boolean),
            dueDate: editDueDate || null,
            recurrence: editRecurrence,
        });
        setIsEditing(false);
    }
    function cancelEdit() {
        setIsEditing(false);
    }
    function handleKeyDown(e) {
        if (e.key === 'Enter')
            saveEdit();
        if (e.key === 'Escape')
            cancelEdit();
    }
    const overdue = task.dueDate && !task.completed && isOverdue(task.dueDate);
    const dueSoon = task.dueDate && !task.completed && !overdue && isDueSoon(task.dueDate);
    if (isEditing) {
        return (_jsxs("li", { className: "task-item task-item--editing", children: [_jsx("input", { className: "task-item__edit-title", type: "text", value: editTitle, onChange: e => setEditTitle(e.target.value), onKeyDown: handleKeyDown, autoFocus: true, maxLength: 200 }), _jsxs("div", { className: "task-item__edit-meta", children: [_jsx("select", { className: "task-item__edit-select", value: editPriority, onChange: e => setEditPriority(e.target.value), children: Object.entries(PRIORITY_LABELS).map(([v, l]) => (_jsx("option", { value: v, children: l }, v))) }), _jsx("select", { className: "task-item__edit-select", value: editRecurrence, onChange: e => setEditRecurrence(e.target.value), children: Object.entries(RECURRENCE_LABELS).map(([v, l]) => (_jsx("option", { value: v, children: l }, v))) }), _jsx("input", { className: "task-item__edit-date", type: "date", value: editDueDate, min: todayISO(), onChange: e => setEditDueDate(e.target.value) }), _jsx("input", { className: "task-item__edit-categories", type: "text", placeholder: "\u30AB\u30C6\u30B4\u30EA\uFF08\u30AB\u30F3\u30DE\u533A\u5207\u308A\uFF09", value: editCategories, onChange: e => setEditCategories(e.target.value), onKeyDown: handleKeyDown, list: "category-list-edit" }), _jsx("datalist", { id: "category-list-edit", children: existingCategories.map(c => _jsx("option", { value: c }, c)) })] }), _jsxs("div", { className: "task-item__edit-actions", children: [_jsx("button", { className: "task-item__btn task-item__btn--save", onClick: saveEdit, children: "\u4FDD\u5B58" }), _jsx("button", { className: "task-item__btn task-item__btn--cancel", onClick: cancelEdit, children: "\u30AD\u30E3\u30F3\u30BB\u30EB" })] })] }));
    }
    return (_jsxs("li", { className: `task-item${task.completed ? ' task-item--completed' : ''}`, children: [_jsx("input", { className: "task-item__checkbox", type: "checkbox", checked: task.completed, onChange: () => onToggle(task.id), "aria-label": task.completed ? 'タスクを未完了にする' : 'タスクを完了にする' }), _jsxs("div", { className: "task-item__body", children: [_jsx("span", { className: "task-item__title", children: task.title }), _jsxs("div", { className: "task-item__meta", children: [_jsx(Badge, { label: PRIORITY_LABELS[task.priority], variant: `priority-${task.priority}` }), task.recurrence !== 'none' && (_jsx(Badge, { label: `繰り返し: ${RECURRENCE_LABELS[task.recurrence]}`, variant: "recurrence" })), task.categories.map(cat => (_jsx(Badge, { label: cat, variant: "category" }, cat))), task.dueDate && (_jsxs("span", { className: `task-item__due${overdue ? ' task-item__due--overdue' : dueSoon ? ' task-item__due--soon' : ''}`, children: [overdue && _jsx("span", { className: "task-item__due-icon", children: "!" }), formatDueDate(task.dueDate)] }))] })] }), _jsxs("div", { className: "task-item__actions", children: [_jsx("button", { className: "task-item__btn task-item__btn--edit", onClick: startEdit, "aria-label": "\u30BF\u30B9\u30AF\u3092\u7DE8\u96C6", children: "\u7DE8\u96C6" }), _jsx("button", { className: "task-item__btn task-item__btn--delete", onClick: () => onDelete(task.id), "aria-label": "\u30BF\u30B9\u30AF\u3092\u524A\u9664", children: "\u524A\u9664" })] })] }));
}
