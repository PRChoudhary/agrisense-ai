import { useQuery } from '@tanstack/react-query'
import { fetchNews } from '../services/news.service'

export function useNews({ category = 'ALL', impact = 'ALL', search = '', page = 1, limit = 12 } = {}) {
  return useQuery({
    queryKey: ['news', category, impact, search, page],
    queryFn: () => fetchNews({ category, impact, search, page, limit }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: (prev) => prev,
    select: (data) => ({
      articles: data?.data || [],
      meta: data?.meta || { total: 0, page: 1, totalPages: 1 },
    }),
  })
}
