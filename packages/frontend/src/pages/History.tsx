import { useQuery } from '@tanstack/react-query'
import { ChevronRight, FileText, Plus } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { Link, useNavigate } from 'react-router-dom'
import ShareButton from '../components/ui/ShareButton'
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

      <div className="space-y-5 animate-fade-in">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-heading font-bold text-neutral">Riwayat Nota</h1>
          <button
            type="button"
            onClick={() => navigate('/create')}
            className="btn btn-primary btn-sm font-medium transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            Buat Baru
          </button>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {['a', 'b', 'c'].map((k) => (
              <div key={k} className="skeleton h-[72px] w-full rounded-box" />
            ))}
          </div>
        ) : !notes?.length ? (
          <div className="card bg-base-100 border border-base-300 shadow-sm">
            <div className="card-body items-center text-center py-12">
              <div className="w-14 h-14 rounded-xl bg-base-200 flex items-center justify-center mb-4">
                <FileText className="w-7 h-7 text-base-content/20" />
              </div>
              <p className="text-base-content/50 font-medium">Belum ada nota</p>
              <p className="text-sm text-base-content/40 mt-1">Buat nota pertama kamu sekarang</p>
              <button
                type="button"
                onClick={() => navigate('/create')}
                className="btn btn-primary btn-sm mt-5"
              >
                <Plus className="w-4 h-4" />
                Buat Nota Baru
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {notes.map((note: Note) => (
              <div
                key={note.id}
                className="card bg-base-100 border border-base-300 shadow-sm hover:border-primary/30 hover:shadow-md transition-all duration-200"
              >
                <div className="card-body p-4 sm:p-5 flex flex-row items-center gap-3">
                  <Link
                    to={`/preview/${note.id}`}
                    className="flex-1 min-w-0 group"
                    aria-label={`Buka nota ${note.noteNumber}`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="font-heading font-semibold text-sm text-neutral group-hover:text-primary transition-colors">
                          {note.noteNumber}
                        </h3>
                        <p className="text-xs text-base-content/45 mt-0.5">
                          {formatDate(note.date)}{' '}
                          <span className="mx-1.5 text-base-content/25">|</span>
                          {note.items?.length || 0} item
                          {note.customerName && (
                            <>
                              <span className="mx-1.5 text-base-content/25">|</span>
                              {note.customerName}
                            </>
                          )}
                        </p>
                      </div>
                      <div className="text-right shrink-0 flex items-center gap-2">
                        <p className="font-heading font-bold text-primary tabular-nums text-sm">
                          {formatCurrency(note.grandTotal)}
                        </p>
                        <ChevronRight className="w-4 h-4 text-base-content/25 group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                  </Link>
                  <ShareButton token={note.shareToken} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
