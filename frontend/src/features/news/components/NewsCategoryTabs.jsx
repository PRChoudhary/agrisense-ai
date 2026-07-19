import React from 'react'
import { motion } from 'framer-motion'
import { CATEGORY_FILTERS, IMPACT_FILTERS } from '../utils/newsUtils'
import { cn } from '../../../utils/cn'

export default function NewsCategoryTabs({ activeCategory, activeImpact, onCategoryChange, onImpactChange }) {
  return (
    <div className="space-y-3">
      {/* Category tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {CATEGORY_FILTERS.map(filter => (
          <button
            key={filter.value}
            onClick={() => onCategoryChange(filter.value)}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all border',
              activeCategory === filter.value
                ? filter.value === 'POSITIVE'
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                  : filter.value === 'NEGATIVE'
                    ? 'bg-rose-500/15 border-rose-500/30 text-rose-400'
                    : 'bg-slate-600 border-slate-500 text-white'
                : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white'
            )}
          >
            <span>{filter.icon}</span>
            <span>{filter.label}</span>
          </button>
        ))}

        {/* Separator */}
        <div className="w-px h-6 bg-slate-700 mx-1" />

        {/* Impact filter pills */}
        {IMPACT_FILTERS.map(filter => (
          <button
            key={filter.value}
            onClick={() => onImpactChange(filter.value)}
            className={cn(
              'px-3 py-2 rounded-xl text-xs font-medium transition-all border',
              activeImpact === filter.value
                ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                : 'bg-slate-800/60 border-slate-700 text-slate-500 hover:border-slate-500 hover:text-white'
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  )
}
