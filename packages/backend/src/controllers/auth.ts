import crypto from 'node:crypto'
import type { Request, Response } from 'express'
import { prisma } from '../lib/prisma.js'

function generateToken(): string {
  return crypto.randomUUID()
}

export async function login(req: Request, res: Response) {
  try {
    const { identifier } = req.body as { identifier: string }
    if (!identifier?.trim()) {
      res.status(400).json({ error: 'Email atau no HP harus diisi' })
      return
    }

    const isEmail = identifier.includes('@')
    let user: { id: string; email: string | null; phone: string | null } | null = null

    if (isEmail) {
      user = await prisma.user.findUnique({ where: { email: identifier.trim() } })
    } else {
      user = await prisma.user.findUnique({ where: { phone: identifier.trim() } })
    }

    if (user) {
      const token = generateToken()
      await prisma.user.update({ where: { id: user.id }, data: { token } })

      const profile = await prisma.businessProfile.findUnique({ where: { userId: user.id } })

      res.json({
        user: { id: user.id, email: user.email, phone: user.phone, token },
        profile,
        isNew: !profile,
      })
    } else {
      const token = generateToken()
      const data: Record<string, string> = { token }
      if (isEmail) data.email = identifier.trim()
      else data.phone = identifier.trim()

      user = await prisma.user.create({ data: data as any })

      res.json({
        user: { id: user.id, email: user.email, phone: user.phone, token },
        profile: null,
        isNew: true,
      })
    }
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Gagal login' })
  }
}

export async function getMe(req: Request, res: Response) {
  try {
    const userId = (req as any).userId
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }
    const profile = await prisma.businessProfile.findUnique({ where: { userId: user.id } })
    res.json({ user: { id: user.id, email: user.email, phone: user.phone }, profile })
  } catch (error) {
    res.status(500).json({ error: 'Gagal memuat user' })
  }
}
