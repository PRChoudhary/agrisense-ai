import { useQuery } from '@tanstack/react-query'
import { fetchCropsForDropdown } from '../services/predictions.service'

export function useCropsForPredictions() {
  return useQuery({
    queryKey: ['crops', 'dropdown'],
    queryFn: fetchCropsForDropdown,
    staleTime: 60 * 60 * 1000,
    select: (data) => (data?.data || []).map(c => ({ value: c.id, label: c.name, hindi: c.nameHindi, msp: c.mspPrice })),
  })
}
