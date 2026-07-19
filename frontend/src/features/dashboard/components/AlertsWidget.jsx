import React from 'react'
import { Link } from 'react-router-dom'
import { Bell, ArrowRight, BellRing } from 'lucide-react'
import { useAlerts } from '../../alerts'

export default function AlertsWidget() {
  const { data: alerts = [], isLoading } = useAlerts()
  const activeAlerts = alerts.filter(a => a.isActive).slice(0, 3)

  if (isLoading) return <div className="h-48 bg-slate-800 rounded-2xl animate-pulse" />

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <Bell size={16} className="text-emerald-400" />
          Active Alerts
        </h3>
        <Link to="/alerts" className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium">
          Manage <ArrowRight size={12} />
        </Link>
      </div>

      {activeAlerts.length > 0 ? (
        <div className="space-y-3 mt-auto">
          {activeAlerts.map((alert) => (
            <div key={alert.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/30 border border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <BellRing size={14} className="text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white line-clamp-1">{alert.name}</p>
                  <p className="text-xs text-slate-500">{alert.priceAlert?.direction === 'ABOVE' ? 'Above' : 'Below'} ₹{alert.priceAlert?.threshold.toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-auto flex flex-col items-center justify-center py-4">
          <Bell size={24} className="text-slate-700 mb-2" />
          <p className="text-sm text-slate-500 mb-2">No active alerts set</p>
          <Link to="/alerts" className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg hover:bg-emerald-500/20 transition-colors">
            Create Alert
          </Link>
        </div>
      )}
    </div>
  )
}
