import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, Leaf } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'FAQ', href: '#faq' },
  ];

  const handleSmoothScroll = (e, href) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 py-3 shadow-lg'
          : 'bg-transparent py-5'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="text-emerald-500" size={28} />
            <span className="text-white font-display font-bold text-xl tracking-tight">AgriSense</span>
            <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-1.5 py-0.5 rounded">AI</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleSmoothScroll(e, link.href)}
                className="text-slate-300 hover:text-white transition-colors text-sm font-medium"
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <button className="text-slate-400 hover:text-white text-sm font-medium px-2 py-1">
              EN | हिं
            </button>
            <button
              onClick={() => setIsDark(!isDark)}
              className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-colors"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link
              to="/dashboard"
              className="text-slate-300 hover:text-white transition-colors text-sm font-medium px-4 py-2"
            >
              Explore as Guest
            </Link>
            <Link
              to="/login"
              className="text-white hover:text-emerald-400 transition-colors text-sm font-medium px-4 py-2"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 group"
            >
              Get Started Free
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-slate-300 hover:text-white p-2"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 bg-slate-900 border-b border-slate-800 shadow-xl md:hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleSmoothScroll(e, link.href)}
                  className="block text-slate-300 hover:text-white text-lg font-medium"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <button className="text-slate-400 hover:text-white font-medium">EN | हिं</button>
                <button
                  onClick={() => setIsDark(!isDark)}
                  className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-colors"
                >
                  {isDark ? <Sun size={20} /> : <Moon size={20} />}
                </button>
              </div>
              <div className="pt-4 flex flex-col gap-3">
                <Link
                  to="/login"
                  className="w-full text-center text-white border border-slate-700 hover:bg-slate-800 py-3 rounded-lg font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="w-full text-center bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  Get Started Free
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
