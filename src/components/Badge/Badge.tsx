import './Badge.css'

type BadgeVariant = 'priority-high' | 'priority-medium' | 'priority-low' | 'category' | 'recurrence'

interface BadgeProps {
  label: string
  variant: BadgeVariant
}

export function Badge({ label, variant }: BadgeProps) {
  return <span className={`badge badge--${variant}`}>{label}</span>
}
