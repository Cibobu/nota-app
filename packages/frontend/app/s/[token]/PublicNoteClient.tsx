'use client'

import NoteReceipt from '@/components/nota/NoteReceipt'
import { usePublicNote } from '@/hooks/usePublicNote'
import { FileText, Share2, XCircle } from 'lucide-react'
import Link from 'next/link'

export default function PublicNoteClient({ token }: { token: string }) {
  const { data: note, isLoading, isError } = usePublicNote(token)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-200">
        <div className="max-w-xl mx-auto p-4 sm:p-6 pt-8">
          <div className="text-center mb-5">
            <div className="skeleton h-6 w-48 mx-auto rounded-full" />
          </div>
          <div className="card bg-base-100 shadow-sm border border-base-300">
            <div className="card-body p-6 space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="skeleton h-12 w-12 rounded-xl" />
                <div className="space-y-1.5">
                  <div className="skeleton h-4 w-32" />
                  <div className="skeleton h-3 w-48" />
                </div>
              </div>
              <div className="divider" />
              {[1, 2, 3].map((k) => (
                <div key={k} className="flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="skeleton h-4 w-32" />
                    <div className="skeleton h-3 w-20" />
                  </div>
                  <div className="skeleton h-4 w-20" />
                </div>
              ))}
              <div className="divider" />
              <div className="flex justify-between items-center">
                <div className="skeleton h-5 w-24" />
                <div className="skeleton h-6 w-32" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isError || !note) {
    return (
      <div className="min-h-screen bg-base-200">
        <div className="max-w-xl mx-auto p-4 sm:p-6">
          <div className="card bg-base-100 border border-base-300 shadow-sm mt-8">
            <div className="card-body items-center text-center py-12">
              <div className="w-14 h-14 rounded-xl bg-base-200 flex items-center justify-center mb-4">
                <XCircle className="w-7 h-7 text-base-content/20" />
              </div>
              <p className="text-base-content/50 font-medium">Nota tidak ditemukan</p>
              <p className="text-sm text-base-content/40 mt-1 mb-6">
                Link mungkin salah atau sudah tidak berlaku
              </p>
              <Link href="/login" className="btn btn-primary btn-sm font-medium">
                <FileText className="w-4 h-4" />
                Buat Nota Pintar
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="max-w-xl mx-auto p-4 sm:p-6 animate-fade-in">
        <div className="text-center mb-5">
          <span className="badge badge-neutral badge-sm gap-1.5 font-medium">
            <Share2 className="w-3 h-3" />
            Dokumen ini berhasil dibagikan
          </span>
        </div>

        <NoteReceipt
          business={note.business as any}
          items={note.items}
          grandTotal={note.grandTotal}
          noteNumber={note.noteNumber}
          date={note.date}
          customerName={note.customerName}
          customerPhone={note.customerPhone}
        />

      </div>
    </div>
  )
}
