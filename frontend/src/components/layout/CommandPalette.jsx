import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, CornerDownLeft, TrendingUp, Bot, CloudSun, LayoutDashboard } from 'lucide-react'

const ACTIONS = [
  { id: 'dashboard', title: 'Go to Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { id: 'prices', title: 'Check Market Prices', icon: TrendingUp, path: '/prices' },
  { id: 'copilot', title: 'Ask AI Copilot', icon: Bot, path: '/copilot' },
  { id: 'weather', title: 'View Weather', icon: CloudSun, path: '/weather' },
]

export const CommandPalette = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setQuery('')
    }
  }, [isOpen])

  const filteredActions = query === '' 
    ? ACTIONS 
    : ACTIONS.filter(action => action.title.toLowerCase().includes(query.toLowerCase()))

  const handleSelect = (path) => {
    navigate(path)
    onClose()
  }

  if (typeof window === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] sm:pt-[25vh] px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
          >
            <div className="flex items-center px-4 py-3 border-b border-slate-200 dark:border-slate-800">
              <Search className="w-5 h-5 text-slate-400 mr-3" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search commands, pages, and data..."
                className="flex-1 bg-transparent border-none outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
              />
              <span className="text-xs text-slate-400 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5">ESC</span>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-2">
              {filteredActions.length === 0 ? (
                <div className="py-14 text-center text-sm text-slate-500">
                  No results found for "{query}"
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredActions.map((action, index) => (
                    <button
                      key={action.id}
                      onClick={() => handleSelect(action.path)}
                      className="w-full flex items-center justify-between px-3 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors">
                          <action.icon size={16} />
                        </div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                          {action.title}
                        </span>
                      </div>
                      <CornerDownLeft size={14} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}
