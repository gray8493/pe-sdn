export const CATEGORIES = [
  { id: 'an-uong', label: 'Ăn uống', color: '#f97316' },
  { id: 'di-chuyen', label: 'Di chuyển', color: '#3b82f6' },
  { id: 'mua-sam', label: 'Mua sắm', color: '#a855f7' },
  { id: 'giai-tri', label: 'Giải trí', color: '#ec4899' },
  { id: 'hoa-don', label: 'Hoá đơn & Tiện ích', color: '#eab308' },
  { id: 'suc-khoe', label: 'Sức khoẻ', color: '#22c55e' },
  { id: 'khac', label: 'Khác', color: '#6b7280' },
] as const

export type CategoryId = (typeof CATEGORIES)[number]['id']

export function isCategoryId(value: unknown): value is CategoryId {
  return CATEGORIES.some((c) => c.id === value)
}

export function categoryLabel(id: string): string {
  return CATEGORIES.find((c) => c.id === id)?.label ?? 'Khác'
}

export function categoryColor(id: string): string {
  return CATEGORIES.find((c) => c.id === id)?.color ?? '#6b7280'
}
