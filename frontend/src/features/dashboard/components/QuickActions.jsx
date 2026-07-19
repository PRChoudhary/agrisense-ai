import React from 'react'
import { Link } from 'react-router-dom'
import { Bot, MapPin, TrendingUp, Bell } from 'lucide-react'

export default function QuickActions() {
  const actions = [
    { name: 'Ask AI Copilot', icon: Bot, path: '/copilot', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20 hover:bg-purple-500/20 hover:border-purple-500/40' },
    { name: 'Check Live Prices', icon: MapPin, path: '/prices', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20 hover:border-emerald-500/40' },
    { name: 'Price Forecasts', icon: TrendingUp, path: '/predictions', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20 hover:border-blue-500/40' },
    { name: 'Set Smart Alert', icon: Bell, path: '/alerts', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20 hover:border-amber-500/40' },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      {actions.map((action, i) => (
        <Link
          key={i}
          to={action.path}
          className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${action.bg}`}
        >
          <div className={`p-2 rounded-xl bg-slate-900/50 ${action.color}`}>
            <action.icon size={18} />
          </div>
          <span className="font-semibold text-white text-sm">{action.name}</span>
        </Link>
      ))}
    </div>
  )
}
