'use client'

import NotePreview from '@/components/nota/NotePreview'
import ShareButton from '@/components/ui/ShareButton'
import { useNote } from '@/hooks/useNotes'
import { useProfile } from '@/hooks/useProfile'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function PreviewPage() {
  const params = useParams<{ id: string }>()
  const { data: note, isLoading: noteLoading } = useNote(params.id || '')
  const { data: profile } = useProfile()

  if (noteLoading) {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="skeleton h-9 w-28 rounded-lg" />
          <div className="skeleton h-9 w-28 rounded-lg" />
        </div>
        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body p-6 space-y-4">
            <div className="space-y-2">
              <div className="skeleton h-4 w-24" />
              <div className="skeleton h-8 w-full" />
              <div className="skeleton h-4 w-36" />
            </div>
            <div className="divider" />
            {[1, 2, 3].map((k) => (
              <div key={k} className="flex justify-between items-center">
                <div className="space-y-1">
                  <div className="skeleton h-4 w-32" />
                  <div className="skeleton h-3 w-20" />
                </div>
                <div className="skeleton h-4 w-16" />
              </div>
            ))}
            <div className="divider" />
            <div className="flex justify-between items-center">
              <div className="skeleton h-5 w-24" />
              <div className="skeleton h-6 w-28" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!note) {
    return (
      <div className="text-center py-16">
        <p className="text-base-content/50 mb-4">Nota tidak ditemukan</p>
        <Link href="/create" className="btn btn-primary btn-sm">
          Buat Nota Baru
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between no-print">
        <Link href="/history" className="btn btn-ghost btn-sm">
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </Link>
        <ShareButton token={note.shareToken} />
      </div>

      <NotePreview
        items={note.items}
        grandTotal={note.grandTotal}
        profile={profile}
        noteNumber={note.noteNumber}
        date={note.date}
        customerName={note.customerName}
        customerPhone={note.customerPhone}
      />
    </div>
  )
}
