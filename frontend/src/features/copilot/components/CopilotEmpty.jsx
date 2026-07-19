import React from 'react'
import { motion } from 'framer-motion'
import { Bot, Sparkles } from 'lucide-react'
import { SUGGESTED_PROMPTS } from '../utils/chatUtils'

export default function CopilotEmpty({ onPromptClick }) {
  return (
    <div className="flex flex-col items-center justify-center h-full py-12 px-4">
      {/* Logo */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-sky-500/20 border border-emerald-500/30 flex items-center justify-center mb-6"
      >
        <Bot size={40} className="text-emerald-400" />
      </motion.div>

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl font-bold text-white mb-2">AgriSense AI Copilot</h2>
        <p className="text-slate-400 max-w-md">
          Ask me anything about crop prices, best selling time, mandi comparison, weather impact, or MSP rates — in Hindi or English.
        </p>
        <p className="text-slate-500 text-sm mt-2">आप हिंदी में भी पूछ सकते हैं</p>
      </motion.div>

      {/* Suggested prompts grid */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full max-w-3xl"
      >
        {SUGGESTED_PROMPTS.map((prompt, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onPromptClick(prompt.text)}
            className="text-left p-4 rounded-xl bg-slate-800/60 border border-slate-700 hover:border-emerald-500/40 hover:bg-slate-800 transition-all group"
          >
            <span className="text-2xl mb-2 block">{prompt.icon}</span>
            <p className="text-white text-sm font-medium leading-snug group-hover:text-emerald-300 transition-colors">
              {prompt.text}
            </p>
            <p className="text-slate-500 text-xs mt-1">{prompt.hindi}</p>
          </motion.button>
        ))}
      </motion.div>
    </div>
  )
}
