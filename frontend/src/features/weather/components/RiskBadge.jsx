import React from 'react'
import { Shield } from 'lucide-react'
import { getRiskStyle } from '../utils/weatherUtils'
import { cn } from '../../../utils/cn'

export default function RiskBadge({ level = 'low', score, showScore = false, size = 'md' }) {
  const style = getRiskStyle(level)

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 font-semibold border rounded-full',
      style.bg, style.color,
      size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1.5 text-sm'
    )}>
      <span className={cn('w-1.5 h-1.5 rounded-full animate-pulse', style.dot)} />
      {style.label}
      {showScore && <span className="opacity-70">({score})</span>}
    </span>
  )
}
