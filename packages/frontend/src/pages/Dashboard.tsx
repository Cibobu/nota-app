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

      <div className="space-y-6">
        <div className="hero bg-primary text-primary-content rounded-box p-8 sm:p-12">
          <div className="hero-content text-center p-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-heading font-bold mb-2">
                {profile?.displayName ? `Halo, ${profile.displayName}!` : 'Nota Pintar'}
              </h1>
              <p className="text-sm sm:text-base text-primary-content/80 mb-6 max-w-lg">
                Buat nota / invoice online gratis. Download PDF atau JPG, langsung share ke
                pelanggan via WhatsApp dan sosmed.
              </p>
              <Link to="/create" className="btn btn-accent btn-lg text-white">
                Buat Nota Baru
              </Link>
            </div>
          </div>
        </div>

        <div className="stats shadow-sm w-full bg-base-100 border border-base-200">
          {isLoading ? (
            <div className="stat">
              <div className="skeleton h-4 w-20 mb-2" />
              <div className="skeleton h-8 w-16" />
            </div>
          ) : (
            <>
              <StatsCard
                title="Total Pengunjung"
                value={stats?.visitorCount ?? 0}
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                }
                color="primary"
              />
              <StatsCard
                title="Total Download Nota"
                value={stats?.downloadCount ?? 0}
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                }
                color="secondary"
              />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/profile"
            className="card bg-base-100 shadow-sm border border-base-200 hover:border-primary transition-colors"
          >
            <div className="card-body p-5">
              <h3 className="card-title text-sm font-heading">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Profil Bisnis
              </h3>
              <p className="text-xs text-base-content/60">Atur logo, alamat, kontak bisnis Anda</p>
            </div>
          </Link>

          <Link
            to="/create"
            className="card bg-base-100 shadow-sm border border-base-200 hover:border-secondary transition-colors"
          >
            <div className="card-body p-5">
              <h3 className="card-title text-sm font-heading">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-secondary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Buat Nota Baru
              </h3>
              <p className="text-xs text-base-content/60">
                Buat nota dengan cepat, tinggal isi lalu download
              </p>
            </div>
          </Link>

          <Link
            to="/history"
            className="card bg-base-100 shadow-sm border border-base-200 hover:border-accent transition-colors"
          >
            <div className="card-body p-5">
              <h3 className="card-title text-sm font-heading">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Riwayat Nota
              </h3>
              <p className="text-xs text-base-content/60">
                Lihat dan unduh ulang nota yang sudah dibuat
              </p>
            </div>
          </Link>
        </div>
      </div>
    </>
  )
}
