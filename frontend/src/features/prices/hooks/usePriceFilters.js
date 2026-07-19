import { useState, useCallback } from 'react'
import { useDebounce } from '../../../hooks/useDebounce'

/** Default filter state */
const DEFAULT_FILTERS = {
  cropId: '',
  mandiId: '',
  state: '',
  district: '',
  search: '',
  sortBy: 'date',
  sortOrder: 'desc',
  page: 1,
  limit: 24,
}

export function usePriceFilters() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const debouncedSearch = useDebounce(filters.search, 400)

  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 })) // Reset page on filter change
  }, [])

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS)
  }, [])

  const setPage = useCallback((page) => {
    setFilters(prev => ({ ...prev, page }))
  }, [])

  // Build clean params object (remove empty strings)
  const activeParams = Object.fromEntries(
    Object.entries({ ...filters, search: debouncedSearch })
      .filter(([, v]) => v !== '' && v !== null && v !== undefined)
  )

  const hasActiveFilters = filters.cropId || filters.mandiId || filters.state || filters.district || filters.search

  return { filters, activeParams, updateFilter, resetFilters, setPage, hasActiveFilters }
}
