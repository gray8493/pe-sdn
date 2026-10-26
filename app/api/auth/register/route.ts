import { sql } from '@/lib/db'
import { hashPassword } from '@/lib/password'
import { createSession } from '@/lib/session'
import { seedSampleExpenses } from '@/lib/seed'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  let body: { name?: unknown; email?: unknown; password?: unknown }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Dữ liệu không hợp lệ' }, { status: 400 })
  }

  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const email =
    typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const password = typeof body.password === 'string' ? body.password : ''

  if (!EMAIL_PATTERN.test(email)) {
    return Response.json({ error: 'Email không hợp lệ' }, { status: 400 })
  }
  if (password.length < 8) {
    return Response.json(
      { error: 'Mật khẩu phải có ít nhất 8 ký tự' },
      { status: 400 }
    )
  }

  const existing = await sql`SELECT id FROM users WHERE email = ${email}`
  if (existing.length > 0) {
    return Response.json({ error: 'Email đã được đăng ký' }, { status: 409 })
  }

  const passwordHash = await hashPassword(password)

  let user: { id: string; email: string }
  try {
    const rows = await sql`
      INSERT INTO users (email, password_hash, name)
      VALUES (${email}, ${passwordHash}, ${name})
      RETURNING id, email
    `
    user = rows[0] as { id: string; email: string }
  } catch (error) {
    // 23505 = unique_violation: hai request đăng ký cùng email một lúc
    if ((error as { code?: string } | null)?.code === '23505') {
      return Response.json({ error: 'Email đã được đăng ký' }, { status: 409 })
    }
    throw error
  }

  await createSession(user)
  await seedSampleExpenses(user.id)
  return Response.json({ ok: true })
}
