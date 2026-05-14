import type { FilterState, Priority } from '../../types'
import './FilterBar.css'

interface TaskCounts {
  total: number
  completed: number
  overdue: number
}

interface FilterBarProps {
  filters: FilterState
  availableCategories: string[]
  taskCounts: TaskCounts
  onChange: (next: FilterState) => void
}

const PRIORITY_OPTIONS: { value: Priority | 'all'; label: string }[] = [
  { value: 'all', label: 'すべて' },
  { value: 'high', label: '高' },
  { value: 'medium', label: '中' },
  { value: 'low', label: '低' },
]

export function FilterBar({ filters, availableCategories, taskCounts, onChange }: FilterBarProps) {
  return (
    <div className="filter-bar">
      <div className="filter-bar__controls">
        <div className="filter-bar__group">
          {PRIORITY_OPTIONS.map(opt => (
            <button
              key={opt.value}
              className={`filter-bar__pill${filters.priority === opt.value ? ' filter-bar__pill--active' : ''}`}
              onClick={() => onChange({ ...filters, priority: opt.value })}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {availableCategories.length > 0 && (
          <select
            className="filter-bar__select"
            value={filters.category}
            onChange={e => onChange({ ...filters, category: e.target.value })}
          >
            <option value="all">カテゴリ: すべて</option>
            {availableCategories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        )}

        <label className="filter-bar__checkbox-label">
          <input
            type="checkbox"
            checked={filters.showCompleted}
            onChange={e => onChange({ ...filters, showCompleted: e.target.checked })}
          />
          完了済みを表示
        </label>
      </div>

      <div className="filter-bar__stats">
        <span>{taskCounts.total} 件</span>
        {taskCounts.completed > 0 && (
          <span className="filter-bar__stat-item">{taskCounts.completed} 完了</span>
        )}
        {taskCounts.overdue > 0 && (
          <span className="filter-bar__stat-item filter-bar__stat-item--overdue">{taskCounts.overdue} 期限切れ</span>
        )}
      </div>
    </div>
  )
}
