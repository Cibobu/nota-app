'use client'

import Navbar from '@/components/layout/Navbar'
import { useAuth } from '@/lib/auth'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, isNew } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!user) {
      router.replace('/login')
      return
    }
    if (isNew && pathname !== '/profile') {
      router.replace('/profile')
    }
  }, [user, isNew, pathname, router])

  if (!user) return null
  if (isNew && pathname !== '/profile') return null

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      <main className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">{children}</main>
    </div>
  )
}
