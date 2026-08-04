import type { Metadata } from 'next'
import PublicNoteClient from './PublicNoteClient'

async function fetchPublicNote(token: string) {
  const baseUrl = process.env.VITE_API_URL || 'http://localhost:4000'
  const apiBase = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`
  const res = await fetch(`${apiBase}/public/notes/${encodeURIComponent(token)}`)
  if (!res.ok) return null
  return res.json()
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string }>
}): Promise<Metadata> {
  const { token } = await params
  const note = await fetchPublicNote(token)

  if (!note) {
    return {
      title: 'Nota Tidak Ditemukan — Nota Pintar',
    }
  }

  const displayName = note.business?.displayName || note.business?.ownerName || 'Nota Pintar'
  const customerLabel = note.customerName ? `untuk ${note.customerName}` : ''
  const totalFormatted = note.grandTotal.toLocaleString('id-ID')
  const itemLabel = `${note.items.length} item`
  const title = `Nota ${note.noteNumber} — ${displayName} | Nota Pintar`
  const desc = customerLabel
    ? `Nota ${customerLabel} — ${itemLabel}, total Rp${totalFormatted}. Lihat selengkapnya.`
    : `${itemLabel} dengan total Rp${totalFormatted}. Nota online dari ${displayName}.`

  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      type: 'website',
    },
  }
}

export default async function PublicNotePage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  return <PublicNoteClient token={token} />
}
