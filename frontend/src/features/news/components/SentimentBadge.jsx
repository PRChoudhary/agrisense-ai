import React from 'react'
import { getSentimentConfig } from '../utils/newsUtils'
import { cn } from '../../../utils/cn'

export default function SentimentBadge({ category, size = 'sm' }) {
  const config = getSentimentConfig(category)
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 font-medium border rounded-full',
      config.bg, config.color,
      size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm'
    )}>
      <span className={cn('w-1.5 h-1.5 rounded-full', config.dot)} />
      {config.label}
    </span>
  )
}
