import { useState } from 'react'
import type { Task, Priority, Recurrence } from '../types'
import { loadTasks, saveTasks } from '../utils/storage'
import { calcNextDueDate } from '../utils/date'

type TaskDraft = Omit<Task, 'id' | 'createdAt' | 'completed'>
type TaskPatch = Partial<Pick<Task, 'title' | 'priority' | 'categories' | 'dueDate' | 'recurrence'>>

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks())

  function addTask(draft: TaskDraft): void {
    const next: Task = {
      ...draft,
      id: crypto.randomUUID(),
      completed: false,
      createdAt: new Date().toISOString(),
    }
    const updated = [...tasks, next]
    setTasks(updated)
    saveTasks(updated)
  }

  function deleteTask(id: string): void {
    const updated = tasks.filter(t => t.id !== id)
    setTasks(updated)
    saveTasks(updated)
  }

  function toggleTask(id: string): void {
    const task = tasks.find(t => t.id === id)
    if (!task) return

    const updated = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)

    if (!task.completed && task.recurrence !== 'none') {
      const nextDue = calcNextDueDate(task.dueDate, task.recurrence)
      const next: Task = {
        ...task,
        id: crypto.randomUUID(),
        completed: false,
        dueDate: nextDue,
        createdAt: new Date().toISOString(),
      }
      const withNext = [...updated, next]
      setTasks(withNext)
      saveTasks(withNext)
      return
    }

    setTasks(updated)
    saveTasks(updated)
  }

  function editTask(id: string, patch: TaskPatch): void {
    const updated = tasks.map(t => t.id === id ? { ...t, ...patch } : t)
    setTasks(updated)
    saveTasks(updated)
  }

  return { tasks, addTask, deleteTask, toggleTask, editTask }
}

export type { TaskDraft, TaskPatch, Priority, Recurrence }
