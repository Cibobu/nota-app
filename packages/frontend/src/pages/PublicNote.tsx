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
          <div className="card bg-base-100 border border-base-200 shadow-sm mt-8">
            <div className="card-body items-center text-center py-12">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-base-content/30 mb-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636M12 3a9 9 0 019 9c0 2.4-.94 4.59-2.47 6.21M12 3v9m0 0l-3-3m3 3l3-3"
                />
              </svg>
              <p className="text-base-content/60 mb-1 font-medium">Nota tidak ditemukan</p>
              <p className="text-sm text-base-content/50 mb-6">
                Link mungkin salah atau sudah tidak berlaku
              </p>
              <Link to="/login" className="btn btn-primary btn-sm">
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
      <Helmet>
        <title>Nota {note.noteNumber} - Nota Pintar</title>
        <meta
          name="description"
          content={`Nota ${note.noteNumber} - ${note.items.length} item, total ${note.grandTotal.toLocaleString('id-ID')}`}
        />
      </Helmet>

      <div className="max-w-xl mx-auto p-4 sm:p-6">
        <div className="text-center mb-4">
          <span className="badge badge-neutral badge-sm gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
            Dokumen ini dibagikan kepada Anda
          </span>
        </div>

        <NoteReceipt
          business={note.business}
          items={note.items}
          grandTotal={note.grandTotal}
          noteNumber={note.noteNumber}
          date={note.date}
          customerName={note.customerName}
          customerPhone={note.customerPhone}
        />

        <p className="text-center text-xs text-base-content/50 mt-6">
          Dibuat dengan{' '}
          <Link to="/login" className="link link-primary">
            Nota Pintar
          </Link>{' '}
          — buat nota online gratis
        </p>
      </div>
    </div>
  )
}
