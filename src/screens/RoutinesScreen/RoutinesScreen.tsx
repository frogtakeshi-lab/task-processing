import type { Task, Recurrence, TaskPatch } from '../../types'
import { TaskItem } from '../../components/TaskItem/TaskItem'
import './RoutinesScreen.css'

const GROUPS: { recurrence: Recurrence; label: string }[] = [
  { recurrence: 'daily', label: '毎日' },
  { recurrence: 'weekly', label: '毎週' },
  { recurrence: 'monthly', label: '毎月' },
]

interface RoutinesScreenProps {
  tasks: Task[]
  existingCategories: string[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (id: string, patch: TaskPatch) => void
}

export function RoutinesScreen({ tasks, existingCategories, onToggle, onDelete, onEdit }: RoutinesScreenProps) {
  const routines = tasks.filter(t => t.recurrence !== 'none')

  if (routines.length === 0) {
    return (
      <div className="routines-screen">
        <p className="routines-screen__empty">
          ルーティンがまだありません
          <br />
          <span>右下の + ボタンから追加できます</span>
        </p>
      </div>
    )
  }

  return (
    <div className="routines-screen">
      {GROUPS.map(({ recurrence, label }) => {
        const group = routines
          .filter(t => t.recurrence === recurrence)
          .sort((a, b) => {
            if (a.completed !== b.completed) return a.completed ? 1 : -1
            if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate)
            return a.createdAt.localeCompare(b.createdAt)
          })
        if (group.length === 0) return null

        return (
          <section key={recurrence} className="routines-screen__group">
            <h2 className="routines-screen__group-title">{label}</h2>
            <ul className="routines-screen__list" role="list">
              {group.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  existingCategories={existingCategories}
                  onToggle={onToggle}
                  onDelete={onDelete}
                  onEdit={onEdit}
                />
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
