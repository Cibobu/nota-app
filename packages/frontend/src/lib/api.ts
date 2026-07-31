const raw = import.meta.env.PROD ? import.meta.env.VITE_API_URL || '/api' : '/api'
const BASE_URL = raw.endsWith('/api') ? raw : `${raw}/api`

function getToken(): string | null {
  try {
    const saved = localStorage.getItem('notapintar_auth')
    if (saved) {
      const { token } = JSON.parse(saved)
      return token || null
    }
  } catch {}
  return null
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${BASE_URL}${url}`, {
    headers: { ...headers, ...(options?.headers as Record<string, string>) },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(err.error || `HTTP ${res.status}`)
  }
  return res.json()
}

export const api = {
  profile: {
    get: () => request<import('../types').BusinessProfile>('/profile'),
    update: (data: Record<string, string | null | undefined>) =>
      request<import('../types').BusinessProfile>('/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  },
  notes: {
    getAll: () => request<import('../types').Note[]>('/notes'),
    getById: (id: string) => request<import('../types').Note>(`/notes/${id}`),
    nextNumber: () => request<{ noteNumber: string }>('/notes/next-number'),
    create: (data: {
      customerName?: string
      customerPhone?: string
      items: import('../types').NoteItem[]
      grandTotal: number
    }) =>
      request<import('../types').Note>('/notes', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },
  public: {
    getNote: (token: string) =>
      request<import('../types').PublicNote>(`/public/notes/${encodeURIComponent(token)}`),
  },
  stats: {
    get: () => request<import('../types').Stats>('/stats'),
    visit: () => request<import('../types').Stats>('/stats/visit', { method: 'POST' }),
    download: () => request<import('../types').Stats>('/stats/download', { method: 'POST' }),
  },
}
