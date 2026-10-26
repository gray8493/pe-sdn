'use client'

import { useState } from 'react'
import { CATEGORIES } from '@/lib/categories'
import CategoryIcon from './category-icon'
import { PlusCircle, Loader2, Calendar, FileText, AlertCircle, Coins } from 'lucide-react'

function localToday(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function localYesterday(): string {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const QUICK_AMOUNTS = [
  { label: '50k', value: 50000 },
  { label: '100k', value: 100000 },
  { label: '200k', value: 200000 },
  { label: '500k', value: 500000 },
  { label: '1.000k', value: 1000000 },
]

export default function ExpenseForm({ onCreated }: { onCreated: () => void }) {
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<string>(CATEGORIES[0].id)
  const [date, setDate] = useState(localToday())
  const [note, setNote] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setPending(true)

    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Number(amount),
          category,
          note,
          spent_at: date,
        }),
      })

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as {
          error?: string
        } | null
        setError(data?.error ?? 'Không thêm được khoản chi')
        return
      }

      setAmount('')
      setNote('')
      setDate(localToday())
      onCreated()
    } catch {
      setError('Không kết nối được máy chủ, vui lòng thử lại sau.')
    } finally {
      setPending(false)
    }
  }

  const handleQuickAmount = (val: number) => {
    const current = Number(amount) || 0
    setAmount(String(current + val))
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-slate-200/80 bg-white/95 p-5 sm:p-6 shadow-sm backdrop-blur-sm dark:border-slate-800/80 dark:bg-slate-900/90"
    >
      <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
          <PlusCircle className="h-4 w-4" />
        </div>
        <h2 className="font-bold text-slate-900 text-base sm:text-lg dark:text-white">
          Ghi nhận khoản chi mới
        </h2>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {/* Số tiền */}
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Số tiền (VNĐ) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 font-bold text-sm">
              <Coins className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="number"
              min={1}
              step="any"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="VD: 50000"
              className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-12 text-base font-semibold text-slate-900 placeholder:text-slate-400 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-xs font-medium text-slate-400">
              ₫
            </span>
          </div>

          {/* Quick amount chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] text-slate-400">Cộng nhanh:</span>
            {QUICK_AMOUNTS.map((qa) => (
              <button
                type="button"
                key={qa.label}
                onClick={() => handleQuickAmount(qa.value)}
                className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                +{qa.label}
              </button>
            ))}
            {amount && (
              <button
                type="button"
                onClick={() => setAmount('')}
                className="text-[11px] text-red-500 hover:underline ml-auto"
              >
                Xóa số
              </button>
            )}
          </div>
        </div>

        {/* Danh mục */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Hạng mục <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <CategoryIcon category={category} size={16} />
            </div>
            <select
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-9 pr-8 text-sm text-slate-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Ngày chi */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Ngày chi <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-1 text-[11px]">
              <button
                type="button"
                onClick={() => setDate(localToday())}
                className={`px-1.5 py-0.5 rounded ${date === localToday() ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Hôm nay
              </button>
              <button
                type="button"
                onClick={() => setDate(localYesterday())}
                className={`px-1.5 py-0.5 rounded ${date === localYesterday() ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Hôm qua
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <Calendar className="h-4 w-4" />
            </div>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3.5 text-sm text-slate-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Ghi chú */}
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Ghi chú chi tiết <span className="text-xs font-normal text-slate-400">(tùy chọn)</span>
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <FileText className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="VD: Cà phê sáng, Mua sách, Đổ xăng xe..."
              className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      <div className="mt-5 flex items-center justify-end">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/30 transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/40 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Đang lưu...</span>
            </>
          ) : (
            <>
              <PlusCircle className="h-4 w-4" />
              <span>Lưu khoản chi</span>
            </>
          )}
        </button>
      </div>
    </form>
  )
}
