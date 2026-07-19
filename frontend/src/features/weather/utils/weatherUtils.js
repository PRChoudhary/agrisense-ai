/**
 * Get gradient classes based on weather condition bg type
 * @param {'sunny'|'rain'|'storm'|'cloudy'|'cold'|'fog'|'neutral'} bg
 * @returns {string} TailwindCSS gradient classes
 */
export function getConditionGradient(bg) {
  const gradients = {
    sunny: 'from-amber-500/20 via-orange-400/10 to-yellow-300/5',
    rain: 'from-blue-600/20 via-slate-600/10 to-blue-400/5',
    storm: 'from-slate-700/30 via-purple-900/20 to-slate-800/10',
    cloudy: 'from-slate-500/15 via-slate-400/10 to-slate-600/5',
    cold: 'from-sky-400/20 via-blue-300/10 to-cyan-200/5',
    fog: 'from-slate-400/15 via-slate-300/10 to-slate-500/5',
    neutral: 'from-slate-600/15 via-slate-500/10 to-slate-400/5',
  }
  return gradients[bg] || gradients.neutral
}

/**
 * Get border color class based on condition
 */
export function getConditionBorder(bg) {
  const borders = {
    sunny: 'border-amber-500/30',
    rain: 'border-blue-500/30',
    storm: 'border-purple-500/30',
    cloudy: 'border-slate-500/30',
    cold: 'border-sky-500/30',
    fog: 'border-slate-400/20',
    neutral: 'border-slate-700',
  }
  return borders[bg] || borders.neutral
}

/**
 * Get risk level styling
 * @param {'low'|'medium'|'high'|'critical'} level
 */
export function getRiskStyle(level) {
  const styles = {
    low: { color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30', label: 'Low Risk', dot: 'bg-emerald-400' },
    medium: { color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30', label: 'Medium Risk', dot: 'bg-amber-400' },
    high: { color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30', label: 'High Risk', dot: 'bg-orange-400' },
    critical: { color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30', label: 'Critical Risk', dot: 'bg-rose-400' },
  }
  return styles[level] || styles.low
}

/**
 * Get day name from date string
 * @param {string} dateStr - YYYY-MM-DD
 */
export function getDayName(dateStr) {
  const date = new Date(dateStr)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  if (date.toDateString() === today.toDateString()) return 'Today'
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow'
  return date.toLocaleDateString('en-IN', { weekday: 'short' })
}

/**
 * Format wind speed with label
 * @param {number} speed - km/h
 */
export function formatWind(speed) {
  if (speed < 10) return { value: speed, label: 'Calm', color: 'text-emerald-400' }
  if (speed < 20) return { value: speed, label: 'Light', color: 'text-sky-400' }
  if (speed < 35) return { value: speed, label: 'Moderate', color: 'text-amber-400' }
  return { value: speed, label: 'Strong', color: 'text-rose-400' }
}

/** Quick city shortcuts for Indian farmers */
export const QUICK_CITIES = [
  { name: 'Delhi', state: 'Delhi' },
  { name: 'Mumbai', state: 'Maharashtra' },
  { name: 'Ludhiana', state: 'Punjab' },
  { name: 'Jaipur', state: 'Rajasthan' },
  { name: 'Nashik', state: 'Maharashtra' },
  { name: 'Bhopal', state: 'Madhya Pradesh' },
  { name: 'Patna', state: 'Bihar' },
  { name: 'Hyderabad', state: 'Telangana' },
]
