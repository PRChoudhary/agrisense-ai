import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, TrendingUp, TrendingDown, Wheat, MapPin } from 'lucide-react'
import api from '../../../services/api' // To fetch crops/mandis for dropdowns
import { cn } from '../../../utils/cn'

export default function CreateAlertDialog({ isOpen, onClose, onSubmit, isSubmitting }) {
  const [direction, setDirection] = useState('ABOVE') // 'ABOVE' | 'BELOW'
  const [cropId, setCropId] = useState('')
  const [mandiId, setMandiId] = useState('')
  const [threshold, setThreshold] = useState('')

  const [crops, setCrops] = useState([])
  const [mandis, setMandis] = useState([])

  useEffect(() => {
    if (isOpen) {
      api.get('/crops?limit=50').then(res => setCrops(res.data?.data || []))
      api.get('/mandis/states').then(res => {
        // Flatten states into mandis for simplicity in this demo, or fetch specific mandis
        api.get('/mandis?limit=50').then(resM => setMandis(resM.data?.data || []))
      })
    }
  }, [isOpen])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!cropId || !threshold) return
    onSubmit({ cropId, mandiId, threshold: Number(threshold), direction })
  }

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCropId('')
      setMandiId('')
      setThreshold('')
      setDirection('ABOVE')
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white">Create Price Alert</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">
            {/* Crop Select */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <Wheat size={14} className="text-emerald-400" /> Select Crop *
              </label>
              <select
                required
                value={cropId}
                onChange={e => setCropId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              >
                <option value="">-- Choose a crop --</option>
                {crops.map(c => (
                  <option key={c.id} value={c.id}>{c.name} {c.nameHindi ? `(${c.nameHindi})` : ''}</option>
                ))}
              </select>
            </div>

            {/* Mandi Select */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <MapPin size={14} className="text-sky-400" /> Specific Mandi (Optional)
              </label>
              <select
                value={mandiId}
                onChange={e => setMandiId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              >
                <option value="">All Markets (National Average)</option>
                {mandis.map(m => (
                  <option key={m.id} value={m.id}>{m.name}, {m.city}</option>
                ))}
              </select>
            </div>

            {/* Direction & Threshold */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Condition *</label>
              <div className="flex gap-3">
                <div className="flex bg-slate-800 rounded-xl p-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => setDirection('ABOVE')}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all',
                      direction === 'ABOVE' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-500 hover:text-slate-300'
                    )}
                  >
                    <TrendingUp size={14} /> Above
                  </button>
                  <button
                    type="button"
                    onClick={() => setDirection('BELOW')}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all',
                      direction === 'BELOW' ? 'bg-rose-500/20 text-rose-400' : 'text-slate-500 hover:text-slate-300'
                    )}
                  >
                    <TrendingDown size={14} /> Below
                  </button>
                </div>
                
                <div className="relative flex-1">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">₹</span>
                  <input
                    type="number"
                    required
                    min="1"
                    value={threshold}
                    onChange={e => setThreshold(e.target.value)}
                    placeholder="Threshold price"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-8 pr-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-slate-300 hover:text-white font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !cropId || !threshold}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:shadow-none flex items-center gap-2"
            >
              {isSubmitting && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              Create Alert
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
