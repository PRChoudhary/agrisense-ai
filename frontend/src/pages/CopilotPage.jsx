import React, { useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PanelLeft, PanelLeftClose } from 'lucide-react'
import {
  ChatMessage, ChatInput, ChatSidebar, CopilotEmpty, ContextBadge,
  useStreamingChat
} from '../features/copilot'
import { fetchSession } from '../features/copilot/services/copilot.service'
import { cn } from '../utils/cn'

export default function CopilotPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const messagesEndRef = useRef(null)

  const {
    messages,
    sessionId,
    sessionTitle,
    isStreaming,
    error,
    sendMessage,
    loadSession,
    newChat,
    stopStreaming,
  } = useStreamingChat()

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Load a session from the sidebar
  const handleSelectSession = async (sessionSummary) => {
    try {
      const response = await fetchSession(sessionSummary.id)
      const session = response?.data
      if (session) loadSession(session)
    } catch (err) {
      console.error('Failed to load session:', err)
    }
  }

  return (
    <div className="flex h-full bg-slate-950 overflow-hidden">
      {/* Left Sidebar */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="shrink-0 overflow-hidden"
          >
            <ChatSidebar
              currentSessionId={sessionId}
              onSelectSession={handleSelectSession}
              onNewChat={newChat}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Topbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            >
              {sidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeft size={18} />}
            </button>
            <div>
              <p className="text-white font-semibold text-sm">
                {sessionTitle || 'AgriSense AI Copilot'}
              </p>
              <p className="text-slate-500 text-xs">
                {messages.length > 0 ? `${messages.length} messages` : 'Ask anything about crop markets'}
              </p>
            </div>
          </div>
          <ContextBadge />
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <CopilotEmpty onPromptClick={sendMessage} />
          ) : (
            <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
              <AnimatePresence initial={false}>
                {messages.map((message, i) => (
                  <ChatMessage key={message.id} message={message} index={i} />
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <ChatInput
          onSend={sendMessage}
          onStop={stopStreaming}
          isStreaming={isStreaming}
          disabled={false}
        />
      </div>
    </div>
  )
}
