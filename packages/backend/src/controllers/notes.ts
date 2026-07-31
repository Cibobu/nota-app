import crypto from 'node:crypto'
import type { Request, Response } from 'express'
import { getNextNoteNumber } from '../lib/noteNumber.js'
import { prisma } from '../lib/prisma.js'
import type { CreateNoteBody } from '../types/index.js'

function generateShareToken(): string {
  return crypto.randomBytes(16).toString('hex')
}

export async function createNote(req: Request, res: Response) {
  try {
    const userId = (req as any).userId
    const { customerName, customerPhone, items, grandTotal } = req.body as CreateNoteBody

    if (!items?.length) {
      res.status(400).json({ error: 'Items cannot be empty' })
      return
    }

    const noteNumber = await getNextNoteNumber(userId)

    const note = await prisma.note.create({
      data: {
        userId,
        noteNumber,
        customerName: customerName || null,
        customerPhone: customerPhone || null,
        items: JSON.stringify(items),
        grandTotal,
        shareToken: generateShareToken(),
      },
    })

    res.status(201).json(note)
  } catch (error) {
    console.error('Failed to create note:', error)
    res.status(500).json({ error: 'Failed to create note' })
  }
}

export async function getNextNoteNumberHandler(req: Request, res: Response) {
  try {
    const userId = (req as any).userId
    const noteNumber = await getNextNoteNumber(userId)
    res.json({ noteNumber })
  } catch (error) {
    console.error('Failed to get next note number:', error)
    res.status(500).json({ error: 'Failed to get next note number' })
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
