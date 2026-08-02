import { ArrowLeft } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { Link, useParams } from 'react-router-dom'
import NotePreview from '../components/nota/NotePreview'
import ShareButton from '../components/ui/ShareButton'
import { useNote } from '../hooks/useNotes'
import { useProfile } from '../hooks/useProfile'

export default function Preview() {
  const { id } = useParams<{ id: string }>()
  const { data: note, isLoading: noteLoading } = useNote(id || '')
  const { data: profile } = useProfile()

  if (noteLoading) {
    return (
      <div className="flex justify-center py-16">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    )
  }

  if (!note) {
    return (
      <div className="text-center py-16">
        <p className="text-base-content/50 mb-4">Nota tidak ditemukan</p>
        <Link to="/create" className="btn btn-primary btn-sm">
          Buat Nota Baru
        </Link>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>Nota {note.noteNumber} - Nota Pintar</title>
        <meta
          name="description"
          content={`Nota ${note.noteNumber} - ${note.items.length} item, total Rp ${note.grandTotal.toLocaleString('id-ID')}`}
        />
        <meta property="og:title" content={`Nota ${note.noteNumber}`} />
        <meta
          property="og:description"
          content={`Total: Rp ${note.grandTotal.toLocaleString('id-ID')}`}
        />
      </Helmet>

      <div className="space-y-4 animate-fade-in">
        <div className="flex items-center justify-between no-print">
          <Link to="/history" className="btn btn-ghost btn-sm">
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
    </>
  )
}
