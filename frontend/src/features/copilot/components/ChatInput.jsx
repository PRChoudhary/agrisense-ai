import React, { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, Square, Mic } from 'lucide-react'
import { cn } from '../../../utils/cn'

export default function ChatInput({ onSend, isStreaming, onStop, disabled }) {
  const textareaRef = useRef(null)
  const [value, setValue] = React.useState('')

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current
    if (ta) {
      ta.style.height = 'auto'
      ta.style.height = Math.min(ta.scrollHeight, 200) + 'px'
    }
  }, [value])

  const handleSend = () => {
    if (!value.trim() || isStreaming) return
    onSend(value.trim())
    setValue('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSend()
    }
    // Allow Shift+Enter for new line (default)
  }

  return (
    <div className="border-t border-slate-800 bg-slate-950 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-end gap-3 bg-slate-800/80 border border-slate-700 rounded-2xl p-3 focus-within:border-emerald-500/40 transition-colors">
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about crop prices, best selling time, mandi rates... (हिंदी में भी पूछें)"
            disabled={disabled}
            rows={1}
            className="flex-1 bg-transparent text-white placeholder:text-slate-500 resize-none focus:outline-none text-sm leading-relaxed min-h-[24px] max-h-[200px] py-1"
          />

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Character hint */}
            {value.length > 0 && !isStreaming && (
              <span className="text-slate-600 text-xs">⌘↵</span>
            )}

            {/* Stop / Send button */}
            {isStreaming ? (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onStop}
                className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 hover:bg-rose-500/30 transition-all"
              >
                <Square size={14} fill="currentColor" />
              </motion.button>
            ) : (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleSend}
                disabled={!value.trim() || disabled}
                className={cn(
                  'w-9 h-9 rounded-xl flex items-center justify-center transition-all',
                  value.trim() && !disabled
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shadow-emerald-500/20'
                    : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                )}
              >
                <Send size={15} />
              </motion.button>
            )}
          </div>
        </div>

        <p className="text-center text-slate-600 text-xs mt-2">
          AgriSense AI · Powered by GPT-4o · Prices updated every 15 min
        </p>
      </div>
    </div>
  )
}
