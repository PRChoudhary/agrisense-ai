import { useQuery } from '@tanstack/react-query'
import { fetchCropPrediction } from '../services/predictions.service'

export function usePrediction({ cropId, mandiId, forceRefresh = false } = {}) {
  return useQuery({
    queryKey: ['predictions', 'crop', cropId, mandiId],
    queryFn: () => fetchCropPrediction({ cropId, mandiId, forceRefresh }),
    enabled: !!cropId,
    staleTime: 6 * 60 * 60 * 1000, // 6 hours — matches backend cache
    retry: 1,
    select: (data) => data?.data || null,
  })
}
