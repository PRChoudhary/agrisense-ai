import { useQuery } from '@tanstack/react-query'
import { fetchTopPredictions } from '../services/predictions.service'

export function useTopPredictions() {
  return useQuery({
    queryKey: ['predictions', 'top'],
    queryFn: fetchTopPredictions,
    staleTime: 6 * 60 * 60 * 1000,
    select: (data) => data?.data || [],
  })
}
