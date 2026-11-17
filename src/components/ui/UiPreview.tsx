import { useState } from 'react'
import { Avatar } from './Avatar'
import { KpiCard } from './KpiCard'
import { Pagination } from './Pagination'
import { PriorityBadge } from './PriorityBadge'
import { StatusPill } from './StatusPill'

// TẠM THỜI: trang xem trước các thành phần với dữ liệu cứng, để chỉnh cho khớp Figma.
// Xóa file này trước khi nộp (CLAUDE.md: không để code thử nghiệm).
// Cách xem: tạm render <UiPreview /> trong App.tsx, hoặc trong một route thử.

export function UiPreview() {
  const [page, setPage] = useState(1) // chỉ dùng cho bản xem trước; trong app thật `page` nằm trên URL

  return (
    <div className="flex flex-col gap-6 bg-background p-6">
      <div className="flex gap-3">
        <KpiCard label="Total Tasks" value={24} hint="+4 this week" />
        <KpiCard label="Completion Rate" value="79.2%" hint="+12% vs sprint" />
        <KpiCard label="In Progress" value={11} hint="Actively Developing" />
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-card bg-surface p-4">
        <Avatar initials="AN" tone="primary" />
        <Avatar initials="SC" tone="success" />
        <Avatar initials="MB" tone="secondary" />
        <Avatar initials="ER" tone="soft" />
        <Avatar initials="+2" tone="muted" size="lg" />
        <StatusPill status="todo" />
        <StatusPill status="in-progress" />
        <StatusPill status="done" />
        <PriorityBadge priority="low" />
        <PriorityBadge priority="medium" />
        <PriorityBadge priority="high" />
      </div>

      <Pagination page={page} pageSize={6} total={24} onPageChange={setPage} />
    </div>
  )
}
