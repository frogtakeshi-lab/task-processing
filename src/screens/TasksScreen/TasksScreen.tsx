import { useState } from 'react'
import type { Task, FilterState } from '../../types'
import { FilterBar } from '../../components/FilterBar/FilterBar'
import { TaskList } from '../../components/TaskList/TaskList'
import { isOverdue } from '../../utils/date'
import './TasksScreen.css'

const DEFAULT_FILTERS: FilterState = {
  priority: 'all',
  category: 'all',
  showCompleted: true,
  routineOnly: false,
}

interface TasksScreenProps {
  tasks: Task[]
  existingCategories: string[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (id: string, patch: Partial<Pick<Task, 'title' | 'priority' | 'categories' | 'dueDate' | 'recurrence'>>) => void
}

export function TasksScreen({ tasks, existingCategories, onToggle, onDelete, onEdit }: TasksScreenProps) {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)

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

  return (
    <div className="tasks-screen">
      <div className="tasks-screen__filter">
        <FilterBar
          filters={filters}
          availableCategories={existingCategories}
          taskCounts={{ total: activeCount, completed: completedCount, overdue: overdueCount }}
          onChange={setFilters}
        />
      </div>
      <div className="tasks-screen__list">
        <TaskList
          tasks={filteredTasks}
          existingCategories={existingCategories}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      </div>
    </div>
  )
}
