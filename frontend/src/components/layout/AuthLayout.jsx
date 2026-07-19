import React from 'react'
import { Outlet } from 'react-router-dom'
import { Leaf, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen">
      {/* Left side - Branding */}
      <div className="relative hidden w-0 flex-1 flex-col justify-center bg-slate-900 lg:flex">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
        <div className="absolute inset-0 gradient-brand opacity-80 mix-blend-multiply"></div>
        
        <div className="relative z-10 px-16 py-12 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <span className="font-display text-3xl font-bold">AgriSense AI</span>
            </div>

            <h1 className="mb-6 font-display text-4xl font-bold leading-tight lg:text-5xl">
              Smart farming decisions powered by Artificial Intelligence
            </h1>
            
            <p className="mb-12 text-lg text-emerald-50">
              Join thousands of progressive farmers optimizing their yield, predicting market prices, and protecting crops with AgriSense AI.
            </p>

            <div className="space-y-4">
              {[
                'Real-time Mandi price predictions',
                'AI-driven crop disease detection',
                'Hyper-local weather intelligence',
                'Personalized farming copilot'
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3 text-emerald-100">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24 bg-white dark:bg-slate-950">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          {/* Mobile Logo */}
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-primary">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <span className="font-display text-2xl font-bold text-slate-900 dark:text-white">AgriSense AI</span>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  )
}
