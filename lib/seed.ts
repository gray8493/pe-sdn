import 'server-only'

import { sql } from './db'

type SampleExpense = {
  amount: number
  category: string
  note: string
  daysAgo: number
}

const SAMPLE_EXPENSES: SampleExpense[] = [
  { amount: 35000, category: 'an-uong', note: 'Cà phê sáng', daysAgo: 1 },
  { amount: 150000, category: 'an-uong', note: 'Ăn trưa văn phòng', daysAgo: 3 },
  { amount: 50000, category: 'di-chuyen', note: 'Xe buýt đi làm', daysAgo: 5 },
  { amount: 320000, category: 'an-uong', note: 'Đi chợ cuối tuần', daysAgo: 8 },
  { amount: 650000, category: 'hoa-don', note: 'Tiền điện tháng', daysAgo: 12 },
  { amount: 120000, category: 'giai-tri', note: 'Vé xem phim', daysAgo: 15 },
  { amount: 85000, category: 'suc-khoe', note: 'Thuốc cảm', daysAgo: 20 },
  { amount: 450000, category: 'mua-sam', note: 'Áo phông mới', daysAgo: 25 },
]

// Ngày hiện tại theo giờ Việt Nam (UTC+7) — server chạy theo UTC
function vnToday(): Date {
  return new Date(Date.now() + 7 * 60 * 60 * 1000)
}

export async function seedSampleExpenses(userId: string) {
  for (const item of SAMPLE_EXPENSES) {
    const spentAt = vnToday()
    spentAt.setDate(spentAt.getDate() - item.daysAgo)
    await sql`
      INSERT INTO expenses (user_id, amount, category, note, spent_at)
      VALUES (
        ${userId},
        ${item.amount},
        ${item.category},
        ${item.note},
        ${spentAt.toISOString().slice(0, 10)}
      )
    `
  }
}
