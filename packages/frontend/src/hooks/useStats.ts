import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'

export function useStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: api.stats.get,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  })
}

export function useTrackVisit() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: api.stats.visit,
    onSuccess: (data) => {
      qc.setQueryData(['stats'], data)
    },
  })
}

export function useTrackDownload() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: api.stats.download,
    onSuccess: (data) => {
      qc.setQueryData(['stats'], data)
    },
  })
}
