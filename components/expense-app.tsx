'use client'

import { useCallback, useEffect, useState } from 'react'
import type { ExpenseDto, SummaryResponse } from '@/lib/types'
import { formatVnd } from '@/lib/format'
import { categoryLabel } from '@/lib/categories'
import CategoryIcon from './category-icon'
import ExpenseForm from './expense-form'
import ExpenseList from './expense-list'
import ExpenseSummary from './expense-summary'
import {
  TrendingUp,
  Receipt,
  PieChart,
  Calculator,
  RefreshCw,
  AlertCircle,
} from 'lucide-react'

interface ExpenseAppProps {
  userEmail?: string
}

export default function ExpenseApp({ userEmail }: ExpenseAppProps) {
  const [expenses, setExpenses] = useState<ExpenseDto[]>([])
  const [summary, setSummary] = useState<SummaryResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    try {
      const [expensesRes, summaryRes] = await Promise.all([
        fetch('/api/expenses'),
        fetch('/api/expenses/summary'),
      ])
      if (!expensesRes.ok || !summaryRes.ok) {
        throw new Error('Lỗi tải dữ liệu')
      }
      const [expensesData, summaryData] = await Promise.all([
        expensesRes.json(),
        summaryRes.json(),
      ])
      setExpenses(expensesData)
      setSummary(summaryData)
      setError(null)
    } catch {
      setError('Không tải được dữ liệu, vui lòng kiểm tra kết nối mạng và thử lại.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- tải dữ liệu lần đầu khi mount
    refresh()
  }, [refresh])

  // Tính toán các chỉ số thống kê nhanh
  const grandTotal = summary?.grandTotal ?? 0
  const totalCount = expenses.length
  const averageAmount = totalCount > 0 ? Math.round(grandTotal / totalCount) : 0
  const topCategory = summary?.items && summary.items.length > 0 ? summary.items[0] : null

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
      {/* Title & Refresh header */}
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
            Bảng điều khiển chi tiêu
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {userEmail ? `Tài khoản: ${userEmail} · ` : ''}Theo dõi và ghi chép dòng tiền chi tiết
          </p>
        </div>

        <button
          onClick={() => {
            setLoading(true)
            refresh()
          }}
          disabled={loading}
          className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          Làm mới
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
        {/* Card 1: Tổng chi */}
        <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 sm:p-5 shadow-sm backdrop-blur-sm dark:border-slate-800/80 dark:bg-slate-900/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Tổng chi tiêu
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-lg font-bold tracking-tight text-blue-600 sm:text-2xl dark:text-blue-400">
            {loading ? '—' : formatVnd(grandTotal)}
          </p>
          <span className="mt-1 block text-[11px] text-slate-400">Toàn bộ thời gian</span>
        </div>

        {/* Card 2: Số giao dịch */}
        <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 sm:p-5 shadow-sm backdrop-blur-sm dark:border-slate-800/80 dark:bg-slate-900/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Tổng giao dịch
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
              <Receipt className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-lg font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
            {loading ? '—' : `${totalCount} khoản`}
          </p>
          <span className="mt-1 block text-[11px] text-slate-400">Đã được ghi nhận</span>
        </div>

        {/* Card 3: Danh mục lớn nhất */}
        <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 sm:p-5 shadow-sm backdrop-blur-sm dark:border-slate-800/80 dark:bg-slate-900/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Chi nhiều nhất
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
              <PieChart className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            {topCategory ? (
              <>
                <CategoryIcon category={topCategory.category} size={16} />
                <p className="text-sm sm:text-base font-bold truncate text-slate-900 dark:text-white">
                  {categoryLabel(topCategory.category)}
                </p>
              </>
            ) : (
              <p className="text-sm font-semibold text-slate-400">—</p>
            )}
          </div>
          <span className="mt-1 block text-[11px] text-slate-400">
            {topCategory ? `${formatVnd(topCategory.total)}` : 'Chưa có dữ liệu'}
          </span>
        </div>

        {/* Card 4: Trung bình mỗi khoản */}
        <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 sm:p-5 shadow-sm backdrop-blur-sm dark:border-slate-800/80 dark:bg-slate-900/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Trung bình/khoản
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <Calculator className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-lg font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
            {loading ? '—' : formatVnd(averageAmount)}
          </p>
          <span className="mt-1 block text-[11px] text-slate-400">Ước tính trên mỗi lần chi</span>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200/80 bg-white/50 py-16 text-center dark:border-slate-800 dark:bg-slate-900/50">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mb-3" />
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Đang tải dữ liệu chi tiêu từ cơ sở dữ liệu...
          </p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-red-200 bg-red-50/80 p-8 text-center dark:border-red-900/50 dark:bg-red-950/30">
          <AlertCircle className="h-10 w-10 text-red-500 mb-3" />
          <p className="text-sm font-semibold text-red-700 dark:text-red-300">{error}</p>
          <button
            onClick={refresh}
            className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-red-700 transition"
          >
            Thử tải lại
          </button>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Cột trái: Form thêm + Danh sách chi tiêu */}
          <div className="flex flex-col gap-8">
            <ExpenseForm onCreated={refresh} />
            <ExpenseList expenses={expenses} onChanged={refresh} />
          </div>

          {/* Cột phải: Tổng kết danh mục */}
          <div>
            <ExpenseSummary summary={summary} />
          </div>
        </div>
      )}
    </div>
  )
}
