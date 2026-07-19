import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center dark:bg-slate-950">
      <h1 className="text-9xl font-bold text-slate-200 dark:text-slate-800">404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-slate-900 dark:text-white">Page not found</h2>
      <p className="mt-2 text-slate-500">The page you are looking for doesn't exist or has been moved.</p>
      <Button 
        className="mt-8"
        onClick={() => navigate('/dashboard')}
      >
        Back to Dashboard
      </Button>
    </div>
  )
}
