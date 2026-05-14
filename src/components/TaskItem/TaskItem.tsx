import { useState, type KeyboardEvent } from 'react'
import type { Task, Priority, Recurrence, Subtask, TaskPatch } from '../../types'
import { Badge } from '../Badge/Badge'
import { formatDueDate, isOverdue, isDueSoon, todayISO } from '../../utils/date'
import './TaskItem.css'

interface TaskItemProps {
  task: Task
  existingCategories: string[]
  readOnly?: boolean
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (id: string, patch: TaskPatch) => void
}

const PRIORITY_LABELS: Record<Priority, string> = { high: '高', medium: '中', low: '低' }
const RECURRENCE_LABELS: Record<Recurrence, string> = { none: 'なし', daily: '毎日', weekly: '毎週', monthly: '毎月' }

export function TaskItem({ task, existingCategories, readOnly = false, onToggle, onDelete, onEdit }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)
  const [editPriority, setEditPriority] = useState<Priority>(task.priority)
  const [editCategories, setEditCategories] = useState(task.categories.join(', '))
  const [editDueDate, setEditDueDate] = useState(task.dueDate ?? '')
  const [editRecurrence, setEditRecurrence] = useState<Recurrence>(task.recurrence)
  const [editNotes, setEditNotes] = useState(task.notes)
  const [editSubtasks, setEditSubtasks] = useState<Subtask[]>(task.subtasks)
  const [newSubtaskInput, setNewSubtaskInput] = useState('')

  function startEdit() {
    setEditTitle(task.title)
    setEditPriority(task.priority)
    setEditCategories(task.categories.join(', '))
    setEditDueDate(task.dueDate ?? '')
    setEditRecurrence(task.recurrence)
    setEditNotes(task.notes)
    setEditSubtasks(task.subtasks)
    setNewSubtaskInput('')
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
      notes: editNotes,
      subtasks: editSubtasks,
    })
    setIsEditing(false)
  }

  function cancelEdit() {
    setIsEditing(false)
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter' && e.currentTarget.tagName !== 'TEXTAREA') saveEdit()
    if (e.key === 'Escape') cancelEdit()
  }

  function addEditSubtask() {
    const trimmed = newSubtaskInput.trim()
    if (!trimmed) return
    setEditSubtasks(prev => [...prev, { id: crypto.randomUUID(), title: trimmed, completed: false }])
    setNewSubtaskInput('')
  }

  function toggleEditSubtask(id: string) {
    setEditSubtasks(prev => prev.map(s => s.id === id ? { ...s, completed: !s.completed } : s))
  }

  function removeEditSubtask(id: string) {
    setEditSubtasks(prev => prev.filter(s => s.id !== id))
  }

  function toggleSubtask(sub: Subtask) {
    onEdit(task.id, {
      subtasks: task.subtasks.map(s => s.id === sub.id ? { ...s, completed: !s.completed } : s)
    })
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
          <select className="task-item__edit-select" value={editPriority} onChange={e => setEditPriority(e.target.value as Priority)}>
            {(Object.entries(PRIORITY_LABELS) as [Priority, string][]).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
          <select className="task-item__edit-select" value={editRecurrence} onChange={e => setEditRecurrence(e.target.value as Recurrence)}>
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
            list="category-list-edit"
          />
          <datalist id="category-list-edit">
            {existingCategories.map(c => <option key={c} value={c} />)}
          </datalist>
        </div>

        <textarea
          className="task-item__edit-notes"
          placeholder="補足説明..."
          value={editNotes}
          onChange={e => setEditNotes(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={2}
          maxLength={1000}
        />

        <div className="task-item__edit-subtasks">
          <span className="task-item__edit-subtasks-label">サブタスク</span>
          {editSubtasks.map(sub => (
            <div key={sub.id} className="task-item__edit-subtask-row">
              <input
                type="checkbox"
                checked={sub.completed}
                onChange={() => toggleEditSubtask(sub.id)}
                className="task-item__subtask-check"
              />
              <span className={`task-item__edit-subtask-title${sub.completed ? ' task-item__edit-subtask-title--done' : ''}`}>{sub.title}</span>
              <button type="button" className="task-item__edit-subtask-remove" onClick={() => removeEditSubtask(sub.id)} aria-label="削除">×</button>
            </div>
          ))}
          <div className="task-item__edit-subtask-add">
            <input
              className="task-item__edit-subtask-input"
              type="text"
              placeholder="サブタスクを追加..."
              value={newSubtaskInput}
              onChange={e => setNewSubtaskInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addEditSubtask() } }}
              maxLength={200}
            />
            <button type="button" className="task-item__edit-subtask-btn" onClick={addEditSubtask} disabled={!newSubtaskInput.trim()}>+</button>
          </div>
        </div>

        <div className="task-item__edit-actions">
          <button className="task-item__btn task-item__btn--save" onClick={saveEdit}>保存</button>
          <button className="task-item__btn task-item__btn--cancel" onClick={cancelEdit}>キャンセル</button>
        </div>
      </li>
    )
  }

  return (
    <li className={`task-item${task.completed ? ' task-item--completed' : ''}${readOnly ? ' task-item--readonly' : ''}`}>
      {!readOnly && (
        <input
          className="task-item__checkbox"
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          aria-label={task.completed ? 'タスクを未完了にする' : 'タスクを完了にする'}
        />
      )}
      {readOnly && <span className="task-item__readonly-dot" aria-hidden="true" />}

      <div className="task-item__body">
        <span className="task-item__title">{task.title}</span>

        {task.notes && (
          <p className="task-item__notes">{task.notes}</p>
        )}

        {task.subtasks.length > 0 && (
          <ul className="task-item__subtasks" role="list">
            {task.subtasks.map(sub => (
              <li key={sub.id} className="task-item__subtask">
                <input
                  type="checkbox"
                  className="task-item__subtask-check"
                  checked={sub.completed}
                  onChange={() => !readOnly && toggleSubtask(sub)}
                  disabled={readOnly}
                  aria-label={sub.title}
                />
                <span className={`task-item__subtask-title${sub.completed ? ' task-item__subtask-title--done' : ''}`}>
                  {sub.title}
                </span>
              </li>
            ))}
          </ul>
        )}

        <div className="task-item__meta">
          <Badge label={PRIORITY_LABELS[task.priority]} variant={`priority-${task.priority}`} />
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

      {!readOnly && (
        <div className="task-item__actions">
          <button className="task-item__btn task-item__btn--edit" onClick={startEdit} aria-label="タスクを編集">編集</button>
          <button className="task-item__btn task-item__btn--delete" onClick={() => onDelete(task.id)} aria-label="タスクを削除">削除</button>
        </div>
      )}
    </li>
  )
}
