import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Phone, MapPin, Globe, Shield, Save, KeyRound, CheckCircle2 } from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'
import { Card, Button, Input, Select, Badge } from '../components/ui'
import { useAuth } from '../contexts/AuthContext'
import { INDIAN_STATES } from '../utils/constants'

export default function ProfilePage() {
  const { user, updateProfile, isGuest } = useAuth()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    state: '',
    preferredLang: 'EN',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        state: user.state || '',
        preferredLang: user.preferredLang || 'EN',
      })
    }
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSavedSuccess(false)
    try {
      await updateProfile({
        name: formData.name,
        phone: formData.phone,
        state: formData.state,
        preferredLang: formData.preferredLang,
      })
      setSavedSuccess(true)
      setTimeout(() => setSavedSuccess(false), 3000)
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const stateOptions = [
    { value: '', label: 'Select your state' },
    ...INDIAN_STATES.map(s => ({ value: s, label: s }))
  ]

  const langOptions = [
    { value: 'EN', label: 'English (English)' },
    { value: 'HI', label: 'Hindi (हिंदी)' },
  ]

  return (
    <PageWrapper 
      title="Your Profile" 
      subtitle="Manage your account information and regional preferences"
      icon={User}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* User Summary Header Card */}
        <Card className="p-6 bg-slate-900/60 border-slate-800 backdrop-blur-xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-emerald-500/20">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'AG'}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
                <CheckCircle2 size={14} className="text-white" />
              </div>
            </div>

            <div className="flex-1 text-center sm:text-left space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <h2 className="text-2xl font-bold text-white">{user?.name || 'Farmer Account'}</h2>
                <Badge variant={isGuest ? 'warning' : 'success'}>
                  {isGuest ? 'Guest Access' : (user?.role || 'Farmer')}
                </Badge>
              </div>
              <p className="text-slate-400 text-sm">{user?.email || 'guest@agrisense.ai'}</p>
              {user?.state && (
                <p className="text-emerald-400 text-xs flex items-center justify-center sm:justify-start gap-1 pt-1">
                  <MapPin size={12} /> {user.state}, India
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Profile Edit Form */}
        <Card className="p-6 sm:p-8 bg-slate-900/60 border-slate-800 backdrop-blur-xl">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <User className="text-emerald-500" size={20} />
            Personal Details
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <Input
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Ramesh Kumar"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  disabled
                  className="opacity-60 cursor-not-allowed"
                />
                <p className="text-xs text-slate-500 mt-1">Email cannot be modified</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Home State (Location)
                </label>
                <Select
                  value={formData.state}
                  onChange={e => setFormData({ ...formData, state: e.target.value })}
                  options={stateOptions}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Preferred Language
                </label>
                <Select
                  value={formData.preferredLang}
                  onChange={e => setFormData({ ...formData, preferredLang: e.target.value })}
                  options={langOptions}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              {savedSuccess ? (
                <span className="text-emerald-400 text-sm flex items-center gap-2">
                  <CheckCircle2 size={16} /> Changes saved successfully!
                </span>
              ) : <span />}

              <Button
                type="submit"
                isLoading={isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-6"
              >
                <Save size={16} className="mr-2" />
                Save Changes
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </PageWrapper>
  )
}
