import { categoryColor, categoryLabel } from '@/lib/categories'
import { formatVnd } from '@/lib/format'
import type { SummaryResponse } from '@/lib/types'

export default function ExpenseSummary({
  summary,
}: {
  summary: SummaryResponse | null
}) {
  if (!summary) {
    return (
      <div className="rounded-xl border border-black/10 p-4">
        <h2 className="font-semibold">Tổng kết theo hạng mục</h2>
        <p className="mt-3 text-sm text-zinc-500">Đang tải...</p>
      </div>
    )
  }

  if (summary.items.length === 0) {
    return (
      <div className="rounded-xl border border-black/10 p-4">
        <h2 className="font-semibold">Tổng kết theo hạng mục</h2>
        <p className="mt-3 text-sm text-zinc-500">Chưa có dữ liệu chi tiêu.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-black/10 p-4 lg:sticky lg:top-4 lg:self-start">
      <h2 className="font-semibold">Tổng kết theo hạng mục</h2>
      <p className="text-3xl font-bold text-blue-700">
        {formatVnd(summary.grandTotal)}
      </p>
      <ul className="flex flex-col gap-3">
        {summary.items.map((item) => {
          const percent =
            summary.grandTotal > 0
              ? Math.round((item.total / summary.grandTotal) * 100)
              : 0
          const color = categoryColor(item.category)
          return (
            <li key={item.category} className="flex flex-col gap-1">
              <div className="flex items-baseline justify-between text-sm">
                <span className="font-medium">
                  {categoryLabel(item.category)}
                </span>
                <span className="text-zinc-500">
                  {formatVnd(item.total)} · {item.count} khoản · {percent}%
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${percent}%`, backgroundColor: color }}
                />
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
