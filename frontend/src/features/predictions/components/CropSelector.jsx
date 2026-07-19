import React, { useState } from 'react'
import { Wheat, Search, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../../utils/cn'

export default function CropSelector({ crops = [], selectedCropId, onSelect, isLoading }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const selected = crops.find(c => c.value === selectedCropId)
  const filtered = crops.filter(c =>
    c.label.toLowerCase().includes(search.toLowerCase()) ||
    (c.hindi && c.hindi.includes(search))
  )

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 w-full bg-slate-800/80 border border-slate-700 hover:border-slate-500 rounded-2xl px-4 py-3 transition-all"
      >
        <Wheat size={18} className="text-emerald-400 shrink-0" />
        <span className="flex-1 text-left">
          {isLoading ? (
            <span className="text-slate-500 text-sm">Loading crops...</span>
          ) : selected ? (
            <>
              <span className="text-white font-medium text-sm">{selected.label}</span>
              {selected.hindi && <span className="text-slate-500 text-xs ml-2">{selected.hindi}</span>}
              {selected.msp && <span className="text-slate-600 text-xs ml-2">MSP ₹{selected.msp?.toLocaleString('en-IN')}</span>}
            </>
          ) : (
            <span className="text-slate-500 text-sm">Select a crop to predict prices...</span>
          )}
        </span>
        <ChevronDown size={16} className={cn('text-slate-400 transition-transform', open && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 left-0 right-0 z-50 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Search */}
            <div className="p-3 border-b border-slate-700">
              <div className="flex items-center gap-2 bg-slate-700/50 rounded-xl px-3 py-2">
                <Search size={14} className="text-slate-400" />
                <input
                  autoFocus
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search crops..."
                  className="flex-1 bg-transparent text-white text-sm placeholder:text-slate-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Options */}
            <div className="max-h-64 overflow-y-auto">
              {filtered.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-4">No crops found</p>
              ) : (
                filtered.map(crop => (
                  <button
                    key={crop.value}
                    onClick={() => { onSelect(crop.value); setOpen(false); setSearch('') }}
                    className={cn(
                      'w-full flex items-center justify-between px-4 py-3 hover:bg-slate-700/50 transition-colors text-left',
                      crop.value === selectedCropId && 'bg-emerald-500/10 text-emerald-400'
                    )}
                  >
                    <div>
                      <span className="text-white text-sm font-medium">{crop.label}</span>
                      {crop.hindi && <span className="text-slate-500 text-xs ml-2">{crop.hindi}</span>}
                    </div>
                    {crop.msp && (
                      <span className="text-slate-500 text-xs">MSP ₹{crop.msp?.toLocaleString('en-IN')}</span>
                    )}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
