import React from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Clock, Brain } from 'lucide-react'
import SentimentBadge from './SentimentBadge'
import ImpactBadge from './ImpactBadge'
import { getSentimentConfig, formatNewsTime } from '../utils/newsUtils'
import { cn } from '../../../utils/cn'

export default function FeaturedNewsCard({ article }) {
  if (!article) return null
  const sentiment = getSentimentConfig(article.category)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'relative overflow-hidden rounded-3xl border p-6 lg:p-8',
        article.category === 'POSITIVE' ? 'border-emerald-500/20 bg-emerald-500/5' :
        article.category === 'NEGATIVE' ? 'border-rose-500/20 bg-rose-500/5' :
        'border-slate-700 bg-slate-900/50'
      )}
    >
      {/* Background emoji watermark */}
      <div className="absolute -right-4 -top-4 text-[100px] opacity-5 select-none pointer-events-none">
        {sentiment.icon}
      </div>

      {/* Featured label */}
      <div className="flex items-center gap-2 mb-4">
        <span className="px-2.5 py-1 bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold rounded-full tracking-wider">⭐ TOP STORY</span>
        <SentimentBadge category={article.category} />
        <ImpactBadge impact={article.impact} />
      </div>

      {/* Title */}
      <h2 className="text-white text-xl lg:text-2xl font-bold leading-tight mb-4 max-w-3xl">
        {article.title}
      </h2>

      {/* AI Summary */}
      {article.aiSummary && (
        <div className="flex gap-3 mb-5 p-4 bg-slate-800/60 border border-slate-700/50 rounded-2xl max-w-3xl">
          <Brain size={16} className="text-purple-400 shrink-0 mt-0.5" />
          <p className="text-slate-300 text-sm leading-relaxed">{article.aiSummary}</p>
        </div>
      )}

      {/* Meta + CTA */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-1.5 text-slate-500 text-xs">
          <span className="font-medium text-slate-400">{article.source}</span>
          <span>·</span>
          <Clock size={11} />
          <span>{formatNewsTime(article.publishedAt)}</span>
        </div>
        <a
          href={article.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors"
        >
          Read Full Article <ExternalLink size={13} />
        </a>
      </div>
    </motion.div>
  )
}
