/**
 * Format message timestamp for display
 * @param {string|Date} date
 * @returns {string}
 */
export function formatMessageTime(date) {
  const d = new Date(date)
  const now = new Date()
  const diffMs = now - d
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffMins < 1440) return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
}

/**
 * Detect if text is primarily Hindi
 * @param {string} text
 * @returns {'HI' | 'EN'}
 */
export function detectLanguage(text) {
  const hindiPattern = /[\u0900-\u097F]/
  return hindiPattern.test(text) ? 'HI' : 'EN'
}

/**
 * Truncate session title for display
 * @param {string} title
 * @param {number} maxLength
 */
export function truncateTitle(title, maxLength = 40) {
  if (!title) return 'New Conversation'
  return title.length > maxLength ? title.slice(0, maxLength) + '...' : title
}

/** Suggested prompts shown on empty state */
export const SUGGESTED_PROMPTS = [
  {
    icon: '📈',
    text: 'Should I sell my wheat today or wait a few days?',
    hindi: 'क्या मुझे आज गेहूं बेचना चाहिए?',
  },
  {
    icon: '🌾',
    text: 'Which mandi gives best price for onions near Delhi?',
    hindi: 'दिल्ली के पास प्याज के लिए बेस्ट मंडी कौन सी है?',
  },
  {
    icon: '🌧️',
    text: 'How will the rain this week affect tomato prices?',
    hindi: 'इस हफ्ते की बारिश टमाटर के भाव पर कैसे असर करेगी?',
  },
  {
    icon: '💰',
    text: 'What is the MSP for rice and soybean this year?',
    hindi: 'इस साल चावल और सोयाबीन का MSP क्या है?',
  },
  {
    icon: '🚜',
    text: 'Compare prices: Azadpur vs Vashi mandi for potatoes',
    hindi: 'आलू के लिए आजादपुर vs वाशी मंडी में क्या फर्क है?',
  },
  {
    icon: '📊',
    text: 'What is the price trend for cotton in Punjab?',
    hindi: 'पंजाब में कपास का भाव क्या चल रहा है?',
  },
]
