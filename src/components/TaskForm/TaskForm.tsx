import { useState, useRef, type FormEvent, type KeyboardEvent } from 'react'
import type { Priority, Recurrence, Task } from '../../types'
import { todayISO } from '../../utils/date'
import './TaskForm.css'

type TaskDraft = Omit<Task, 'id' | 'createdAt' | 'completed'>

interface TaskFormProps {
  existingCategories: string[]
  onAdd: (draft: TaskDraft) => void
}

const RECURRENCE_LABELS: Record<Recurrence, string> = {
  none: 'なし',
  daily: '毎日',
  weekly: '毎週',
  monthly: '毎月',
}

const PRIORITY_LABELS: Record<Priority, string> = {
  high: '高',
  medium: '中',
  low: '低',
}

export function TaskForm({ existingCategories, onAdd }: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [categoryInput, setCategoryInput] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [recurrence, setRecurrence] = useState<Recurrence>('none')
  const titleRef = useRef<HTMLInputElement>(null)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return

    const categories = categoryInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)

    onAdd({
      title: trimmed,
      priority,
      categories,
      dueDate: dueDate || null,
      recurrence,
    })

    setTitle('')
    setCategoryInput('')
    setDueDate('')
    setRecurrence('none')
    titleRef.current?.focus()
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit(e as unknown as FormEvent)
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="task-form__title-row">
        <input
          ref={titleRef}
          className="task-form__title-input"
          type="text"
          placeholder="タスクを入力..."
          value={title}
          onChange={e => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={200}
          autoFocus
        />
        <button className="task-form__submit" type="submit" disabled={!title.trim()}>
          追加
        </button>
      </div>
      <div className="task-form__meta-row">
        <div className="task-form__field">
          <label className="task-form__label">優先度</label>
          <select
            className="task-form__select"
            value={priority}
            onChange={e => setPriority(e.target.value as Priority)}
          >
            {(Object.entries(PRIORITY_LABELS) as [Priority, string][]).map(([v, label]) => (
              <option key={v} value={v}>{label}</option>
            ))}
          </select>
        </div>
        <div className="task-form__field">
          <label className="task-form__label">繰り返し</label>
          <select
            className="task-form__select"
            value={recurrence}
            onChange={e => setRecurrence(e.target.value as Recurrence)}
          >
            {(Object.entries(RECURRENCE_LABELS) as [Recurrence, string][]).map(([v, label]) => (
              <option key={v} value={v}>{label}</option>
            ))}
          </select>
        </div>
        <div className="task-form__field">
          <label className="task-form__label">期限</label>
          <input
            className="task-form__date"
            type="date"
            value={dueDate}
            min={todayISO()}
            onChange={e => setDueDate(e.target.value)}
          />
        </div>
        <div className="task-form__field task-form__field--grow">
          <label className="task-form__label">カテゴリ</label>
          <input
            className="task-form__category-input"
            type="text"
            placeholder="仕事, 健康..."
            value={categoryInput}
            onChange={e => setCategoryInput(e.target.value)}
            list="category-list"
          />
          <datalist id="category-list">
            {existingCategories.map(c => <option key={c} value={c} />)}
          </datalist>
        </div>
      </div>
    </form>
  )
}
