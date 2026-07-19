import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { LayoutGrid, List, Download, RefreshCw, TrendingUp, AlertCircle } from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'
import {
  PriceCard, PriceFilters, PriceTable, PriceListSkeleton,
  PriceEmptyState, PriceStatsBar, usePrices, usePriceFilters, exportPricesToCSV
} from '../features/prices'
import { cn } from '../utils/cn'

export default function PricesPage() {
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'table'
  const [isExporting, setIsExporting] = useState(false)

  const { filters, activeParams, updateFilter, resetFilters, setPage, hasActiveFilters } = usePriceFilters()
  
  const { data, isLoading, isError, error, isFetching, refetch } = usePrices(activeParams)
  
  const prices = data?.data || []
  const meta = data?.meta

  const handleExport = async () => {
    setIsExporting(true)
    try {
      // Export all currently filtered prices
      exportPricesToCSV(
        prices,
        `agrisense-prices-${new Date().toISOString().split('T')[0]}.csv`
      )
    } finally {
      setIsExporting(false)
    }
  }

  const handleSort = (sortBy, sortOrder) => {
    updateFilter('sortBy', sortBy)
    updateFilter('sortOrder', sortOrder)
  }

  // Page actions (shown in PageWrapper header)
  const pageActions = (
    <div className="flex items-center gap-3">
      {/* Refresh button */}
      <button
        onClick={() => refetch()}
        disabled={isFetching}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white text-sm font-medium transition-all disabled:opacity-50"
      >
        <RefreshCw size={15} className={isFetching ? 'animate-spin' : ''} />
        {isFetching ? 'Updating...' : 'Refresh'}
      </button>

      {/* Export CSV */}
      <button
        onClick={handleExport}
        disabled={isExporting || !prices.length}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-all disabled:opacity-50 shadow-sm"
      >
        <Download size={15} />
        Export CSV
      </button>

      {/* View toggle */}
      <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl p-1">
        <button
          onClick={() => setViewMode('grid')}
          className={cn('p-1.5 rounded-lg transition-all', viewMode === 'grid' ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white')}
        >
          <LayoutGrid size={16} />
        </button>
        <button
          onClick={() => setViewMode('table')}
          className={cn('p-1.5 rounded-lg transition-all', viewMode === 'table' ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white')}
        >
          <List size={16} />
        </button>
      </div>
    </div>
  )

  return (
    <PageWrapper
      title="Live Market Prices"
      subtitle={meta ? `Showing ${prices.length} of ${meta.total} price records across India` : 'Real-time prices from 500+ APMC mandis'}
      actions={pageActions}
      icon={TrendingUp}
    >
      {/* Filter Bar */}
      <PriceFilters
        filters={filters}
        onUpdate={updateFilter}
        onReset={resetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Stats summary bar */}
      <PriceStatsBar prices={prices} isLoading={isLoading} />

      {/* Error state */}
      {isError && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-4 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 mb-6"
        >
          <AlertCircle size={20} className="shrink-0" />
          <div>
            <p className="font-medium">Failed to load prices</p>
            <p className="text-sm text-rose-400/70">{error?.message || 'Unable to connect to the server. Make sure the backend is running.'}</p>
          </div>
          <button onClick={() => refetch()} className="ml-auto px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 rounded-xl text-sm font-medium transition-all">
            Retry
          </button>
        </motion.div>
      )}

      {/* Loading */}
      {isLoading ? (
        <PriceListSkeleton count={12} />
      ) : prices.length === 0 ? (
        <PriceEmptyState hasFilters={hasActiveFilters} onReset={resetFilters} />
      ) : (
        <>
          {/* Content */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {prices.map((price, i) => (
                <PriceCard key={price.id || i} price={price} index={i} />
              ))}
            </div>
          ) : (
            <PriceTable
              prices={prices}
              onSort={handleSort}
              sortBy={filters.sortBy}
              sortOrder={filters.sortOrder}
            />
          )}

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-800">
              <p className="text-slate-500 text-sm">
                Page {meta.page} of {meta.totalPages} · {meta.total} total records
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(meta.page - 1)}
                  disabled={!meta.hasPrevPage}
                  className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white disabled:opacity-40 hover:border-slate-500 transition-all"
                >
                  ← Previous
                </button>
                {/* Page numbers */}
                {Array.from({ length: Math.min(5, meta.totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, meta.page - 2) + i
                  if (pageNum > meta.totalPages) return null
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={cn(
                        'w-10 h-10 rounded-xl text-sm font-medium transition-all',
                        pageNum === meta.page
                          ? 'bg-emerald-600 text-white border border-emerald-500'
                          : 'bg-slate-800 border border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white'
                      )}
                    >
                      {pageNum}
                    </button>
                  )
                })}
                <button
                  onClick={() => setPage(meta.page + 1)}
                  disabled={!meta.hasNextPage}
                  className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white disabled:opacity-40 hover:border-slate-500 transition-all"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </PageWrapper>
  )
}
