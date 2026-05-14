export type Priority = 'high' | 'medium' | 'low';

export type Recurrence = 'none' | 'daily' | 'weekly' | 'monthly';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  categories: string[];
  dueDate: string | null;
  recurrence: Recurrence;
  createdAt: string;
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
