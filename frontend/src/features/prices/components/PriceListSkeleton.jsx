import React from 'react'

function PriceCardSkeleton() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-2">
          <div className="h-4 w-28 bg-slate-700 rounded" />
          <div className="h-3 w-40 bg-slate-800 rounded" />
        </div>
        <div className="h-6 w-20 bg-slate-700 rounded-full" />
      </div>
      <div className="h-8 w-32 bg-slate-700 rounded mb-1" />
      <div className="h-3 w-24 bg-slate-800 rounded mb-4" />
      <div className="h-8 bg-slate-800 rounded mb-4" />
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[1,2,3].map(i => (
          <div key={i} className="h-12 bg-slate-800 rounded-xl" />
        ))}
      </div>
      <div className="flex justify-between pt-3 border-t border-slate-800">
        <div className="h-3 w-20 bg-slate-800 rounded" />
        <div className="h-3 w-16 bg-slate-800 rounded" />
      </div>
    </div>
  )
}

export default function PriceListSkeleton({ count = 12 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <PriceCardSkeleton key={i} />
      ))}
    </div>
  )
}
