import React from 'react'
import { motion } from 'framer-motion'
import { LayoutDashboard } from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'
import { useAuth } from '../contexts/AuthContext'
import { WeatherWidget, PredictionsWidget, AlertsWidget, NewsWidget, QuickActions } from '../features/dashboard'

export default function DashboardPage() {
  const { user } = useAuth()
  
  // Format current date: "Monday, October 24"
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <PageWrapper 
      title={`Welcome back, ${user?.name?.split(' ')[0] || 'Farmer'}! 👋`}
      subtitle={today}
      icon={LayoutDashboard}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Quick Actions Row */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <QuickActions />
        </motion.div>
        
        {/* Top Widgets Grid (Weather, Alerts, Predictions) */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <WeatherWidget />
          <PredictionsWidget />
          <AlertsWidget />
        </motion.div>

        {/* Bottom Widgets Grid (News spans 2 cols, maybe something else later) */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-8"
        >
          <NewsWidget />
          
          {/* A neat little promotional/info card for the 3rd column */}
          <div className="bg-gradient-to-br from-emerald-600 to-teal-800 rounded-2xl p-6 flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 mix-blend-overlay pointer-events-none">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <h3 className="text-white text-xl font-bold mb-2">Sell smarter, not harder.</h3>
            <p className="text-emerald-100 text-sm mb-6 leading-relaxed">
              AgriSense AI analyzes millions of data points across India to bring you actionable insights.
            </p>
            <div className="inline-flex items-center gap-2 bg-black/20 text-white text-sm font-medium px-4 py-2 rounded-xl backdrop-blur-sm self-start">
              100% Free for Farmers
            </div>
          </div>
        </motion.div>
        
      </div>
    </PageWrapper>
  )
}
