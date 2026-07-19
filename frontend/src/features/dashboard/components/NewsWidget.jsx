import React from 'react'
import { Link } from 'react-router-dom'
import { Newspaper, ArrowRight, ExternalLink } from 'lucide-react'
import { useNews } from '../../news'

export default function NewsWidget() {
  const { data, isLoading } = useNews({ limit: 3 })
  const articles = data?.articles?.slice(0, 3) || []

  if (isLoading) return <div className="h-64 bg-slate-800 rounded-2xl animate-pulse lg:col-span-2" />

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col h-full lg:col-span-2">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <Newspaper size={16} className="text-amber-400" />
          Top Agriculture News
        </h3>
        <Link to="/news" className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium">
          Read All <ArrowRight size={12} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-auto">
        {articles.map((article) => (
          <a
            key={article.id}
            href={article.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col bg-slate-800/40 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 rounded-xl p-4 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                article.category === 'POSITIVE' ? 'bg-emerald-500/20 text-emerald-400' :
                article.category === 'NEGATIVE' ? 'bg-rose-500/20 text-rose-400' :
                'bg-slate-700 text-slate-300'
              }`}>
                {article.impact} IMPACT
              </span>
              <ExternalLink size={12} className="text-slate-500 group-hover:text-amber-400 transition-colors" />
            </div>
            <h4 className="text-sm font-semibold text-white leading-snug mb-2 line-clamp-2 group-hover:text-amber-300 transition-colors">
              {article.title}
            </h4>
            <p className="text-xs text-slate-500 mt-auto">{article.source}</p>
          </a>
        ))}
      </div>
      
      {articles.length === 0 && <p className="text-sm text-slate-500 py-4 text-center">No recent news available</p>}
    </div>
  )
}
