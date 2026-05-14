import { useState, type KeyboardEvent } from 'react'
import type { Task, Priority, Recurrence } from '../../types'
import { Badge } from '../Badge/Badge'
import { formatDueDate, isOverdue, isDueSoon, todayISO } from '../../utils/date'
import './TaskItem.css'

interface TaskItemProps {
  task: Task
  existingCategories: string[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (id: string, patch: Partial<Pick<Task, 'title' | 'priority' | 'categories' | 'dueDate' | 'recurrence'>>) => void
}

const PRIORITY_LABELS: Record<Priority, string> = { high: '高', medium: '中', low: '低' }
const RECURRENCE_LABELS: Record<Recurrence, string> = { none: 'なし', daily: '毎日', weekly: '毎週', monthly: '毎月' }

export function TaskItem({ task, existingCategories, onToggle, onDelete, onEdit }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)
  const [editPriority, setEditPriority] = useState<Priority>(task.priority)
  const [editCategories, setEditCategories] = useState(task.categories.join(', '))
  const [editDueDate, setEditDueDate] = useState(task.dueDate ?? '')
  const [editRecurrence, setEditRecurrence] = useState<Recurrence>(task.recurrence)

  function startEdit() {
    setEditTitle(task.title)
    setEditPriority(task.priority)
    setEditCategories(task.categories.join(', '))
    setEditDueDate(task.dueDate ?? '')
    setEditRecurrence(task.recurrence)
    setIsEditing(true)
  }

  function saveEdit() {
    const trimmed = editTitle.trim()
    if (!trimmed) return
    onEdit(task.id, {
      title: trimmed,
      priority: editPriority,
      categories: editCategories.split(',').map(s => s.trim()).filter(Boolean),
      dueDate: editDueDate || null,
      recurrence: editRecurrence,
    })
    setIsEditing(false)
  }

  function cancelEdit() {
    setIsEditing(false)
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') saveEdit()
    if (e.key === 'Escape') cancelEdit()
  }

  const overdue = task.dueDate && !task.completed && isOverdue(task.dueDate)
  const dueSoon = task.dueDate && !task.completed && !overdue && isDueSoon(task.dueDate)

  if (isEditing) {
    return (
      <li className="task-item task-item--editing">
        <input
          className="task-item__edit-title"
          type="text"
          value={editTitle}
          onChange={e => setEditTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          maxLength={200}
        />
        <div className="task-item__edit-meta">
          <select
            className="task-item__edit-select"
            value={editPriority}
            onChange={e => setEditPriority(e.target.value as Priority)}
          >
            {(Object.entries(PRIORITY_LABELS) as [Priority, string][]).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
          <select
            className="task-item__edit-select"
            value={editRecurrence}
            onChange={e => setEditRecurrence(e.target.value as Recurrence)}
          >
            {(Object.entries(RECURRENCE_LABELS) as [Recurrence, string][]).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
          <input
            className="task-item__edit-date"
            type="date"
            value={editDueDate}
            min={todayISO()}
            onChange={e => setEditDueDate(e.target.value)}
          />
          <input
            className="task-item__edit-categories"
            type="text"
            placeholder="カテゴリ（カンマ区切り）"
            value={editCategories}
            onChange={e => setEditCategories(e.target.value)}
            onKeyDown={handleKeyDown}
            list="category-list-edit"
          />
          <datalist id="category-list-edit">
            {existingCategories.map(c => <option key={c} value={c} />)}
          </datalist>
        </div>
        <div className="task-item__edit-actions">
          <button className="task-item__btn task-item__btn--save" onClick={saveEdit}>保存</button>
          <button className="task-item__btn task-item__btn--cancel" onClick={cancelEdit}>キャンセル</button>
        </div>
      </li>
    )
  }

  return (
    <li className={`task-item${task.completed ? ' task-item--completed' : ''}`}>
      <input
        className="task-item__checkbox"
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        aria-label={task.completed ? 'タスクを未完了にする' : 'タスクを完了にする'}
      />
      <div className="task-item__body">
        <span className="task-item__title">{task.title}</span>
        <div className="task-item__meta">
          <Badge
            label={PRIORITY_LABELS[task.priority]}
            variant={`priority-${task.priority}`}
          />
          {task.recurrence !== 'none' && (
            <Badge label={`繰り返し: ${RECURRENCE_LABELS[task.recurrence]}`} variant="recurrence" />
          )}
          {task.categories.map(cat => (
            <Badge key={cat} label={cat} variant="category" />
          ))}
          {task.dueDate && (
            <span className={`task-item__due${overdue ? ' task-item__due--overdue' : dueSoon ? ' task-item__due--soon' : ''}`}>
              {overdue && <span className="task-item__due-icon">!</span>}
              {formatDueDate(task.dueDate)}
            </span>
          )}
        </div>
      </div>
      <div className="task-item__actions">
        <button
          className="task-item__btn task-item__btn--edit"
          onClick={startEdit}
          aria-label="タスクを編集"
        >
          編集
        </button>
        <button
          className="task-item__btn task-item__btn--delete"
          onClick={() => onDelete(task.id)}
          aria-label="タスクを削除"
        >
          削除
        </button>
      </div>
    </li>
  )
}
