import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Plus } from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'
import { 
  AlertCard, 
  AlertsEmptyState, 
  CreateAlertDialog, 
  useAlerts, 
  useCreateAlert, 
  useToggleAlert, 
  useDeleteAlert 
} from '../features/alerts'
import { useAuth } from '../contexts/AuthContext'
import { Navigate } from 'react-router-dom'

export default function AlertsPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data: alerts = [], isLoading: alertsLoading } = useAlerts()
  const createAlert = useCreateAlert()
  const toggleAlert = useToggleAlert()
  const deleteAlert = useDeleteAlert()

  // Allow guests to view the page, but creation will require auth or handle gracefully

  const handleCreate = (data) => {
    createAlert.mutate(data, {
      onSuccess: () => setIsModalOpen(false)
    })
  }

  const handleToggle = (id, isActive) => {
    toggleAlert.mutate({ id, isActive })
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this alert?')) {
      deleteAlert.mutate(id)
    }
  }

  const pageActions = (
    <button
      onClick={() => setIsModalOpen(true)}
      className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-emerald-500/20"
    >
      <Plus size={16} />
      New Alert
    </button>
  )

  return (
    <PageWrapper
      title="Smart Alerts"
      subtitle="Get notified when prices hit your target thresholds"
      actions={alerts.length > 0 ? pageActions : null}
      icon={Bell}
    >
      {alertsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-44 bg-slate-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : alerts.length === 0 ? (
        <AlertsEmptyState onCreateClick={() => setIsModalOpen(true)} />
      ) : (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {alerts.map(alert => (
              <AlertCard
                key={alert.id}
                alert={alert}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Modal is kept mounted but hidden via AnimatePresence inside it */}
      <AnimatePresence>
        {isModalOpen && (
          <CreateAlertDialog
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleCreate}
            isSubmitting={createAlert.isPending}
          />
        )}
      </AnimatePresence>
    </PageWrapper>
  )
}
