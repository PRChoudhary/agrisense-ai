import React from 'react'

export default function PredictionSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="h-44 rounded-2xl bg-slate-800" />
      <div className="h-80 rounded-2xl bg-slate-800" />
      <div className="h-40 rounded-2xl bg-slate-800" />
    </div>
  )
}
