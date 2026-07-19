import React from 'react';
import { motion } from 'framer-motion';

export default function TestimonialsSection() {
  const testimonials = [
    {
      quote: "Maine pahle kabhi nahi socha tha ki koi app mujhe itna helpful advice de sakta hai. AgriSense ne mujhe Wheat mein ₹45,000 zyada profit dilaya. Ab main roz check karta hoon.",
      name: "Ramesh Yadav",
      location: "Muzaffarnagar, UP",
      crop: "Wheat Farmer",
      savings: "₹45,000 extra profit",
      initials: "RY",
      color: "emerald",
      rating: 5,
    },
    {
      quote: "The AI Copilot answered all my questions in Hindi. I asked 'Should I sell my onions today?' and it gave me a detailed answer with market data. This is exactly what farmers needed.",
      name: "Sunita Patil",
      location: "Nashik, Maharashtra",
      crop: "Onion Farmer",
      savings: "₹28,000 saved",
      initials: "SP",
      color: "sky",
      rating: 5,
    },
    {
      quote: "Mandi prices pe hamesha doubt rehta tha. AgriSense se pata chala ki Azadpur mein Tomato ka rate 20% zyada hai compared to local mandi. Transport cost nikal ke bhi ₹32,000 zyada mila.",
      name: "Vijay Kumar Singh",
      location: "Agra, UP",
      crop: "Tomato Farmer",
      savings: "₹32,000 extra",
      initials: "VK",
      color: "purple",
      rating: 5,
    },
  ];

  return (
    <section className="py-24 bg-[#020617] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white font-display mb-4">Farmers Across India Trust AgriSense</h2>
          <p className="text-slate-400 text-lg">Real stories from farmers who changed the way they sell.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {testimonials.map((t, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ scale: 1.02, borderColor: 'rgba(255,255,255,0.15)' }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-8 relative overflow-hidden flex flex-col h-full"
            >
              <div className="absolute top-4 right-4 text-[100px] text-slate-800/30 font-serif leading-none select-none pointer-events-none">
                "
              </div>
              
              <div className="flex gap-1 mb-6 text-amber-400 text-sm">
                {[...Array(t.rating)].map((_, j) => (
                  <span key={j}>★</span>
                ))}
              </div>
              
              <p className="text-slate-300 italic mb-8 relative z-10 flex-grow leading-relaxed">
                "{t.quote}"
              </p>
              
              <div className="mt-auto border-t border-slate-800/50 pt-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full bg-${t.color}-500/20 border border-${t.color}-500/30 flex items-center justify-center text-${t.color}-400 font-bold text-lg shrink-0`}>
                    {t.initials}
                  </div>
                  <div className="flex-grow">
                    <p className="text-white font-bold">{t.name}</p>
                    <p className="text-slate-400 text-xs mb-1">{t.location}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] uppercase tracking-wider font-bold bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                        {t.crop}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded whitespace-nowrap">
                        {t.savings}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* As seen in */}
        <div className="border-t border-slate-900 pt-10">
          <p className="text-center text-slate-600 text-sm font-medium uppercase tracking-widest mb-6">Recognized By</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale">
            {['Krishi Jagran', 'The Hindu Business', 'AgriWatch', 'Rural Voice'].map((logo, idx) => (
              <span key={idx} className="text-slate-400 font-display font-bold text-xl">{logo}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
