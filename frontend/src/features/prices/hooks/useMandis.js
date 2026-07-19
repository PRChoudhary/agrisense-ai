import { useQuery } from '@tanstack/react-query'
import { fetchMandis } from '../services/prices.service'

export function useMandis(filters = {}) {
  return useQuery({
    queryKey: ['mandis', filters],
    queryFn: () => fetchMandis(filters),
    staleTime: 30 * 60 * 1000,
    enabled: true,
    select: (data) => data?.data || [],
  })
}
