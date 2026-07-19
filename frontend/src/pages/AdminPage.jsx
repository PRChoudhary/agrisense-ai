import React from 'react'
import { PageWrapper } from '../components/layout/PageWrapper'
import { Card } from '../components/ui'
import { Shield } from 'lucide-react'

export default function AdminPage() {
  return (
    <PageWrapper 
      title="Admin Panel" 
      subtitle="System management and oversight"
    >
      <Card className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <Shield className="w-16 h-16 text-brand-primary mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Admin Dashboard</h2>
        <p className="text-slate-500 max-w-md">User management, system logs, and data administration tools coming in Phase 2.</p>
      </Card>
    </PageWrapper>
  )
}
