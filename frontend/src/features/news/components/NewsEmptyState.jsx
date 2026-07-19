import React from 'react'
import { Newspaper } from 'lucide-react'

export default function NewsEmptyState({ onClear }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Newspaper size={48} className="text-slate-700 mb-4" />
      <h3 className="text-white font-semibold text-lg mb-2">No articles found</h3>
      <p className="text-slate-400 text-sm mb-5">Try adjusting your filters or search term</p>
      <button
        onClick={onClear}
        className="px-4 py-2 bg-slate-800 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white rounded-xl text-sm font-medium transition-all"
      >
        Clear Filters
      </button>
    </div>
  )
}
