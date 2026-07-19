import React from 'react'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  TrendingUp,
  Bot,
  Sparkles,
  CloudSun,
  Newspaper,
  BarChart3,
  Bell,
  User,
  Settings,
  Shield,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Leaf
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useTranslation } from 'react-i18next'
import { cn } from '../../utils/cn'

const MAIN_NAV = [
  { path: '/dashboard', icon: LayoutDashboard, labelKey: 'nav.dashboard' },
  { path: '/prices', icon: TrendingUp, labelKey: 'nav.marketPrices' },
]

const INTELLIGENCE_NAV = [
  { path: '/copilot', icon: Bot, labelKey: 'nav.aiCopilot' },
  { path: '/predictions', icon: Sparkles, labelKey: 'nav.predictions' },
  { path: '/weather', icon: CloudSun, labelKey: 'nav.weather' },
  { path: '/news', icon: Newspaper, labelKey: 'nav.news' },
  { path: '/analytics', icon: BarChart3, labelKey: 'nav.analytics' },
  { path: '/alerts', icon: Bell, labelKey: 'nav.alerts' },
]

export const Sidebar = ({ isCollapsed, onToggle }) => {
  const { user, logout } = useAuth()
  const { t } = useTranslation()

  const NavItem = ({ to, icon: Icon, labelKey }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn('sidebar-link group', isActive && 'active', isCollapsed && 'justify-center px-2')
      }
      title={isCollapsed ? t(labelKey) : undefined}
    >
      <Icon className={cn('flex-shrink-0 w-5 h-5', isCollapsed ? 'mx-auto' : '')} />
      {!isCollapsed && <span className="truncate">{t(labelKey)}</span>}
    </NavLink>
  )

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-0 z-40 h-screen bg-[#020617] border-r border-slate-800 flex flex-col hide-scrollbar"
    >
      {/* Logo Area */}
      <div className="flex h-16 shrink-0 items-center px-4 gap-3 border-b border-slate-800">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
          <Leaf size={20} />
        </div>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 overflow-hidden whitespace-nowrap"
          >
            <span className="text-xl font-bold font-display text-white">AgriSense</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-brand-primary text-white tracking-wider">AI</span>
          </motion.div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        <div>
          {!isCollapsed && <h3 className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Main</h3>}
          <div className="space-y-1">
            {MAIN_NAV.map((item) => (
              <NavItem key={item.path} to={item.path} icon={item.icon} labelKey={item.labelKey} />
            ))}
          </div>
        </div>

        <div>
          {!isCollapsed && <h3 className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Intelligence</h3>}
          <div className="space-y-1">
            {INTELLIGENCE_NAV.map((item) => (
              <NavItem key={item.path} to={item.path} icon={item.icon} labelKey={item.labelKey} />
            ))}
          </div>
        </div>

        <div>
          {!isCollapsed && <h3 className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Management</h3>}
          <div className="space-y-1">
            <NavItem to="/profile" icon={User} labelKey="nav.profile" />
            <NavItem to="/settings" icon={Settings} labelKey="nav.settings" />
            {user?.role === 'admin' && (
              <NavItem to="/admin" icon={Shield} labelKey="nav.admin" />
            )}
          </div>
        </div>
      </nav>

      {/* Footer Area */}
      <div className="p-3 border-t border-slate-800 space-y-3">
        <button
          onClick={onToggle}
          className="flex w-full items-center justify-center p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>

        <div className={cn('flex items-center gap-3', isCollapsed ? 'justify-center' : 'p-2')}>
          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
            <User size={16} className="text-slate-300" />
          </div>
          {!isCollapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user ? user.name : 'Guest Farmer'}</p>
              <p className="text-xs text-slate-400 truncate">{user ? user.email : 'Unregistered'}</p>
            </div>
          )}
          {!isCollapsed && user && (
            <button
              onClick={logout}
              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </motion.aside>
  )
}
