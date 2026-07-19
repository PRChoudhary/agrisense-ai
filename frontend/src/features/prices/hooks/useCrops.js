import { useQuery } from '@tanstack/react-query'
import { fetchCrops } from '../services/prices.service'

export function useCrops(categoryId) {
  return useQuery({
    queryKey: ['crops', categoryId],
    queryFn: () => fetchCrops(categoryId),
    staleTime: 30 * 60 * 1000, // 30 minutes - crops rarely change
    select: (data) => data?.data || [],
  })
}
