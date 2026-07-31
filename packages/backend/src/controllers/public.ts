import type { Request, Response } from 'express'
import { prisma } from '../lib/prisma.js'

export async function getPublicNote(req: Request, res: Response) {
  try {
    const { token } = req.params as { token: string }
    if (!token) {
      res.status(400).json({ error: 'Token diperlukan' })
      return
    }

    const note = await prisma.note.findUnique({ where: { shareToken: token } })
    if (!note) {
      res.status(404).json({ error: 'Nota tidak ditemukan' })
      return
    }

    const profile = await prisma.businessProfile.findUnique({ where: { userId: note.userId } })

    res.set('Cache-Control', 'no-store')
    res.json({
      noteNumber: note.noteNumber,
      date: note.date,
      customerName: note.customerName,
      customerPhone: note.customerPhone,
      items: JSON.parse(note.items),
      grandTotal: note.grandTotal,
      business: {
        displayName: profile?.displayName || null,
        ownerName: profile?.ownerName || null,
        address: profile?.address || null,
        phone: profile?.phone || null,
        instagram: profile?.instagram || null,
        whatsapp: profile?.whatsapp || null,
        logoBase64: profile?.logoBase64 || null,
      },
    })
  } catch (error) {
    console.error('Failed to fetch public note:', error)
    res.status(500).json({ error: 'Gagal memuat nota' })
  }
}
