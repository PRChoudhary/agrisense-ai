import React from 'react'
import { motion } from 'framer-motion'

/**
 * Mini sparkline bar chart for price trend visualization
 * @param {{ values: number[], color?: string }} props
 */
export default function PriceTrendMini({ values = [], color = 'emerald' }) {
  if (!values.length) {
    // Show placeholder bars
    values = [60, 45, 70, 55, 80, 65, 75]
  }
  
  const max = Math.max(...values)
  const min = Math.min(...values)
  const range = max - min || 1
  
  const colorMap = {
    emerald: 'bg-emerald-400',
    rose: 'bg-rose-400',
    amber: 'bg-amber-400',
    sky: 'bg-sky-400',
  }
  
  const lastVal = values[values.length - 1]
  const prevVal = values[values.length - 2]
  const trend = lastVal > prevVal ? 'emerald' : lastVal < prevVal ? 'rose' : 'amber'
  const barColor = colorMap[trend] || colorMap.emerald

  return (
    <div className="flex items-end gap-0.5 h-8">
      {values.slice(-7).map((val, i) => {
        const height = ((val - min) / range) * 100
        const isLast = i === Math.min(values.length, 7) - 1
        return (
          <motion.div
            key={i}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: i * 0.04, duration: 0.3 }}
            style={{ height: `${Math.max(15, height)}%` }}
            className={`flex-1 rounded-sm origin-bottom ${
              isLast ? barColor : 'bg-slate-700'
            }`}
          />
        )
      })}
    </div>
  )
}
