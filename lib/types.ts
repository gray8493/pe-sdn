export type ExpenseDto = {
  id: string
  amount: number
  category: string
  note: string
  spent_at: string
}

export type SummaryItem = {
  category: string
  total: number
  count: number
}

export type SummaryResponse = {
  items: SummaryItem[]
  grandTotal: number
}
