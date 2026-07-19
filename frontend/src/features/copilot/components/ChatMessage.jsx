import React, { useState } from 'react'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import { Bot, User, Copy, Check } from 'lucide-react'
import { cn } from '../../../utils/cn'
import { formatMessageTime } from '../utils/chatUtils'
import StreamingDots from './StreamingDots'

export default function ChatMessage({ message, index }) {
  const [copied, setCopied] = useState(false)
  const isUser = message.role === 'user'
  const isAssistant = message.role === 'assistant'

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.3) }}
      className={cn(
        'flex gap-3 group',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Avatar */}
      <div className={cn(
        'w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-1',
        isUser ? 'bg-emerald-600' : 'bg-slate-700 border border-slate-600'
      )}>
        {isUser ? <User size={16} className="text-white" /> : <Bot size={16} className="text-emerald-400" />}
      </div>

      {/* Bubble */}
      <div className={cn(
        'max-w-[78%] flex flex-col gap-1',
        isUser ? 'items-end' : 'items-start'
      )}>
        <div className={cn(
          'px-4 py-3 rounded-2xl text-sm leading-relaxed',
          isUser
            ? 'bg-emerald-600 text-white rounded-tr-sm'
            : message.isError
              ? 'bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-tl-sm'
              : 'bg-slate-800 border border-slate-700/50 text-slate-100 rounded-tl-sm'
        )}>
          {message.isStreaming && !message.content ? (
            <StreamingDots />
          ) : isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="prose prose-invert prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0.5 prose-headings:text-emerald-300 prose-strong:text-white prose-code:text-emerald-300 prose-code:bg-slate-700/50 prose-code:px-1 prose-code:rounded">
              <ReactMarkdown>{message.content || ''}</ReactMarkdown>
              {message.isStreaming && <StreamingDots />}
            </div>
          )}
        </div>

        {/* Timestamp + copy */}
        <div className={cn(
          'flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity px-1',
          isUser ? 'flex-row-reverse' : 'flex-row'
        )}>
          <span className="text-slate-600 text-xs">
            {formatMessageTime(message.createdAt)}
          </span>
          {isAssistant && message.content && !message.isStreaming && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-slate-600 hover:text-slate-400 text-xs transition-colors"
            >
              {copied ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
