export type Priority = 'high' | 'medium' | 'low';
export type Recurrence = 'none' | 'daily' | 'weekly' | 'monthly';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  categories: string[];
  dueDate: string | null;
  recurrence: Recurrence;
  createdAt: string;
  notes: string;
  subtasks: Subtask[];
}

export interface StorageSchema {
  version: 1;
  tasks: Task[];
}

export interface FilterState {
  priority: Priority | 'all';
  category: string | 'all';
  showCompleted: boolean;
  routineOnly: boolean;
}

export type Screen = 'home' | 'tasks' | 'routines';

export type TaskPatch = Partial<Pick<Task,
  'title' | 'priority' | 'categories' | 'dueDate' | 'recurrence' | 'notes' | 'subtasks'
>>;
