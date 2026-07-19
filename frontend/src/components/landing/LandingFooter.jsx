import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Twitter, Github, Linkedin } from 'lucide-react';

export default function LandingFooter() {
  return (
    <footer className="bg-slate-950 pt-20 pb-10 border-t border-slate-900 relative overflow-hidden">
      {/* Subtle green glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-32 bg-emerald-500/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          {/* Brand Col */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <Leaf className="text-emerald-500" size={28} />
              <span className="text-white font-display font-bold text-xl tracking-tight">AgriSense</span>
            </div>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Empowering Indian farmers with AI-driven market intelligence for better pricing and higher profits.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-slate-500 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Product Col */}
          <div>
            <h4 className="text-white font-semibold mb-6">Product</h4>
            <ul className="space-y-3">
              <li><Link to="/dashboard" className="text-slate-400 hover:text-white text-sm transition-colors">Dashboard</Link></li>
              <li><Link to="/prices" className="text-slate-400 hover:text-white text-sm transition-colors">Market Prices</Link></li>
              <li><Link to="/copilot" className="text-slate-400 hover:text-white text-sm transition-colors">AI Copilot</Link></li>
              <li><Link to="/predictions" className="text-slate-400 hover:text-white text-sm transition-colors">Predictions</Link></li>
              <li><Link to="/weather" className="text-slate-400 hover:text-white text-sm transition-colors">Weather</Link></li>
              <li><Link to="/alerts" className="text-slate-400 hover:text-white text-sm transition-colors">Alerts</Link></li>
            </ul>
          </div>

          {/* Company Col */}
          <div>
            <h4 className="text-white font-semibold mb-6">Company</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">About Us</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Blog</a></li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors flex items-center gap-2">
                  Careers <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">Hiring</span>
                </a>
              </li>
              <li><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Contact Support</a></li>
            </ul>
          </div>

          {/* Legal Col */}
          <div>
            <h4 className="text-white font-semibold mb-6">Legal</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">© {new Date().getFullYear()} AgriSense AI. All rights reserved.</p>
          <p className="text-slate-400 text-sm flex items-center gap-1">
            Made with <span className="text-rose-500">❤️</span> in India <span className="text-lg">🇮🇳</span>
          </p>
          <p className="text-slate-500 text-sm flex items-center gap-2">
            Powered by <span className="text-white font-semibold">OpenAI</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
