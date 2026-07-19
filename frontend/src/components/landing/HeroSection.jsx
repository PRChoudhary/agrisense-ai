import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Play, TrendingUp, CloudSun, ChevronDown } from 'lucide-react';

export default function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <section className="relative min-h-screen pt-32 pb-20 flex items-center overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-3xl mix-blend-screen animate-blob" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-500/15 rounded-full blur-3xl mix-blend-screen animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-3xl mix-blend-screen animate-blob animation-delay-4000" />
        
        {/* Dot grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.15]"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column - Content */}
          <motion.div 
            className="flex flex-col items-start text-left"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="mb-6">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-medium">
                <Sparkles size={14} />
                Powered by OpenAI GPT-4o · Made for Indian Farmers
              </span>
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight font-display mb-6">
              <span className="text-white">Know the Best Time</span>
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-sky-400 to-purple-400 bg-clip-text text-transparent">
                to Sell Your Crops
              </span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-slate-400 text-xl leading-relaxed max-w-xl mb-10">
              AgriSense AI combines live mandi prices, AI market reasoning, weather intelligence,
              and demand analysis to tell you exactly when and where to sell for maximum profit.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 mb-10 w-full sm:w-auto">
              <Link to="/prices" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-full text-lg font-medium transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                Start Searching
                <span className="text-emerald-100 text-sm font-normal">· शुरू करें</span>
                <ArrowRight size={20} />
              </Link>
              <Link to="/copilot" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-transparent border-2 border-slate-700 hover:border-slate-500 hover:bg-slate-800 text-white px-8 py-4 rounded-full text-lg font-medium transition-all">
                <Play size={20} className="fill-current" />
                Try AI Copilot
              </Link>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-center gap-4 pt-2">
              <div className="flex -space-x-3">
                {['bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-purple-500', 'bg-rose-500'].map((color, i) => (
                  <div key={i} className={`w-10 h-10 rounded-full ${color} border-2 border-[#020617] flex items-center justify-center text-white text-xs font-bold shadow-sm z-[${5-i}]`}>
                    {['RY', 'SP', 'VK', 'AM', 'NT'][i]}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-slate-400 text-sm">
                  <span className="text-white font-semibold">10,000+</span> farmers trust us
                </p>
                <div className="flex text-amber-400 text-xs">
                  ★★★★★ <span className="text-slate-500 ml-1 font-medium">4.9/5</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Dashboard Mockup */}
          <div className="relative hidden lg:block">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="relative z-10"
            >
              {/* Main card */}
              <div className="rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 p-6 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                {/* Card header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                      <TrendingUp size={20} className="text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">Wheat (Gehun)</p>
                      <p className="text-slate-500 text-xs mt-0.5">Azadpur Mandi, Delhi</p>
                    </div>
                  </div>
                  <span className="px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold animate-pulse">
                    ✓ Sell Today
                  </span>
                </div>

                {/* Price display */}
                <div className="mb-6">
                  <p className="text-5xl font-bold text-white tracking-tight">₹2,350 <span className="text-lg font-normal text-slate-400">/qt</span></p>
                  <p className="text-emerald-400 text-sm mt-2 flex items-center gap-1 font-medium">
                    <TrendingUp size={14} /> +₹180 (+8.3%) this week
                  </p>
                </div>

                {/* Mini price bars - SVG sparkline */}
                <div className="flex items-end gap-1.5 h-20 mb-6">
                  {[40, 55, 45, 65, 58, 75, 88].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ delay: 0.7 + i * 0.05, duration: 0.5, ease: "easeOut" }}
                      style={{ height: `${h}%` }}
                      className={`flex-1 rounded-sm origin-bottom ${
                        i === 6 ? 'bg-emerald-400' : 'bg-slate-700'
                      }`}
                    />
                  ))}
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50">
                    <p className="text-slate-500 text-xs mb-1">Min</p>
                    <p className="text-white font-semibold">₹2,100</p>
                  </div>
                  <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50">
                    <p className="text-slate-500 text-xs mb-1">Max</p>
                    <p className="text-white font-semibold">₹2,600</p>
                  </div>
                  <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50">
                    <p className="text-slate-500 text-xs mb-1">Arrival</p>
                    <p className="text-white font-semibold">120 qt</p>
                  </div>
                </div>

                {/* AI confidence bar */}
                <div className="mb-5">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-slate-400">AI Confidence</span>
                    <span className="text-emerald-400 font-semibold">94%</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '94%' }}
                      transition={{ delay: 1.2, duration: 1, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-emerald-500 to-sky-500 rounded-full relative"
                    >
                      <div className="absolute inset-0 bg-white/20 w-full animate-pulse" />
                    </motion.div>
                  </div>
                </div>

                {/* Weather + MSP row */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <CloudSun size={16} className="text-sky-400" />
                    <span>28°C · Favorable</span>
                  </div>
                  <div className="text-slate-400 text-sm">
                    MSP: <span className="text-amber-400 font-medium ml-1">₹2,275</span>
                  </div>
                </div>
              </div>

              {/* Floating mini cards */}
              <motion.div
                initial={{ opacity: 0, x: 20, y: -10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 1.5, duration: 0.6 }}
                className="absolute -top-6 -right-6 bg-slate-800/90 backdrop-blur-md border border-slate-600 rounded-xl p-4 shadow-xl z-20"
              >
                <p className="text-slate-400 text-xs mb-1 font-medium">Best Mandi Match</p>
                <p className="text-white font-bold text-base">Azadpur APMC</p>
                <p className="text-emerald-400 text-xs font-semibold mt-0.5">+₹230 extra profit/qt</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20, y: 10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 1.7, duration: 0.6 }}
                className="absolute -bottom-6 -left-6 bg-slate-800/90 backdrop-blur-md border border-amber-500/30 rounded-xl p-4 shadow-xl z-20"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
                  <p className="text-slate-300 text-xs font-medium">Market Insight</p>
                </div>
                <p className="text-white text-sm font-medium">Export demand rising</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:block">
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}>
          <ChevronDown size={24} className="text-slate-500" />
        </motion.div>
      </div>
    </section>
  );
}
