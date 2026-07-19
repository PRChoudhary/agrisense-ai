import React from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Clock, Brain } from 'lucide-react'
import SentimentBadge from './SentimentBadge'
import ImpactBadge from './ImpactBadge'
import { getSentimentConfig, formatNewsTime } from '../utils/newsUtils'
import { cn } from '../../../utils/cn'

export default function NewsCard({ article, index = 0 }) {
  const sentiment = getSentimentConfig(article.category)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      whileHover={{ y: -2 }}
      className={cn(
        'flex flex-col bg-slate-900 border rounded-2xl p-5 transition-all group h-full',
        article.category === 'POSITIVE' ? 'border-slate-800 hover:border-emerald-500/30' :
        article.category === 'NEGATIVE' ? 'border-slate-800 hover:border-rose-500/30' :
        'border-slate-800 hover:border-slate-600'
      )}
    >
      {/* Top badges row */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <SentimentBadge category={article.category} />
        <ImpactBadge impact={article.impact} />
        <span className="text-slate-600 text-xs ml-auto">{article.source}</span>
      </div>

      {/* Title */}
      <h3 className={cn(
        'font-semibold text-sm leading-snug mb-3 transition-colors line-clamp-2',
        article.category === 'POSITIVE' ? 'text-white group-hover:text-emerald-300' :
        article.category === 'NEGATIVE' ? 'text-white group-hover:text-rose-300' :
        'text-white group-hover:text-slate-200'
      )}>
        {article.title}
      </h3>

      {/* AI Summary */}
      {article.aiSummary && (
        <div className="flex gap-2 mb-4 flex-1">
          <Brain size={13} className="text-purple-400 shrink-0 mt-0.5" />
          <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">{article.aiSummary}</p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-800">
        <div className="flex items-center gap-1 text-slate-600 text-xs">
          <Clock size={10} />
          <span>{formatNewsTime(article.publishedAt)}</span>
        </div>
        <a
          href={article.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1 text-slate-500 hover:text-emerald-400 text-xs transition-colors"
        >
          Read <ExternalLink size={10} />
        </a>
      </div>
    </motion.div>
  )
}
