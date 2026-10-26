import { sql } from '@/lib/db'
import { getSession } from '@/lib/session'
import { validateExpenseInput, toExpenseDto } from '@/lib/expenses'

export async function GET() {
  const session = await getSession()
  if (!session) {
    return Response.json({ error: 'Chưa đăng nhập' }, { status: 401 })
  }

  const rows = await sql`
    SELECT id, amount, category, note, spent_at
    FROM expenses
    WHERE user_id = ${session.sub}
    ORDER BY spent_at DESC, id DESC
  `
  return Response.json(rows.map(toExpenseDto))
}

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) {
    return Response.json({ error: 'Chưa đăng nhập' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Dữ liệu không hợp lệ' }, { status: 400 })
  }

  const result = validateExpenseInput((body ?? {}) as Record<string, unknown>)
  if ('error' in result) {
    return Response.json({ error: result.error }, { status: 400 })
  }
  const { amount, category, note, spent_at } = result.data

  const rows = await sql`
    INSERT INTO expenses (user_id, amount, category, note, spent_at)
    VALUES (${session.sub}, ${amount}, ${category}, ${note}, ${spent_at})
    RETURNING id, amount, category, note, spent_at
  `
  return Response.json(toExpenseDto(rows[0]), { status: 201 })
}
