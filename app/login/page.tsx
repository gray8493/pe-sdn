import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import LoginForm from '@/components/login-form'

// Trang đọc session cookie theo từng request nên không prerender được
export const instant = false

export default async function LoginPage() {
  const session = await getSession()
  if (session) redirect('/dashboard')

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-8 py-16">
      <h1 className="text-3xl font-bold">Đăng nhập</h1>
      <LoginForm />
      <p className="text-sm text-zinc-600">
        Chưa có tài khoản?{' '}
        <Link
          href="/register"
          className="font-medium text-blue-600 hover:underline"
        >
          Đăng ký
        </Link>
      </p>
    </main>
  )
}
