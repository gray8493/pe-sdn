import Link from 'next/link'
import { requireSession } from '@/lib/session'
import { sql } from '@/lib/db'

// Trang đọc cookies + DB theo từng request nên không prerender được
export const instant = false

export default async function DashboardPage() {
  const session = await requireSession()

  const rows = await sql`
    SELECT name, email, created_at FROM users WHERE id = ${session.sub}
  `
  const user = rows[0] as
    | { name: string; email: string; created_at: string }
    | undefined

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-8 py-16">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {user ? (
        <div className="flex w-full max-w-sm flex-col gap-2 rounded-xl border border-black/10 p-6">
          <p>
            <span className="font-medium">Tên:</span> {user.name || '—'}
          </p>
          <p>
            <span className="font-medium">Email:</span> {user.email}
          </p>
          <p>
            <span className="font-medium">Ngày tạo:</span>{' '}
            {new Date(user.created_at).toLocaleString('vi-VN')}
          </p>
        </div>
      ) : (
        <p className="text-red-600">Không tìm thấy thông tin người dùng</p>
      )}

      <div className="flex gap-3">
        <Link
          href="/"
          className="rounded-full border border-black/10 px-5 py-2 font-medium hover:bg-black/5"
        >
          Trang chủ
        </Link>
        <form action="/api/auth/logout" method="post">
          <button className="rounded-full bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700">
            Đăng xuất
          </button>
        </form>
      </div>
    </main>
  )
}
