import React from 'react'
import { motion } from 'framer-motion'
import { SearchX, RefreshCw } from 'lucide-react'

export default function PriceEmptyState({ hasFilters, onReset }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 px-4 text-center"
    >
      <div className="w-20 h-20 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-6">
        <SearchX size={36} className="text-slate-500" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">
        {hasFilters ? 'No prices match your filters' : 'No price data available'}
      </h3>
      <p className="text-slate-400 max-w-md mb-6">
        {hasFilters
          ? 'Try adjusting your crop, state, or mandi filters to find available prices.'
          : 'Price data will appear here once the database is seeded. Make sure the backend is running.'}
      </p>
      {hasFilters && (
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-800 border border-slate-700 hover:border-slate-500 text-white text-sm font-medium transition-all hover:bg-slate-700"
        >
          <RefreshCw size={16} />
          Clear Filters
        </button>
      )}
    </motion.div>
  )
}
