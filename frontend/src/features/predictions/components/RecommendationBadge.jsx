import React from 'react'
import { motion } from 'framer-motion'
import { getRecommendationConfig } from '../utils/predictionUtils'
import { cn } from '../../../utils/cn'

export default function RecommendationBadge({ recommendation, size = 'md' }) {
  const config = getRecommendationConfig(recommendation)

  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        'inline-flex items-center gap-2 font-semibold border rounded-full',
        config.bg, config.color,
        size === 'lg' ? 'px-4 py-2 text-base' : size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm'
      )}
    >
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </motion.span>
  )
}
