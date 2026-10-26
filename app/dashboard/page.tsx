import Link from 'next/link'
import { requireSession } from '@/lib/session'
import ExpenseApp from '@/components/expense-app'
import { Wallet, Home, LogOut, User } from 'lucide-react'

export const instant = false

export default async function DashboardPage() {
  const session = await requireSession()

  return (
    <div className="flex min-h-screen flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/80">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5 font-bold tracking-tight">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
              <Wallet className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold leading-tight text-slate-900 dark:text-white">
                PE-SDN
              </span>
              <span className="text-[10px] font-medium text-blue-600 dark:text-blue-400">
                Sổ tay chi tiêu
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* User Pill */}
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50/80 px-3 py-1 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white">
                <User className="h-3 w-3" />
              </div>
              <span className="max-w-[160px] truncate font-medium">{session.email}</span>
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              title="Về trang chủ"
            >
              <Home className="h-3.5 w-3.5" />
              <span className="hidden xs:inline">Trang chủ</span>
            </Link>

            <form action="/api/auth/logout" method="post">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50/70 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100 hover:text-red-700 dark:border-red-950 dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-900/60"
                title="Đăng xuất khỏi phiên"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Đăng xuất</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Expense Application */}
      <main className="flex-1 pb-16 pt-6 sm:pt-8">
        <ExpenseApp userEmail={session.email} />
      </main>
    </div>
  )
}

