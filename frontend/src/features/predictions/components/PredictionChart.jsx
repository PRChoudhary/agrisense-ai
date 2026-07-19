import React from 'react'
import {
  ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer, Legend
} from 'recharts'
import { formatChartPrice } from '../utils/predictionUtils'

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null

  const entry = payload[0]?.payload
  const isActual = entry?.type === 'actual'

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-3 shadow-xl">
      <p className="text-slate-400 text-xs mb-2">{label}</p>
      {payload.map(p => {
        if (p.dataKey === 'confidence_band') return null
        return (
          <div key={p.dataKey} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-slate-300 text-xs">{p.name}:</span>
            <span className="text-white font-semibold text-xs">{formatChartPrice(p.value)}</span>
          </div>
        )
      })}
      {!isActual && entry?.low && entry?.high && (
        <p className="text-slate-500 text-xs mt-1.5">
          Range: {formatChartPrice(entry.low)} – {formatChartPrice(entry.high)}
        </p>
      )}
      {!isActual && <p className="text-amber-400 text-[10px] mt-1">AI Prediction</p>}
    </div>
  )
}

export default function PredictionChart({ historicalPrices = [], predictions = [], mspPrice, currentPrice }) {
  // Build unified chart data
  // Historical: last 14 days
  const histData = historicalPrices.slice(-14).map(d => ({
    date: new Date(d.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
    actual: d.price,
    type: 'actual',
  }))

  // Predictions: next 7 days — include the last actual price as connection point
  const lastActual = historicalPrices[historicalPrices.length - 1]
  const predData = [
    // Bridge point: last actual price also shown as predicted (smooth connection)
    lastActual ? {
      date: new Date(lastActual.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      predicted: lastActual.price,
      low: lastActual.price,
      high: lastActual.price,
      type: 'bridge',
    } : null,
    ...predictions.map(p => ({
      date: new Date(p.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      predicted: p.price,
      low: p.low,
      high: p.high,
      type: 'predicted',
    }))
  ].filter(Boolean)

  // Merge: historical first, then predictions (some overlap at bridge)
  const chartData = [
    ...histData,
    ...predData.slice(1), // Skip bridge (already in histData)
  ]

  // Add bridge predicted value to last historical point
  if (chartData.length > 0 && predData.length > 0) {
    chartData[histData.length - 1] = {
      ...chartData[histData.length - 1],
      predicted: lastActual?.price,
      low: lastActual?.price,
      high: lastActual?.price,
    }
  }

  const minPrice = Math.min(
    ...chartData.filter(d => d.actual || d.predicted).map(d => Math.min(d.actual || Infinity, d.predicted || Infinity, d.low || Infinity)),
    mspPrice || Infinity
  ) * 0.95

  const maxPrice = Math.max(
    ...chartData.filter(d => d.actual || d.predicted).map(d => Math.max(d.actual || 0, d.predicted || 0, d.high || 0)),
    mspPrice || 0
  ) * 1.05

  const splitIndex = histData.length - 1 // Divider line between historical and predicted
  const splitDate = chartData[splitIndex]?.date

  return (
    <div className="w-full">
      {/* Chart legend */}
      <div className="flex flex-wrap items-center gap-4 mb-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-0.5 bg-emerald-400 rounded" />
          <span className="text-slate-400">Actual Price</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-0.5 bg-amber-400 rounded border-dashed" style={{borderTop: '2px dashed #f59e0b', background: 'none'}} />
          <span className="text-slate-400">AI Prediction</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded" style={{background: 'rgba(251,191,36,0.15)'}} />
          <span className="text-slate-400">Confidence Band</span>
        </div>
        {mspPrice && (
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-px bg-rose-400" style={{borderTop: '1px dashed #f87171'}} />
            <span className="text-slate-400">MSP ₹{mspPrice?.toLocaleString('en-IN')}</span>
          </div>
        )}
      </div>

      <ResponsiveContainer width="100%" height={340}>
        <ComposedChart data={chartData} margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="date"
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            interval={2}
          />
          <YAxis
            tickFormatter={v => `₹${(v/1000).toFixed(1)}k`}
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            domain={[minPrice, maxPrice]}
            width={60}
          />
          <Tooltip content={<CustomTooltip />} />

          {/* Confidence band (area between low and high) */}
          <Area
            dataKey="high"
            stroke="transparent"
            fill="rgba(251, 191, 36, 0.1)"
            fillOpacity={1}
            isAnimationActive
          />
          <Area
            dataKey="low"
            stroke="transparent"
            fill="rgba(15, 23, 42, 1)" // Cuts out the band bottom
            fillOpacity={1}
          />

          {/* MSP reference line */}
          {mspPrice && (
            <ReferenceLine
              y={mspPrice}
              stroke="#f87171"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{ value: 'MSP', fill: '#f87171', fontSize: 10, position: 'insideTopRight' }}
            />
          )}

          {/* Today divider */}
          {splitDate && (
            <ReferenceLine
              x={splitDate}
              stroke="rgba(255,255,255,0.15)"
              strokeDasharray="4 4"
              label={{ value: 'Today', fill: '#94a3b8', fontSize: 10, position: 'insideTopLeft' }}
            />
          )}

          {/* Actual price line */}
          <Line
            dataKey="actual"
            name="Actual"
            stroke="#34d399"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4, fill: '#34d399' }}
            connectNulls={false}
          />

          {/* Predicted price line — dashed amber */}
          <Line
            dataKey="predicted"
            name="Predicted"
            stroke="#f59e0b"
            strokeWidth={2.5}
            strokeDasharray="6 3"
            dot={false}
            activeDot={{ r: 4, fill: '#f59e0b' }}
            connectNulls
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
