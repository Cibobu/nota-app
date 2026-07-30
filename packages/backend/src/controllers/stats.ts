import type { Request, Response } from 'express'
import { getCache, setCache, setCacheHeaders } from '../lib/cache.js'
import { prisma } from '../lib/prisma.js'

async function getOrCreateStats() {
  let stats = await prisma.stats.findFirst()
  if (!stats) {
    stats = await prisma.stats.create({
      data: { visitorCount: 0, downloadCount: 0 },
    })
  }
  return stats
}

export async function getStats(_req: Request, res: Response) {
  try {
    const cached = getCache('stats')
    if (cached) {
      res.set(setCacheHeaders()).json(cached)
      return
    }

    const stats = await getOrCreateStats()
    setCache('stats', stats, 120_000)
    res.set(setCacheHeaders()).json(stats)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' })
  }
}

export async function incrementVisitor(_req: Request, res: Response) {
  try {
    const stats = await getOrCreateStats()
    const updated = await prisma.stats.update({
      where: { id: stats.id },
      data: { visitorCount: stats.visitorCount + 1 },
    })
    setCache('stats', updated, 120_000)
    res.json(updated)
  } catch (error) {
    res.status(500).json({ error: 'Failed to increment visitor' })
  }
}

export async function incrementDownload(_req: Request, res: Response) {
  try {
    const stats = await getOrCreateStats()
    const updated = await prisma.stats.update({
      where: { id: stats.id },
      data: { downloadCount: stats.downloadCount + 1 },
    })
    setCache('stats', updated, 120_000)
    res.json(updated)
  } catch (error) {
    res.status(500).json({ error: 'Failed to increment download' })
  }
}
