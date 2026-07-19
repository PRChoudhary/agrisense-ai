import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MapPin, X } from 'lucide-react'
import { QUICK_CITIES } from '../utils/weatherUtils'

export default function CitySearch({ onSearch, currentCity, isLoading }) {
  const [input, setInput] = useState('')
  const [focused, setFocused] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim()) {
      onSearch({ city: input.trim() })
      setFocused(false)
    }
  }

  const handleQuickCity = (c) => {
    setInput(c.name)
    onSearch({ city: c.name, state: c.state })
    setFocused(false)
  }

  return (
    <div className="relative">
      <form onSubmit={handleSubmit}>
        <div className={`flex items-center gap-3 bg-slate-800/80 border rounded-2xl px-4 py-3 transition-all ${
          focused ? 'border-emerald-500/50' : 'border-slate-700'
        }`}>
          <Search size={18} className="text-slate-500 shrink-0" />
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 200)}
            placeholder="Search city or district..."
            className="flex-1 bg-transparent text-white placeholder:text-slate-500 text-sm focus:outline-none"
          />
          {currentCity && (
            <div className="flex items-center gap-1.5 text-slate-400 text-xs shrink-0">
              <MapPin size={12} className="text-emerald-400" />
              <span>{currentCity}</span>
            </div>
          )}
          {isLoading && (
            <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin shrink-0" />
          )}
        </div>
      </form>

      {/* Quick city pills */}
      <div className="flex flex-wrap gap-2 mt-3">
        {QUICK_CITIES.map(c => (
          <button
            key={c.name}
            onClick={() => handleQuickCity(c)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all border ${
              currentCity === c.name
                ? 'bg-emerald-600 border-emerald-500 text-white'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>
    </div>
  )
}
