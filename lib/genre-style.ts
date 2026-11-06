import type { Genre } from './validation'

/** Visual style per genre (badge, bar and accent colors). */
export const GENRE_STYLE: Record<Genre, { badge: string; bar: string; border: string; emoji: string }> = {
  Fiction: {
    badge: 'bg-violet-100 text-violet-700 ring-violet-200',
    bar: 'from-violet-500 to-fuchsia-500',
    border: 'border-l-violet-500',
    emoji: '📖',
  },
  'Non-Fiction': {
    badge: 'bg-sky-100 text-sky-700 ring-sky-200',
    bar: 'from-sky-500 to-cyan-500',
    border: 'border-l-sky-500',
    emoji: '🧠',
  },
  'Sci-Fi': {
    badge: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
    bar: 'from-emerald-500 to-teal-500',
    border: 'border-l-emerald-500',
    emoji: '🚀',
  },
  Biography: {
    badge: 'bg-amber-100 text-amber-800 ring-amber-200',
    bar: 'from-amber-500 to-orange-500',
    border: 'border-l-amber-500',
    emoji: '👤',
  },
  Other: {
    badge: 'bg-slate-100 text-slate-700 ring-slate-200',
    bar: 'from-slate-400 to-slate-500',
    border: 'border-l-slate-400',
    emoji: '📚',
  },
}
