import type { Task } from '../../types'
import { TaskList } from '../../components/TaskList/TaskList'
import { getGreeting, formatTodayHeader, isTodayTask, isOverdue } from '../../utils/date'
import './HomeScreen.css'

interface HomeScreenProps {
  tasks: Task[]
  existingCategories: string[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (id: string, patch: Partial<Pick<Task, 'title' | 'priority' | 'categories' | 'dueDate' | 'recurrence'>>) => void
}

export function HomeScreen({ tasks, existingCategories, onToggle, onDelete, onEdit }: HomeScreenProps) {
  const todayTasks = tasks
    .filter(t => !t.completed && isTodayTask(t.dueDate))
    .sort((a, b) => {
      if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate)
      if (a.dueDate) return -1
      if (b.dueDate) return 1
      return a.createdAt.localeCompare(b.createdAt)
    })

  const routines = tasks
    .filter(t => t.recurrence !== 'none')
    .sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1
      if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate)
      return a.createdAt.localeCompare(b.createdAt)
    })

  const activeCount = tasks.filter(t => !t.completed).length
  const completedCount = tasks.filter(t => t.completed).length
  const overdueCount = tasks.filter(t => !t.completed && t.dueDate != null && isOverdue(t.dueDate)).length

  return (
    <div className="home-screen">
      <header className="home-screen__header">
        <p className="home-screen__date">{formatTodayHeader()}</p>
        <p className="home-screen__greeting">{getGreeting()}</p>
        <div className="home-screen__stats">
          <span className="home-screen__stat">
            未完了 <strong>{activeCount}</strong>
          </span>
          <span className="home-screen__stat-divider">|</span>
          <span className="home-screen__stat">
            完了 <strong>{completedCount}</strong>
          </span>
          {overdueCount > 0 && (
            <>
              <span className="home-screen__stat-divider">|</span>
              <span className="home-screen__stat home-screen__stat--overdue">
                期限切れ <strong>{overdueCount}</strong>
              </span>
            </>
          )}
        </div>
      </header>

      <section className="home-screen__section">
        <h2 className="home-screen__section-title">今日のタスク</h2>
        {todayTasks.length === 0 ? (
          <p className="home-screen__empty">今日のタスクはありません</p>
        ) : (
          <TaskList
            tasks={todayTasks}
            existingCategories={existingCategories}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        )}
      </section>

      <section className="home-screen__section">
        <h2 className="home-screen__section-title">ルーティン</h2>
        {routines.length === 0 ? (
          <p className="home-screen__empty">ルーティンはまだありません</p>
        ) : (
          <TaskList
            tasks={routines}
            existingCategories={existingCategories}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        )}
      </section>
    </div>
  )
}
