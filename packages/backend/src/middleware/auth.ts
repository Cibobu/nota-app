import type { NextFunction, Request, Response } from 'express'
import { prisma } from '../lib/prisma.js'

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }

    const token = authHeader.slice(7)
    const user = await prisma.user.findFirst({ where: { token } })

    if (!user) {
      res.status(401).json({ error: 'Invalid token' })
      return
    }
    ;(req as any).userId = user.id
    next()
  } catch {
    res.status(500).json({ error: 'Auth error' })
  }
}
