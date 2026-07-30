import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { path: '/', label: 'Beranda' },
  { path: '/profile', label: 'Profil' },
  { path: '/create', label: 'Buat Nota' },
  { path: '/history', label: 'Riwayat' },
]

export default function Navbar() {
  const { pathname } = useLocation()

  return (
    <div className="navbar bg-base-100 shadow-sm border-b border-base-200">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl font-heading font-bold text-primary px-2">
          Nota Pintar
        </Link>
      </div>
      <div className="hidden sm:flex gap-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`btn btn-ghost btn-sm ${pathname === item.path ? 'btn-active text-primary' : ''}`}
          >
            {item.label}
          </Link>
        ))}
      </div>
      <div className="sm:hidden dropdown dropdown-end">
        <div tabIndex={0} role="button" className="btn btn-ghost btn-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </div>
        <ul className="menu dropdown-content z-30 mt-3 p-2 shadow bg-base-100 rounded-box w-52">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link to={item.path} className={pathname === item.path ? 'active' : ''}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
