'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { Globe, Sparkles } from 'lucide-react';

// All 22 Arab League Member State Flags with native AR & EN names
const ARAB_COUNTRIES = [
  { code: 'SA', name_ar: 'السعودية', name_en: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'EG', name_ar: 'مصر', name_en: 'Egypt', flag: '🇪🇬' },
  { code: 'AE', name_ar: 'الإمارات', name_en: 'UAE', flag: '🇦🇪' },
  { code: 'MA', name_ar: 'المغرب', name_en: 'Morocco', flag: '🇲🇦' },
  { code: 'DZ', name_ar: 'الجزائر', name_en: 'Algeria', flag: '🇩🇿' },
  { code: 'IQ', name_ar: 'العراق', name_en: 'Iraq', flag: '🇮🇶' },
  { code: 'JO', name_ar: 'الأردن', name_en: 'Jordan', flag: '🇯🇴' },
  { code: 'KW', name_ar: 'الكويت', name_en: 'Kuwait', flag: '🇰🇼' },
  { code: 'LB', name_ar: 'لبنان', name_en: 'Lebanon', flag: '🇱🇧' },
  { code: 'LY', name_ar: 'ليبيا', name_en: 'Libya', flag: '🇱🇾' },
  { code: 'OM', name_ar: 'عُمان', name_en: 'Oman', flag: '🇴🇲' },
  { code: 'PS', name_ar: 'فلسطين', name_en: 'Palestine', flag: '🇵🇸' },
  { code: 'QA', name_ar: 'قطر', name_en: 'Qatar', flag: '🇶🇦' },
  { code: 'SY', name_ar: 'سوريا', name_en: 'Syria', flag: '🇸🇾' },
  { code: 'TN', name_ar: 'تونس', name_en: 'Tunisia', flag: '🇹🇳' },
  { code: 'YE', name_ar: 'اليمن', name_en: 'Yemen', flag: '🇾🇪' },
  { code: 'BH', name_ar: 'البحرين', name_en: 'Bahrain', flag: '🇧🇭' },
  { code: 'SD', name_ar: 'السودان', name_en: 'Sudan', flag: '🇸🇩' },
  { code: 'SO', name_ar: 'الصومال', name_en: 'Somalia', flag: '🇸🇴' },
  { code: 'MR', name_ar: 'موريتانيا', name_en: 'Mauritania', flag: '🇲🇷' },
  { code: 'DJ', name_ar: 'جيبوتي', name_en: 'Djibouti', flag: '🇩🇯' },
  { code: 'KM', name_ar: 'جزر القمر', name_en: 'Comoros', flag: '🇰🇲' },
];

export default function ArabFlagsConstellation() {
  const { appLang, setAppLang, strings } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const shouldReduceMotion = useReducedMotion();

  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [mobileGroupIndex, setMobileGroupIndex] = useState(0);

  // Mobile rotation logic: rotate through subsets of flags smoothly
  useEffect(() => {
    if (shouldReduceMotion) return;
    const interval = setInterval(() => {
      setMobileGroupIndex((prev) => (prev + 1) % Math.ceil(ARAB_COUNTRIES.length / 6));
    }, 5000);
    return () => clearInterval(interval);
  }, [shouldReduceMotion]);

  // Trigonometric orbital layout calculation for desktop constellation
  const getOrbitalPosition = (index, total) => {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
    // Elliptical radii for desktop
    const rx = 180;
    const ry = 95;
    const x = Math.cos(angle) * rx;
    const y = Math.sin(angle) * ry;
    return { x, y };
  };

  return (
    <div className={`w-full relative rounded-3xl p-6 border shadow-2xl overflow-hidden transition-all backdrop-blur-md ${
      isDark 
        ? 'bg-gradient-to-b from-slate-900/90 via-slate-800/80 to-slate-900/90 border-slate-700/80' 
        : 'bg-gradient-to-b from-white via-rose-50/40 to-white border-slate-200'
    }`}>
      {/* Ambient background glow layer */}
      <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 via-amber-500/5 to-blue-500/5 pointer-events-none" />

      {/* Header Label */}
      <div className="text-center space-y-1 relative z-10 mb-4">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-black bg-rose-500/15 text-rose-400 border border-rose-500/20">
          <Globe className="w-3.5 h-3.5 text-rose-400" />
          <span>{appLang === 'ar' ? 'دعم كامل باللغة العربية لكل الدول العربية 🌍' : 'Full Arabic Support Across the Arab World 🌍'}</span>
        </span>
      </div>

      {/* DESKTOP & TABLET CONSTELLATION VIEW (Hidden on small mobile screens) */}
      <div className="hidden sm:flex relative min-h-[260px] items-center justify-center py-6 z-10">
        {/* Central Arabic Language Centerpiece Button */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, cubicBezier: [0.16, 1, 0.3, 1] }}
          className="relative z-20 text-center"
        >
          <button
            onClick={() => setAppLang('ar')}
            className={`px-6 py-3.5 rounded-2xl font-black text-sm sm:text-base flex items-center gap-2.5 shadow-xl transition-all border ${
              appLang === 'ar'
                ? 'bg-gradient-to-r from-rose-600 via-amber-600 to-rose-600 text-white border-rose-400/50 shadow-rose-600/30 scale-105 animate-pulse-glow'
                : isDark ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700' : 'bg-white text-slate-800 border-slate-300 shadow-md hover:bg-slate-100'
            }`}
          >
            <span className="text-lg">🇸🇦</span>
            <span>العربية</span>
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin-slow" />
          </button>
        </motion.div>

        {/* Floating Constellation Flags Array */}
        {ARAB_COUNTRIES.map((country, idx) => {
          const { x, y } = getOrbitalPosition(idx, ARAB_COUNTRIES.length);
          const isHovered = hoveredCountry?.code === country.code;

          // Varied unique animation duration & offset for dynamic micro-floating
          const floatDuration = 4.5 + (idx % 5) * 0.6;
          const floatDelay = (idx % 7) * 0.15;
          const entranceDelay = 0.2 + idx * 0.04;

          return (
            <motion.div
              key={country.code}
              initial={{ opacity: 0, scale: 0.5, x: 0, y: 0 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                x: shouldReduceMotion ? x : [x - 3, x + 3, x - 3],
                y: shouldReduceMotion ? y : [y - 4, y + 4, y - 4],
                rotate: shouldReduceMotion ? 0 : [-2, 2, -2]
              }}
              transition={{
                opacity: { duration: 0.5, delay: entranceDelay },
                scale: { duration: 0.5, delay: entranceDelay },
                x: { duration: floatDuration, repeat: Infinity, ease: 'easeInOut', delay: floatDelay },
                y: { duration: floatDuration + 0.5, repeat: Infinity, ease: 'easeInOut', delay: floatDelay },
                rotate: { duration: floatDuration + 1, repeat: Infinity, ease: 'easeInOut', delay: floatDelay }
              }}
              whileHover={{ scale: 1.25, zIndex: 30 }}
              onHoverStart={() => setHoveredCountry(country)}
              onHoverEnd={() => setHoveredCountry(null)}
              className="absolute cursor-pointer group"
              style={{
                left: `calc(50% + ${x}px - 20px)`,
                top: `calc(50% + ${y}px - 20px)`,
              }}
            >
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-lg border backdrop-blur-md transition-all ${
                isDark 
                  ? 'bg-slate-800/90 border-slate-700/80 hover:border-rose-500/80 shadow-slate-950/50' 
                  : 'bg-white/90 border-slate-200/80 hover:border-rose-500/80 shadow-slate-300/40'
              }`}>
                <span>{country.flag}</span>
              </div>

              {/* Interactive Tooltip showing Country Name */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.9 }}
                    transition={{ duration: 0.15 }}
                    className={`absolute bottom-12 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-xl text-[11px] font-black whitespace-nowrap shadow-xl border z-40 pointer-events-none ${
                      isDark ? 'bg-slate-900 text-white border-rose-500/40' : 'bg-slate-900 text-white border-rose-500/40'
                    }`}
                  >
                    <span>{country.flag} {country.name_ar}</span>
                    <span className="text-[9px] opacity-75 block text-center">({country.name_en})</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* MOBILE COMPACT ROTATING CAROUSEL VIEW */}
      <div className="flex sm:hidden flex-col items-center space-y-4 py-3 z-10">
        {/* Central Arabic Language Centerpiece Button */}
        <button
          onClick={() => setAppLang('ar')}
          className={`w-full py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg border transition-all ${
            appLang === 'ar'
              ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white border-rose-500/40 shadow-rose-600/30'
              : isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-white text-slate-800 border-slate-200'
          }`}
        >
          <span>🇸🇦</span>
          <span>العربية (دعم كامل لجميع الدول)</span>
        </button>

        {/* Mobile Rotating Flag Grid Subset */}
        <div className="grid grid-cols-6 gap-2 w-full pt-1">
          {ARAB_COUNTRIES.slice(mobileGroupIndex * 6, mobileGroupIndex * 6 + 6).map((country, idx) => (
            <motion.div
              key={country.code}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              onClick={() => setAppLang('ar')}
              className={`p-2 rounded-xl border flex flex-col items-center justify-center shadow-md transition-all cursor-pointer ${
                isDark ? 'bg-slate-800/90 border-slate-700/80' : 'bg-white border-slate-200'
              }`}
            >
              <span className="text-xl">{country.flag}</span>
              <span className="text-[9px] font-bold text-theme-sub truncate w-full text-center mt-0.5">{country.name_ar}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* All 3 Language Buttons Selector Bar */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-700/40 relative z-10">
        <button
          onClick={() => setAppLang('ar')}
          className={`py-2 px-2 rounded-xl text-xs font-black transition-all border flex items-center justify-center gap-1 ${
            appLang === 'ar'
              ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-600/30'
              : isDark ? 'bg-slate-900/60 text-slate-400 border-slate-700/50' : 'bg-slate-100 text-slate-600 border-slate-200'
          }`}
        >
          <span>🇸🇦</span>
          <span>العربية</span>
        </button>

        <button
          onClick={() => setAppLang('en')}
          className={`py-2 px-2 rounded-xl text-xs font-black transition-all border flex items-center justify-center gap-1 ${
            appLang === 'en'
              ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-600/30'
              : isDark ? 'bg-slate-900/60 text-slate-400 border-slate-700/50' : 'bg-slate-100 text-slate-600 border-slate-200'
          }`}
        >
          <span>🇬🇧</span>
          <span>English</span>
        </button>

        <button
          onClick={() => setAppLang('ro')}
          className={`py-2 px-2 rounded-xl text-xs font-black transition-all border flex items-center justify-center gap-1 ${
            appLang === 'ro'
              ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-600/30'
              : isDark ? 'bg-slate-900/60 text-slate-400 border-slate-700/50' : 'bg-slate-100 text-slate-600 border-slate-200'
          }`}
        >
          <span>🇷🇴</span>
          <span>Română</span>
        </button>
      </div>
    </div>
  );
}
