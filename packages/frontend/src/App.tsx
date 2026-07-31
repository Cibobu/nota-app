import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Suspense, lazy } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Toaster } from 'sonner'
import Layout from './components/layout/Layout'
import { AuthProvider, useAuth } from './lib/auth'

const Login = lazy(() => import('./pages/Login'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Profile = lazy(() => import('./pages/Profile'))
const CreateNote = lazy(() => import('./pages/CreateNote'))
const Preview = lazy(() => import('./pages/Preview'))
const History = lazy(() => import('./pages/History'))
const PublicNote = lazy(() => import('./pages/PublicNote'))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

const raw = import.meta.env.PROD ? import.meta.env.VITE_API_URL || '/api' : '/api'
const API_BASE = raw.endsWith('/api') ? raw : `${raw}/api`

function Loading() {
  return (
    <div className="flex justify-center py-16">
      <span className="loading loading-spinner loading-md text-primary" />
    </div>
  )
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isNew } = useAuth()
  const location = useLocation()

  if (!user) return <Navigate to="/login" replace />
  if (isNew && location.pathname !== '/profile') return <Navigate to="/profile" replace />

  return <>{children}</>
}

function AppRoutes() {
  const { user } = useAuth()

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/s/:token" element={<PublicNote />} />
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/create" element={<CreateNote />} />
          <Route path="/preview/:id" element={<Preview />} />
          <Route path="/history" element={<History />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider apiBase={API_BASE}>
            <Toaster position="top-center" richColors />
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </HelmetProvider>
  )
}
