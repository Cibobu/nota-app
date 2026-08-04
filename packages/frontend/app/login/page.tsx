'use client'

import { useAuth } from '@/lib/auth'
import { FileText, LogIn, Mail } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!identifier.trim()) return

    setLoading(true)
    try {
      const { isNew } = await login(identifier.trim())
      toast.success(isNew ? 'Selamat datang! Silakan lengkapi profil' : 'Selamat datang kembali!')
      router.push(isNew ? '/profile' : '/')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-dvh bg-base-200 flex items-center justify-center p-4">
      <div className="card bg-base-100 shadow-sm border border-base-300 w-full max-w-sm animate-fade-in-up">
        <div className="card-body p-6 sm:p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center mx-auto mb-5">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-heading font-bold text-neutral">Nota Pintar</h1>
            <p className="text-sm text-base-content/50 mt-2">
              Masukkan email atau no HP untuk memulai
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="form-control w-full">
              <span className="label-text text-sm font-medium mb-2">Email atau No. Handphone</span>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/30" />
                <input
                  type="text"
                  className="input input-bordered w-full pl-11 h-12"
                  placeholder="contoh@email.com atau 0812xxxx"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
            </label>

            <button
              type="submit"
              className="btn btn-primary w-full h-12 mt-3 font-semibold transition-all duration-200"
              disabled={loading || !identifier.trim()}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Masuk
                </>
              )}
            </button>
          </form>

          <p className="text-xs text-base-content/40 text-center mt-5">
            Dengan masuk, kamu menyetujui penggunaan data untuk aplikasi ini
          </p>
        </div>
      </div>
    </div>
  )
}
