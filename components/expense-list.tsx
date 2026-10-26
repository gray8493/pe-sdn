'use client'

import { useState } from 'react'
import { CATEGORIES, categoryColor, categoryLabel } from '@/lib/categories'
import { formatVnd } from '@/lib/format'
import type { ExpenseDto } from '@/lib/types'

const inputClass =
  'w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none'

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
  const [error, setError] = useState<string | null>(null)
  const [pendingId, setPendingId] = useState<string | null>(null)

  async function handleDelete(expense: ExpenseDto) {
    const label = expense.note || categoryLabel(expense.category)
    if (!window.confirm(`Xoá khoản chi "${label}"?`)) return

    setPendingId(expense.id)
    setError(null)
    try {
      const res = await fetch(`/api/expenses/${expense.id}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as {
          error?: string
        } | null
        setError(data?.error ?? 'Không xoá được khoản chi')
        return
      }
      onChanged()
    } catch {
      setError('Không kết nối được máy chủ')
    } finally {
      setPendingId(null)
    }
  }

  if (expenses.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-black/15 p-6 text-center text-zinc-500">
        Chưa có khoản chi nào — thêm khoản đầu tiên ở trên.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-black/10 p-4">
      <h2 className="font-semibold">
        Danh sách chi tiêu ({expenses.length} khoản)
      </h2>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <ul className="flex flex-col divide-y divide-gray-100">
        {expenses.map((expense) => (
          <li
            key={expense.id}
            className="flex items-center gap-3 py-3 text-sm"
          >
            <span className="w-20 shrink-0 text-zinc-500">
              {formatDate(expense.spent_at)}
            </span>
            <span
              className="rounded-full px-2 py-0.5 text-xs font-medium"
              style={{
                backgroundColor: `${categoryColor(expense.category)}1f`,
                color: categoryColor(expense.category),
              }}
            >
              {categoryLabel(expense.category)}
            </span>
            <span className="min-w-0 flex-1 truncate text-zinc-600">
              {expense.note || '—'}
            </span>
            <span className="shrink-0 font-semibold">
              {formatVnd(expense.amount)}
            </span>
            <span className="flex shrink-0 gap-1">
              <button
                onClick={() => setEditing(expense)}
                className="rounded px-2 py-1 text-blue-600 hover:bg-blue-50"
              >
                Sửa
              </button>
              <button
                onClick={() => handleDelete(expense)}
                disabled={pendingId === expense.id}
                className="rounded px-2 py-1 text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                Xoá
              </button>
            </span>
          </li>
        ))}
      </ul>

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="flex w-full max-w-sm flex-col gap-3 rounded-xl bg-white p-5 shadow-xl"
      >
        <h3 className="font-semibold">Sửa khoản chi</h3>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Số tiền (₫)
          <input
            type="number"
            min={1}
            step="any"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Hạng mục
          <select
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={inputClass}
          >
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Ngày chi
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Ghi chú
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className={inputClass}
          />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 font-medium hover:bg-gray-50"
          >
            Huỷ
          </button>
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {pending ? 'Đang lưu...' : 'Lưu'}
          </button>
        </div>
      </form>
    </div>
  )
}
