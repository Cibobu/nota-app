import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuth } from '../lib/auth'

export default function Login() {
  const [identifier, setIdentifier] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!identifier.trim()) return

    setLoading(true)
    try {
      const { isNew } = await login(identifier.trim())
      toast.success(isNew ? 'Selamat datang! Silakan lengkapi profil' : 'Selamat datang kembali!')
      navigate(isNew ? '/profile' : '/')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Masuk - Nota Pintar</title>
      </Helmet>

      <div className="hero min-h-[80vh]">
        <div className="hero-content w-full max-w-sm">
          <div className="card bg-base-100 shadow-xl w-full">
            <div className="card-body p-6 sm:p-8">
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-primary rounded-box flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-heading font-bold text-white">N</span>
                </div>
                <h1 className="text-xl font-heading font-bold">Nota Pintar</h1>
                <p className="text-sm text-base-content/60 mt-1">
                  Masukkan email atau no HP untuk memulai
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <label className="form-control w-full">
                  <span className="label-text text-sm">Email atau No. Handphone</span>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="contoh@email.com atau 0812xxxx"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                  />
                </label>

                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={loading || !identifier.trim()}
                >
                  {loading ? <span className="loading loading-spinner" /> : 'Masuk'}
                </button>
              </form>

              <p className="text-xs text-base-content/40 text-center mt-4">
                Dengan masuk, kamu menyetujui penggunaan data untuk aplikasi ini
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
