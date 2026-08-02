import { type ReactNode, createContext, useContext, useEffect, useState } from 'react'
import type { BusinessProfile, User } from '../types'

interface AuthState {
  user: User | null
  profile: BusinessProfile | null
  token: string | null
  isNew: boolean
  login: (identifier: string) => Promise<{ isNew: boolean }>
  logout: () => void
  setProfile: (profile: BusinessProfile) => void
}

const AuthContext = createContext<AuthState | null>(null)

const STORAGE_KEY = 'notapintar_auth'

function loadAuth(): { user: User | null; token: string | null } {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch {}
  return { user: null, token: null }
}

export function AuthProvider({ children, apiBase }: { children: ReactNode; apiBase: string }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [profile, setProfileState] = useState<BusinessProfile | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = loadAuth()
    if (saved.token && saved.user) {
      setUser(saved.user)
      setToken(saved.token)

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10_000)

      fetch(`${apiBase}/auth/me`, {
        headers: { Authorization: `Bearer ${saved.token}` },
        signal: controller.signal,
      })
        .then((r) => r.json())
        .then((data) => {
          clearTimeout(timeoutId)
          if (data.user) {
            setUser(data.user)
            setProfileState(data.profile)
            setIsNew(!data.profile)
          } else {
            localStorage.removeItem(STORAGE_KEY)
            setUser(null)
            setToken(null)
          }
        })
        .catch(() => {
          clearTimeout(timeoutId)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [apiBase])

  const login = async (identifier: string) => {
    const res = await fetch(`${apiBase}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier }),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Gagal login')
    }

    const data = await res.json()
    setUser(data.user)
    setToken(data.user.token)
    setProfileState(data.profile)
    setIsNew(data.isNew)

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        user: { id: data.user.id, email: data.user.email, phone: data.user.phone },
        token: data.user.token,
      }),
    )

    return { isNew: data.isNew }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    setProfileState(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  const setProfile = (p: BusinessProfile) => {
    setProfileState(p)
    setIsNew(false)
  }

  return (
    <AuthContext.Provider value={{ user, profile, token, isNew, login, logout, setProfile }}>
      {loading ? (
        <div className="min-h-dvh bg-base-200 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto animate-bounce shadow-lg">
              <span className="text-2xl font-heading font-bold text-white">N</span>
            </div>
            <p className="text-base-content/60 text-sm animate-pulse">Memuat...</p>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
