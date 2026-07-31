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

export function useNextNoteNumber() {
  return useQuery({
    queryKey: ['notes', 'next-number'],
    queryFn: api.notes.nextNumber,
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateNote() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: {
      customerName?: string
      customerPhone?: string
      items: NoteItem[]
      grandTotal: number
    }) => api.notes.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notes'] })
    },
  })
}
