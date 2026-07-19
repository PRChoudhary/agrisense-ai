import React, { useState } from 'react'
import { Database, ChevronDown, TrendingUp, CloudSun, Newspaper } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ContextBadge() {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium hover:bg-emerald-500/20 transition-all"
      >
        <Database size={12} />
        AI has live market access
        <ChevronDown size={12} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 left-0 z-50 w-72 bg-slate-800 border border-slate-700 rounded-xl p-4 shadow-2xl"
          >
            <p className="text-white text-sm font-semibold mb-3">AgriSense AI can access:</p>
            <div className="space-y-2.5">
              {[
                { icon: TrendingUp, color: 'text-emerald-400', title: 'Live Mandi Prices', desc: 'Real-time prices from 500+ APMCs' },
                { icon: CloudSun, color: 'text-sky-400', title: 'Weather Data', desc: 'Temperature, rainfall, risk levels' },
                { icon: Newspaper, color: 'text-amber-400', title: 'MSP Data', desc: 'Govt. minimum support prices 2024-25' },
                { icon: Database, color: 'text-purple-400', title: 'Market History', desc: 'Price trends for past 30 days' },
              ].map(({ icon: Icon, color, title, desc }) => (
                <div key={title} className="flex items-start gap-3">
                  <Icon size={14} className={`${color} mt-0.5 shrink-0`} />
                  <div>
                    <p className="text-white text-xs font-medium">{title}</p>
                    <p className="text-slate-400 text-xs">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
