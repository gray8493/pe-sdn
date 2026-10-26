import { sql } from '@/lib/db'
import { getSession } from '@/lib/session'

export async function GET() {
  const session = await getSession()
  if (!session) {
    return Response.json({ error: 'Chưa đăng nhập' }, { status: 401 })
  }

  const rows = await sql`
    SELECT category, SUM(amount) AS total, COUNT(*) AS count
    FROM expenses
    WHERE user_id = ${session.sub}
    GROUP BY category
    ORDER BY total DESC
  `

  const items = rows.map((row) => ({
    category: row.category as string,
    total: Number(row.total),
    count: Number(row.count),
  }))
  const grandTotal = items.reduce((sum, item) => sum + item.total, 0)

  return Response.json({ items, grandTotal })
}
