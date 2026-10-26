import Link from 'next/link'
import { getSession } from '@/lib/session'
import {
  Wallet,
  ArrowRight,
  TrendingUp,
  PieChart,
  ShieldCheck,
  Zap,
  Sparkles,
  ChevronRight,
  BarChart3,
} from 'lucide-react'

export const instant = false

export default async function Home() {
  const session = await getSession()

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/60 bg-white/70 backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-950/70">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5 font-bold text-xl tracking-tight">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 text-white shadow-md shadow-blue-500/20">
              <Wallet className="h-5 w-5" />
            </div>
            <span className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 bg-clip-text text-transparent dark:from-white dark:via-blue-200 dark:to-indigo-300">
              PE-SDN
            </span>
          </Link>

          <nav className="flex items-center gap-3">
            {session ? (
              <div className="flex items-center gap-3">
                <span className="hidden text-sm text-slate-600 dark:text-slate-400 sm:inline">
                  Xin chào, <strong className="font-semibold text-slate-900 dark:text-white">{session.email}</strong>
                </span>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-600/30 transition-all hover:bg-blue-700 hover:shadow-md hover:shadow-blue-600/40"
                >
                  Vào Dashboard
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3">
                <Link
                  href="/login"
                  className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/80 dark:hover:text-white"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-600/30 transition-all hover:bg-blue-700 hover:shadow-md hover:shadow-blue-600/40"
                >
                  Bắt đầu ngay
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden py-16 sm:py-24 lg:py-28">
          <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/80 px-3.5 py-1 text-xs font-semibold text-blue-700 shadow-sm backdrop-blur-sm dark:border-blue-800/60 dark:bg-blue-950/50 dark:text-blue-300">
              <Sparkles className="h-3.5 w-3.5 text-blue-500" />
              <span>Nền tảng quản lý tài chính thế hệ mới</span>
            </div>

            {/* Main Headline */}
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl dark:text-white">
              Nắm bắt từng khoản chi,{' '}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                làm chủ tương lai
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base text-slate-600 sm:text-lg dark:text-slate-300">
              Theo dõi chi tiêu hàng ngày trực quan, phân tích dòng tiền chính xác theo từng danh mục và kiểm soát ngân sách cá nhân dễ dàng cùng PE-SDN.
            </p>

            {/* Action Buttons */}
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              {session ? (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-600/30 transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/40"
                >
                  Mở ứng dụng Dashboard
                  <ArrowRight className="h-5 w-5" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-600/30 transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/40"
                  >
                    Bắt đầu miễn phí
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white/80 px-7 py-3.5 text-base font-semibold text-slate-800 shadow-sm backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    Đăng nhập tài khoản
                  </Link>
                </>
              )}
            </div>

            {/* Quick Demo Preview Card */}
            <div className="mt-14 mx-auto max-w-4xl rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-2xl backdrop-blur-xl sm:p-6 dark:border-slate-800 dark:bg-slate-900/90">
              <div className="flex flex-col sm:flex-row items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800 gap-3">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                  <span className="ml-2 text-xs font-medium text-slate-500">Live Preview · Trực quan & Nhanh chóng</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-blue-600 font-medium bg-blue-50 dark:bg-blue-950/60 dark:text-blue-400 px-3 py-1 rounded-full">
                  <TrendingUp className="h-3.5 w-3.5" />
                  Đồng bộ tức thì với Cloud
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-5 text-left">
                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800/80 dark:bg-slate-800/40">
                  <p className="text-xs font-medium text-slate-500">Tổng chi tháng này</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">4.850.000 ₫</p>
                  <p className="mt-2 text-xs text-emerald-600 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> Trong tầm kiểm soát
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800/80 dark:bg-slate-800/40">
                  <p className="text-xs font-medium text-slate-500">Hạng mục lớn nhất</p>
                  <p className="mt-1 text-2xl font-bold text-orange-600">Ăn uống (45%)</p>
                  <p className="mt-2 text-xs text-slate-500">2.180.000 ₫ · 24 khoản</p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800/80 dark:bg-slate-800/40">
                  <p className="text-xs font-medium text-slate-500">Giao dịch gần nhất</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">Cà phê sáng</p>
                  <p className="mt-2 text-xs text-slate-500">45.000 ₫ · Hôm nay</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="border-t border-slate-200/60 bg-slate-50/50 py-16 sm:py-20 dark:border-slate-800/60 dark:bg-slate-900/30">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                Mọi công cụ bạn cần để làm chủ dòng tiền
              </h2>
              <p className="mt-3 text-sm text-slate-600 sm:text-base dark:text-slate-400">
                Được thiết kế tối giản, loại bỏ rườm rà, tập trung vào trải nghiệm mượt mà nhất.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">Nhập liệu siêu nhanh</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Ghi lại khoản chi chỉ với 2 chạm. Có sẵn nút chọn số tiền nhanh 50k, 100k, 200k, 500k.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
                  <PieChart className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">Phân loại thông minh</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Phân tách danh mục rõ ràng: Ăn uống, Di chuyển, Mua sắm, Hóa đơn, Sức khỏe...
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">Thống kê trực quan</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Tỷ lệ % chi tiêu tự động cập nhật, dễ dàng phát hiện danh mục vượt ngân sách.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">Bảo mật tuyệt đối</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Mã hóa mật khẩu an toàn, session chuẩn JWT và dữ liệu được lưu trên Neon Postgres.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
        <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-blue-600" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">PE-SDN Finance</span>
            <span>— Quản lý chi tiêu cá nhân thông minh</span>
          </div>
          <p>© {new Date().getFullYear()} PE-SDN. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

