export interface NoteItem {
  name: string
  quantity: number
  price: number
  total: number
}

export interface CreateNoteBody {
  customerName?: string
  customerPhone?: string
  items: NoteItem[]
  grandTotal: number
}

export interface ProfileBody {
  businessName?: string
  address?: string
  phone?: string
  ownerName?: string
  instagram?: string
  whatsapp?: string
  website?: string
}
