import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

function AnimatedCounter({ target, prefix = '', suffix = '', decimals = 0, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!inView) return;
    
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
        return;
      }
      setCount(start);
    }, 16);
    
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  const displayValue = decimals > 0 
    ? count.toFixed(decimals) 
    : Math.floor(count).toLocaleString('en-IN');

  return <span ref={ref}>{prefix}{displayValue}{suffix}</span>;
}

export default function StatsSection() {
  const stats = [
    { target: 10847, suffix: '+', label: 'Active Farmers', desc: 'Trust AgriSense AI' },
    { target: 547, label: 'Mandis Covered', desc: 'Across 15 states' },
    { target: 2.3, prefix: '₹', suffix: ' Cr', decimals: 1, label: 'Farmer Savings', desc: 'Through better pricing' },
    { target: 94.7, suffix: '%', decimals: 1, label: 'Price Accuracy', desc: 'In our 7-day forecasts' },
  ];

  return (
    <section className="bg-slate-900/50 border-y border-slate-800 py-16 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-x-0 lg:divide-x divide-slate-800">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className={`text-center px-4 ${idx % 2 !== 0 ? 'border-l border-slate-800 lg:border-none' : ''}`}
            >
              <h3 className="text-4xl md:text-5xl font-bold text-white mb-2 font-display">
                <AnimatedCounter 
                  target={stat.target} 
                  prefix={stat.prefix} 
                  suffix={stat.suffix} 
                  decimals={stat.decimals} 
                />
              </h3>
              <p className="text-emerald-400 font-semibold text-lg mb-1">{stat.label}</p>
              <p className="text-slate-500 text-sm">{stat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
