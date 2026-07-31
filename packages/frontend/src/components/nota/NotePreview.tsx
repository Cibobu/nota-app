import { useCallback, useRef, useState } from 'react'
import { toast } from 'sonner'
import { useTrackDownload } from '../../hooks/useStats'
import { exportToJPG, exportToPDF } from '../../lib/export'
import type { BusinessProfile, NoteItem } from '../../types'
import NoteReceipt from './NoteReceipt'

interface NotePreviewProps {
  items: NoteItem[]
  grandTotal: number
  profile: BusinessProfile | undefined
  noteNumber: string
  date: string
  customerName?: string | null
  customerPhone?: string | null
  onBeforeExport?: () => Promise<void>
  onExported?: () => void
}

export default function NotePreview({
  items,
  grandTotal,
  profile,
  noteNumber,
  date,
  customerName,
  customerPhone,
  onBeforeExport,
  onExported,
}: NotePreviewProps) {
  const noteRef = useRef<HTMLDivElement>(null)
  const [exporting, setExporting] = useState<'pdf' | 'jpg' | null>(null)
  const trackDownload = useTrackDownload()

  const business = profile
    ? {
        displayName: profile.displayName,
        logoBase64: profile.logoBase64,
        phone: profile.phone,
        instagram: profile.instagram,
        whatsapp: profile.whatsapp,
        address: profile.address,
      }
    : null

  const handleExport = useCallback(
    async (type: 'pdf' | 'jpg') => {
      if (!noteRef.current || exporting) return
      setExporting(type)

      try {
        if (onBeforeExport) await onBeforeExport()

        trackDownload.mutateAsync().catch(() => {})

        if (type === 'pdf') {
          await exportToPDF(noteRef.current, `nota-${noteNumber || 'baru'}.pdf`)
        } else {
          await exportToJPG(noteRef.current, `nota-${noteNumber || 'baru'}.jpg`)
        }

        toast.success('Nota berhasil di-download')
        onExported?.()
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Gagal mengekspor nota'
        toast.error(msg)
      } finally {
        setExporting(null)
      }
    },
    [noteNumber, onBeforeExport, onExported, trackDownload, exporting],
  )

  if (!items.length) return null

  return (
    <div className="space-y-3 no-print">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => handleExport('pdf')}
          disabled={exporting !== null}
          className="btn btn-primary flex-1"
        >
          {exporting === 'pdf' ? <span className="loading loading-spinner" /> : null}
          {exporting === 'pdf' ? 'Menyiapkan...' : 'Download PDF'}
        </button>
        <button
          type="button"
          onClick={() => handleExport('jpg')}
          disabled={exporting !== null}
          className="btn btn-secondary flex-1"
        >
          {exporting === 'jpg' ? <span className="loading loading-spinner" /> : null}
          {exporting === 'jpg' ? 'Menyiapkan...' : 'Download JPG'}
        </button>
      </div>

      <NoteReceipt
        ref={noteRef}
        business={business}
        items={items}
        grandTotal={grandTotal}
        noteNumber={noteNumber}
        date={date}
        customerName={customerName}
        customerPhone={customerPhone}
      />
    </div>
  )
}
