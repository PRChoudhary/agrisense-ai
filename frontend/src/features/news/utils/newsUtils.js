/**
 * Get sentiment badge config
 * @param {'POSITIVE'|'NEGATIVE'|'NEUTRAL'} category
 */
export function getSentimentConfig(category) {
  const configs = {
    POSITIVE: {
      label: 'Positive',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/25',
      dot: 'bg-emerald-400',
      glow: 'shadow-emerald-500/10',
      icon: '📈',
    },
    NEGATIVE: {
      label: 'Negative',
      color: 'text-rose-400',
      bg: 'bg-rose-500/10 border-rose-500/25',
      dot: 'bg-rose-400',
      glow: 'shadow-rose-500/10',
      icon: '📉',
    },
    NEUTRAL: {
      label: 'Neutral',
      color: 'text-slate-400',
      bg: 'bg-slate-500/10 border-slate-500/25',
      dot: 'bg-slate-400',
      glow: '',
      icon: '📰',
    },
  }
  return configs[category] || configs.NEUTRAL
}

/**
 * Get impact badge config
 * @param {'HIGH'|'MEDIUM'|'LOW'} impact
 */
export function getImpactConfig(impact) {
  const configs = {
    HIGH: { label: 'High Impact', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/25' },
    MEDIUM: { label: 'Medium Impact', color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/25' },
    LOW: { label: 'Low Impact', color: 'text-slate-500', bg: 'bg-slate-500/10 border-slate-600/25' },
  }
  return configs[impact] || configs.MEDIUM
}

/**
 * Format relative time for news articles
 * @param {string|Date} date
 */
export function formatNewsTime(date) {
  const d = new Date(date)
  const now = new Date()
  const diffMs = now - d
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffHours < 1) return 'Just now'
  if (diffHours === 1) return '1 hour ago'
  if (diffHours < 24) return `${diffHours} hours ago`
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
}

/** Category filter options */
export const CATEGORY_FILTERS = [
  { value: 'ALL', label: 'All News', icon: '📰' },
  { value: 'POSITIVE', label: 'Positive', icon: '📈' },
  { value: 'NEGATIVE', label: 'Negative', icon: '📉' },
  { value: 'NEUTRAL', label: 'Updates', icon: '📋' },
]

/** Impact filter options */
export const IMPACT_FILTERS = [
  { value: 'ALL', label: 'All Impact' },
  { value: 'HIGH', label: 'High' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'LOW', label: 'Low' },
]
