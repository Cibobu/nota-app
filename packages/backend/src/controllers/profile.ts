import type { Request, Response } from 'express'
import { getCache, setCache, setCacheHeaders } from '../lib/cache.js'
import { prisma } from '../lib/prisma.js'

const PROFILE_CACHE_KEY = 'profile:'

function cacheKey(userId: string) {
  return `${PROFILE_CACHE_KEY}${userId}`
}

export async function getProfile(req: Request, res: Response) {
  try {
    const userId = (req as any).userId
    const cached = getCache(cacheKey(userId))
    if (cached) {
      res.set(setCacheHeaders()).json(cached)
      return
    }

    const profile = await prisma.businessProfile.findUnique({ where: { userId } })

    if (profile) {
      setCache(cacheKey(userId), profile)
    }

    res.set(setCacheHeaders()).json(profile)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' })
  }
}

export async function updateProfile(req: Request, res: Response) {
  try {
    const userId = (req as any).userId
    const {
      displayName,
      address,
      phone,
      email,
      ownerName,
      instagram,
      whatsapp,
      website,
      logoBase64,
    } = req.body

    if (!displayName?.trim()) {
      res.status(400).json({ error: 'Nama pemilik/toko/brand wajib diisi' })
      return
    }
    if (!address?.trim()) {
      res.status(400).json({ error: 'Alamat wajib diisi' })
      return
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }

    if (user.email && !phone?.trim()) {
      res.status(400).json({ error: 'No HP wajib diisi (kamu daftar menggunakan email)' })
      return
    }
    if (user.phone && !email?.trim()) {
      res.status(400).json({ error: 'Email wajib diisi (kamu daftar menggunakan no HP)' })
      return
    }

    const data = {
      displayName: displayName.trim(),
      address: address.trim(),
      phone: phone?.trim() || null,
      email: email?.trim() || null,
      ownerName: ownerName?.trim() || null,
      instagram: instagram?.trim() || null,
      whatsapp: whatsapp?.trim() || null,
      website: website?.trim() || null,
      logoBase64: logoBase64 || null,
    }

    const profile = await prisma.businessProfile.upsert({
      where: { userId },
      create: { userId, ...data },
      update: data,
    })

    setCache(cacheKey(userId), profile)
    res.json(profile)
  } catch (error) {
    res.status(500).json({ error: 'Gagal menyimpan profil' })
  }
}
