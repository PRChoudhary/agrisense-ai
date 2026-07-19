/**
 * Get recommendation display config
 * @param {'SELL_NOW'|'SELL_IN_3_DAYS'|'SELL_IN_7_DAYS'|'WAIT'} rec
 */
export function getRecommendationConfig(rec) {
  const configs = {
    SELL_NOW: {
      label: 'Sell Now',
      labelHindi: 'अभी बेचें',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/15 border-emerald-500/30',
      dot: 'bg-emerald-400',
      description: 'Prices are at a good level. Consider selling today.',
      urgency: 'high',
      icon: '⚡',
    },
    SELL_IN_3_DAYS: {
      label: 'Sell in 3 Days',
      labelHindi: '3 दिन में बेचें',
      color: 'text-amber-400',
      bg: 'bg-amber-500/15 border-amber-500/30',
      dot: 'bg-amber-400',
      description: 'Prices expected to rise slightly. Best window: next 2-3 days.',
      urgency: 'medium',
      icon: '📈',
    },
    SELL_IN_7_DAYS: {
      label: 'Sell in 7 Days',
      labelHindi: '7 दिन में बेचें',
      color: 'text-sky-400',
      bg: 'bg-sky-500/15 border-sky-500/30',
      dot: 'bg-sky-400',
      description: 'Prices trending upward. Wait for peak in 5-7 days.',
      urgency: 'low',
      icon: '🎯',
    },
    WAIT: {
      label: 'Wait & Watch',
      labelHindi: 'इंतज़ार करें',
      color: 'text-slate-400',
      bg: 'bg-slate-500/15 border-slate-500/30',
      dot: 'bg-slate-400',
      description: 'Market uncertain. Monitor prices before deciding.',
      urgency: 'none',
      icon: '👁️',
    },
  }
  return configs[rec] || configs.WAIT
}

/**
 * Get trend config
 * @param {'UP'|'DOWN'|'STABLE'} trend
 */
export function getTrendConfig(trend) {
  const configs = {
    UP: { label: 'Upward', color: 'text-emerald-400', bg: 'bg-emerald-500/10', arrow: '↑', class: 'text-emerald-400' },
    DOWN: { label: 'Downward', color: 'text-rose-400', bg: 'bg-rose-500/10', arrow: '↓', class: 'text-rose-400' },
    STABLE: { label: 'Stable', color: 'text-amber-400', bg: 'bg-amber-500/10', arrow: '→', class: 'text-amber-400' },
  }
  return configs[trend] || configs.STABLE
}

/**
 * Format price for chart tooltip
 */
export function formatChartPrice(value) {
  return value ? `₹${Number(value).toLocaleString('en-IN')}` : '—'
}

/**
 * Get confidence level label
 */
export function getConfidenceLabel(score) {
  if (score >= 80) return { label: 'High', color: 'text-emerald-400' }
  if (score >= 60) return { label: 'Medium', color: 'text-amber-400' }
  if (score >= 40) return { label: 'Fair', color: 'text-orange-400' }
  return { label: 'Low', color: 'text-rose-400' }
}
