import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import LoginForm from '@/components/login-form'
import { Wallet, ArrowLeft } from 'lucide-react'

export const instant = false

export default async function LoginPage() {
  const session = await getSession()
  if (session) redirect('/dashboard')

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Background ambient light */}
      <div className="absolute top-1/4 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

      {/* Back button */}
      <div className="w-full max-w-md mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Quay lại trang chủ
        </Link>
      </div>

      {/* Main card */}
      <div className="w-full max-w-md rounded-3xl border border-slate-200/80 bg-white/95 p-6 sm:p-8 shadow-xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/90">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 mb-3">
            <Wallet className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Chào mừng trở lại
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Đăng nhập tài khoản để tiếp tục quản lý chi tiêu
          </p>
        </div>

        <LoginForm />

        <div className="mt-6 border-t border-slate-100 pt-4 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
          Chưa có tài khoản?{' '}
          <Link
            href="/register"
            className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
          >
            Đăng ký tài khoản mới
          </Link>
        </div>
      </div>
    </div>
  )
}

