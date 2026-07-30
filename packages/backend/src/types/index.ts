export interface NoteItem {
  name: string
  quantity: number
  price: number
  total: number
}

export interface CreateNoteBody {
  noteNumber?: string
  customerName?: string
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
