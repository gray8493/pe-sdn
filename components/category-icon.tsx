import React from 'react'
import {
  UtensilsCrossed,
  Car,
  ShoppingBag,
  Sparkles,
  Receipt,
  HeartPulse,
  FolderArchive,
  type LucideIcon,
} from 'lucide-react'
import { categoryColor } from '@/lib/categories'

const ICON_MAP: Record<string, LucideIcon> = {
  'an-uong': UtensilsCrossed,
  'di-chuyen': Car,
  'mua-sam': ShoppingBag,
  'giai-tri': Sparkles,
  'hoa-don': Receipt,
  'suc-khoe': HeartPulse,
  'khac': FolderArchive,
}

interface CategoryIconProps {
  category: string
  className?: string
  size?: number
  withBackground?: boolean
}

export default function CategoryIcon({
  category,
  className = '',
  size = 18,
  withBackground = false,
}: CategoryIconProps) {
  const Icon = ICON_MAP[category] || FolderArchive
  const color = categoryColor(category)

  if (withBackground) {
    return (
      <div
        className={`flex items-center justify-center rounded-xl p-2.5 transition-transform duration-200 group-hover:scale-110 ${className}`}
        style={{
          backgroundColor: `${color}18`,
          color: color,
        }}
      >
        <Icon size={size} strokeWidth={2.2} />
      </div>
    )
  }

  return <Icon size={size} className={className} style={{ color }} strokeWidth={2.2} />
}
