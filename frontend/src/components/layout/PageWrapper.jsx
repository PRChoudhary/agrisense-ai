import React from 'react'
import { motion } from 'framer-motion'

/**
 * Page wrapper providing consistent header layout and entrance animation.
 * Supports both default and named import styles.
 * @param {{ title?: string, subtitle?: string, actions?: React.ReactNode, icon?: React.ComponentType, children: React.ReactNode }} props
 */
export default function PageWrapper({ title, subtitle, actions, icon: Icon, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 lg:p-8 min-h-full"
    >
      {/* Page Header */}
      {(title || actions) && (
        <div className="flex items-start justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <Icon size={20} className="text-emerald-400" />
              </div>
            )}
            <div>
              {title && <h1 className="text-2xl font-bold text-white tracking-tight">{title}</h1>}
              {subtitle && <p className="text-slate-400 text-sm mt-0.5">{subtitle}</p>}
            </div>
          </div>
          {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
        </div>
      )}
      {children}
    </motion.div>
  )
}

// Named export alias — allows both `import PageWrapper` and `import { PageWrapper }`
export { PageWrapper }
