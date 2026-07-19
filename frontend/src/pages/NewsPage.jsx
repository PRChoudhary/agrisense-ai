import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Newspaper, RefreshCw } from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'
import {
  NewsCard, FeaturedNewsCard, NewsCategoryTabs,
  NewsSearchBar, NewsSkeleton, NewsEmptyState,
  useNews
} from '../features/news'
import { refreshNews } from '../features/news/services/news.service'
import { useQueryClient } from '@tanstack/react-query'
import { useDebounce } from '../hooks/useDebounce'

export default function NewsPage() {
  const [category, setCategory] = useState('ALL')
  const [impact, setImpact] = useState('ALL')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const debouncedSearch = useDebounce(search, 400)
  const queryClient = useQueryClient()

  const { data, isLoading, isFetching } = useNews({
    category,
    impact,
    search: debouncedSearch,
    page,
  })

  const articles = data?.articles || []
  const meta = data?.meta || { total: 0, page: 1, totalPages: 1 }
  const featuredArticle = articles[0]
  const gridArticles = articles.slice(1)

  const handleCategoryChange = (cat) => {
    setCategory(cat)
    setPage(1)
  }

  const handleImpactChange = (imp) => {
    setImpact(imp)
    setPage(1)
  }

  const handleSearch = useCallback((val) => {
    setSearch(val)
    setPage(1)
  }, [])

  const handleClear = () => {
    setCategory('ALL')
    setImpact('ALL')
    setSearch('')
    setPage(1)
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await refreshNews()
      queryClient.invalidateQueries({ queryKey: ['news'] })
    } catch (e) {
      console.error('Refresh failed:', e)
    } finally {
      setIsRefreshing(false)
    }
  }

  const pageActions = (
    <button
      onClick={handleRefresh}
      disabled={isRefreshing || isFetching}
      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white text-sm font-medium transition-all disabled:opacity-50"
    >
      <RefreshCw size={15} className={isRefreshing || isFetching ? 'animate-spin' : ''} />
      Refresh
    </button>
  )

  return (
    <PageWrapper
      title="Agriculture News"
      subtitle={`${meta.total} articles · AI-analyzed for farmer impact`}
      actions={pageActions}
      icon={Newspaper}
    >
      {/* Search */}
      <div className="mb-5">
        <NewsSearchBar onSearch={handleSearch} isLoading={isFetching} />
      </div>

      {/* Category + Impact filters */}
      <div className="mb-6">
        <NewsCategoryTabs
          activeCategory={category}
          activeImpact={impact}
          onCategoryChange={handleCategoryChange}
          onImpactChange={handleImpactChange}
        />
      </div>

      {/* Content */}
      {isLoading ? (
        <NewsSkeleton />
      ) : articles.length === 0 ? (
        <NewsEmptyState onClear={handleClear} />
      ) : (
        <div className="space-y-5">
          {/* Featured top story */}
          {featuredArticle && page === 1 && (
            <FeaturedNewsCard article={featuredArticle} />
          )}

          {/* News grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${category}-${impact}-${debouncedSearch}-${page}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {gridArticles.map((article, i) => (
                <NewsCard key={article.id} article={article} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Pagination */}
          {meta.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white text-sm transition-all disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-slate-500 text-sm px-3">
                Page {meta.page} of {meta.totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                disabled={page >= meta.totalPages}
                className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white text-sm transition-all disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </PageWrapper>
  )
}
