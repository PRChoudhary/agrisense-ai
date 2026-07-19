import { format, formatDistanceToNow } from 'date-fns'

/**
 * Format currency value
 * @param {number} amount
 * @param {string} currency
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount, currency = 'INR') {
  if (amount == null) return '-'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format numbers with commas
 * @param {number} num
 * @returns {string}
 */
export function formatNumber(num) {
  if (num == null) return '-'
  return new Intl.NumberFormat('en-IN').format(num)
}

/**
 * Format date nicely
 * @param {Date|string|number} date
 * @param {string} formatStr
 * @returns {string}
 */
export function formatDate(date, formatStr = 'PP') {
  if (!date) return '-'
  return format(new Date(date), formatStr)
}

/**
 * Format relative time (e.g. "2 hours ago")
 * @param {Date|string|number} date
 * @returns {string}
 */
export function formatRelativeTime(date) {
  if (!date) return '-'
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

/**
 * Format weight
 * @param {number} kg
 * @returns {string}
 */
export function formatWeight(kg) {
  if (kg == null) return '-'
  if (kg >= 1000) return `${(kg / 1000).toFixed(1)} Tonnes`
  if (kg >= 100) return `${(kg / 100).toFixed(1)} Quintals`
  return `${kg} Kg`
}

/**
 * Format percentage
 * @param {number} value
 * @param {number} decimals
 * @returns {string}
 */
export function formatPercentage(value, decimals = 1) {
  if (value == null) return '-'
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(decimals)}%`
}

/**
 * Truncate text
 * @param {string} str
 * @param {number} length
 * @returns {string}
 */
export function truncate(str, length = 100) {
  if (!str) return ''
  if (str.length <= length) return str
  return `${str.slice(0, length)}...`
}

/**
 * Create URL friendly slug
 * @param {string} str
 * @returns {string}
 */
export function slugify(str) {
  if (!str) return ''
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Get initials from name
 * @param {string} name
 * @returns {string}
 */
export function getInitials(name) {
  if (!name) return '?'
  const parts = name.split(' ').filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}
