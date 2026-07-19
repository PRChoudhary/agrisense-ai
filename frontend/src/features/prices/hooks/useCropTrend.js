import { useQuery } from '@tanstack/react-query'
import { fetchCropTrend, fetchCropSummary } from '../services/prices.service'

export function useCropTrend(cropId, mandiId) {
  return useQuery({
    queryKey: ['cropTrend', cropId, mandiId],
    queryFn: () => fetchCropTrend(cropId, mandiId),
    enabled: !!cropId,
    staleTime: 10 * 60 * 1000,
    select: (data) => data?.data || [],
  })
}

export function useCropSummary(cropId) {
  return useQuery({
    queryKey: ['cropSummary', cropId],
    queryFn: () => fetchCropSummary(cropId),
    enabled: !!cropId,
    staleTime: 10 * 60 * 1000,
    select: (data) => data?.data || null,
  })
}
