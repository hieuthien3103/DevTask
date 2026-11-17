import type { ReactNode } from 'react'

// Thẻ chỉ số. Phần giá trị phụ (xu hướng, vòng tiến độ, thanh tiến độ) truyền qua `children`
// để một component dùng được cho cả 4 thẻ trong thiết kế.
// Dữ liệu thật do TaskStatsSummary (Người 2) truyền vào, KpiCard không tự lấy dữ liệu.

type KpiCardProps = {
  label: string // ví dụ "Total Tasks"
  value: ReactNode // ví dụ 24 hoặc "79.2%"
  icon?: ReactNode // icon SVG nội tuyến ở góc phải
  hint?: ReactNode // dòng chữ nhỏ cạnh giá trị, ví dụ "+4 this week"
  children?: ReactNode // nội dung phía dưới: sparkline, thanh tiến độ, ghi chú
}

export function KpiCard({ label, value, icon, hint, children }: KpiCardProps) {
  return (
    <section className="flex min-w-0 flex-1 flex-col gap-3 rounded-card bg-surface p-4 shadow-card">
      <header className="flex items-center justify-between gap-2">
        <h3 className="text-label font-semibold uppercase tracking-[0.55px] text-on-surface-variant">
          {label}
        </h3>
        {icon ? <span className="shrink-0 text-on-surface-variant">{icon}</span> : null}
      </header>

      <div className="flex items-baseline justify-between gap-2">
        <p className="text-[32px] font-bold leading-10 tracking-[-0.8px] text-on-surface">{value}</p>
        {hint ? <span className="text-label tracking-[0.22px] text-on-surface-variant">{hint}</span> : null}
      </div>

      {children}
    </section>
  )
}
