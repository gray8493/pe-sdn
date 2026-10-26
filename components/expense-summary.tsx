import { categoryColor, categoryLabel } from '@/lib/categories'
import { formatVnd } from '@/lib/format'
import type { SummaryResponse } from '@/lib/types'
import CategoryIcon from './category-icon'
import { PieChart, TrendingDown } from 'lucide-react'

export default function ExpenseSummary({
  summary,
}: {
  summary: SummaryResponse | null
}) {
  if (!summary) {
    return (
      <div className="rounded-3xl border border-slate-200/80 bg-white/95 p-5 sm:p-6 shadow-sm backdrop-blur-sm dark:border-slate-800/80 dark:bg-slate-900/90">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
            <PieChart className="h-4 w-4" />
          </div>
          <h2 className="font-bold text-slate-900 text-base dark:text-white">
            Phân bổ danh mục
          </h2>
        </div>
        <p className="mt-4 text-xs text-slate-400">Đang tải thống kê...</p>
      </div>
    )
  }

  if (summary.items.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-200/80 bg-white/95 p-5 sm:p-6 shadow-sm backdrop-blur-sm dark:border-slate-800/80 dark:bg-slate-900/90">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
            <PieChart className="h-4 w-4" />
          </div>
          <h2 className="font-bold text-slate-900 text-base dark:text-white">
            Phân bổ danh mục
          </h2>
        </div>
        <p className="mt-4 text-xs text-slate-400">Chưa có dữ liệu chi tiêu nào.</p>
      </div>
    )
  }

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white/95 p-5 sm:p-6 shadow-sm backdrop-blur-sm dark:border-slate-800/80 dark:bg-slate-900/90 lg:sticky lg:top-20">
      {/* Card Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
            <PieChart className="h-4 w-4" />
          </div>
          <h2 className="font-bold text-slate-900 text-base dark:text-white">
            Phân bổ chi tiêu
          </h2>
        </div>
        <span className="text-[11px] font-medium text-slate-400">
          {summary.items.length} danh mục
        </span>
      </div>

      {/* Grand Total Highlight */}
      <div className="mt-4 rounded-2xl bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-slate-50/70 p-4 border border-blue-100/60 dark:border-blue-900/40 dark:from-blue-950/30 dark:via-indigo-950/20 dark:to-slate-900/30">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Tổng ngân sách đã chi
        </span>
        <p className="mt-1 text-2xl font-extrabold tracking-tight text-blue-600 sm:text-3xl dark:text-blue-400">
          {formatVnd(summary.grandTotal)}
        </p>

        {/* Multi-segmented visual bar */}
        <div className="mt-3 flex h-2 w-full overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-800">
          {summary.items.map((item) => {
            const percent = summary.grandTotal > 0 ? (item.total / summary.grandTotal) * 100 : 0
            const color = categoryColor(item.category)
            if (percent <= 0) return null
            return (
              <div
                key={item.category}
                style={{
                  width: `${percent}%`,
                  backgroundColor: color,
                }}
                title={`${categoryLabel(item.category)}: ${Math.round(percent)}%`}
                className="transition-all duration-300 first:rounded-l-full last:rounded-r-full"
              />
            )
          })}
        </div>
      </div>

      {/* Category breakdown list */}
      <div className="mt-5 flex flex-col gap-3.5">
        {summary.items.map((item) => {
          const percent =
            summary.grandTotal > 0
              ? Math.round((item.total / summary.grandTotal) * 100)
              : 0
          const color = categoryColor(item.category)

          return (
            <div key={item.category} className="group flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <CategoryIcon category={item.category} size={14} />
                  <span className="font-semibold text-slate-800 truncate dark:text-slate-200">
                    {categoryLabel(item.category)}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    ({item.count} khoản)
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-bold text-slate-900 dark:text-white">
                    {formatVnd(item.total)}
                  </span>
                  <span
                    className="rounded-md px-1.5 py-0.5 text-[10px] font-bold"
                    style={{
                      backgroundColor: `${color}18`,
                      color: color,
                    }}
                  >
                    {percent}%
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${percent}%`,
                    backgroundColor: color,
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Micro Insight Footer */}
      <div className="mt-6 border-t border-slate-100 pt-3 dark:border-slate-800">
        <p className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <TrendingDown className="h-3 w-3 text-emerald-500" />
          <span>Tỷ lệ tự động cân đối theo thời gian thực</span>
        </p>
      </div>
    </div>
  )
}
