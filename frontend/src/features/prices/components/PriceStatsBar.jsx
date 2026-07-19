import React from 'react'
import { TrendingUp, TrendingDown, Minus, BarChart2 } from 'lucide-react'
import { formatPrice } from '../utils/priceUtils'

export default function PriceStatsBar({ prices = [], isLoading }) {
  if (isLoading || !prices.length) return null

  const modalPrices = prices.map(p => p.modalPrice).filter(Boolean)
  const avgPrice = modalPrices.reduce((a, b) => a + b, 0) / modalPrices.length
  const maxPrice = Math.max(...modalPrices)
  const minPrice = Math.min(...modalPrices)
  const totalArrival = prices.reduce((a, b) => a + (b.arrivalQuantity || 0), 0)

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      {[
        { label: 'Avg Price', value: formatPrice(Math.round(avgPrice)), icon: BarChart2, color: 'text-sky-400' },
        { label: 'Highest', value: formatPrice(maxPrice), icon: TrendingUp, color: 'text-emerald-400' },
        { label: 'Lowest', value: formatPrice(minPrice), icon: TrendingDown, color: 'text-rose-400' },
        { label: 'Total Arrival', value: `${totalArrival.toLocaleString('en-IN')} qt`, icon: Minus, color: 'text-amber-400' },
      ].map(({ label, value, icon: Icon, color }) => (
        <div key={label} className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Icon size={14} className={color} />
            <span className="text-slate-500 text-xs font-medium">{label}</span>
          </div>
          <p className={`text-lg font-bold ${color}`}>{value}</p>
        </div>
      ))}
    </div>
  )
}
