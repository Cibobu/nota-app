import { prisma } from './prisma.js'

export function buildNoteNumber(sequence: number, now: Date): string {
  const seq = String(sequence).padStart(3, '0')
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const yy = String(now.getFullYear()).slice(-2)
  return `Nota-${seq}/${mm}/${yy}`
}

export async function getNextNoteNumber(userId: string, now = new Date()): Promise<string> {
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  const count = await prisma.note.count({
    where: {
      userId,
      createdAt: { gte: startOfMonth, lt: startOfNextMonth },
    },
  })
  return buildNoteNumber(count + 1, now)
}
