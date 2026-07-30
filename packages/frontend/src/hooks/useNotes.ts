import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import type { NoteItem } from '../types'

export function useNotes() {
  return useQuery({
    queryKey: ['notes'],
    queryFn: api.notes.getAll,
    staleTime: 2 * 60 * 1000,
  })
}

export function useNote(id: string) {
  return useQuery({
    queryKey: ['notes', id],
    queryFn: () => api.notes.getById(id),
    enabled: !!id,
  })
}

export function useCreateNote() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: {
      noteNumber?: string
      customerName?: string
      items: NoteItem[]
      grandTotal: number
    }) => api.notes.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notes'] })
    },
  })
}
