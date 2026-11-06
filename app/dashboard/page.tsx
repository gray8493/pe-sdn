import Link from 'next/link'
import { requireSession } from '@/lib/session'
import { ShieldCheck, Home, LogOut, User, CheckCircle2, KeyRound } from 'lucide-react'

export const instant = false

export default async function DashboardPage() {
  const session = await requireSession()

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/80">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5 font-bold tracking-tight">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold leading-tight text-slate-900 dark:text-white">
                PE-SDN
              </span>
              <span className="text-[10px] font-medium text-blue-600 dark:text-blue-400">
                Supabase Auth
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <Home className="h-3.5 w-3.5" />
              <span>Trang chủ</span>
            </Link>

            <form action="/api/auth/logout" method="post">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50/70 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100 hover:text-red-700 dark:border-red-950 dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-900/60"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Đăng xuất</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-5 dark:border-slate-800">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Đăng nhập thành công!
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Phiên làm việc được xác thực an toàn qua Supabase Auth.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/50">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Thông tin tài khoản
              </span>
              <div className="mt-3 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <User className="h-4 w-4 text-blue-500 shrink-0" />
                  <span className="font-medium text-slate-500 dark:text-slate-400">Email:</span>
                  <strong className="font-semibold text-slate-900 dark:text-white">{session.email}</strong>
                </div>
                {session.name && (
                  <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <User className="h-4 w-4 text-blue-500 shrink-0" />
                    <span className="font-medium text-slate-500 dark:text-slate-400">Họ và tên:</span>
                    <strong className="font-semibold text-slate-900 dark:text-white">{session.name}</strong>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <KeyRound className="h-4 w-4 text-indigo-500 shrink-0" />
                  <span className="font-medium text-slate-500 dark:text-slate-400">User ID (Supabase):</span>
                  <code className="rounded bg-slate-200/60 px-1.5 py-0.5 text-xs text-slate-800 dark:bg-slate-800 dark:text-slate-200 font-mono">
                    {session.sub}
                  </code>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 rounded-2xl border border-blue-100 bg-blue-50/50 p-4 text-sm text-blue-800 dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-blue-300">
              <span className="font-semibold">Trạng thái kết nối:</span>
              <span>Đã loại bỏ Neon DB và chuyển toàn bộ xác thực sang Supabase Backend thành công.</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
