import { useQuery } from '@tanstack/react-query'
import { fetchCurrentWeather } from '../services/weather.service'

export function useWeather({ city, state, lat, lon } = {}) {
  return useQuery({
    queryKey: ['weather', 'current', city, lat, lon],
    queryFn: () => fetchCurrentWeather({ city, state, lat, lon }),
    enabled: !!(city || (lat && lon)),
    staleTime: 30 * 60 * 1000, // 30 minutes
    select: (data) => data?.data || null,
    retry: 2,
  })
}
