import { forwardRef } from 'react'
import { formatCurrency, formatDate } from '../../lib/export'
import type { NoteItem } from '../../types'

const UNIT_LABELS: Record<string, string> = {
  pcs: 'Pcs',
  buah: 'Buah',
  lusin: 'Lusin',
  kodi: 'Kodi',
  pack: 'Pack',
  dus: 'Dus',
  kg: 'Kg',
  gram: 'Gram',
  ons: 'Ons',
  liter: 'Liter',
  ml: 'ml',
  meter: 'Meter',
  cm: 'cm',
  lembar: 'Lembar',
  set: 'Set',
  pasang: 'Pasang',
  orang: 'Orang',
  unit: 'Unit',
  rim: 'Rim',
  batang: 'Batang',
}

export interface ReceiptBusiness {
  displayName: string | null
  logoUrl: string | null
  phone: string | null
  instagram: string | null
  whatsapp: string | null
  address: string | null
}

interface NoteReceiptProps {
  business: ReceiptBusiness | null | undefined
  items: NoteItem[]
  grandTotal: number
  noteNumber: string
  date: string
  customerName?: string | null
  customerPhone?: string | null
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
    fontSize: '18px',
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    fontWeight: 700,
    color: '#1f2937',
    margin: '0 0 0',
  },
  info: {
    fontSize: '12px',
    color: '#6b7280',
    margin: '1px 0 0',
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
    padding: '4px 8px',
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
    padding: '4px 8px',
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
  social: {
    textAlign: 'center' as const,
    fontSize: '12px',
    color: '#6b7280',
    margin: '0',
  },
}

function formatUnit(item: NoteItem): string {
  return `${item.quantity} ${UNIT_LABELS[item.unit] || item.unit}`
}

const NoteReceipt = forwardRef<HTMLDivElement, NoteReceiptProps>(function NoteReceipt(
  { business, items, grandTotal, noteNumber, date, customerName, customerPhone },
  ref,
) {
  const logoUrl = business?.logoUrl || null

  return (
    <div ref={ref} style={s.wrapper}>
      <div style={{ ...s.center, ...s.mb6 }}>
        {logoUrl ? (
          <img src={logoUrl} alt="Logo" style={s.logo} />
        ) : (
          <div style={s.logoFallback}>
            <span style={s.logoInitials}>
              {(business?.displayName || 'N').slice(0, 2).toUpperCase()}
            </span>
          </div>
        )}
        <h2 style={s.bizName}>{business?.displayName || 'Nama Bisnis'}</h2>
      </div>

      <hr style={s.divider} />

      <div style={{ ...s.center, marginBottom: '16px' }}>
        <h3 style={s.noteTitle}>Nota</h3>
        <p style={s.noteMeta}>
          {noteNumber} | {formatDate(date)}
        </p>
        {customerName && (
          <p style={{ ...s.noteMeta, marginTop: '4px' }}>Kepada Yth: {customerName}</p>
        )}
        {customerPhone && <p style={{ ...s.noteMeta, marginTop: '2px' }}>Telp: {customerPhone}</p>}
      </div>

      <table style={s.table}>
        <thead>
          <tr>
            <th style={s.thCenter}>Jumlah</th>
            <th style={s.th}>Nama</th>
            <th style={s.thRight}>Harga</th>
            <th style={s.thRightLast}>Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={`${item.name}-${i}`}>
              <td style={s.tdCenter}>{formatUnit(item)}</td>
              <td style={s.td}>{item.name}</td>
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
        {business?.whatsapp ? (
          <span style={s.social}>WA: {business.whatsapp}</span>
        ) : (
          business?.phone && <p style={s.social}>Telp: {business.phone}</p>
        )}
        {business?.instagram && <span style={s.social}>IG: @{business.instagram}</span>}
        {business?.address && <p style={s.social}>{business.address}</p>}
      </div>
    </div>
  )
})

export default NoteReceipt
