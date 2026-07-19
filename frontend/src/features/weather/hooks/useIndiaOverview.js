import { useQuery } from '@tanstack/react-query'
import { fetchIndiaOverview } from '../services/weather.service'

export function useIndiaOverview() {
  return useQuery({
    queryKey: ['weather', 'india-overview'],
    queryFn: fetchIndiaOverview,
    staleTime: 60 * 60 * 1000, // 1 hour
    select: (data) => data?.data || [],
  })
}
