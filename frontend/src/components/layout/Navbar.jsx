import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Menu, Search, Bell, Sun, Moon, Languages } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { Avatar } from '../ui'
import { useAuth } from '../../contexts/AuthContext'

export const Navbar = ({ onMenuClick, onSearchClick }) => {
  const { theme, toggleTheme } = useTheme()
  const { language, toggleLanguage } = useLanguage()
  const { user } = useAuth()
  const [showNotifications, setShowNotifications] = useState(false)

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-slate-200 bg-white/80 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 sm:px-6">
      <button
        onClick={onMenuClick}
        className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-md dark:text-slate-400 dark:hover:bg-slate-800 md:hidden"
      >
        <Menu size={24} />
      </button>

      <div className="flex flex-1 items-center gap-4">
        <button
          onClick={onSearchClick}
          className="flex items-center gap-2 w-full max-w-sm px-3 py-2 text-sm text-slate-500 bg-slate-100 rounded-lg border border-transparent hover:border-slate-300 dark:bg-slate-800 dark:hover:border-slate-700 transition-colors"
        >
          <Search size={18} />
          <span className="hidden sm:inline-block">Search anywhere...</span>
          <span className="sm:hidden">Search</span>
          <kbd className="ml-auto hidden sm:inline-block rounded bg-slate-200 px-1.5 py-0.5 text-xs font-medium text-slate-500 dark:bg-slate-700 dark:text-slate-400">
            ⌘K
          </kbd>
        </button>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={toggleLanguage}
          className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-slate-100 text-slate-600 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
          title="Toggle Language"
        >
          <span className="text-sm font-bold">{language === 'en' ? 'EN' : 'HI'}</span>
        </button>

        <button
          onClick={toggleTheme}
          className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-slate-100 text-slate-600 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors relative overflow-hidden"
          title="Toggle Theme"
        >
          <motion.div
            initial={false}
            animate={{
              y: theme === 'dark' ? 30 : 0,
              opacity: theme === 'dark' ? 0 : 1,
            }}
            className="absolute"
          >
            <Sun size={20} />
          </motion.div>
          <motion.div
            initial={false}
            animate={{
              y: theme === 'dark' ? 0 : -30,
              opacity: theme === 'dark' ? 1 : 0,
            }}
            className="absolute"
          >
            <Moon size={20} />
          </motion.div>
        </button>

        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-slate-100 text-slate-600 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
          >
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border border-white dark:border-slate-900"></span>
          </button>
        </div>

        <div className="hidden sm:block h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>

        {user ? (
          <button className="flex items-center gap-2 focus:outline-none">
            <Avatar name={user.name || "User"} size="sm" status="online" />
          </button>
        ) : (
          <a href="/login" className="text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 px-4 py-1.5 rounded-lg transition-colors">
            Sign In
          </a>
        )}
      </div>
    </header>
  )
}
