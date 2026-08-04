import { FileText, Share2, XCircle } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { Link, useParams } from 'react-router-dom'
import NoteReceipt from '../components/nota/NoteReceipt'
import { usePublicNote } from '../hooks/usePublicNote'

export default function PublicNote() {
  const { token = '' } = useParams<{ token: string }>()
  const { data: note, isLoading, isError } = usePublicNote(token)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-start justify-center p-4 pt-16">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    )
  }

  if (isError || !note) {
    return (
      <div className="min-h-screen bg-base-200">
        <Helmet>
          <title>Nota Tidak Ditemukan - Nota Pintar</title>
        </Helmet>
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
              <Link to="/login" className="btn btn-primary btn-sm font-medium">
                <FileText className="w-4 h-4" />
                Buat Nota Pintar
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const displayName = note.business?.displayName || note.business?.ownerName || 'Nota Pintar'
  const customerLabel = note.customerName ? `untuk ${note.customerName}` : ''
  const totalFormatted = note.grandTotal.toLocaleString('id-ID')
  const itemLabel = `${note.items.length} item`
  const desc = customerLabel
    ? `Nota ${customerLabel} — ${itemLabel}, total Rp${totalFormatted}. Lihat selengkapnya.`
    : `${itemLabel} dengan total Rp${totalFormatted}. Nota online dari ${displayName}.`

  return (
    <div className="min-h-screen bg-base-200">
      <Helmet>
        <title>
          Nota {note.noteNumber} — {displayName} | Nota Pintar
        </title>
        <meta name="description" content={desc} />
        <meta
          property="og:title"
          content={`Nota ${note.noteNumber} — ${displayName} | Nota Pintar`}
        />
        <meta property="og:description" content={desc} />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="max-w-xl mx-auto p-4 sm:p-6 animate-fade-in">
        <div className="text-center mb-5">
          <span className="badge badge-neutral badge-sm gap-1.5 font-medium">
            <Share2 className="w-3 h-3" />
            Dokumen ini dibagikan kepada Anda
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

        <p className="text-center text-xs text-base-content/40 mt-6">
          Dibuat dengan{' '}
          <Link to="/login" className="link link-primary font-medium">
            Nota Pintar
          </Link>{' '}
          — buat nota online gratis
        </p>
      </div>
    </div>
  )
}
