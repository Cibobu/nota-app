import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { VercelRequest, VercelResponse } from '@vercel/node'

function getBaseUrl() {
  const raw = process.env.VITE_API_URL || '/api'
  return raw.endsWith('/api') ? raw : `${raw}/api`
}

function getHtmlTemplate(): string {
  const candidates = [
    join(process.cwd(), 'dist', 'index.html'),
    join(process.cwd(), 'packages', 'frontend', 'dist', 'index.html'),
  ]
  for (const p of candidates) {
    if (existsSync(p)) return readFileSync(p, 'utf-8')
  }
  return ''
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { token } = req.query as { token: string }

  if (!token) {
    res.statusCode = 404
    res.setHeader('Content-Type', 'text/html')
    return res.end(notFoundHtml())
  }

  try {
    const apiUrl = `${getBaseUrl()}/public/notes/${encodeURIComponent(token)}`
    const noteRes = await fetch(apiUrl)

    if (!noteRes.ok) {
      res.statusCode = 404
      res.setHeader('Content-Type', 'text/html')
      return res.end(notFoundHtml())
    }

    const note = await noteRes.json()
    const displayName = note.business?.displayName || note.business?.ownerName || 'Nota Pintar'
    const customerLabel = note.customerName ? `untuk ${note.customerName}` : ''
    const totalFormatted = note.grandTotal.toLocaleString('id-ID')
    const itemLabel = `${note.items.length} item`
    const title = `Nota ${note.noteNumber} — ${displayName} | Nota Pintar`
    const desc = customerLabel
      ? `Nota ${customerLabel} — ${itemLabel}, total Rp${totalFormatted}. Lihat selengkapnya.`
      : `${itemLabel} dengan total Rp${totalFormatted}. Nota online dari ${displayName}.`

    let html = getHtmlTemplate()

    if (!html) {
      html = [
        '<!doctype html>',
        '<html lang="id" data-theme="notapintar">',
        '<head>',
        '<meta charset="UTF-8" />',
        '<meta name="viewport" content="width=device-width, initial-scale=1.0" />',
        '<title>{{TITLE}}</title>',
        '<meta name="description" content="{{DESC}}" />',
        '<meta property="og:title" content="{{TITLE}}" />',
        '<meta property="og:description" content="{{DESC}}" />',
        '<meta property="og:type" content="website" />',
        '</head>',
        '<body>',
        '<div id="root"></div>',
        '<script type="module" src="/src/main.tsx"></script>',
        '</body>',
        '</html>',
      ].join('\n')
    }

    html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    html = html.replace(
      /<meta name="description" content="[^"]*" \/>/,
      `<meta name="description" content="${desc.replace(/"/g, '&quot;')}" />`,
    )
    html = html.replace(
      /<meta property="og:title" content="[^"]*" \/>/,
      `<meta property="og:title" content="${title.replace(/"/g, '&quot;')}" />`,
    )
    html = html.replace(
      /<meta property="og:description" content="[^"]*" \/>/,
      `<meta property="og:description" content="${desc.replace(/"/g, '&quot;')}" />`,
    )

    res.statusCode = 200
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.end(html)
  } catch {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/html')
    res.end(fallbackHtml())
  }
}

function notFoundHtml(): string {
  const html = getHtmlTemplate()
  if (html) {
    return html.replace(/<title>.*?<\/title>/, '<title>Nota Tidak Ditemukan — Nota Pintar</title>')
  }
  return '<!doctype html><html lang="id"><head><meta charset="UTF-8"/><title>Nota Tidak Ditemukan</title></head><body><h1>Nota tidak ditemukan</h1></body></html>'
}

function fallbackHtml(): string {
  return getHtmlTemplate() || ''
}
