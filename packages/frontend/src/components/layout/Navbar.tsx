import { FileText, LogOut, Menu } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuth } from '../../lib/auth'

const navItems = [
  { path: '/', label: 'Beranda' },
  { path: '/profile', label: 'Profil' },
  { path: '/create', label: 'Buat Nota' },
  { path: '/history', label: 'Riwayat' },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
    toast.success('Sampai jumpa lagi!')
  }

  return (
    <div className="navbar sticky top-0 z-40 bg-base-100/95 backdrop-blur-sm border-b border-base-300">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl font-heading font-bold text-primary px-3">
          <FileText className="w-6 h-6" />
          Nota Pintar
        </Link>
      </div>
      <div className="hidden sm:flex gap-0.5 items-center">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`btn btn-ghost btn-sm font-medium transition-colors ${
              pathname === item.path
                ? 'bg-primary/10 text-primary'
                : 'text-base-content/60 hover:text-base-content'
            }`}
          >
            {item.label}
          </Link>
        ))}
        <div className="w-px h-6 bg-base-300 mx-1" />
        <button
          onClick={handleLogout}
          className="btn btn-ghost btn-sm text-base-content/50 hover:text-error transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
      <div className="sm:hidden dropdown dropdown-end">
        <div tabIndex={0} role="button" className="btn btn-ghost btn-sm">
          <Menu className="w-5 h-5" />
        </div>
        <ul className="menu dropdown-content z-30 mt-3 p-2 shadow bg-base-100 rounded-box w-52 border border-base-300">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link to={item.path} className={pathname === item.path ? 'active font-medium' : ''}>
                {item.label}
              </Link>
            </li>
          ))}
          <li className="border-t border-base-300 mt-1 pt-1" />
          <li>
            <button onClick={handleLogout} className="text-error">
              <LogOut className="w-4 h-4" />
              Keluar
            </button>
          </li>
        </ul>
      </div>
    </div>
  )
}
