import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: "Is AgriSense AI free to use?",
      a: "Yes! AgriSense AI is free for all farmers. We believe every farmer deserves access to market intelligence. A premium plan with advanced AI features and unlimited alerts is coming soon."
    },
    {
      q: "How accurate are the mandi prices?",
      a: "Prices are sourced directly from Agmarknet (data.gov.in) and verified APMC APIs. They are updated every 15-30 minutes during market hours. Historical accuracy is above 94% for major crops."
    },
    {
      q: "Which languages does AgriSense support?",
      a: "Currently English and Hindi (हिंदी). The AI Copilot can understand and respond in both languages. We are adding Marathi, Punjabi, Telugu, and Kannada support soon."
    },
    {
      q: "How does the AI Copilot work?",
      a: "The AI Copilot is powered by OpenAI GPT-4o and has access to real-time mandi prices, weather data, and agriculture news. Ask it anything — 'Should I sell my wheat today?', 'Which mandi pays more for onions?', or 'How will the rain affect tomato prices?' — and it answers using live market data."
    },
    {
      q: "Does it work for all crops?",
      a: "AgriSense covers 100+ crops including all major grains (Wheat, Rice, Corn), vegetables (Tomato, Onion, Potato), fruits, pulses (Tur, Chana, Moong), oilseeds (Soybean, Mustard), and spices (Turmeric, Chili). More crops are added regularly."
    },
    {
      q: "How is the 'Best Mandi' recommendation calculated?",
      a: "We factor in: current price at each mandi, your distance from the mandi, estimated transport cost per quintal, current arrival quantity (to avoid oversupply), and AI price trend analysis. The result is your expected net profit ranked across nearby mandis."
    },
    {
      q: "Is my data private and secure?",
      a: "Absolutely. We never sell your data. Your search history and profile are encrypted and stored securely. We comply with Indian data protection standards. You can delete your account and all data at any time."
    }
  ];

  return (
    <section id="faq" className="py-24 bg-[#020617] border-t border-slate-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 font-display">Frequently Asked Questions</h2>
          <p className="text-slate-400 text-lg">Everything farmers want to know about AgriSense AI.</p>
        </motion.div>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="border-b border-slate-800"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between py-5 text-left group"
              >
                <span className="text-slate-200 font-medium pr-8 group-hover:text-white transition-colors">{faq.q}</span>
                <motion.div 
                  animate={{ rotate: openIndex === i ? 45 : 0 }}
                  className="bg-slate-800/50 p-1 rounded-full text-slate-400 group-hover:bg-slate-800 group-hover:text-white transition-colors"
                >
                  <Plus size={18} className="shrink-0" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <p className="pb-6 text-slate-400 leading-relaxed text-sm md:text-base">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
