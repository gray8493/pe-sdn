import { sql } from '@/lib/db'
import { verifyPassword } from '@/lib/password'
import { createSession } from '@/lib/session'

export async function POST(request: Request) {
  let body: { email?: unknown; password?: unknown }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Dữ liệu không hợp lệ' }, { status: 400 })
  }

  const email =
    typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const password = typeof body.password === 'string' ? body.password : ''

  if (!email || !password) {
    return Response.json(
      { error: 'Vui lòng nhập đầy đủ email và mật khẩu' },
      { status: 400 }
    )
  }

  const rows = await sql`
    SELECT id, email, password_hash FROM users WHERE email = ${email}
  `
  const user = rows[0] as
    | { id: string; email: string; password_hash: string }
    | undefined

  if (!user || !(await verifyPassword(password, user.password_hash))) {
    return Response.json(
      { error: 'Email hoặc mật khẩu không đúng' },
      { status: 401 }
    )
  }

  await createSession({ id: user.id, email: user.email })
  return Response.json({ ok: true })
}
