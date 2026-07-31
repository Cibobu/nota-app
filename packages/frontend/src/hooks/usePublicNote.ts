import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'

export function usePublicNote(token: string) {
  return useQuery({
    queryKey: ['public-note', token],
    queryFn: () => api.public.getNote(token),
    enabled: !!token,
    retry: 1,
  })
}
