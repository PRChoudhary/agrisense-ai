import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Cpu, TrendingUp } from 'lucide-react';

export default function HowItWorksSection() {
  const steps = [
    {
      icon: <Leaf size={32} className="text-emerald-400" />,
      color: 'emerald',
      title: 'Select Crop & Location',
      description: 'Choose from 100+ crops. Enter your current location or nearest mandi. Set your quantity.'
    },
    {
      icon: <Cpu size={32} className="text-sky-400" />,
      color: 'sky',
      title: 'AI Analyzes Everything',
      description: 'Our AI instantly reads live mandi prices, weather forecasts, news sentiment, historical trends, and demand patterns.'
    },
    {
      icon: <TrendingUp size={32} className="text-purple-400" />,
      color: 'purple',
      title: 'Get Your Sell Decision',
      description: 'Receive a clear recommendation: Sell today, Wait 3 days, or Go to a specific mandi. With full AI reasoning.'
    }
  ];

  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden bg-[#020617]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-sm font-bold tracking-wider text-emerald-400 uppercase mb-3">How It Works</h2>
          <h3 className="text-3xl md:text-5xl font-bold text-white font-display">From Farm to Maximum Profit</h3>
        </motion.div>

        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-emerald-500/0 via-slate-700 to-purple-500/0" />
          
          <div className="grid md:grid-cols-3 gap-12 relative z-10">
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="flex flex-col items-center text-center relative group"
              >
                <div className={`w-24 h-24 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-center mb-8 relative z-10 group-hover:border-${step.color}-500/50 group-hover:scale-110 transition-all duration-300`}>
                  <div className={`absolute inset-0 bg-${step.color}-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity`} />
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  {step.icon}
                </div>
                
                <h4 className="text-xl font-bold text-white mb-4">{step.title}</h4>
                <p className="text-slate-400 leading-relaxed max-w-sm">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
