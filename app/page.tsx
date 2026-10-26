import Link from 'next/link'
import { getSession } from '@/lib/session'

// Trang đọc session cookie theo từng request nên không prerender được
export const instant = false

export default async function Home() {
  const session = await getSession()

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-8 py-16 text-center">
      <h1 className="text-4xl font-bold tracking-tight">PE-SDN</h1>
      <p className="max-w-md text-zinc-600">
        Sườn Next.js + Neon Postgres với đăng nhập/đăng ký sẵn có.
      </p>

      {session ? (
        <>
          <p>
            Xin chào, <span className="font-semibold">{session.email}</span>
          </p>
          <div className="flex gap-3">
            <Link
              href="/dashboard"
              className="rounded-full bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700"
            >
              Vào Dashboard
            </Link>
            <form action="/api/auth/logout" method="post">
              <button className="rounded-full border border-black/10 px-5 py-2 font-medium hover:bg-black/5">
                Đăng xuất
              </button>
            </form>
          </div>
        </>
      ) : (
        <div className="flex gap-3">
          <Link
            href="/login"
            className="rounded-full bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700"
          >
            Đăng nhập
          </Link>
          <Link
            href="/register"
            className="rounded-full border border-black/10 px-5 py-2 font-medium hover:bg-black/5"
          >
            Đăng ký
          </Link>
        </div>
      )}
    </main>
  )
}
