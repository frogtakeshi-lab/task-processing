import { useState, useRef, useEffect, type FormEvent } from 'react'
import type { Priority, Recurrence, Task } from '../../types'
import { todayISO } from '../../utils/date'
import './AddTaskModal.css'

type TaskDraft = Omit<Task, 'id' | 'createdAt' | 'completed'>

export interface ModalDefaults {
  recurrence?: Recurrence
}

interface AddTaskModalProps {
  mode?: 'task' | 'routine'
  defaults?: ModalDefaults
  existingCategories: string[]
  onAdd: (draft: TaskDraft) => void
  onClose: () => void
}

const PRIORITY_LABELS: Record<Priority, string> = { high: '高', medium: '中', low: '低' }
const RECURRENCE_OPTIONS_ROUTINE: [Recurrence, string][] = [['daily', '毎日'], ['weekly', '毎週'], ['monthly', '毎月']]

export function AddTaskModal({ mode = 'task', defaults = {}, existingCategories, onAdd, onClose }: AddTaskModalProps) {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [categoryInput, setCategoryInput] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [recurrence, setRecurrence] = useState<Recurrence>(defaults.recurrence ?? (mode === 'routine' ? 'daily' : 'none'))
  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    titleRef.current?.focus()
  }, [])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    const categories = categoryInput.split(',').map(s => s.trim()).filter(Boolean)
    onAdd({ title: trimmed, priority, categories, dueDate: dueDate || null, recurrence })
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal-sheet"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="タスクを追加"
      >
        <div className="modal-sheet__handle" aria-hidden="true" />
        <h2 className="modal-sheet__heading">{mode === 'routine' ? 'ルーティンを追加' : 'タスクを追加'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            ref={titleRef}
            className="modal-sheet__title-input"
            type="text"
            placeholder="タスク名を入力..."
            value={title}
            onChange={e => setTitle(e.target.value)}
            maxLength={200}
          />
          <div className="modal-sheet__fields">
            <label className="modal-sheet__field">
              <span className="modal-sheet__label">優先度</span>
              <select
                className="modal-sheet__select"
                value={priority}
                onChange={e => setPriority(e.target.value as Priority)}
              >
                {(Object.entries(PRIORITY_LABELS) as [Priority, string][]).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </label>
            {mode === 'routine' && (
              <label className="modal-sheet__field">
                <span className="modal-sheet__label">繰り返し</span>
                <select
                  className="modal-sheet__select"
                  value={recurrence}
                  onChange={e => setRecurrence(e.target.value as Recurrence)}
                >
                  {RECURRENCE_OPTIONS_ROUTINE.map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              </label>
            )}
            <label className="modal-sheet__field">
              <span className="modal-sheet__label">期限</span>
              <input
                className="modal-sheet__date"
                type="date"
                value={dueDate}
                min={todayISO()}
                onChange={e => setDueDate(e.target.value)}
              />
            </label>
            <label className="modal-sheet__field modal-sheet__field--full">
              <span className="modal-sheet__label">カテゴリ（カンマ区切り）</span>
              <input
                className="modal-sheet__category"
                type="text"
                placeholder="仕事, 健康..."
                value={categoryInput}
                onChange={e => setCategoryInput(e.target.value)}
                list="modal-category-list"
              />
              <datalist id="modal-category-list">
                {existingCategories.map(c => <option key={c} value={c} />)}
              </datalist>
            </label>
          </div>
          <button className="modal-sheet__submit" type="submit" disabled={!title.trim()}>
            追加する
          </button>
        </form>
      </div>
    </div>
  )
}
