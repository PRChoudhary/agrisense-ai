import React from 'react'
import { motion } from 'framer-motion'
import { Brain, AlertTriangle, CheckCircle, Leaf } from 'lucide-react'
import { getRiskStyle } from '../utils/weatherUtils'
import { cn } from '../../../utils/cn'

export default function FarmingRiskCard({ weather }) {
  if (!weather) return null

  const style = getRiskStyle(weather.riskLevel)
  const riskFactors = weather.riskFactors || []

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-slate-900 border border-slate-800 rounded-2xl p-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Leaf size={16} className="text-emerald-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">Farming Risk Assessment</h3>
            <p className="text-slate-500 text-xs">AI-powered advisory</p>
          </div>
        </div>
        {/* Risk meter */}
        <div className="text-right">
          <p className={cn('text-2xl font-bold', style.color)}>{weather.riskScore}</p>
          <p className="text-slate-500 text-xs">/ 100</p>
        </div>
      </div>

      {/* Risk score bar */}
      <div className="mb-4">
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${weather.riskScore}%` }}
            transition={{ duration: 1, delay: 0.3 }}
            className={cn(
              'h-full rounded-full',
              weather.riskLevel === 'low' ? 'bg-emerald-500' :
              weather.riskLevel === 'medium' ? 'bg-amber-500' :
              weather.riskLevel === 'high' ? 'bg-orange-500' : 'bg-rose-500'
            )}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-600 mt-1">
          <span>Low Risk</span>
          <span>Critical</span>
        </div>
      </div>

      {/* Risk factors */}
      {riskFactors.length > 0 && (
        <div className="mb-4">
          <p className="text-slate-500 text-xs font-medium mb-2">RISK FACTORS</p>
          <div className="space-y-1.5">
            {riskFactors.map((factor, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <AlertTriangle size={13} className="text-amber-400 mt-0.5 shrink-0" />
                <span className="text-slate-300">{factor}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Summary */}
      {weather.aiSummary && (
        <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Brain size={13} className="text-emerald-400" />
            <span className="text-emerald-400 text-xs font-semibold">AI Farming Advisory</span>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">{weather.aiSummary}</p>
        </div>
      )}
    </motion.div>
  )
}
