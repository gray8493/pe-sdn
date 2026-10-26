'use client'

import { useState, useMemo } from 'react'
import { CATEGORIES, categoryColor, categoryLabel } from '@/lib/categories'
import { formatVnd } from '@/lib/format'
import type { ExpenseDto } from '@/lib/types'
import CategoryIcon from './category-icon'
import {
  Search,
  SlidersHorizontal,
  Pencil,
  Trash2,
  Calendar,
  AlertTriangle,
  Loader2,
  Coins,
  X,
  FileQuestion,
} from 'lucide-react'

function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-')
  return `${day}/${month}/${year}`
}

export default function ExpenseList({
  expenses,
  onChanged,
}: {
  expenses: ExpenseDto[]
  onChanged: () => void
}) {
  const [editing, setEditing] = useState<ExpenseDto | null>(null)
  const [deleting, setDeleting] = useState<ExpenseDto | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pendingId, setPendingId] = useState<string | null>(null)

  // Filter & Search states
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'>('date-desc')

  async function confirmDelete() {
    if (!deleting) return

    setPendingId(deleting.id)
    setError(null)
    try {
      const res = await fetch(`/api/expenses/${deleting.id}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as {
          error?: string
        } | null
        setError(data?.error ?? 'Không xoá được khoản chi')
        return
      }
      setDeleting(null)
      onChanged()
    } catch {
      setError('Không kết nối được máy chủ')
    } finally {
      setPendingId(null)
    }
  }

  // Filter & Sort computation
  const filteredExpenses = useMemo(() => {
    return expenses
      .filter((exp) => {
        const matchCategory = categoryFilter === 'all' || exp.category === categoryFilter
        const matchSearch =
          !search ||
          exp.note.toLowerCase().includes(search.toLowerCase()) ||
          categoryLabel(exp.category).toLowerCase().includes(search.toLowerCase())
        return matchCategory && matchSearch
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') {
          return new Date(b.spent_at).getTime() - new Date(a.spent_at).getTime() || b.id.localeCompare(a.id)
        }
        if (sortBy === 'date-asc') {
          return new Date(a.spent_at).getTime() - new Date(b.spent_at).getTime() || a.id.localeCompare(b.id)
        }
        if (sortBy === 'amount-desc') {
          return b.amount - a.amount
        }
        if (sortBy === 'amount-asc') {
          return a.amount - b.amount
        }
        return 0
      })
  }, [expenses, search, categoryFilter, sortBy])

  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white/50 p-8 sm:p-12 text-center dark:border-slate-800 dark:bg-slate-900/40">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
          <FileQuestion className="h-6 w-6" />
        </div>
        <h3 className="mt-4 font-bold text-slate-800 dark:text-slate-200">Chưa có khoản chi nào</h3>
        <p className="mt-1 max-w-sm text-xs sm:text-sm text-slate-500">
          Ghi lại khoản chi đầu tiên ở biểu mẫu phía trên để bắt đầu theo dõi dòng tiền thông minh.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white/95 p-5 sm:p-6 shadow-sm backdrop-blur-sm dark:border-slate-800/80 dark:bg-slate-900/90">
      {/* List Header */}
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-bold text-slate-900 text-base sm:text-lg dark:text-white">
            Lịch sử chi tiêu
          </h2>
          <p className="text-xs text-slate-500">
            Hiển thị {filteredExpenses.length} trên tổng số {expenses.length} khoản chi
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search bar */}
          <div className="relative flex-1 sm:w-48 sm:flex-none">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo ghi chú..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-700 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            <option value="all">Mọi danh mục</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>

          {/* Sort selector */}
          <div className="flex items-center gap-1">
            <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-700 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              <option value="date-desc">Mới nhất</option>
              <option value="date-asc">Cũ nhất</option>
              <option value="amount-desc">Số tiền: Cao → Thấp</option>
              <option value="amount-asc">Số tiền: Thấp → Cao</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
          <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* List Content */}
      {filteredExpenses.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-xs sm:text-sm text-slate-500">
            Không tìm thấy khoản chi nào phù hợp với bộ lọc tìm kiếm.
          </p>
          <button
            onClick={() => {
              setSearch('')
              setCategoryFilter('all')
            }}
            className="mt-2 text-xs font-semibold text-blue-600 hover:underline"
          >
            Xóa bộ lọc
          </button>
        </div>
      ) : (
        <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-800">
          {filteredExpenses.map((expense) => {
            const color = categoryColor(expense.category)
            return (
              <div
                key={expense.id}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3.5 transition-colors hover:bg-slate-50/70 -mx-3 px-3 rounded-2xl dark:hover:bg-slate-800/40"
              >
                {/* Left: Icon + Note + Category + Date */}
                <div className="flex items-center gap-3 min-w-0">
                  <CategoryIcon category={expense.category} withBackground size={18} />

                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm text-slate-900 truncate dark:text-white">
                        {expense.note || categoryLabel(expense.category)}
                      </span>
                      <span
                        className="rounded-md px-2 py-0.5 text-[10px] font-semibold tracking-wide"
                        style={{
                          backgroundColor: `${color}18`,
                          color: color,
                        }}
                      >
                        {categoryLabel(expense.category)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(expense.spent_at)}
                      </span>
                      {expense.note && (
                        <>
                          <span>·</span>
                          <span className="truncate max-w-[200px] text-slate-400">
                            {categoryLabel(expense.category)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Amount + Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-3 pl-12 sm:pl-0">
                  <span className="font-bold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white">
                    {formatVnd(expense.amount)}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditing(expense)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition dark:hover:bg-blue-950 dark:hover:text-blue-400"
                      title="Chỉnh sửa khoản chi"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeleting(expense)}
                      disabled={pendingId === expense.id}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition dark:hover:bg-red-950 dark:hover:text-red-400 disabled:opacity-50"
                      title="Xóa khoản chi"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modern Delete Confirmation Dialog */}
      {deleting && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in"
          onClick={() => setDeleting(null)}
        >
          <div
            className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400 mx-auto mb-4">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h3 className="text-center text-lg font-bold text-slate-900 dark:text-white">
              Xác nhận xóa khoản chi?
            </h3>
            <p className="mt-2 text-center text-xs text-slate-500">
              Bạn có chắc chắn muốn xóa &quot;
              <strong className="text-slate-700 dark:text-slate-300">
                {deleting.note || categoryLabel(deleting.category)}
              </strong>
              &quot; với số tiền{' '}
              <strong className="text-red-600">{formatVnd(deleting.amount)}</strong>? Hành động này không thể hoàn tác.
            </p>

            <div className="mt-6 flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setDeleting(null)}
                className="flex-1 rounded-xl border border-slate-300 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={pendingId === deleting.id}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-red-600 py-2.5 text-xs font-semibold text-white shadow-md shadow-red-600/30 hover:bg-red-700 transition disabled:opacity-50"
              >
                {pendingId === deleting.id ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Đang xóa...</span>
                  </>
                ) : (
                  <span>Xác nhận xóa</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editing && (
        <EditModal
          expense={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null)
            onChanged()
          }}
        />
      )}
    </div>
  )
}

function EditModal({
  expense,
  onClose,
  onSaved,
}: {
  expense: ExpenseDto
  onClose: () => void
  onSaved: () => void
}) {
  const [amount, setAmount] = useState(String(expense.amount))
  const [category, setCategory] = useState(expense.category)
  const [date, setDate] = useState(expense.spent_at)
  const [note, setNote] = useState(expense.note)
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setPending(true)

    try {
      const res = await fetch(`/api/expenses/${expense.id}`, {
        method: 'PATCH',
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
        setError(data?.error ?? 'Không cập nhật được khoản chi')
        return
      }
      onSaved()
    } catch {
      setError('Không kết nối được máy chủ')
    } finally {
      setPending(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in"
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <Pencil className="h-4 w-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-base dark:text-white">
              Chỉnh sửa khoản chi
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-3.5">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Số tiền (VNĐ) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Coins className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="number"
                min={1}
                step="any"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-8 text-sm font-semibold text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-xs text-slate-400">
                ₫
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Hạng mục
            </label>
            <select
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Ngày chi
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Ghi chú
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          </div>
        </div>

        {error && (
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-2.5 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
            <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-md shadow-blue-600/30 hover:bg-blue-700 transition disabled:opacity-50"
          >
            {pending ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Đang lưu...</span>
              </>
            ) : (
              <span>Lưu thay đổi</span>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
