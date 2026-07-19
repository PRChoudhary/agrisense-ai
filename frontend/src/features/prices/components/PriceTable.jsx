import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import { formatPrice, formatQty, getSellScoreInfo, calculateSellScore } from '../utils/priceUtils'
import { cn } from '../../../utils/cn'

const COLUMNS = [
  { key: 'crop.name', label: 'Crop', sortable: false },
  { key: 'mandi.name', label: 'Mandi', sortable: false },
  { key: 'modalPrice', label: 'Price', sortable: true },
  { key: 'minPrice', label: 'Min', sortable: true },
  { key: 'maxPrice', label: 'Max', sortable: true },
  { key: 'arrivalQuantity', label: 'Arrival', sortable: true },
  { key: 'sellScore', label: 'Sell Score', sortable: false },
  { key: 'date', label: 'Date', sortable: true },
]

export default function PriceTable({ prices = [], onSort, sortBy, sortOrder }) {
  const handleSort = (key) => {
    if (!onSort) return
    if (sortBy === key) {
      onSort(key, sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      onSort(key, 'desc')
    }
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-800">
      <table className="w-full min-w-[800px]">
        <thead>
          <tr className="bg-slate-900 border-b border-slate-800">
            {COLUMNS.map(col => (
              <th
                key={col.key}
                className={cn(
                  'px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap',
                  col.sortable && 'cursor-pointer hover:text-white select-none'
                )}
                onClick={() => col.sortable && handleSort(col.key)}
              >
                <div className="flex items-center gap-1">
                  {col.label}
                  {col.sortable && (
                    <span className="text-slate-600">
                      {sortBy === col.key
                        ? sortOrder === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                        : <ChevronsUpDown size={12} />}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/50">
          {prices.map((price, i) => {
            const score = calculateSellScore(price.modalPrice, price.minPrice, price.maxPrice)
            const scoreInfo = getSellScoreInfo(score)
            return (
              <motion.tr
                key={price.id || i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.02 }}
                className="bg-slate-900/30 hover:bg-slate-800/40 transition-colors"
              >
                <td className="px-4 py-3">
                  <div>
                    <p className="text-white font-medium text-sm">{price.crop?.name}</p>
                    {price.crop?.nameHindi && <p className="text-slate-500 text-xs">{price.crop.nameHindi}</p>}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="text-slate-300 text-sm">{price.mandi?.name}</p>
                  <p className="text-slate-500 text-xs">{price.mandi?.state?.name}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-white font-bold">{formatPrice(price.modalPrice)}</p>
                </td>
                <td className="px-4 py-3 text-rose-400 text-sm">{formatPrice(price.minPrice)}</td>
                <td className="px-4 py-3 text-emerald-400 text-sm">{formatPrice(price.maxPrice)}</td>
                <td className="px-4 py-3 text-amber-400 text-sm">{formatQty(price.arrivalQuantity)}</td>
                <td className="px-4 py-3">
                  <span className={cn('px-2.5 py-1 rounded-full text-xs font-bold border', scoreInfo.bg, scoreInfo.color)}>
                    {scoreInfo.label}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                  {new Date(price.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                </td>
              </motion.tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
