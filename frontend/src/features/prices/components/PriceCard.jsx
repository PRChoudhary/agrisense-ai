import React from 'react'
import { motion } from 'framer-motion'
import { MapPin, Clock, TrendingUp, TrendingDown, Minus, ChevronRight } from 'lucide-react'
import { formatPrice, formatQty, getTrendDirection, calculateSellScore, getSellScoreInfo, getTrendInfo } from '../utils/priceUtils'
import PriceTrendMini from './PriceTrendMini'
import { cn } from '../../../utils/cn'

/**
 * A premium price card showing all key pricing data for a crop at a mandi
 */
export default function PriceCard({ price, index = 0 }) {
  const { crop, mandi, modalPrice, minPrice, maxPrice, arrivalQuantity, date } = price

  // Calculate sell score based on position in min-max range
  const sellScore = calculateSellScore(modalPrice, minPrice, maxPrice)
  const scoreInfo = getSellScoreInfo(sellScore)
  
  // MSP comparison
  const mspDiff = crop?.mspPrice ? ((modalPrice - crop.mspPrice) / crop.mspPrice) * 100 : null
  const aboveMSP = mspDiff !== null && mspDiff > 0

  // Time since update
  const updatedTime = date ? new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : 'Today'

  // Trend (simplified - use static sample until trend API integrated)
  const trendValues = [minPrice * 0.92, minPrice * 0.95, minPrice, modalPrice * 0.98, modalPrice * 0.99, modalPrice * 1.01, modalPrice]
  const trendDir = getTrendDirection(trendValues)
  const trendInfo = getTrendInfo(trendDir)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.4 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="group bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-600 transition-all duration-300 cursor-pointer relative overflow-hidden"
    >
      {/* Subtle glow on hover */}
      <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/3 transition-all duration-300 rounded-2xl pointer-events-none" />

      {/* Header: Crop name + Sell score badge */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0 pr-2">
          <div className="flex items-center gap-2">
            <p className="text-white font-semibold text-base truncate">{crop?.name}</p>
            {crop?.nameHindi && (
              <span className="text-slate-500 text-xs font-normal">{crop.nameHindi}</span>
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <MapPin size={11} className="text-slate-500 shrink-0" />
            <p className="text-slate-500 text-xs truncate">
              {mandi?.name}, {mandi?.state?.name}
            </p>
          </div>
        </div>
        <span className={cn(
          'shrink-0 px-2.5 py-1 rounded-full text-xs font-bold border',
          scoreInfo.bg, scoreInfo.color
        )}>
          {scoreInfo.label}
        </span>
      </div>

      {/* Main Price */}
      <div className="mb-1">
        <p className="text-3xl font-bold text-white tracking-tight">
          {formatPrice(modalPrice)}
          <span className="text-sm font-normal text-slate-500 ml-1">/qt</span>
        </p>
      </div>

      {/* Trend indicator */}
      <div className={cn('flex items-center gap-1 text-sm mb-4', trendInfo.color)}>
        {trendDir === 'UP' && <TrendingUp size={14} />}
        {trendDir === 'DOWN' && <TrendingDown size={14} />}
        {trendDir === 'STABLE' && <Minus size={14} />}
        <span className="font-medium">{trendInfo.label}</span>
        {mspDiff !== null && (
          <span className={cn('ml-auto text-xs font-medium', aboveMSP ? 'text-emerald-500' : 'text-rose-400')}>
            {aboveMSP ? '+' : ''}{mspDiff.toFixed(1)}% vs MSP
          </span>
        )}
      </div>

      {/* Mini Sparkline */}
      <div className="mb-4">
        <PriceTrendMini values={trendValues} />
      </div>

      {/* Min / Max / Arrival */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { label: 'Min', value: formatPrice(minPrice), className: 'text-rose-400' },
          { label: 'Max', value: formatPrice(maxPrice), className: 'text-emerald-400' },
          { label: 'Arrival', value: formatQty(arrivalQuantity), className: 'text-amber-400' },
        ].map(({ label, value, className }) => (
          <div key={label} className="bg-slate-800/60 rounded-xl p-2.5 text-center">
            <p className="text-slate-500 text-[10px] font-medium uppercase tracking-wide mb-0.5">{label}</p>
            <p className={cn('font-semibold text-sm', className)}>{value}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-800">
        <div className="flex items-center gap-1.5 text-slate-500 text-xs">
          <Clock size={11} />
          <span>{updatedTime}</span>
        </div>
        {crop?.mspPrice && (
          <div className="text-xs text-slate-500">
            MSP: <span className="text-amber-400 font-medium">{formatPrice(crop.mspPrice)}</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}
