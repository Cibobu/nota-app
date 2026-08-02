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
  logoUrl: string | null
  createdAt: string
  updatedAt: string
}

export interface NoteItem {
  name: string
  quantity: number
  unit: string
  price: number
  total: number
}

export interface Note {
  id: string
  noteNumber: string
  customerName: string | null
  customerPhone: string | null
  date: string
  items: NoteItem[]
  grandTotal: number
  createdAt: string
  shareToken: string | null
}

export interface PublicNoteBusiness {
  displayName: string | null
  ownerName: string | null
  address: string | null
  phone: string | null
  instagram: string | null
  whatsapp: string | null
  logoBase64: string | null
  logoUrl: string | null
}

export interface PublicNote {
  noteNumber: string
  date: string
  customerName: string | null
  customerPhone: string | null
  items: NoteItem[]
  grandTotal: number
  business: PublicNoteBusiness
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
