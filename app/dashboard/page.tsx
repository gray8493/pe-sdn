import Link from 'next/link'
import { requireSession } from '@/lib/session'
import ExpenseApp from '@/components/expense-app'

// Trang đọc cookies theo từng request nên không prerender được
export const instant = false

export default async function DashboardPage() {
  await requireSession()

  return (
    <main className="flex flex-1 flex-col items-center">
      <header className="flex w-full max-w-5xl items-center justify-between px-4 py-6">
        <h1 className="text-2xl font-bold">Quản lý chi tiêu</h1>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="rounded-full border border-black/10 px-4 py-1.5 text-sm font-medium hover:bg-black/5"
          >
            Trang chủ
          </Link>
          <form action="/api/auth/logout" method="post">
            <button className="rounded-full bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700">
              Đăng xuất
            </button>
          </form>
        </div>
      </header>
      <ExpenseApp />
    </main>
  )
}
