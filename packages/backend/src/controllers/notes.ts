import type { Request, Response } from 'express'
import { prisma } from '../lib/prisma.js'
import type { CreateNoteBody } from '../types/index.js'

export async function createNote(req: Request, res: Response) {
  try {
    const userId = (req as any).userId
    const {
      noteNumber: customNoteNumber,
      customerName,
      items,
      grandTotal,
    } = req.body as CreateNoteBody

    if (!items?.length) {
      res.status(400).json({ error: 'Items cannot be empty' })
      return
    }

    const noteNumber = customNoteNumber || `NOTA-${String(Date.now()).slice(-6)}`

    const note = await prisma.note.create({
      data: {
        userId,
        noteNumber,
        customerName: customerName || null,
        items: JSON.stringify(items),
        grandTotal,
      },
    })

    res.status(201).json(note)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create note' })
  }
}

export async function getNotes(req: Request, res: Response) {
  try {
    const userId = (req as any).userId
    const notes = await prisma.note.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })

    const parsed = notes.map((note) => ({
      ...note,
      items: JSON.parse(note.items),
    }))

    res.json(parsed)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notes' })
  }
}

export async function getNoteById(req: Request, res: Response) {
  try {
    const userId = (req as any).userId
    const note = await prisma.note.findUnique({
      where: { id: String(req.params.id) },
    })

    if (!note || note.userId !== userId) {
      res.status(404).json({ error: 'Note not found' })
      return
    }

    res.json({ ...note, items: JSON.parse(note.items) })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch note' })
  }
}
