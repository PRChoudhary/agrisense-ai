import React from 'react'
import { BellRing } from 'lucide-react'

export default function AlertsEmptyState({ onCreateClick }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-900 border border-slate-800 rounded-3xl">
      <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-4">
        <BellRing size={28} className="text-emerald-400" />
      </div>
      <h3 className="text-white font-semibold text-lg mb-2">No Active Alerts</h3>
      <p className="text-slate-400 text-sm mb-6 max-w-sm">
        Set up smart alerts to get notified instantly when crop prices cross your target thresholds.
      </p>
      <button
        onClick={onCreateClick}
        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-emerald-500/20"
      >
        Create First Alert
      </button>
    </div>
  )
}
