import './FAB.css'

interface FABProps {
  onClick: () => void
}

export function FAB({ onClick }: FABProps) {
  return (
    <button className="fab" onClick={onClick} aria-label="タスクを追加">
      <span className="fab__icon">+</span>
    </button>
  )
}
