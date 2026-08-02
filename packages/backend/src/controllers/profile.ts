import { v2 as cloudinary } from 'cloudinary'
import type { Request, Response } from 'express'
import { getCache, setCache, setCacheHeaders } from '../lib/cache.js'
import { prisma } from '../lib/prisma.js'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'demo',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
})

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
      logoUrl,
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

    const data: Record<string, string | null> = {
      displayName: displayName.trim(),
      address: address.trim(),
      phone: phone?.trim() || null,
      email: email?.trim() || null,
      ownerName: ownerName?.trim() || null,
      instagram: instagram?.trim() || null,
      whatsapp: whatsapp?.trim() || null,
      website: website?.trim() || null,
    }

    if (logoUrl !== undefined) {
      data.logoUrl = logoUrl || null
    }
    if (logoBase64 !== undefined) {
      data.logoBase64 = logoBase64 || null
    }

    const profile = await prisma.businessProfile.upsert({
      where: { userId },
      create: { userId, ...data } as any,
      update: data,
    })

    setCache(cacheKey(userId), profile)
    res.json(profile)
  } catch (error) {
    res.status(500).json({ error: 'Gagal menyimpan profil' })
  }
}

export async function uploadLogo(req: Request, res: Response) {
  try {
    const userId = (req as any).userId
    const file = (req as any).file

    if (!file) {
      res.status(400).json({ error: 'No file uploaded' })
      return
    }

    const result = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'notapintar/logos',
          transformation: [{ width: 256, height: 256, crop: 'limit' }],
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        },
      )
      stream.end(file.buffer)
    })

    const logoUrl = result.secure_url
    const existing = await prisma.businessProfile.findUnique({ where: { userId } })

    if (existing) {
      await prisma.businessProfile.update({
        where: { userId },
        data: { logoUrl },
      })
    }

    setCache(cacheKey(userId), null)
    res.json({ logoUrl })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ error: 'Gagal upload logo' })
  }
}
