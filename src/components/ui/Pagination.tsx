// Thanh phân trang, kiểu "controlled": trang hiện tại nằm trên URL (search param `page`),
// nên component không giữ state riêng. Route (Người 3) truyền `page` và `onPageChange`.

type PaginationProps = {
  page: number // bắt đầu từ 1
  pageSize: number
  total: number // tổng số task khớp bộ lọc
  onPageChange: (page: number) => void
}

export function Pagination({ page, pageSize, total, onPageChange }: PaginationProps) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  // Giá trị suy ra từ props nên tính trực tiếp khi render, không lưu vào state.
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1)

  return (
    <nav
      aria-label="Phân trang"
      className="flex items-center justify-between bg-surface-low px-4 py-3 text-[13px] text-on-surface-variant"
    >
      <p>
        Showing <strong className="font-semibold text-on-surface">{from}</strong> to{' '}
        <strong className="font-semibold text-on-surface">{to}</strong> of{' '}
        <strong className="font-semibold text-on-surface">{total}</strong> tasks
        <span className="mx-3 inline-block h-4 w-px bg-outline-variant align-middle" aria-hidden="true" />
        Rows per page: <span className="ml-1 rounded bg-surface px-3 py-0.5 text-label text-on-surface">{pageSize}</span>
      </p>

      <ul className="flex items-center gap-1">
        <li>
          <button
            type="button"
            aria-label="Trang trước"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="px-2 py-1 disabled:opacity-40"
          >
            ‹
          </button>
        </li>
        {pages.map((p) => (
          <li key={p}>
            <button
              type="button"
              aria-current={p === page ? 'page' : undefined}
              onClick={() => onPageChange(p)}
              className={`min-w-7 px-2.5 py-1 text-label tracking-[0.22px] ${
                p === page
                  ? 'bg-primary font-bold text-white shadow-card'
                  : 'text-on-surface hover:bg-surface-container'
              }`}
            >
              {p}
            </button>
          </li>
        ))}
        <li>
          <button
            type="button"
            aria-label="Trang sau"
            disabled={page >= pageCount}
            onClick={() => onPageChange(page + 1)}
            className="px-2 py-1 disabled:opacity-40"
          >
            ›
          </button>
        </li>
      </ul>
    </nav>
  )
}
