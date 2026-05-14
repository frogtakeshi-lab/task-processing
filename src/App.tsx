import { useState, useEffect } from 'react'
import { useTasks } from './hooks/useTasks'
import { BottomNav } from './components/BottomNav/BottomNav'
import { FAB } from './components/FAB/FAB'
import { AddTaskModal, type ModalDefaults } from './components/AddTaskModal/AddTaskModal'
import { HomeScreen } from './screens/HomeScreen/HomeScreen'
import { TasksScreen } from './screens/TasksScreen/TasksScreen'
import { RoutinesScreen } from './screens/RoutinesScreen/RoutinesScreen'
import type { Screen, Task } from './types'

export default function App() {
  const { tasks, addTask, deleteTask, toggleTask, editTask } = useTasks()
  const [screen, setScreen] = useState<Screen>('home')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalDefaults, setModalDefaults] = useState<ModalDefaults>({})

  const availableCategories = Array.from(
    new Set(tasks.flatMap(t => t.categories))
  ).sort()

  const activeCount = tasks.filter(t => !t.completed).length

  useEffect(() => {
    document.title = activeCount > 0 ? `(${activeCount}) Daily Tasks` : 'Daily Tasks'
  }, [activeCount])

  function handleFAB() {
    setModalDefaults(screen === 'routines' ? { recurrence: 'daily' } : {})
    setModalOpen(true)
  }

  function handleEdit(
    id: string,
    patch: Partial<Pick<Task, 'title' | 'priority' | 'categories' | 'dueDate' | 'recurrence'>>
  ) {
    editTask(id, patch)
  }

  const screenProps = {
    tasks,
    existingCategories: availableCategories,
    onToggle: toggleTask,
    onDelete: deleteTask,
    onEdit: handleEdit,
  }

  return (
    <div className="app">
      <main className="screen-content">
        {screen === 'home' && <HomeScreen {...screenProps} />}
        {screen === 'tasks' && <TasksScreen {...screenProps} />}
        {screen === 'routines' && <RoutinesScreen {...screenProps} />}
      </main>

      <FAB onClick={handleFAB} />
      <BottomNav current={screen} onChange={setScreen} />

      {modalOpen && (
        <AddTaskModal
          defaults={modalDefaults}
          existingCategories={availableCategories}
          onAdd={draft => { addTask(draft); setModalOpen(false) }}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  )
}
