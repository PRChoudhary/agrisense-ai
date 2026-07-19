import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import RecommendationBadge from './RecommendationBadge'
import { getTrendConfig, formatChartPrice } from '../utils/predictionUtils'
import { cn } from '../../../utils/cn'

export default function TopPredictionsGrid({ predictions = [], onSelect, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-36 rounded-2xl bg-slate-800 animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {predictions.map((pred, i) => {
        const trend = getTrendConfig(pred.trend)
        const TrendIcon = pred.trend === 'UP' ? TrendingUp : pred.trend === 'DOWN' ? TrendingDown : Minus
        const lastPredicted = pred.predictions?.[pred.predictions.length - 1]?.price
        const change = lastPredicted && pred.currentPrice
          ? ((lastPredicted - pred.currentPrice) / pred.currentPrice * 100).toFixed(1)
          : null

        return (
          <motion.button
            key={pred.cropId}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(pred.cropId)}
            className="text-left bg-slate-800/60 border border-slate-700 hover:border-slate-500 rounded-2xl p-4 transition-all group"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-white font-semibold text-sm group-hover:text-emerald-300 transition-colors">{pred.cropName}</p>
                {pred.cropNameHindi && <p className="text-slate-600 text-xs">{pred.cropNameHindi}</p>}
              </div>
              <div className={cn('flex items-center gap-1 text-sm font-bold', trend.color)}>
                <TrendIcon size={14} />
                {change && <span>{parseFloat(change) >= 0 ? '+' : ''}{change}%</span>}
              </div>
            </div>

            <div className="flex items-baseline gap-1 mb-3">
              <span className="text-2xl font-bold text-white">{formatChartPrice(pred.currentPrice)}</span>
              <span className="text-slate-600 text-xs">/qt</span>
            </div>

            <div className="flex items-center justify-between">
              <RecommendationBadge recommendation={pred.recommendation} size="sm" />
              <span className="text-slate-600 text-xs">{pred.confidence}% conf.</span>
            </div>
          </motion.button>
        )
      })}
    </div>
  )
}
