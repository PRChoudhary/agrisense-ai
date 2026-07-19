import React from 'react'
import { motion } from 'framer-motion'
import { getDayName } from '../utils/weatherUtils'
import { cn } from '../../../utils/cn'

export default function ForecastRow({ forecast = [] }) {
  if (!forecast.length) return null

  return (
    <div>
      <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
        <span>7-Day Forecast</span>
        <span className="text-slate-600 text-xs font-normal">— scroll to see more</span>
      </h3>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
        {forecast.map((day, i) => (
          <motion.div
            key={day.date}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="flex-shrink-0 w-[90px] bg-slate-800/60 border border-slate-700 rounded-2xl p-3 text-center hover:border-slate-500 transition-colors"
          >
            <p className={cn(
              'text-xs font-semibold mb-2',
              i === 0 ? 'text-emerald-400' : 'text-slate-400'
            )}>
              {getDayName(day.date)}
            </p>
            <div className="text-3xl mb-2">{day.emoji}</div>
            <p className="text-white font-bold text-sm">{day.maxTemp}°</p>
            <p className="text-slate-500 text-xs">{day.minTemp}°</p>
            {day.rainfall > 0 && (
              <p className="text-sky-400 text-[10px] mt-1.5">💧 {day.rainfall}mm</p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
