'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const ARAB_COUNTRIES = [
  { code: 'SA', flag: '🇸🇦', name_en: 'Saudi Arabia' },
  { code: 'EG', flag: '🇪🇬', name_en: 'Egypt' },
  { code: 'AE', flag: '🇦🇪', name_en: 'United Arab Emirates' },
  { code: 'MA', flag: '🇲🇦', name_en: 'Morocco' },
  { code: 'DZ', flag: '🇩🇿', name_en: 'Algeria' },
  { code: 'IQ', flag: '🇮🇶', name_en: 'Iraq' },
  { code: 'JO', flag: '🇯🇴', name_en: 'Jordan' },
  { code: 'KW', flag: '🇰🇼', name_en: 'Kuwait' },
  { code: 'LB', flag: '🇱🇧', name_en: 'Lebanon' },
  { code: 'LY', flag: '🇱🇾', name_en: 'Libya' },
  { code: 'OM', flag: '🇴🇲', name_en: 'Oman' },
  { code: 'PS', flag: '🇵🇸', name_en: 'Palestine' },
  { code: 'QA', flag: '🇶🇦', name_en: 'Qatar' },
  { code: 'SY', flag: '🇸🇾', name_en: 'Syria' },
  { code: 'TN', flag: '🇹🇳', name_en: 'Tunisia' },
  { code: 'YE', flag: '🇾🇪', name_en: 'Yemen' },
  { code: 'BH', flag: '🇧🇭', name_en: 'Bahrain' },
  { code: 'SD', flag: '🇸🇩', name_en: 'Sudan' },
  { code: 'SO', flag: '🇸🇴', name_en: 'Somalia' },
  { code: 'MR', flag: '🇲🇷', name_en: 'Mauritania' },
  { code: 'DJ', flag: '🇩🇯', name_en: 'Djibouti' },
  { code: 'KM', flag: '🇰🇲', name_en: 'Comoros' },
];

export default function HeroArabFlagPulse() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [currentIndex, setCurrentIndex] = useState(0);

  // Cycle through 2 flags at a time every 3.6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 2) % ARAB_COUNTRIES.length);
    }, 3600);

    return () => clearInterval(timer);
  }, []);

  const flag1 = ARAB_COUNTRIES[currentIndex];
  const flag2 = ARAB_COUNTRIES[(currentIndex + 1) % ARAB_COUNTRIES.length];

  return (
    <>
      {/* Flag 1: Floating Zoom-In / Zoom-Out on Top Left of Logo */}
      <div className="absolute -top-4 -left-2 sm:-left-8 z-30 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={flag1.code}
            initial={{ scale: 0.2, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.2, opacity: 0, y: -15 }}
            transition={{ duration: 0.55, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <div className={`px-3 py-1.5 rounded-full text-xs font-black border backdrop-blur-md shadow-xl flex items-center gap-1.5 transition-all ${
              isDark 
                ? 'bg-slate-900/90 text-amber-300 border-amber-500/50 shadow-amber-950/40' 
                : 'bg-white/95 text-slate-900 border-amber-400 shadow-amber-500/20'
            }`}>
              <span className="text-sm sm:text-base animate-pulse">{flag1.flag}</span>
              <span className="tracking-wide text-[11px] sm:text-xs">{flag1.name_en}</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Flag 2: Floating Zoom-In / Zoom-Out on Bottom Right of Logo */}
      <div className="absolute -bottom-4 -right-2 sm:-right-8 z-30 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={flag2.code}
            initial={{ scale: 0.2, opacity: 0, y: -15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.2, opacity: 0, y: 15 }}
            transition={{ duration: 0.55, ease: [0.34, 1.56, 0.64, 1], delay: 0.15 }}
          >
            <div className={`px-3 py-1.5 rounded-full text-xs font-black border backdrop-blur-md shadow-xl flex items-center gap-1.5 transition-all ${
              isDark 
                ? 'bg-slate-900/90 text-rose-300 border-rose-500/50 shadow-rose-950/40' 
                : 'bg-white/95 text-slate-900 border-rose-400 shadow-rose-500/20'
            }`}>
              <span className="text-sm sm:text-base animate-pulse">{flag2.flag}</span>
              <span className="tracking-wide text-[11px] sm:text-xs">{flag2.name_en}</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}
