import React from 'react'
import { PageWrapper } from '../components/layout/PageWrapper'
import { Card } from '../components/ui'
import { Settings } from 'lucide-react'

export default function SettingsPage() {
  return (
    <PageWrapper 
      title="Settings" 
      subtitle="Manage your preferences"
    >
      <Card className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <Settings className="w-16 h-16 text-slate-400 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Account Settings</h2>
        <p className="text-slate-500 max-w-md">Notification preferences, display settings, and security options coming in Phase 2.</p>
      </Card>
    </PageWrapper>
  )
}
