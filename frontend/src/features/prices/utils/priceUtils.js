/**
 * Determine price trend direction from an array of prices
 * @param {number[]} prices - array of modal prices oldest to newest
 * @returns {'UP' | 'DOWN' | 'STABLE'}
 */
export function getTrendDirection(prices) {
  if (!prices || prices.length < 2) return 'STABLE'
  const recent = prices[prices.length - 1]
  const previous = prices[prices.length - 2]
  const diff = ((recent - previous) / previous) * 100
  if (diff > 1) return 'UP'
  if (diff < -1) return 'DOWN'
  return 'STABLE'
}

/**
 * Calculate a sell score (0-100) based on price vs min/max range
 * @param {number} currentPrice
 * @param {number} minPrice
 * @param {number} maxPrice
 * @returns {number} 0-100
 */
export function calculateSellScore(currentPrice, minPrice, maxPrice) {
  if (maxPrice === minPrice) return 50
  const score = ((currentPrice - minPrice) / (maxPrice - minPrice)) * 100
  return Math.round(Math.min(100, Math.max(0, score)))
}

/**
 * Get sell score label and color
 * @param {number} score 0-100
 * @returns {{ label: string, color: string, bg: string }}
 */
export function getSellScoreInfo(score) {
  if (score >= 75) return { label: 'Sell Now', color: 'text-emerald-400', bg: 'bg-emerald-500/15 border-emerald-500/30' }
  if (score >= 50) return { label: 'Good Time', color: 'text-sky-400', bg: 'bg-sky-500/15 border-sky-500/30' }
  if (score >= 25) return { label: 'Average', color: 'text-amber-400', bg: 'bg-amber-500/15 border-amber-500/30' }
  return { label: 'Wait', color: 'text-rose-400', bg: 'bg-rose-500/15 border-rose-500/30' }
}

/**
 * Get trend icon details
 * @param {'UP' | 'DOWN' | 'STABLE'} direction
 */
export function getTrendInfo(direction) {
  if (direction === 'UP') return { icon: '↑', color: 'text-emerald-400', label: 'Rising' }
  if (direction === 'DOWN') return { icon: '↓', color: 'text-rose-400', label: 'Falling' }
  return { icon: '→', color: 'text-slate-400', label: 'Stable' }
}

/** Format price as Indian currency */
export function formatPrice(price) {
  if (!price && price !== 0) return '—'
  return `₹${Number(price).toLocaleString('en-IN')}`
}

/** Format quantity in quintals */
export function formatQty(qty) {
  if (!qty && qty !== 0) return '—'
  if (qty >= 1000) return `${(qty / 1000).toFixed(1)}K qt`
  return `${qty} qt`
}
