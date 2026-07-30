import { useCallback, useRef, useState } from 'react'
import { toast } from 'sonner'
import { useTrackDownload } from '../../hooks/useStats'
import { exportToJPG, exportToPDF, formatCurrency, formatDate } from '../../lib/export'
import type { BusinessProfile, NoteItem } from '../../types'

interface NotePreviewProps {
  items: NoteItem[]
  grandTotal: number
  profile: BusinessProfile | undefined
  noteNumber: string
  customerName?: string | null
}

const s = {
  wrapper: {
    width: '100%',
    maxWidth: '500px',
    margin: '0 auto',
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    padding: '32px',
    fontSize: '14px',
    lineHeight: '20px',
    color: '#1f2937',
    colorScheme: 'light' as const,
  },
  center: { textAlign: 'center' as const },
  mb6: { marginBottom: '24px' },
  logo: {
    height: '64px',
    margin: '0 auto 12px',
    objectFit: 'contain' as const,
    display: 'block',
  },
  logoFallback: {
    width: '64px',
    height: '64px',
    background: '#1e40af',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 12px',
  },
  logoInitials: {
    fontSize: '24px',
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    fontWeight: 700,
    color: '#ffffff',
  },
  bizName: {
    fontSize: '20px',
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    fontWeight: 700,
    color: '#1f2937',
    margin: '0 0 0',
  },
  info: {
    fontSize: '12px',
    color: '#6b7280',
    margin: '2px 0 0',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '4px',
    fontSize: '12px',
    color: '#6b7280',
  },
  divider: {
    border: 'none',
    borderTop: '1px dashed #e2e8f0',
    margin: '16px 0',
  },
  noteTitle: {
    fontSize: '18px',
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    margin: '0 0 4px',
  },
  noteMeta: {
    fontSize: '12px',
    color: '#6b7280',
    margin: '0',
  },
  table: {
    width: '100%',
    fontSize: '12px',
    borderCollapse: 'collapse' as const,
    marginBottom: '16px',
  },
  th: {
    textAlign: 'left' as const,
    padding: '4px 8px 4px 0',
    borderBottom: '1px solid #e2e8f0',
    fontWeight: 600,
  },
  thCenter: {
    textAlign: 'center' as const,
    padding: '4px 8px 4px 0',
    borderBottom: '1px solid #e2e8f0',
    fontWeight: 600,
  },
  thRight: {
    textAlign: 'right' as const,
    padding: '4px 8px 4px 0',
    borderBottom: '1px solid #e2e8f0',
    fontWeight: 600,
  },
  thRightLast: {
    textAlign: 'right' as const,
    padding: '4px 0',
    borderBottom: '1px solid #e2e8f0',
    fontWeight: 600,
  },
  td: {
    padding: '4px 8px 4px 0',
    borderBottom: '1px solid #f8fafc',
  },
  tdCenter: {
    textAlign: 'center' as const,
    padding: '4px 8px 4px 0',
    borderBottom: '1px solid #f8fafc',
  },
  tdRight: {
    textAlign: 'right' as const,
    padding: '4px 8px 4px 0',
    borderBottom: '1px solid #f8fafc',
  },
  tdRightLast: {
    textAlign: 'right' as const,
    padding: '4px 0',
    borderBottom: '1px solid #f8fafc',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    borderTop: '2px solid #1f2937',
    paddingTop: '8px',
    marginTop: '8px',
  },
  totalLabel: {
    fontSize: '12px',
    color: '#6b7280',
    margin: '0',
  },
  totalValue: {
    fontSize: '20px',
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    fontWeight: 700,
    color: '#1e40af',
    margin: '0',
  },
  thanks: {
    textAlign: 'center' as const,
    fontSize: '12px',
    color: '#9ca3af',
    margin: '0',
  },
}

export default function NotePreview({
  items,
  grandTotal,
  profile,
  noteNumber,
  customerName,
}: NotePreviewProps) {
  const noteRef = useRef<HTMLDivElement>(null)
  const [exporting, setExporting] = useState<'pdf' | 'jpg' | null>(null)
  const trackDownload = useTrackDownload()
  const date = formatDate(new Date().toISOString())

  const logoUrl = profile?.logoBase64 || null

  const handleExport = useCallback(
    async (type: 'pdf' | 'jpg') => {
      if (!noteRef.current) return
      setExporting(type)

      try {
        await trackDownload.mutateAsync()

        if (type === 'pdf') {
          await exportToPDF(noteRef.current, `nota-${noteNumber || 'baru'}.pdf`)
        } else {
          await exportToJPG(noteRef.current, `nota-${noteNumber || 'baru'}.jpg`)
        }

        toast.success('Nota berhasil di-download')
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Gagal mengexport nota'
        toast.error(msg)
      } finally {
        setExporting(null)
      }
    },
    [noteNumber, trackDownload],
  )

  if (!items.length) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          type="button"
          onClick={() => handleExport('pdf')}
          disabled={exporting !== null}
          style={{
            flex: 1,
            padding: '8px 16px',
            fontSize: '14px',
            fontWeight: 600,
            background: '#1e40af',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            cursor: exporting ? 'not-allowed' : 'pointer',
            opacity: exporting ? 0.6 : 1,
          }}
        >
          {exporting === 'pdf' ? 'Menyiapkan...' : 'Download PDF'}
        </button>
        <button
          type="button"
          onClick={() => handleExport('jpg')}
          disabled={exporting !== null}
          style={{
            flex: 1,
            padding: '8px 16px',
            fontSize: '14px',
            fontWeight: 600,
            background: '#059669',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            cursor: exporting ? 'not-allowed' : 'pointer',
            opacity: exporting ? 0.6 : 1,
          }}
        >
          {exporting === 'jpg' ? 'Menyiapkan...' : 'Download JPG'}
        </button>
      </div>

      <div ref={noteRef} style={s.wrapper}>
        <div style={{ ...s.center, ...s.mb6 }}>
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" style={s.logo} />
          ) : (
            <div style={s.logoFallback}>
              <span style={s.logoInitials}>
                {(profile?.displayName || 'N').slice(0, 2).toUpperCase()}
              </span>
            </div>
          )}
          <h2 style={s.bizName}>{profile?.displayName || 'Nama Bisnis'}</h2>
        </div>

        <hr style={s.divider} />

        <div style={{ ...s.center, marginBottom: '16px' }}>
          <h3 style={s.noteTitle}>Nota</h3>
          <p style={s.noteMeta}>
            {noteNumber} | {date}
          </p>
          {customerName && (
            <p style={{ ...s.noteMeta, marginTop: '4px' }}>Kepada Yth: {customerName}</p>
          )}
        </div>

        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>#</th>
              <th style={s.th}>Nama</th>
              <th style={s.thCenter}>Qty</th>
              <th style={s.thRight}>Harga</th>
              <th style={s.thRightLast}>Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={`${item.name}-${i}`}>
                <td style={s.td}>{i + 1}</td>
                <td style={s.td}>{item.name}</td>
                <td style={s.tdCenter}>{item.quantity}</td>
                <td style={s.tdRight}>{formatCurrency(item.price)}</td>
                <td style={s.tdRightLast}>{formatCurrency(item.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={s.totalRow}>
          <div style={{ textAlign: 'right' }}>
            <p style={s.totalLabel}>Grand Total</p>
            <p style={s.totalValue}>{formatCurrency(grandTotal)}</p>
          </div>
        </div>

        <hr style={s.divider} />
        <p style={s.thanks}>Terima Kasih atas kunjungan Anda</p>

        <div style={{ ...s.center, ...s.mb6 }}>
          {profile?.phone && <p style={s.info}>Telp: {profile.phone}</p>}
          {(profile?.instagram || profile?.whatsapp) && (
            <div style={s.infoRow}>
              {profile?.instagram && <span>IG: @{profile.instagram}</span>}
              {profile?.whatsapp && <span>WA: {profile.whatsapp}</span>}
            </div>
          )}
          {profile?.address && <p style={s.info}>{profile.address}</p>}
        </div>
      </div>
    </div>
  )
}
