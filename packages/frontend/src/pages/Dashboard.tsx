import { Clock, Download, Eye, FileText, Plus } from 'lucide-react'
import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useNavigate } from 'react-router-dom'
import StatsCard from '../components/ui/StatsCard'
import { useStats, useTrackVisit } from '../hooks/useStats'
import { useAuth } from '../lib/auth'

export default function Dashboard() {
  const { user, profile } = useAuth()
  const { data: stats, isLoading } = useStats()
  const trackVisit = useTrackVisit()
  const navigate = useNavigate()

  useEffect(() => {
    const visited = sessionStorage.getItem('visited')
    if (!visited) {
      trackVisit.mutate()
      sessionStorage.setItem('visited', 'true')
    }
  }, [trackVisit])

  if (!user) {
    navigate('/login')
    return null
  }

  return (
    <>
      <Helmet>
        <title>Nota Pintar - Buat Nota Online Gratis</title>
        <meta
          name="description"
          content="Buat nota/invoice online gratis. Download PDF/JPG, share ke WhatsApp."
        />
      </Helmet>

      <div className="space-y-8 animate-fade-in">
        <div className="rounded-box bg-gradient-to-br from-primary to-primary/90 text-primary-content p-8 sm:p-12">
          <div className="max-w-xl">
            <h1 className="text-2xl sm:text-3xl font-heading font-bold mb-3">
              {profile?.displayName ? `Halo, ${profile.displayName}!` : 'Nota Pintar'}
            </h1>
            <p className="text-sm sm:text-base text-primary-content/75 mb-8 leading-relaxed">
              Buat nota / invoice online gratis. Download PDF atau JPG, langsung share ke pelanggan
              via WhatsApp dan sosmed.
            </p>
            <Link
              to="/create"
              className="btn btn-accent btn-lg font-semibold shadow-sm transition-all inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Buat Nota Baru
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {isLoading ? (
            <>
              <div className="card bg-base-100 shadow-sm border border-base-300">
                <div className="card-body p-5">
                  <div className="skeleton h-4 w-24 mb-2" />
                  <div className="skeleton h-8 w-16" />
                </div>
              </div>
              <div className="card bg-base-100 shadow-sm border border-base-300">
                <div className="card-body p-5">
                  <div className="skeleton h-4 w-28 mb-2" />
                  <div className="skeleton h-8 w-16" />
                </div>
              </div>
            </>
          ) : (
            <>
              <StatsCard
                title="Total Pengunjung"
                value={stats?.visitorCount ?? 0}
                icon={<Eye className="w-5 h-5" />}
                color="primary"
              />
              <StatsCard
                title="Total Download Nota"
                value={stats?.downloadCount ?? 0}
                icon={<Download className="w-5 h-5" />}
                color="secondary"
              />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            to="/profile"
            className="card bg-base-100 shadow-sm border border-base-300 hover:border-primary/40 hover:shadow-md transition-all duration-200 group"
          >
            <div className="card-body p-5">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/15 transition-colors">
                <FileText className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-sm mb-1">Profil Bisnis</h3>
              <p className="text-xs text-base-content/50 leading-relaxed">
                Atur logo, alamat, kontak bisnis Anda
              </p>
            </div>
          </Link>

          <Link
            to="/create"
            className="card bg-base-100 shadow-sm border border-base-300 hover:border-secondary/40 hover:shadow-md transition-all duration-200 group"
          >
            <div className="card-body p-5">
              <div className="w-9 h-9 rounded-lg bg-secondary/10 flex items-center justify-center mb-3 group-hover:bg-secondary/15 transition-colors">
                <Plus className="w-4 h-4 text-secondary" />
              </div>
              <h3 className="font-heading font-semibold text-sm mb-1">Buat Nota Baru</h3>
              <p className="text-xs text-base-content/50 leading-relaxed">
                Buat nota dengan cepat, tinggal isi lalu download
              </p>
            </div>
          </Link>

          <Link
            to="/history"
            className="card bg-base-100 shadow-sm border border-base-300 hover:border-accent/40 hover:shadow-md transition-all duration-200 group"
          >
            <div className="card-body p-5">
              <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center mb-3 group-hover:bg-accent/15 transition-colors">
                <Clock className="w-4 h-4 text-accent" />
              </div>
              <h3 className="font-heading font-semibold text-sm mb-1">Riwayat Nota</h3>
              <p className="text-xs text-base-content/50 leading-relaxed">
                Lihat dan unduh ulang nota yang sudah dibuat
              </p>
            </div>
          </Link>
        </div>
      </div>
    </>
  )
}
