import React, { Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import DashboardLayout from './components/layout/DashboardLayout'
import AuthLayout from './components/layout/AuthLayout'
import { useAuth } from './contexts/AuthContext'
import { Spinner } from './components/ui'

// Lazy loading pages
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'))
const PricesPage = React.lazy(() => import('./pages/PricesPage'))
const CopilotPage = React.lazy(() => import('./pages/CopilotPage'))
const PredictionsPage = React.lazy(() => import('./pages/PredictionsPage'))
const WeatherPage = React.lazy(() => import('./pages/WeatherPage'))
const NewsPage = React.lazy(() => import('./pages/NewsPage'))
const AlertsPage = React.lazy(() => import('./pages/AlertsPage'))
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'))
const SettingsPage = React.lazy(() => import('./pages/SettingsPage'))
const AdminPage = React.lazy(() => import('./pages/AdminPage'))
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'))
const LoginPage = React.lazy(() => import('./pages/auth/LoginPage'))
const RegisterPage = React.lazy(() => import('./pages/auth/RegisterPage'))
const LandingPage = React.lazy(() => import('./pages/LandingPage'))

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, user, isLoading } = useAuth()
  
  if (isLoading) return <div className="h-screen w-screen flex items-center justify-center"><Spinner size="xl" color="brand" /></div>
  
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (requireAdmin && user?.role !== 'admin') return <Navigate to="/dashboard" replace />
  
  return children
}

const LoadingFallback = () => (
  <div className="flex h-full w-full items-center justify-center min-h-[50vh]">
    <Spinner size="lg" color="brand" />
  </div>
)

export default function App() {
  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Public Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Public Auth Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* Public Routes inside Dashboard */}
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/prices" element={<PricesPage />} />
              <Route path="/copilot" element={<CopilotPage />} />
              <Route path="/predictions" element={<PredictionsPage />} />
              <Route path="/weather" element={<WeatherPage />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/alerts" element={<AlertsPage />} />
              
              {/* Protected Routes inside Dashboard */}
              <Route element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/admin" element={<AdminPage />} />
              </Route>
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </AnimatePresence>
    </BrowserRouter>
  )
}
