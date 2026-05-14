import type { StorageSchema, Task } from '../types'

const STORAGE_KEY = 'taskapp_v1'

export function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const data = JSON.parse(raw) as StorageSchema
    if (data.version !== 1 || !Array.isArray(data.tasks)) return []
    // Migrate existing tasks that may be missing notes/subtasks fields
    return data.tasks.map(t => ({
      ...t,
      notes: (t as Task & { notes?: string }).notes ?? '',
      subtasks: (t as Task & { subtasks?: typeof t.subtasks }).subtasks ?? [],
    }))
  } catch {
    return []
  }
}

export function saveTasks(tasks: Task[]): void {
  try {
    const schema: StorageSchema = { version: 1, tasks }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(schema))
  } catch (e) {
    console.warn('Failed to save tasks to localStorage:', e)
  }
}
