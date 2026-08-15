'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { Sparkles, Globe, Heart } from 'lucide-react';

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

  // Timer loop: advances to next Arab country flag every 2.2 seconds
  useEffect(() => {
    if (isPaused || shouldReduceMotion) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ARAB_COUNTRIES.length);
    }, 2200);

    return () => clearInterval(interval);
  }, [isPaused, shouldReduceMotion]);

  const activeCountry = ARAB_COUNTRIES[currentIndex];

  // 4 Cinematic Motion Trajectories (orbiting, scale zoom, rotation)
  const trajectoryType = currentIndex % 4;

  const getMotionVariant = (type) => {
    switch (type) {
      case 0:
        // Top-Right Arc Orbit to Bottom-Left
        return {
          initial: { x: 120, y: -90, scale: 0.3, opacity: 0, rotate: 18 },
          animate: { 
            x: [120, 20, -110], 
            y: [-90, -35, 75], 
            scale: [0.3, 1.45, 0.4], 
            opacity: [0, 1, 0], 
            rotate: [18, -6, -24] 
          },
          transition: { duration: 2.1, ease: [0.16, 1, 0.3, 1] }
        };
      case 1:
        // Bottom-Left Swoop Orbit to Top-Right
        return {
          initial: { x: -130, y: 85, scale: 0.3, opacity: 0, rotate: -22 },
          animate: { 
            x: [-130, -25, 115], 
            y: [85, 25, -75], 
            scale: [0.3, 1.5, 0.4], 
            opacity: [0, 1, 0], 
            rotate: [-22, 8, 22] 
          },
          transition: { duration: 2.1, ease: [0.16, 1, 0.3, 1] }
        };
      case 2:
        // Top-Left Curve Orbit to Bottom-Right
        return {
          initial: { x: -115, y: -85, scale: 0.3, opacity: 0, rotate: -16 },
          animate: { 
            x: [-115, 35, 110], 
            y: [-85, 20, 85], 
            scale: [0.3, 1.4, 0.4], 
            opacity: [0, 1, 0], 
            rotate: [-16, 5, 20] 
          },
          transition: { duration: 2.1, ease: [0.16, 1, 0.3, 1] }
        };
      case 3:
      default:
        // Direct Center Perspective Zoom Burst
        return {
          initial: { x: 0, y: 70, scale: 0.2, opacity: 0, rotate: 0 },
          animate: { 
            x: [0, 0, 0], 
            y: [70, 0, -70], 
            scale: [0.2, 1.55, 0.3], 
            opacity: [0, 1, 0], 
            rotate: [0, 0, 0] 
          },
          transition: { duration: 2.1, ease: [0.16, 1, 0.3, 1] }
        };
    }
  };

  const currentVariant = getMotionVariant(trajectoryType);

  return (
    <div className={`w-full relative rounded-3xl p-6 border shadow-2xl overflow-hidden transition-all backdrop-blur-md ${
      isDark 
        ? 'bg-gradient-to-b from-slate-900/90 via-slate-800/80 to-slate-900/90 border-slate-700/80' 
        : 'bg-gradient-to-b from-white via-rose-50/40 to-white border-slate-200'
    }`}>
      {/* Ambient Radial Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-rose-500/10 pointer-events-none" />

      {/* Top Header Badge */}
      <div className="text-center relative z-10 mb-3">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-black bg-rose-500/15 text-rose-400 border border-rose-500/20">
          <Globe className="w-3.5 h-3.5 text-rose-400" />
          <span>{activeCountry.flag} {activeCountry.name_ar} • ({currentIndex + 1} / 22)</span>
        </span>
      </div>

      {/* CINEMATIC SINGLE-FLAG SPOTLIGHT ORBITER */}
      <div className="relative min-h-[200px] flex items-center justify-center py-4 z-10">
        {/* Central Anchor: Arabic Language Button */}
        <motion.div 
          className="relative z-20 text-center cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setAppLang('ar')}
        >
          <div className={`px-7 py-3.5 rounded-2xl font-black text-sm sm:text-base flex items-center gap-3 shadow-2xl border transition-all ${
            appLang === 'ar'
              ? 'bg-gradient-to-r from-rose-600 via-amber-600 to-rose-600 text-white border-rose-400/50 shadow-rose-600/40 animate-pulse-glow'
              : isDark ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700' : 'bg-white text-slate-800 border-slate-300 shadow-md hover:bg-slate-100'
          }`}>
            <span className="text-xl">🇸🇦</span>
            <div className="text-right">
              <span className="block leading-tight font-black">العربية</span>
              <span className="text-[10px] text-rose-200 font-bold block">تعلم واختبر بلغة الضاد</span>
            </div>
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin-slow shrink-0" />
          </div>
        </motion.div>

        {/* Dynamic Single-Flag Orbiting Spotlight */}
        {!shouldReduceMotion && (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCountry.code}
              initial={currentVariant.initial}
              animate={currentVariant.animate}
              exit={{ opacity: 0, scale: 0.2 }}
              transition={currentVariant.transition}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onClick={() => setAppLang('ar')}
              className="absolute z-30 cursor-pointer pointer-events-auto"
            >
              <div className={`px-4 py-2 rounded-2xl border shadow-2xl backdrop-blur-md flex items-center gap-2.5 transition-all group ${
                isDark 
                  ? 'bg-slate-900/95 border-rose-500/60 shadow-rose-500/20 text-white' 
                  : 'bg-white/95 border-rose-500/60 shadow-rose-500/20 text-slate-900'
              }`}>
                <span className="text-2xl sm:text-3xl drop-shadow-md">{activeCountry.flag}</span>
                <div className="text-right">
                  <span className="block text-xs sm:text-sm font-black text-rose-400 leading-tight">
                    {activeCountry.name_ar}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold block leading-tight">
                    {activeCountry.name_en}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Reduced Motion Static Fallback */}
        {shouldReduceMotion && (
          <div className="absolute top-2 right-4 text-2xl">
            {activeCountry.flag}
          </div>
        )}
      </div>

      {/* Progress Dots Indicator bar for all 22 Arab countries */}
      <div className="flex items-center justify-center gap-1 pt-3 border-t border-slate-700/40 relative z-10 overflow-x-auto no-scrollbar">
        {ARAB_COUNTRIES.map((c, i) => (
          <button
            key={c.code}
            onClick={() => setCurrentIndex(i)}
            title={`${c.flag} ${c.name_ar}`}
            className={`w-2 h-2 rounded-full transition-all ${
              i === currentIndex 
                ? 'bg-rose-500 w-5 shadow-md shadow-rose-500/40' 
                : isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-300 hover:bg-slate-400'
            }`}
          />
        ))}
      </div>

      {/* 3 Language Quick Selector Bar */}
      <div className="grid grid-cols-3 gap-2 pt-3 relative z-10">
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
