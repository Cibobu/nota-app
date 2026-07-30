export interface User {
  id: string
  email: string | null
  phone: string | null
  token?: string
}

export interface BusinessProfile {
  id: string
  userId: string
  displayName: string | null
  address: string | null
  phone: string | null
  email: string | null
  ownerName: string | null
  instagram: string | null
  whatsapp: string | null
  website: string | null
  logoBase64: string | null
  createdAt: string
  updatedAt: string
}

export interface NoteItem {
  name: string
  quantity: number
  price: number
  total: number
}

export interface Note {
  id: string
  noteNumber: string
  customerName: string | null
  date: string
  items: NoteItem[]
  grandTotal: number
  createdAt: string
}

export interface Stats {
  id: number
  visitorCount: number
  downloadCount: number
}

export interface LoginResponse {
  user: User
  profile: BusinessProfile | null
  isNew: boolean
}
