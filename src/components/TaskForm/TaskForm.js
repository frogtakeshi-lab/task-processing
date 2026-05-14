import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef } from 'react';
import { todayISO } from '../../utils/date';
import './TaskForm.css';
const RECURRENCE_LABELS = {
    none: 'なし',
    daily: '毎日',
    weekly: '毎週',
    monthly: '毎月',
};
const PRIORITY_LABELS = {
    high: '高',
    medium: '中',
    low: '低',
};
export function TaskForm({ existingCategories, onAdd }) {
    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState('medium');
    const [categoryInput, setCategoryInput] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [recurrence, setRecurrence] = useState('none');
    const titleRef = useRef(null);
    function handleSubmit(e) {
        e.preventDefault();
        const trimmed = title.trim();
        if (!trimmed)
            return;
        const categories = categoryInput
            .split(',')
            .map(s => s.trim())
            .filter(Boolean);
        onAdd({
            title: trimmed,
            priority,
            categories,
            dueDate: dueDate || null,
            recurrence,
        });
        setTitle('');
        setCategoryInput('');
        setDueDate('');
        setRecurrence('none');
        titleRef.current?.focus();
    }
    function handleKeyDown(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit(e);
        }
    }
    return (_jsxs("form", { className: "task-form", onSubmit: handleSubmit, children: [_jsxs("div", { className: "task-form__title-row", children: [_jsx("input", { ref: titleRef, className: "task-form__title-input", type: "text", placeholder: "\u30BF\u30B9\u30AF\u3092\u5165\u529B...", value: title, onChange: e => setTitle(e.target.value), onKeyDown: handleKeyDown, maxLength: 200, autoFocus: true }), _jsx("button", { className: "task-form__submit", type: "submit", disabled: !title.trim(), children: "\u8FFD\u52A0" })] }), _jsxs("div", { className: "task-form__meta-row", children: [_jsxs("div", { className: "task-form__field", children: [_jsx("label", { className: "task-form__label", children: "\u512A\u5148\u5EA6" }), _jsx("select", { className: "task-form__select", value: priority, onChange: e => setPriority(e.target.value), children: Object.entries(PRIORITY_LABELS).map(([v, label]) => (_jsx("option", { value: v, children: label }, v))) })] }), _jsxs("div", { className: "task-form__field", children: [_jsx("label", { className: "task-form__label", children: "\u7E70\u308A\u8FD4\u3057" }), _jsx("select", { className: "task-form__select", value: recurrence, onChange: e => setRecurrence(e.target.value), children: Object.entries(RECURRENCE_LABELS).map(([v, label]) => (_jsx("option", { value: v, children: label }, v))) })] }), _jsxs("div", { className: "task-form__field", children: [_jsx("label", { className: "task-form__label", children: "\u671F\u9650" }), _jsx("input", { className: "task-form__date", type: "date", value: dueDate, min: todayISO(), onChange: e => setDueDate(e.target.value) })] }), _jsxs("div", { className: "task-form__field task-form__field--grow", children: [_jsx("label", { className: "task-form__label", children: "\u30AB\u30C6\u30B4\u30EA" }), _jsx("input", { className: "task-form__category-input", type: "text", placeholder: "\u4ED5\u4E8B, \u5065\u5EB7...", value: categoryInput, onChange: e => setCategoryInput(e.target.value), list: "category-list" }), _jsx("datalist", { id: "category-list", children: existingCategories.map(c => _jsx("option", { value: c }, c)) })] })] })] }));
}
