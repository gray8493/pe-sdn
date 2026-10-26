import 'server-only'

import { isCategoryId } from './categories'
import type { ExpenseDto } from './types'

export const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

export type ExpenseInput = {
  amount: number
  category: string
  note: string
  spent_at: string
}

type ValidationResult = { error: string } | { data: ExpenseInput }

export function validateExpenseInput(
  body: Record<string, unknown>
): ValidationResult {
  const { amount, category, note, spent_at: spentAt } = body

  if (typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0) {
    return { error: 'Số tiền phải là số lớn hơn 0' }
  }
  if (amount > 1_000_000_000_000) {
    return { error: 'Số tiền quá lớn' }
  }
  if (!isCategoryId(category)) {
    return { error: 'Hạng mục không hợp lệ' }
  }
  if (typeof spentAt !== 'string' || !DATE_PATTERN.test(spentAt)) {
    return { error: 'Ngày không hợp lệ (định dạng YYYY-MM-DD)' }
  }
  const parsed = new Date(`${spentAt}T00:00:00Z`)
  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.toISOString().slice(0, 10) !== spentAt
  ) {
    return { error: 'Ngày không hợp lệ (định dạng YYYY-MM-DD)' }
  }

  return {
    data: {
      amount,
      category,
      note: typeof note === 'string' ? note.slice(0, 200) : '',
      spent_at: spentAt,
    },
  }
}

// Chuẩn hoá cột DATE về "YYYY-MM-DD" theo giờ địa phương của nơi chạy
// (driver trả Date object; dùng getFullYear/Month/Date để không lệch ngày do UTC)
function toDateString(value: unknown): string {
  const date = value instanceof Date ? value : new Date(String(value))
  if (Number.isNaN(date.getTime())) return ''
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Driver neon trả NUMERIC dạng string → chuyển sang number cho client
export function toExpenseDto(row: Record<string, unknown>): ExpenseDto {
  return {
    id: String(row.id),
    amount: Number(row.amount),
    category: String(row.category),
    note: String(row.note),
    spent_at: toDateString(row.spent_at),
  }
}
