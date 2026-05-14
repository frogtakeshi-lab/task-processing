import { useState, useRef, useEffect, type FormEvent, type KeyboardEvent } from 'react'
import type { Priority, Recurrence, Subtask, Task } from '../../types'
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
  const [notes, setNotes] = useState('')
  const [subtasks, setSubtasks] = useState<Subtask[]>([])
  const [subtaskInput, setSubtaskInput] = useState('')
  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    titleRef.current?.focus()
  }, [])

  function addSubtask() {
    const trimmed = subtaskInput.trim()
    if (!trimmed) return
    setSubtasks(prev => [...prev, { id: crypto.randomUUID(), title: trimmed, completed: false }])
    setSubtaskInput('')
  }

  function removeSubtask(id: string) {
    setSubtasks(prev => prev.filter(s => s.id !== id))
  }

  function handleSubtaskKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') { e.preventDefault(); addSubtask() }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    const categories = categoryInput.split(',').map(s => s.trim()).filter(Boolean)
    onAdd({ title: trimmed, priority, categories, dueDate: dueDate || null, recurrence, notes, subtasks })
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal-sheet"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={mode === 'routine' ? 'ルーティンを追加' : 'タスクを追加'}
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
              <select className="modal-sheet__select" value={priority} onChange={e => setPriority(e.target.value as Priority)}>
                {(Object.entries(PRIORITY_LABELS) as [Priority, string][]).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </label>

            <label className="modal-sheet__field">
              <span className="modal-sheet__label">期限</span>
              <input className="modal-sheet__date" type="date" value={dueDate} min={todayISO()} onChange={e => setDueDate(e.target.value)} />
            </label>

            {mode === 'routine' && (
              <label className="modal-sheet__field modal-sheet__field--full">
                <span className="modal-sheet__label">繰り返し</span>
                <select className="modal-sheet__select" value={recurrence} onChange={e => setRecurrence(e.target.value as Recurrence)}>
                  {RECURRENCE_OPTIONS_ROUTINE.map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              </label>
            )}

            <label className="modal-sheet__field modal-sheet__field--full">
              <span className="modal-sheet__label">補足説明</span>
              <textarea
                className="modal-sheet__notes"
                placeholder="メモや詳細を入力..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={2}
                maxLength={1000}
              />
            </label>

            <div className="modal-sheet__field modal-sheet__field--full">
              <span className="modal-sheet__label">サブタスク</span>
              {subtasks.length > 0 && (
                <ul className="modal-sheet__subtask-list">
                  {subtasks.map(sub => (
                    <li key={sub.id} className="modal-sheet__subtask-item">
                      <span className="modal-sheet__subtask-title">{sub.title}</span>
                      <button type="button" className="modal-sheet__subtask-remove" onClick={() => removeSubtask(sub.id)} aria-label="削除">×</button>
                    </li>
                  ))}
                </ul>
              )}
              <div className="modal-sheet__subtask-add">
                <input
                  className="modal-sheet__subtask-input"
                  type="text"
                  placeholder="サブタスクを追加..."
                  value={subtaskInput}
                  onChange={e => setSubtaskInput(e.target.value)}
                  onKeyDown={handleSubtaskKeyDown}
                  maxLength={200}
                />
                <button type="button" className="modal-sheet__subtask-btn" onClick={addSubtask} disabled={!subtaskInput.trim()}>+</button>
              </div>
            </div>

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
