import { useState, useEffect } from 'react'
import { useTasks } from './hooks/useTasks'
import { TaskForm } from './components/TaskForm/TaskForm'
import { FilterBar } from './components/FilterBar/FilterBar'
import { TaskList } from './components/TaskList/TaskList'
import type { FilterState, Task } from './types'
import { isOverdue } from './utils/date'

const DEFAULT_FILTERS: FilterState = {
  priority: 'all',
  category: 'all',
  showCompleted: true,
  routineOnly: false,
}

export default function App() {
  const { tasks, addTask, deleteTask, toggleTask, editTask } = useTasks()
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)

  const availableCategories = Array.from(
    new Set(tasks.flatMap(t => t.categories))
  ).sort()

  const filteredTasks = tasks
    .filter(t => filters.showCompleted || !t.completed)
    .filter(t => filters.priority === 'all' || t.priority === filters.priority)
    .filter(t => filters.category === 'all' || t.categories.includes(filters.category))
    .filter(t => !filters.routineOnly || t.recurrence !== 'none')
    .sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1
      if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate)
      if (a.dueDate) return -1
      if (b.dueDate) return 1
      return a.createdAt.localeCompare(b.createdAt)
    })

  const activeCount = tasks.filter(t => !t.completed).length
  const completedCount = tasks.filter(t => t.completed).length
  const overdueCount = tasks.filter(t => !t.completed && t.dueDate != null && isOverdue(t.dueDate)).length

  useEffect(() => {
    document.title = activeCount > 0 ? `(${activeCount}) Daily Tasks` : 'Daily Tasks'
  }, [activeCount])

  function handleEdit(
    id: string,
    patch: Partial<Pick<Task, 'title' | 'priority' | 'categories' | 'dueDate' | 'recurrence'>>
  ) {
    editTask(id, patch)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-header__title">Daily Tasks</h1>
        <p className="app-header__subtitle">シンプルな日常タスク管理</p>
      </header>

      <main className="app-main">
        <TaskForm existingCategories={availableCategories} onAdd={addTask} />
        <FilterBar
          filters={filters}
          availableCategories={availableCategories}
          taskCounts={{ total: activeCount, completed: completedCount, overdue: overdueCount }}
          onChange={setFilters}
        />
        <TaskList
          tasks={filteredTasks}
          existingCategories={availableCategories}
          onToggle={toggleTask}
          onDelete={deleteTask}
          onEdit={handleEdit}
        />
      </main>
    </div>
  )
}
