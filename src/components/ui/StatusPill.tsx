// Pill trạng thái. Kiểu TaskStatus khai báo cục bộ để file chạy độc lập;
// khi schema của Người 1 xong, đổi sang `import type { TaskStatus } from '../../types/task'`.

export type TaskStatus = 'todo' | 'in-progress' | 'done'

type StatusPillProps = {
  status: TaskStatus
}

const LABELS: Record<TaskStatus, string> = {
  todo: 'Todo',
  'in-progress': 'In Progress',
  done: 'Done',
}

const STYLES: Record<TaskStatus, string> = {
  todo: 'bg-surface-container text-on-surface-variant',
  'in-progress': 'bg-secondary-container text-on-secondary-container',
  done: 'bg-success text-white',
}

const DOT_STYLES: Record<Exclude<TaskStatus, 'done'>, string> = {
  todo: 'bg-outline',
  'in-progress': 'bg-on-secondary-container',
}

export function StatusPill({ status }: StatusPillProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 text-label font-semibold tracking-[0.44px] ${STYLES[status]}`}
    >
      {status === 'done' ? (
        <svg width="8" height="6" viewBox="0 0 8 6" fill="none" aria-hidden="true">
          <path d="M1 3l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <span className={`size-1.5 rounded-full ${DOT_STYLES[status]}`} aria-hidden="true" />
      )}
      {LABELS[status]}
    </span>
  )
}
