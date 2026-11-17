// Badge độ ưu tiên. Giống StatusPill: kiểu khai báo cục bộ, đổi sang type của Người 1 khi có.

export type TaskPriority = 'low' | 'medium' | 'high'

type PriorityBadgeProps = {
  priority: TaskPriority
}

const LABELS: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

const STYLES: Record<TaskPriority, string> = {
  low: 'bg-surface-container text-on-surface-variant',
  medium: 'bg-surface-highest text-on-surface',
  high: 'bg-error-container text-on-error-container',
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-label font-semibold tracking-[0.44px] ${STYLES[priority]}`}
    >
      {LABELS[priority]}
    </span>
  )
}
