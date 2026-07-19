import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchSessions, deleteSession, updateSessionTitle } from '../services/copilot.service'
import { useAuth } from '../../../contexts/AuthContext'

export function useCopilotSessions() {
  const { isAuthenticated } = useAuth()
  const queryClient = useQueryClient()

  const sessionsQuery = useQuery({
    queryKey: ['copilot', 'sessions'],
    queryFn: fetchSessions,
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000,
    select: (data) => data?.data || [],
  })

  const deleteMutation = useMutation({
    mutationFn: deleteSession,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['copilot', 'sessions'] }),
  })

  const renameMutation = useMutation({
    mutationFn: ({ sessionId, title }) => updateSessionTitle(sessionId, title),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['copilot', 'sessions'] }),
  })

  return {
    sessions: sessionsQuery.data || [],
    isLoading: sessionsQuery.isLoading,
    deleteSession: deleteMutation.mutate,
    renameSession: renameMutation.mutate,
    refetch: sessionsQuery.refetch,
  }
}
