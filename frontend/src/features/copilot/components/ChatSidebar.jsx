import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, MessageSquare, Trash2, Pencil, Check, X, Bot } from 'lucide-react'
import { cn } from '../../../utils/cn'
import { truncateTitle, formatMessageTime } from '../utils/chatUtils'
import { useCopilotSessions } from '../hooks/useCopilotSessions'

export default function ChatSidebar({ currentSessionId, onSelectSession, onNewChat }) {
  const { sessions, isLoading, deleteSession, renameSession } = useCopilotSessions()
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')

  const startEdit = (session) => {
    setEditingId(session.id)
    setEditTitle(session.title)
  }

  const saveEdit = (sessionId) => {
    if (editTitle.trim()) {
      renameSession({ sessionId, title: editTitle.trim() })
    }
    setEditingId(null)
  }

  return (
    <div className="flex flex-col h-full bg-slate-900/50 border-r border-slate-800">
      {/* Header */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center gap-2 mb-3">
          <Bot size={18} className="text-emerald-400" />
          <span className="text-white font-semibold text-sm">AI Copilot</span>
        </div>
        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-all"
        >
          <Plus size={16} />
          New Conversation
        </button>
      </div>

      {/* Sessions list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-slate-800 animate-pulse" />
          ))
        ) : sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center px-4">
            <MessageSquare size={28} className="text-slate-600 mb-3" />
            <p className="text-slate-500 text-sm">No conversations yet</p>
            <p className="text-slate-600 text-xs mt-1">Start chatting to see your history</p>
          </div>
        ) : (
          <AnimatePresence>
            {sessions.map((session) => (
              <motion.div
                key={session.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className={cn(
                  'group relative rounded-xl p-3 cursor-pointer transition-all',
                  currentSessionId === session.id
                    ? 'bg-emerald-500/10 border border-emerald-500/20'
                    : 'hover:bg-slate-800 border border-transparent'
                )}
                onClick={() => onSelectSession(session)}
              >
                {editingId === session.id ? (
                  <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                    <input
                      autoFocus
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') saveEdit(session.id); if (e.key === 'Escape') setEditingId(null) }}
                      className="flex-1 bg-slate-700 text-white text-xs rounded px-2 py-1 focus:outline-none"
                    />
                    <button onClick={() => saveEdit(session.id)} className="text-emerald-400 hover:text-emerald-300">
                      <Check size={12} />
                    </button>
                    <button onClick={() => setEditingId(null)} className="text-slate-400 hover:text-slate-300">
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <>
                    <p className={cn(
                      'text-xs font-medium truncate pr-8',
                      currentSessionId === session.id ? 'text-emerald-300' : 'text-slate-300'
                    )}>
                      {truncateTitle(session.title)}
                    </p>
                    {session.messages?.[0] && (
                      <p className="text-slate-500 text-xs truncate mt-0.5">
                        {truncateTitle(session.messages[0].content, 35)}
                      </p>
                    )}
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-slate-600 text-xs">
                        {session._count?.messages || 0} msgs
                      </span>
                      {session.messages?.[0] && (
                        <span className="text-slate-700 text-xs">
                          · {formatMessageTime(session.messages[0].createdAt)}
                        </span>
                      )}
                    </div>

                    {/* Action buttons - shown on hover */}
                    <div className="absolute right-2 top-2.5 hidden group-hover:flex items-center gap-1"
                      onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => startEdit(session)}
                        className="p-1 rounded text-slate-500 hover:text-white hover:bg-slate-700 transition-all"
                      >
                        <Pencil size={11} />
                      </button>
                      <button
                        onClick={() => deleteSession(session.id)}
                        className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
