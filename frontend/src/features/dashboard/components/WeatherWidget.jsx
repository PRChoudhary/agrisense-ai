import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { CloudSun, ArrowRight, Droplets, Wind } from 'lucide-react'
import { useWeather } from '../../weather'

export default function WeatherWidget() {
  const { data, isLoading } = useWeather()
  
  if (isLoading) return <div className="h-48 bg-slate-800 rounded-2xl animate-pulse" />
  
  const current = data?.current

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col h-full relative overflow-hidden group">
      <div className="absolute -right-6 -top-6 text-sky-500/10 transition-transform group-hover:scale-110 group-hover:rotate-12">
        <CloudSun size={120} />
      </div>
      
      <div className="flex items-center justify-between mb-4 relative">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <CloudSun size={16} className="text-sky-400" />
          Local Weather
        </h3>
        <Link to="/weather" className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium transition-colors">
          Full Forecast <ArrowRight size={12} />
        </Link>
      </div>

      {current ? (
        <div className="mt-auto relative">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-4xl font-bold text-white">{Math.round(current.temperature)}°</span>
            <span className="text-slate-400">{current.condition}</span>
          </div>
          <p className="text-sm text-slate-500 mb-4">{current.location}</p>
          
          <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
            <div className="flex items-center gap-1 bg-slate-800/80 px-2 py-1 rounded-md">
              <Droplets size={12} className="text-blue-400" /> {current.humidity}%
            </div>
            <div className="flex items-center gap-1 bg-slate-800/80 px-2 py-1 rounded-md">
              <Wind size={12} className="text-teal-400" /> {current.windSpeed} km/h
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-auto text-sm text-slate-500">Weather data unavailable</div>
      )}
    </div>
  )
}
