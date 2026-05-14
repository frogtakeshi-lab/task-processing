import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import './FilterBar.css';
const PRIORITY_OPTIONS = [
    { value: 'all', label: 'すべて' },
    { value: 'high', label: '高' },
    { value: 'medium', label: '中' },
    { value: 'low', label: '低' },
];
export function FilterBar({ filters, availableCategories, taskCounts, onChange }) {
    return (_jsxs("div", { className: "filter-bar", children: [_jsxs("div", { className: "filter-bar__controls", children: [_jsx("div", { className: "filter-bar__group", children: PRIORITY_OPTIONS.map(opt => (_jsx("button", { className: `filter-bar__pill${filters.priority === opt.value ? ' filter-bar__pill--active' : ''}`, onClick: () => onChange({ ...filters, priority: opt.value }), children: opt.label }, opt.value))) }), availableCategories.length > 0 && (_jsxs("select", { className: "filter-bar__select", value: filters.category, onChange: e => onChange({ ...filters, category: e.target.value }), children: [_jsx("option", { value: "all", children: "\u30AB\u30C6\u30B4\u30EA: \u3059\u3079\u3066" }), availableCategories.map(c => (_jsx("option", { value: c, children: c }, c)))] })), _jsxs("label", { className: "filter-bar__checkbox-label", children: [_jsx("input", { type: "checkbox", checked: filters.routineOnly, onChange: e => onChange({ ...filters, routineOnly: e.target.checked }) }), "\u30EB\u30FC\u30C6\u30A3\u30F3\u306E\u307F"] }), _jsxs("label", { className: "filter-bar__checkbox-label", children: [_jsx("input", { type: "checkbox", checked: filters.showCompleted, onChange: e => onChange({ ...filters, showCompleted: e.target.checked }) }), "\u5B8C\u4E86\u6E08\u307F\u3092\u8868\u793A"] })] }), _jsxs("div", { className: "filter-bar__stats", children: [_jsxs("span", { children: [taskCounts.total, " \u4EF6"] }), taskCounts.completed > 0 && (_jsxs("span", { className: "filter-bar__stat-item", children: [taskCounts.completed, " \u5B8C\u4E86"] })), taskCounts.overdue > 0 && (_jsxs("span", { className: "filter-bar__stat-item filter-bar__stat-item--overdue", children: [taskCounts.overdue, " \u671F\u9650\u5207\u308C"] }))] })] }));
}
