import React from 'react'
import { PageWrapper } from '../components/layout/PageWrapper'
import { Card, Button, Input } from '../components/ui'
import { User } from 'lucide-react'

export default function ProfilePage() {
  return (
    <PageWrapper 
      title="Your Profile" 
      subtitle="Manage your personal information"
    >
      <Card className="max-w-2xl mx-auto p-6">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center">
            <User size={32} className="text-slate-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Profile Picture</h3>
            <p className="text-sm text-slate-500 mb-2">Upload a picture to personalize your account</p>
            <Button size="sm" variant="outline">Upload</Button>
          </div>
        </div>

        <form className="space-y-4" onSubmit={e => e.preventDefault()}>
          <div className="grid grid-cols-2 gap-4">
            <Input label="First Name" placeholder="John" />
            <Input label="Last Name" placeholder="Doe" />
          </div>
          <Input label="Email Address" type="email" placeholder="john@example.com" />
          <Input label="Phone Number" type="tel" placeholder="+91 98765 43210" />
          
          <div className="pt-4 border-t border-slate-100 mt-6">
            <Button type="button">Save Changes</Button>
          </div>
        </form>
      </Card>
    </PageWrapper>
  )
}
