import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Brain, MapPin, CloudSun, Newspaper, Bell } from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    {
      icon: <TrendingUp size={24} className="text-emerald-400" />,
      color: 'emerald',
      title: 'Live Mandi Prices',
      description: 'Real-time prices from 500+ APMC mandis across India. Filter by crop, state, district. Updated every 15 minutes.',
      badge: 'Available'
    },
    {
      icon: <Brain size={24} className="text-sky-400" />,
      color: 'sky',
      title: 'AI Price Intelligence',
      description: 'GPT-4o analyzes price trends, arrival data, and seasonal patterns to predict the next 7 days.',
      badge: 'Available'
    },
    {
      icon: <MapPin size={24} className="text-purple-400" />,
      color: 'purple',
      title: 'Best Mandi Finder',
      description: 'Tell us your location and crop. We calculate nearest mandis, transport costs, and net profit to find your optimal selling destination.',
      badge: 'Available'
    },
    {
      icon: <CloudSun size={24} className="text-amber-400" />,
      color: 'amber',
      title: 'Weather Intelligence',
      description: 'Hyperlocal weather forecasts with AI analysis of how rain, temperature, and humidity will affect your crop prices.',
      badge: 'Available'
    },
    {
      icon: <Newspaper size={24} className="text-rose-400" />,
      color: 'rose',
      title: 'Agriculture News',
      description: 'Curated news from 50+ sources, AI-summarized with price impact analysis (Positive/Negative/Neutral).',
      badge: 'Available'
    },
    {
      icon: <Bell size={24} className="text-indigo-400" />,
      color: 'indigo',
      title: 'Smart Alerts',
      description: 'Price alerts, weather warnings, AI recommendations. Never miss a selling opportunity again.',
      badge: 'Coming Soon'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section id="features" className="py-24 relative bg-[#020617] border-t border-slate-900">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-slate-900/50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 font-display">Everything You Need to Sell Smarter</h2>
          <p className="text-lg text-slate-400">A complete intelligence platform designed for the modern Indian farmer. Powerful, intuitive, and built to increase your profits.</p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, idx) => (
            <motion.div 
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -4, borderColor: 'rgba(71, 85, 105, 1)' }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 transition-all duration-300 group flex flex-col h-full relative overflow-hidden"
            >
              <div className="flex items-start justify-between mb-6">
                <div className={`w-12 h-12 rounded-xl bg-${feature.color}-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${feature.badge === 'Available' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
                  {feature.badge}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed flex-grow">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
