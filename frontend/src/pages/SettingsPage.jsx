import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings, Moon, Sun, Globe, Bell, Database, ShieldCheck, RefreshCw, Check, Trash2, Cpu } from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'
import { Card, Button, Badge } from '../components/ui'
import { useTheme } from '../contexts/ThemeContext'
import { useLanguage } from '../contexts/LanguageContext'
import { toast } from 'react-hot-toast'

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme()
  const { language, changeLanguage } = useLanguage()

  const [notifications, setNotifications] = useState({
    priceAlerts: true,
    weatherAlerts: true,
    weeklyReport: false,
  })

  const [clearingCache, setClearingCache] = useState(false)

  const handleNotificationToggle = (key) => {
    setNotifications(prev => {
      const updated = { ...prev, [key]: !prev[key] }
      toast.success('Notification settings saved')
      return updated
    })
  }

  const handleClearCache = () => {
    setClearingCache(true)
    setTimeout(() => {
      localStorage.removeItem('agrisense_search_history')
      toast.success('Local market cache and history cleared')
      setClearingCache(false)
    }, 600)
  }

  return (
    <PageWrapper 
      title="Settings" 
      subtitle="Customize application behavior, notifications, and preferences"
      icon={Settings}
    >
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Theme & Display Settings */}
        <Card className="p-6 bg-slate-900/60 border-slate-800 backdrop-blur-xl">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Sun className="text-amber-400" size={20} />
            Appearance & Theme
          </h3>
          <p className="text-slate-400 text-sm mb-6">Choose your preferred visual theme for viewing market charts and intelligence data.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => theme !== 'dark' && toggleTheme()}
              className={`p-4 rounded-xl border flex items-center gap-4 transition-all text-left ${
                theme === 'dark' 
                  ? 'border-emerald-500 bg-emerald-500/10 text-white' 
                  : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-emerald-400">
                <Moon size={20} />
              </div>
              <div>
                <p className="font-semibold text-white">Dark Theme (Default)</p>
                <p className="text-xs text-slate-400">Easy on the eyes in low light conditions</p>
              </div>
            </button>

            <button
              onClick={() => theme === 'dark' && toggleTheme()}
              className={`p-4 rounded-xl border flex items-center gap-4 transition-all text-left ${
                theme !== 'dark' 
                  ? 'border-emerald-500 bg-emerald-500/10 text-white' 
                  : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-amber-400">
                <Sun size={20} />
              </div>
              <div>
                <p className="font-semibold text-white">Light Theme</p>
                <p className="text-xs text-slate-400">High contrast for sunlight outdoor viewing</p>
              </div>
            </button>
          </div>
        </Card>

        {/* Language Preferences */}
        <Card className="p-6 bg-slate-900/60 border-slate-800 backdrop-blur-xl">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Globe className="text-sky-400" size={20} />
            Language / भाषा
          </h3>
          <p className="text-slate-400 text-sm mb-6">Select your primary language for Mandi prices, Copilot AI advice, and alerts.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => changeLanguage('en')}
              className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                language === 'en' 
                  ? 'border-emerald-500 bg-emerald-500/10 text-white' 
                  : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div>
                <p className="font-semibold text-white">English</p>
                <p className="text-xs text-slate-400">Standard English interface</p>
              </div>
              {language === 'en' && <Check size={18} className="text-emerald-400" />}
            </button>

            <button
              onClick={() => changeLanguage('hi')}
              className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                language === 'hi' 
                  ? 'border-emerald-500 bg-emerald-500/10 text-white' 
                  : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div>
                <p className="font-semibold text-white">हिंदी (Hindi)</p>
                <p className="text-xs text-slate-400">भारतीय किसानों के लिए हिंदी इंटरफेस</p>
              </div>
              {language === 'hi' && <Check size={18} className="text-emerald-400" />}
            </button>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card className="p-6 bg-slate-900/60 border-slate-800 backdrop-blur-xl">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Bell className="text-purple-400" size={20} />
            Alerts & Notifications
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-800">
              <div>
                <p className="font-medium text-white text-sm">Price Threshold Alerts</p>
                <p className="text-xs text-slate-400">Get notified when tracked crop prices cross target levels</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.priceAlerts}
                onChange={() => handleNotificationToggle('priceAlerts')}
                className="w-5 h-5 accent-emerald-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-800">
              <div>
                <p className="font-medium text-white text-sm">Weather Risk Warnings</p>
                <p className="text-xs text-slate-400">Receive extreme weather advisories for your state</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.weatherAlerts}
                onChange={() => handleNotificationToggle('weatherAlerts')}
                className="w-5 h-5 accent-emerald-500 cursor-pointer"
              />
            </div>
          </div>
        </Card>

        {/* System & Cache Management */}
        <Card className="p-6 bg-slate-900/60 border-slate-800 backdrop-blur-xl">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Cpu className="text-teal-400" size={20} />
            System & Cache Management
          </h3>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-800/30 border border-slate-800">
            <div>
              <p className="font-medium text-white text-sm">Clear Local Data & Cache</p>
              <p className="text-xs text-slate-400">Purges saved local search queries, filter states, and temporary market data.</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearCache}
              isLoading={clearingCache}
              className="border-slate-700 hover:bg-red-500/10 hover:text-red-400 shrink-0"
            >
              <Trash2 size={14} className="mr-2" />
              Clear Cache
            </Button>
          </div>
        </Card>

      </div>
    </PageWrapper>
  )
}
