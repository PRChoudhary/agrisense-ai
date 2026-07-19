import React from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, ArrowRight, BrainCircuit } from 'lucide-react'
import { useTopPredictions } from '../../predictions/hooks/useTopPredictions'

export default function PredictionsWidget() {
  const { data: predictions = [], isLoading } = useTopPredictions()

  if (isLoading) return <div className="h-48 bg-slate-800 rounded-2xl animate-pulse" />

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <BrainCircuit size={16} className="text-purple-400" />
          AI Forecasts
        </h3>
        <Link to="/predictions" className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-medium">
          View All <ArrowRight size={12} />
        </Link>
      </div>

      <div className="space-y-3 mt-auto">
        {predictions.slice(0, 3).map((pred) => (
          <Link key={pred.id} to="/predictions" className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-700/50">
            <div>
              <p className="text-sm font-semibold text-white">{pred.crop?.name}</p>
              <p className="text-xs text-slate-500">{pred.recommendation}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-white">₹{pred.predictedPrice.toLocaleString()}</p>
              <p className={`text-xs font-medium flex items-center justify-end gap-0.5 ${pred.trendDirection === 'UP' ? 'text-emerald-400' : 'text-rose-400'}`}>
                <TrendingUp size={10} className={pred.trendDirection === 'DOWN' ? 'rotate-180' : ''} />
                {Math.abs(pred.trendPercentage).toFixed(1)}%
              </p>
            </div>
          </Link>
        ))}
        {predictions.length === 0 && <p className="text-sm text-slate-500">No predictions available</p>}
      </div>
    </div>
  )
}
