'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { Sparkles, Globe } from 'lucide-react';

// All 22 Arab League Member State Flags with native AR & EN names
const ARAB_COUNTRIES = [
  { code: 'SA', name_ar: 'المملكة العربية السعودية', name_en: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'EG', name_ar: 'جمهورية مصر العربية', name_en: 'Egypt', flag: '🇪🇬' },
  { code: 'AE', name_ar: 'الإمارات العربية المتحدة', name_en: 'United Arab Emirates', flag: '🇦🇪' },
  { code: 'MA', name_ar: 'المملكة المغربية', name_en: 'Morocco', flag: '🇲🇦' },
  { code: 'DZ', name_ar: 'الجمهورية الجزائرية', name_en: 'Algeria', flag: '🇩🇿' },
  { code: 'IQ', name_ar: 'جمهورية العراق', name_en: 'Iraq', flag: '🇮🇶' },
  { code: 'JO', name_ar: 'المملكة الأردنية الهاشمية', name_en: 'Jordan', flag: '🇯🇴' },
  { code: 'KW', name_ar: 'دولة الكويت', name_en: 'Kuwait', flag: '🇰🇼' },
  { code: 'LB', name_ar: 'الجمهورية اللبنانية', name_en: 'Lebanon', flag: '🇱🇧' },
  { code: 'LY', name_ar: 'دولة ليبيا', name_en: 'Libya', flag: '🇱🇾' },
  { code: 'OM', name_ar: 'سلطنة عُمان', name_en: 'Oman', flag: '🇴🇲' },
  { code: 'PS', name_ar: 'دولة فلسطين', name_en: 'Palestine', flag: '🇵🇸' },
  { code: 'QA', name_ar: 'دولة قطر', name_en: 'Qatar', flag: '🇶🇦' },
  { code: 'SY', name_ar: 'الجمهورية العربية السورية', name_en: 'Syria', flag: '🇸🇾' },
  { code: 'TN', name_ar: 'الجمهورية التونسية', name_en: 'Tunisia', flag: '🇹🇳' },
  { code: 'YE', name_ar: 'الجمهورية اليمنية', name_en: 'Yemen', flag: '🇾🇪' },
  { code: 'BH', name_ar: 'مملكة البحرين', name_en: 'Bahrain', flag: '🇧🇭' },
  { code: 'SD', name_ar: 'جمهورية السودان', name_en: 'Sudan', flag: '🇸🇩' },
  { code: 'SO', name_ar: 'جمهورية الصومال', name_en: 'Somalia', flag: '🇸🇴' },
  { code: 'MR', name_ar: 'الجمهورية الإسلامية الموريتانية', name_en: 'Mauritania', flag: '🇲🇷' },
  { code: 'DJ', name_ar: 'جمهورية جيبوتي', name_en: 'Djibouti', flag: '🇩🇯' },
  { code: 'KM', name_ar: 'جمهورية جزر القمر', name_en: 'Comoros', flag: '🇰🇲' },
];

export default function ArabFlagsConstellation() {
  const { appLang, setAppLang } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const shouldReduceMotion = useReducedMotion();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Timer loop: slowed down to 3.8 seconds per flag for high visibility
  useEffect(() => {
    if (isPaused || shouldReduceMotion) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ARAB_COUNTRIES.length);
    }, 3800);

    return () => clearInterval(interval);
  }, [isPaused, shouldReduceMotion]);

  const activeCountry = ARAB_COUNTRIES[currentIndex];

  // 4 Smooth, Slow Cinematic Motion Trajectories
  const trajectoryType = currentIndex % 4;

  const getMotionVariant = (type) => {
    switch (type) {
      case 0:
        // Top-Right Arc Orbit to Bottom-Left (Bigger scale, smooth 3.4s duration)
        return {
          initial: { x: 140, y: -100, scale: 0.4, opacity: 0, rotate: 18 },
          animate: { 
            x: [140, 20, -130], 
            y: [-100, -35, 85], 
            scale: [0.4, 1.8, 0.5], 
            opacity: [0, 1, 0], 
            rotate: [18, -6, -24] 
          },
          transition: { duration: 3.4, ease: [0.16, 1, 0.3, 1] }
        };
      case 1:
        // Bottom-Left Swoop Orbit to Top-Right
        return {
          initial: { x: -140, y: 95, scale: 0.4, opacity: 0, rotate: -22 },
          animate: { 
            x: [-140, -25, 130], 
            y: [95, 25, -85], 
            scale: [0.4, 1.85, 0.5], 
            opacity: [0, 1, 0], 
            rotate: [-22, 8, 22] 
          },
          transition: { duration: 3.4, ease: [0.16, 1, 0.3, 1] }
        };
      case 2:
        // Top-Left Curve Orbit to Bottom-Right
        return {
          initial: { x: -130, y: -95, scale: 0.4, opacity: 0, rotate: -16 },
          animate: { 
            x: [-130, 35, 125], 
            y: [-95, 20, 95], 
            scale: [0.4, 1.75, 0.5], 
            opacity: [0, 1, 0], 
            rotate: [-16, 5, 20] 
          },
          transition: { duration: 3.4, ease: [0.16, 1, 0.3, 1] }
        };
      case 3:
      default:
        // Direct Center Perspective Zoom Burst
        return {
          initial: { x: 0, y: 80, scale: 0.3, opacity: 0, rotate: 0 },
          animate: { 
            x: [0, 0, 0], 
            y: [80, 0, -80], 
            scale: [0.3, 1.9, 0.4], 
            opacity: [0, 1, 0], 
            rotate: [0, 0, 0] 
          },
          transition: { duration: 3.4, ease: [0.16, 1, 0.3, 1] }
        };
    }
  };

  const currentVariant = getMotionVariant(trajectoryType);

  return (
    <div className={`w-full relative rounded-3xl p-6 sm:p-7 border shadow-2xl overflow-hidden transition-all backdrop-blur-md ${
      isDark 
        ? 'bg-gradient-to-b from-slate-900/95 via-slate-800/90 to-slate-900/95 border-slate-700/80' 
        : 'bg-gradient-to-b from-white via-rose-50/50 to-white border-slate-200'
    }`}>
      {/* Ambient Radial Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-rose-500/10 pointer-events-none" />

      {/* Top Header Badge */}
      <div className="text-center relative z-10 mb-4">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black bg-rose-500/15 text-rose-400 border border-rose-500/30 shadow-sm">
          <Globe className="w-4 h-4 text-rose-400" />
          <span>{activeCountry.flag} {activeCountry.name_ar} • ({currentIndex + 1} / 22)</span>
        </span>
      </div>

      {/* CINEMATIC SINGLE-FLAG SPOTLIGHT ORBITER */}
      <div className="relative min-h-[240px] sm:min-h-[260px] flex items-center justify-center py-6 z-10">
        {/* Central Anchor: Main Arabic Language Button */}
        <motion.div 
          className="relative z-20 text-center cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setAppLang('ar')}
        >
          <div className={`px-8 py-4 rounded-2xl font-black text-base sm:text-lg flex items-center gap-3 shadow-2xl border transition-all ${
            appLang === 'ar'
              ? 'bg-gradient-to-r from-rose-600 via-amber-600 to-rose-600 text-white border-rose-400/50 shadow-rose-600/40 animate-pulse-glow'
              : isDark ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700' : 'bg-white text-slate-800 border-slate-300 shadow-md hover:bg-slate-100'
          }`}>
            <span className="text-2xl">🇸🇦</span>
            <div className="text-right">
              <span className="block leading-tight font-black">العربية</span>
              <span className="text-xs text-rose-200 font-bold block">تعلم واختبر بلغة الضاد ⚡</span>
            </div>
            <Sparkles className="w-5 h-5 text-amber-300 animate-spin-slow shrink-0" />
          </div>
        </motion.div>

        {/* Dynamic Single-Flag Orbiting Spotlight (Bigger & Slower) */}
        {!shouldReduceMotion && (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCountry.code}
              initial={currentVariant.initial}
              animate={currentVariant.animate}
              exit={{ opacity: 0, scale: 0.3 }}
              transition={currentVariant.transition}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onClick={() => setAppLang('ar')}
              className="absolute z-30 cursor-pointer pointer-events-auto"
            >
              <div className={`px-6 py-3.5 sm:px-7 sm:py-4 rounded-3xl border-2 shadow-2xl backdrop-blur-xl flex items-center gap-3.5 transition-all group ${
                isDark 
                  ? 'bg-slate-900/95 border-rose-500/70 shadow-rose-500/30 text-white' 
                  : 'bg-white/95 border-rose-500/70 shadow-rose-500/30 text-slate-900'
              }`}>
                <span className="text-4xl sm:text-5xl md:text-6xl drop-shadow-lg">{activeCountry.flag}</span>
                <div className="text-right">
                  <span className="block text-sm sm:text-base md:text-lg font-black text-rose-400 leading-tight">
                    {activeCountry.name_ar}
                  </span>
                  <span className="text-xs sm:text-sm text-slate-300 font-extrabold block leading-tight">
                    {activeCountry.name_en}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Reduced Motion Static Fallback */}
        {shouldReduceMotion && (
          <div className="absolute top-2 right-4 text-3xl">
            {activeCountry.flag}
          </div>
        )}
      </div>

      {/* Progress Dots Indicator bar for all 22 Arab countries */}
      <div className="flex items-center justify-center gap-1.5 pt-4 border-t border-slate-700/40 relative z-10 overflow-x-auto no-scrollbar">
        {ARAB_COUNTRIES.map((c, i) => (
          <button
            key={c.code}
            onClick={() => setCurrentIndex(i)}
            title={`${c.flag} ${c.name_ar}`}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              i === currentIndex 
                ? 'bg-rose-500 w-6 shadow-md shadow-rose-500/40' 
                : isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-300 hover:bg-slate-400'
            }`}
          />
        ))}
      </div>

      {/* 3 Language Quick Selector Bar */}
      <div className="grid grid-cols-3 gap-2.5 pt-3 relative z-10">
        <button
          onClick={() => setAppLang('ar')}
          className={`py-2.5 px-2 rounded-xl text-xs font-black transition-all border flex items-center justify-center gap-1.5 ${
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
          className={`py-2.5 px-2 rounded-xl text-xs font-black transition-all border flex items-center justify-center gap-1.5 ${
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
          className={`py-2.5 px-2 rounded-xl text-xs font-black transition-all border flex items-center justify-center gap-1.5 ${
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
