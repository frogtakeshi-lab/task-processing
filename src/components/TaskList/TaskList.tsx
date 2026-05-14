import type { Task } from '../../types'
import { TaskItem } from '../TaskItem/TaskItem'
import './TaskList.css'

interface TaskListProps {
  tasks: Task[]
  existingCategories: string[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (id: string, patch: Partial<Pick<Task, 'title' | 'priority' | 'categories' | 'dueDate' | 'recurrence'>>) => void
}

export function TaskList({ tasks, existingCategories, onToggle, onDelete, onEdit }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="task-list__empty">
        <p>タスクがありません</p>
        <p className="task-list__empty-hint">右下の + ボタンから追加できます</p>
      </div>
    )
  }

  return (
    <ul className="task-list" role="list">
      {tasks.map(task => (
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
  )
}
