import React from 'react'
import { motion } from 'framer-motion'
import { Bell, BellOff, Trash2, TrendingUp, TrendingDown, MapPin } from 'lucide-react'
import { cn } from '../../../utils/cn'

export default function AlertCard({ alert, onToggle, onDelete }) {
  const { priceAlert } = alert
  if (!priceAlert) return null // Guard for other alert types if added later

  const { crop, mandi, threshold, direction } = priceAlert
  const isAbove = direction === 'ABOVE'
  const DirIcon = isAbove ? TrendingUp : TrendingDown
  const color = isAbove ? 'text-emerald-400' : 'text-rose-400'
  const bg = isAbove ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-rose-500/10 border-rose-500/20'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      layout
      className={cn(
        'bg-slate-900 border rounded-2xl p-5 transition-all',
        alert.isActive ? 'border-slate-700 hover:border-slate-500' : 'border-slate-800 opacity-70'
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className={cn('p-2.5 rounded-xl border', bg, alert.isActive ? color : 'text-slate-500 bg-slate-800 border-slate-700')}>
            {alert.isActive ? <Bell size={18} /> : <BellOff size={18} />}
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">{crop.name}</h3>
            {mandi ? (
              <div className="flex items-center gap-1 text-slate-500 text-xs mt-0.5">
                <MapPin size={10} />
                <span>{mandi.name}, {mandi.city}</span>
              </div>
            ) : (
              <span className="text-slate-500 text-xs mt-0.5">All Markets</span>
            )}
          </div>
        </div>

        {/* Toggle Switch */}
        <button
          onClick={() => onToggle(alert.id, !alert.isActive)}
          className={cn(
            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
            alert.isActive ? 'bg-emerald-500' : 'bg-slate-700'
          )}
        >
          <span className={cn(
            'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
            alert.isActive ? 'translate-x-6' : 'translate-x-1'
          )} />
        </button>
      </div>

      <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-400">Notify when price goes</span>
          <span className={cn('flex items-center gap-1 font-bold', alert.isActive ? color : 'text-slate-500')}>
            <DirIcon size={14} />
            {isAbove ? 'Above' : 'Below'}
          </span>
        </div>
        <span className="text-white font-bold text-lg">₹{threshold.toLocaleString('en-IN')}</span>
      </div>

      <div className="mt-4 flex items-center justify-between pt-4 border-t border-slate-800">
        <span className="text-xs text-slate-500">
          Created {new Date(alert.createdAt).toLocaleDateString()}
        </span>
        <button
          onClick={() => onDelete(alert.id)}
          className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
          title="Delete Alert"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </motion.div>
  )
}
