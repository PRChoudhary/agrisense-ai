import { useQuery } from '@tanstack/react-query'
import { fetchPrices, fetchLatestPrices } from '../services/prices.service'

/** 
 * Fetches paginated, filtered prices
 */
export function usePrices(params = {}) {
  return useQuery({
    queryKey: ['prices', params],
    queryFn: () => fetchPrices(params),
    staleTime: 10 * 60 * 1000, // 10 minutes
    placeholderData: (previousData) => previousData, // Keep previous data while loading new
    select: (data) => data, // Return full paginated response
  })
}

/**
 * Fetches latest prices (for dashboard summary)
 */
export function useLatestPrices(params = {}) {
  return useQuery({
    queryKey: ['prices', 'latest', params],
    queryFn: () => fetchLatestPrices(params),
    staleTime: 10 * 60 * 1000,
    select: (data) => data?.data || [],
  })
}
