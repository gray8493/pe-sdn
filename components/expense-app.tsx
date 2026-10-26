'use client'

import { useCallback, useEffect, useState } from 'react'
import type { ExpenseDto, SummaryResponse } from '@/lib/types'
import ExpenseForm from './expense-form'
import ExpenseList from './expense-list'
import ExpenseSummary from './expense-summary'

export default function ExpenseApp() {
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
      setError('Không tải được dữ liệu, thử lại sau')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- tải dữ liệu lần đầu khi mount
    refresh()
  }, [refresh])

  return (
    <div className="w-full max-w-5xl flex-1 px-4 pb-10">
      {loading ? (
        <p className="py-10 text-center text-zinc-500">Đang tải dữ liệu...</p>
      ) : error ? (
        <p className="py-10 text-center text-red-600">{error}</p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="flex flex-col gap-6">
            <ExpenseForm onCreated={refresh} />
            <ExpenseList expenses={expenses} onChanged={refresh} />
          </div>
          <ExpenseSummary summary={summary} />
        </div>
      )}
    </div>
  )
}
