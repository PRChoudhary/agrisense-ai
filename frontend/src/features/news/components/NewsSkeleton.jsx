import React from 'react'

export default function NewsSkeleton({ count = 12 }) {
  return (
    <div className="space-y-6">
      {/* Featured skeleton */}
      <div className="h-52 rounded-3xl bg-slate-800 animate-pulse" />
      {/* Grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: count - 1 }).map((_, i) => (
          <div key={i} className="h-48 rounded-2xl bg-slate-800 animate-pulse" />
        ))}
      </div>
    </div>
  )
}
