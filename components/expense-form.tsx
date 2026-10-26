'use client'

import { useState } from 'react'
import { CATEGORIES } from '@/lib/categories'

const inputClass =
  'w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none'

function localToday(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

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
      setError('Không kết nối được máy chủ')
    } finally {
      setPending(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-xl border border-black/10 p-4"
    >
      <h2 className="font-semibold">Thêm khoản chi</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm font-medium">
          Số tiền (₫)
          <input
            type="number"
            min={1}
            step="any"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="VD: 50000"
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
          Ghi chú (không bắt buộc)
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="VD: Ăn trưa với đồng nghiệp"
            className={inputClass}
          />
        </label>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {pending ? 'Đang thêm...' : 'Thêm khoản chi'}
      </button>
    </form>
  )
}
