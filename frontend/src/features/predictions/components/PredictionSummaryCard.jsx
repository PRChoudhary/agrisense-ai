import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus, Brain, RefreshCw, Clock } from 'lucide-react'
import RecommendationBadge from './RecommendationBadge'
import { getTrendConfig, getConfidenceLabel, formatChartPrice } from '../utils/predictionUtils'
import { cn } from '../../../utils/cn'

export default function PredictionSummaryCard({ prediction, onRefresh, isRefreshing }) {
  if (!prediction) return null

  const trend = getTrendConfig(prediction.trend)
  const confidence = getConfidenceLabel(prediction.confidence)
  const TrendIcon = prediction.trend === 'UP' ? TrendingUp : prediction.trend === 'DOWN' ? TrendingDown : Minus

  // Calculate 7-day expected price change
  const lastPredicted = prediction.predictions?.[prediction.predictions.length - 1]?.price
  const priceChange = lastPredicted && prediction.currentPrice
    ? ((lastPredicted - prediction.currentPrice) / prediction.currentPrice * 100).toFixed(1)
    : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
    >
      {/* Crop name + refresh */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-white">{prediction.cropName}</h2>
          {prediction.cropNameHindi && (
            <p className="text-slate-500 text-sm">{prediction.cropNameHindi}</p>
          )}
        </div>
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-2 rounded-xl bg-slate-800 border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white transition-all disabled:opacity-50"
        >
          <RefreshCw size={15} className={isRefreshing ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Main recommendation */}
      <div className="mb-5">
        <p className="text-slate-500 text-xs font-medium mb-2">AI RECOMMENDATION</p>
        <RecommendationBadge recommendation={prediction.recommendation} size="lg" />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {/* Current Price */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-3">
          <p className="text-slate-500 text-xs mb-1">Current Price</p>
          <p className="text-white font-bold text-lg">{formatChartPrice(prediction.currentPrice)}</p>
          <p className="text-slate-600 text-xs">per quintal</p>
        </div>

        {/* 7-day trend */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-3">
          <p className="text-slate-500 text-xs mb-1">7-Day Trend</p>
          <div className="flex items-center gap-1">
            <TrendIcon size={16} className={trend.color} />
            <span className={cn('font-bold text-lg', trend.color)}>{trend.arrow}</span>
          </div>
          {priceChange && (
            <p className={cn('text-xs font-medium', parseFloat(priceChange) >= 0 ? 'text-emerald-400' : 'text-rose-400')}>
              {parseFloat(priceChange) >= 0 ? '+' : ''}{priceChange}%
            </p>
          )}
        </div>

        {/* Confidence */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-3">
          <p className="text-slate-500 text-xs mb-1">Confidence</p>
          <p className={cn('font-bold text-lg', confidence.color)}>{prediction.confidence}%</p>
          <p className={cn('text-xs', confidence.color)}>{confidence.label}</p>
        </div>
      </div>

      {/* MSP comparison */}
      {prediction.mspPrice && prediction.currentPrice && (
        <div className={cn(
          'rounded-xl p-3 mb-4 border text-sm',
          prediction.currentPrice >= prediction.mspPrice
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
            : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
        )}>
          {prediction.currentPrice >= prediction.mspPrice
            ? `✅ Current price ₹${prediction.currentPrice?.toLocaleString('en-IN')} is above MSP (₹${prediction.mspPrice?.toLocaleString('en-IN')})`
            : `⚠️ Current price is BELOW MSP. Consider government procurement.`
          }
        </div>
      )}

      {/* Generated at */}
      <div className="flex items-center gap-1.5 text-slate-600 text-xs">
        <Clock size={11} />
        <span>
          {prediction.isCached ? 'Cached' : 'Generated'} at {' '}
          {new Date(prediction.generatedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          {prediction.isMock && ' · Demo data'}
        </span>
      </div>
    </motion.div>
  )
}
