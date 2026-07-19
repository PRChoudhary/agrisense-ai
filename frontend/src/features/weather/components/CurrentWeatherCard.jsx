import React from 'react'
import { motion } from 'framer-motion'
import { Droplets, Wind, Thermometer, Eye, Gauge } from 'lucide-react'
import { getConditionGradient, getConditionBorder } from '../utils/weatherUtils'
import RiskBadge from './RiskBadge'
import { cn } from '../../../utils/cn'

export default function CurrentWeatherCard({ weather }) {
  if (!weather) return null

  const gradient = getConditionGradient(weather.bg)
  const border = getConditionBorder(weather.bg)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        'relative overflow-hidden rounded-3xl border p-8',
        `bg-gradient-to-br ${gradient}`,
        border,
        'bg-slate-900/80'
      )}
    >
      {/* Background emoji watermark */}
      <div className="absolute -right-4 -top-4 text-[120px] opacity-10 select-none pointer-events-none">
        {weather.emoji}
      </div>

      {/* Location */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white">{weather.location}</h2>
          {weather.state && <p className="text-slate-400 text-sm mt-0.5">{weather.state}, India</p>}
          <p className="text-slate-500 text-xs mt-1">
            Updated {weather.recordedAt
              ? new Date(weather.recordedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
              : 'just now'}
            {weather.isMockData && ' (Demo data)'}
          </p>
        </div>
        <RiskBadge level={weather.riskLevel} score={weather.riskScore} showScore />
      </div>

      {/* Main temperature */}
      <div className="flex items-end gap-4 mb-8">
        <div>
          <div className="flex items-start">
            <span className="text-8xl font-thin text-white leading-none">{weather.temperature}</span>
            <span className="text-3xl text-slate-400 mt-4">°C</span>
          </div>
          <p className="text-slate-400 text-lg capitalize mt-1">{weather.conditionDesc || weather.condition}</p>
          {weather.feelsLike !== undefined && (
            <p className="text-slate-500 text-sm">Feels like {weather.feelsLike}°C</p>
          )}
        </div>
        <div className="text-6xl mb-2">{weather.emoji}</div>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: Droplets, label: 'Humidity', value: `${weather.humidity}%`, color: 'text-sky-400' },
          { icon: Wind, label: 'Wind', value: `${weather.windSpeed} km/h`, color: 'text-emerald-400' },
          { icon: Thermometer, label: 'Rainfall', value: `${weather.rainfall}mm`, color: 'text-blue-400' },
          { icon: Gauge, label: 'Pressure', value: weather.pressure ? `${weather.pressure} hPa` : 'N/A', color: 'text-purple-400' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-slate-800/50 rounded-2xl p-3 border border-slate-700/50">
            <div className="flex items-center gap-1.5 mb-1">
              <Icon size={13} className={color} />
              <span className="text-slate-500 text-xs">{label}</span>
            </div>
            <p className={cn('font-semibold text-sm', color)}>{value}</p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
