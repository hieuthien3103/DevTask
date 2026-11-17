// Thành phần thuần hiển thị: chỉ nhận props, không gọi hook dữ liệu hay router.
// Màu lấy từ token Figma; chọn tone bằng prop để không phụ thuộc vào kiểu Task của Người 1.

export type AvatarTone = 'primary' | 'success' | 'secondary' | 'soft' | 'muted'

type AvatarProps = {
  initials: string // ví dụ "AN"; với nhóm avatar dùng "+2"
  tone?: AvatarTone
  size?: 'md' | 'lg' // md = 24px (hàng trong bảng), lg = 28px (nhóm avatar ở panel lọc)
  title?: string // tên đầy đủ, hiện khi rê chuột
}

const TONES: Record<AvatarTone, string> = {
  primary: 'bg-primary text-white',
  success: 'bg-success-deep text-white',
  secondary: 'bg-secondary text-white',
  soft: 'bg-primary-fixed text-on-primary-fixed',
  muted: 'bg-surface-highest text-on-surface-variant',
}

const SIZES = {
  md: 'size-6',
  lg: 'size-7',
}

export function Avatar({ initials, tone = 'primary', size = 'md', title }: AvatarProps) {
  return (
    <span
      title={title}
      className={`inline-flex shrink-0 items-center justify-center rounded-full text-label font-normal tracking-[0.22px] ${SIZES[size]} ${TONES[tone]}`}
    >
      {initials}
    </span>
  )
}
