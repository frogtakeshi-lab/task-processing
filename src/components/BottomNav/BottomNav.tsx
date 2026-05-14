import type { Screen } from '../../types'
import './BottomNav.css'

interface BottomNavProps {
  current: Screen
  onChange: (screen: Screen) => void
}

function HomeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  )
}

function TasksIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="8" y1="6" x2="21" y2="6"/>
      <line x1="8" y1="12" x2="21" y2="12"/>
      <line x1="8" y1="18" x2="21" y2="18"/>
      <polyline points="3 6 4 7 6 5"/>
      <polyline points="3 12 4 13 6 11"/>
      <polyline points="3 18 4 19 6 17"/>
    </svg>
  )
}

function RoutinesIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="17 1 21 5 17 9"/>
      <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
      <polyline points="7 23 3 19 7 15"/>
      <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
    </svg>
  )
}

const TABS: { id: Screen; label: string; Icon: () => JSX.Element }[] = [
  { id: 'home', label: 'ホーム', Icon: HomeIcon },
  { id: 'tasks', label: 'タスク', Icon: TasksIcon },
  { id: 'routines', label: 'ルーティン', Icon: RoutinesIcon },
]

export function BottomNav({ current, onChange }: BottomNavProps) {
  return (
    <nav className="bottom-nav" aria-label="メインナビゲーション">
      {TABS.map(({ id, label, Icon }) => (
        <button
          key={id}
          className={`bottom-nav__tab${current === id ? ' bottom-nav__tab--active' : ''}`}
          onClick={() => onChange(id)}
          aria-current={current === id ? 'page' : undefined}
        >
          <span className="bottom-nav__icon"><Icon /></span>
          <span className="bottom-nav__label">{label}</span>
        </button>
      ))}
    </nav>
  )
}
