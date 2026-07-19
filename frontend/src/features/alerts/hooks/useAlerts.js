import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchAlerts, createAlert, toggleAlert, deleteAlert } from '../services/alerts.service'
import { toast } from 'react-hot-toast'

export function useAlerts() {
  return useQuery({
    queryKey: ['alerts'],
    queryFn: fetchAlerts,
    select: (data) => data?.data || [],
  })
}

export function useCreateAlert() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createAlert,
    onSuccess: () => {
      toast.success('Alert created successfully')
      queryClient.invalidateQueries({ queryKey: ['alerts'] })
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Failed to create alert'),
  })
}

export function useToggleAlert() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: toggleAlert,
    onMutate: async ({ id, isActive }) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['alerts'] })
      const previousAlerts = queryClient.getQueryData(['alerts'])
      queryClient.setQueryData(['alerts'], (old) => {
        if (!old?.data) return old
        return {
          ...old,
          data: old.data.map(alert => alert.id === id ? { ...alert, isActive } : alert)
        }
      })
      return { previousAlerts }
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(['alerts'], context.previousAlerts)
      toast.error('Failed to update alert')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] })
    },
  })
}

export function useDeleteAlert() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteAlert,
    onSuccess: () => {
      toast.success('Alert deleted')
      queryClient.invalidateQueries({ queryKey: ['alerts'] })
    },
    onError: () => toast.error('Failed to delete alert'),
  })
}
