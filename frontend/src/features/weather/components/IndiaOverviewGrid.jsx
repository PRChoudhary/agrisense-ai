import React from 'react'
import { motion } from 'framer-motion'
import RiskBadge from './RiskBadge'
import { cn } from '../../../utils/cn'

export default function IndiaOverviewGrid({ cities = [], onCityClick, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-slate-800 animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      {cities.map((city, i) => (
        <motion.button
          key={city.location || i}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onCityClick(city)}
          className="text-left bg-slate-800/60 border border-slate-700 hover:border-slate-500 rounded-2xl p-4 transition-all"
        >
          <div className="flex items-start justify-between mb-2">
            <p className="text-white font-semibold text-sm truncate pr-1">{city.location}</p>
            <span className="text-xl shrink-0">
              {city.condition === 'Clear' ? '☀️' :
               city.condition === 'Rain' ? '🌧️' :
               city.condition === 'Thunderstorm' ? '⛈️' :
               city.condition?.includes('Cloud') ? '⛅' : '🌡️'}
            </span>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{city.temperature}°</p>
          <p className="text-slate-500 text-xs truncate">{city.condition}</p>
          <div className="mt-2">
            <RiskBadge level={city.riskLevel} size="sm" />
          </div>
        </motion.button>
      ))}
    </div>
  )
}
