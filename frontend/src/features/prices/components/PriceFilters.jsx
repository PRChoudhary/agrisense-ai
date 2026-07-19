import React, { useState } from 'react'
import { Search, Filter, X, ChevronDown } from 'lucide-react'
import { cn } from '../../../utils/cn'
import { useCrops } from '../hooks/useCrops'
import { useMandis } from '../hooks/useMandis'
import { INDIAN_STATES } from '../../../utils/constants'

export default function PriceFilters({ filters, onUpdate, onReset, hasActiveFilters }) {
  const [showMore, setShowMore] = useState(false)
  
  const { data: crops = [] } = useCrops()
  const { data: mandis = [] } = useMandis({ state: filters.state })

  const FilterSelect = ({ label, value, onChange, options, placeholder }) => (
    <div className="flex-1 min-w-[140px]">
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            'w-full appearance-none bg-slate-900 border rounded-xl px-4 py-2.5 text-sm transition-all pr-8',
            value
              ? 'border-emerald-500/40 text-white'
              : 'border-slate-700 text-slate-400'
          )}
        >
          <option value="">{placeholder || label}</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
      </div>
    </div>
  )

  const cropOptions = crops.map(c => ({ value: c.id, label: `${c.name}${c.nameHindi ? ' ('+c.nameHindi+')' : ''}` }))
  const stateOptions = INDIAN_STATES.map(s => ({ value: s, label: s }))
  const mandiOptions = mandis.map(m => ({ value: m.id, label: `${m.name} — ${m.city}` }))

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 mb-6">
      {/* Search bar row */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search crop, mandi, state..."
            value={filters.search}
            onChange={(e) => onUpdate('search', e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
          {filters.search && (
            <button onClick={() => onUpdate('search', '')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Crop dropdown */}
        <FilterSelect
          label="All Crops"
          value={filters.cropId}
          onChange={(v) => onUpdate('cropId', v)}
          options={cropOptions}
          placeholder="All Crops"
        />

        {/* State dropdown */}
        <FilterSelect
          label="All States"
          value={filters.state}
          onChange={(v) => { onUpdate('state', v); onUpdate('mandiId', '') }}
          options={stateOptions}
          placeholder="All States"
        />

        {/* Mandi dropdown — shows only after state selected */}
        {filters.state && (
          <FilterSelect
            label="All Mandis"
            value={filters.mandiId}
            onChange={(v) => onUpdate('mandiId', v)}
            options={mandiOptions}
            placeholder="All Mandis"
          />
        )}

        {/* Clear filters */}
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 text-sm font-medium transition-all"
          >
            <X size={14} />
            Clear
          </button>
        )}
      </div>

      {/* Active filter chips */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap mt-3 pt-3 border-t border-slate-800">
          <span className="text-slate-500 text-xs flex items-center gap-1"><Filter size={11} /> Active:</span>
          {filters.cropId && crops.find(c => c.id === filters.cropId) && (
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium flex items-center gap-1.5">
              {crops.find(c => c.id === filters.cropId)?.name}
              <button onClick={() => onUpdate('cropId', '')}><X size={10} /></button>
            </span>
          )}
          {filters.state && (
            <span className="px-2.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-medium flex items-center gap-1.5">
              {filters.state}
              <button onClick={() => onUpdate('state', '')}><X size={10} /></button>
            </span>
          )}
          {filters.search && (
            <span className="px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium flex items-center gap-1.5">
              "{filters.search}"
              <button onClick={() => onUpdate('search', '')}><X size={10} /></button>
            </span>
          )}
        </div>
      )}
    </div>
  )
}
