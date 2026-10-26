import { sql } from '@/lib/db'
import { getSession } from '@/lib/session'
import {
  UUID_PATTERN,
  validateExpenseInput,
  toExpenseDto,
} from '@/lib/expenses'

export async function PATCH(
  request: Request,
  ctx: RouteContext<'/api/expenses/[id]'>
) {
  const session = await getSession()
  if (!session) {
    return Response.json({ error: 'Chưa đăng nhập' }, { status: 401 })
  }

  const { id } = await ctx.params
  if (!UUID_PATTERN.test(id)) {
    return Response.json(
      { error: 'Không tìm thấy khoản chi' },
      { status: 404 }
    )
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
    UPDATE expenses
    SET amount = ${amount}, category = ${category}, note = ${note}, spent_at = ${spent_at}
    WHERE id = ${id} AND user_id = ${session.sub}
    RETURNING id, amount, category, note, spent_at
  `
  if (rows.length === 0) {
    return Response.json(
      { error: 'Không tìm thấy khoản chi' },
      { status: 404 }
    )
  }
  return Response.json(toExpenseDto(rows[0]))
}

export async function DELETE(
  _request: Request,
  ctx: RouteContext<'/api/expenses/[id]'>
) {
  const session = await getSession()
  if (!session) {
    return Response.json({ error: 'Chưa đăng nhập' }, { status: 401 })
  }

  const { id } = await ctx.params
  if (!UUID_PATTERN.test(id)) {
    return Response.json(
      { error: 'Không tìm thấy khoản chi' },
      { status: 404 }
    )
  }

  const rows = await sql`
    DELETE FROM expenses
    WHERE id = ${id} AND user_id = ${session.sub}
    RETURNING id
  `
  if (rows.length === 0) {
    return Response.json(
      { error: 'Không tìm thấy khoản chi' },
      { status: 404 }
    )
  }
  return Response.json({ ok: true })
}
