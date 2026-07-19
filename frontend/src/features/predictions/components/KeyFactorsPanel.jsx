import React from 'react'
import { motion } from 'framer-motion'
import { Brain, Lightbulb } from 'lucide-react'

export default function KeyFactorsPanel({ reasoning, keyFactors = [] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="bg-slate-900 border border-slate-800 rounded-2xl p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
          <Brain size={16} className="text-purple-400" />
        </div>
        <div>
          <h3 className="text-white font-semibold text-sm">AI Market Analysis</h3>
          <p className="text-slate-500 text-xs">Key factors driving this prediction</p>
        </div>
      </div>

      {/* Reasoning */}
      {reasoning && (
        <div className="bg-purple-500/5 border border-purple-500/10 rounded-xl p-4 mb-4">
          <p className="text-slate-300 text-sm leading-relaxed">{reasoning}</p>
        </div>
      )}

      {/* Key factors */}
      {keyFactors.length > 0 && (
        <div className="space-y-2">
          <p className="text-slate-500 text-xs font-medium">KEY FACTORS</p>
          {keyFactors.map((factor, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="flex items-start gap-2.5"
            >
              <Lightbulb size={13} className="text-amber-400 mt-0.5 shrink-0" />
              <span className="text-slate-300 text-sm">{factor}</span>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
