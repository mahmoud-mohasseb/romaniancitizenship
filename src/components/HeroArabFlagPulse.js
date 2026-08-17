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

  // Cycle through 2 flags at a time every 3.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 2) % ARAB_COUNTRIES.length);
    }, 3500);

    return () => clearInterval(timer);
  }, []);

  const flag1 = ARAB_COUNTRIES[currentIndex];
  const flag2 = ARAB_COUNTRIES[(currentIndex + 1) % ARAB_COUNTRIES.length];

  return (
    <>
      {/* Flag 1: Floating Zoom-In / Zoom-Out on Top-Left/Center of Logo */}
      <div className="absolute -top-5 left-1/2 -translate-x-[90%] sm:-translate-x-full sm:-left-4 z-30 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={flag1.code}
            initial={{ scale: 0.15, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.15, opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <div className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-black border backdrop-blur-md shadow-xl flex items-center gap-1.5 whitespace-nowrap transition-all ${
              isDark 
                ? 'bg-slate-900/95 text-amber-300 border-amber-500/60 shadow-amber-950/60' 
                : 'bg-white/95 text-slate-900 border-amber-500 shadow-amber-500/30'
            }`}>
              <span className="text-xs sm:text-sm animate-pulse shrink-0">{flag1.flag}</span>
              <span className="tracking-wide text-[10px] sm:text-xs font-black">{flag1.name_en}</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Flag 2: Floating Zoom-In / Zoom-Out on Bottom-Right/Center of Logo */}
      <div className="absolute -bottom-5 right-1/2 translate-x-[90%] sm:translate-x-full sm:-right-4 z-30 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={flag2.code}
            initial={{ scale: 0.15, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.15, opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1], delay: 0.12 }}
          >
            <div className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-black border backdrop-blur-md shadow-xl flex items-center gap-1.5 whitespace-nowrap transition-all ${
              isDark 
                ? 'bg-slate-900/95 text-rose-300 border-rose-500/60 shadow-rose-950/60' 
                : 'bg-white/95 text-slate-900 border-rose-500 shadow-rose-500/30'
            }`}>
              <span className="text-xs sm:text-sm animate-pulse shrink-0">{flag2.flag}</span>
              <span className="tracking-wide text-[10px] sm:text-xs font-black">{flag2.name_en}</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}
