import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: api.profile.get,
    staleTime: 30 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export function useUpdateProfile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: api.profile.update,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}
