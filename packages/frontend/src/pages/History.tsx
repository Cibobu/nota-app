import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { formatCurrency, formatDate } from '../lib/export'
import type { Note } from '../types'

export default function History() {
  const navigate = useNavigate()

  const { data: notes, isLoading } = useQuery({
    queryKey: ['notes'],
    queryFn: () => api.notes.getAll(),
  })

  return (
    <>
      <Helmet>
        <title>Riwayat Nota - Nota Pintar</title>
      </Helmet>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-heading font-bold text-neutral">Riwayat Nota</h1>
          <button
            type="button"
            onClick={() => navigate('/create')}
            className="btn btn-primary btn-sm"
          >
            + Buat Baru
          </button>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {['a', 'b', 'c'].map((k) => (
              <div key={k} className="skeleton h-20 w-full rounded-box" />
            ))}
          </div>
        ) : !notes?.length ? (
          <div className="card bg-base-100 border border-base-200 shadow-sm">
            <div className="card-body items-center text-center py-12">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-base-content/20 mb-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-base-content/60 mb-1">Belum ada nota</p>
              <p className="text-sm text-base-content/40">Buat nota pertama kamu sekarang</p>
              <button
                type="button"
                onClick={() => navigate('/create')}
                className="btn btn-primary btn-sm mt-4"
              >
                Buat Nota Baru
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {notes.map((note: Note) => (
              <div
                key={note.id}
                className="card bg-base-100 border border-base-200 shadow-sm hover:border-primary transition-colors cursor-pointer"
                onClick={() => navigate(`/preview/${note.id}`)}
              >
                <div className="card-body p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-heading font-semibold text-sm text-neutral truncate">
                        {note.noteNumber}
                      </h3>
                      <p className="text-xs text-base-content/40 mt-0.5">
                        {formatDate(note.createdAt)}
                      </p>
                      <p className="text-xs text-base-content/40">{note.items?.length || 0} item</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-heading font-bold text-primary">
                        {formatCurrency(note.grandTotal)}
                      </p>
                      <span
                        className="btn btn-ghost btn-xs text-secondary mt-1"
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/preview/${note.id}`)
                        }}
                      >
                        Lihat
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
