import React, { useState } from 'react'
import { Search, X } from 'lucide-react'

export default function NewsSearchBar({ onSearch, isLoading }) {
  const [value, setValue] = useState('')

  const handleChange = (e) => {
    setValue(e.target.value)
    onSearch(e.target.value)
  }

  const handleClear = () => {
    setValue('')
    onSearch('')
  }

  return (
    <div className="flex items-center gap-3 bg-slate-800/80 border border-slate-700 focus-within:border-emerald-500/40 rounded-2xl px-4 py-3 transition-all">
      {isLoading
        ? <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin shrink-0" />
        : <Search size={16} className="text-slate-500 shrink-0" />
      }
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Search news about wheat, onion, MSP, mandi..."
        className="flex-1 bg-transparent text-white placeholder:text-slate-500 text-sm focus:outline-none"
      />
      {value && (
        <button onClick={handleClear} className="text-slate-500 hover:text-white transition-colors">
          <X size={15} />
        </button>
      )}
    </div>
  )
}
