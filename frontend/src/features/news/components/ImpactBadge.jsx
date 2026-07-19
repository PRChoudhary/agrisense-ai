import React from 'react'
import { getImpactConfig } from '../utils/newsUtils'
import { cn } from '../../../utils/cn'

export default function ImpactBadge({ impact, size = 'sm' }) {
  const config = getImpactConfig(impact)
  return (
    <span className={cn(
      'inline-flex items-center font-medium border rounded-full',
      config.bg, config.color,
      size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
    )}>
      {config.label}
    </span>
  )
}
