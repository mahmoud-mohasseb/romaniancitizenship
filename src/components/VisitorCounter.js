'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Eye, Zap, Flame, Award, Globe, ShieldCheck, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { fetchGlobalVisitCount, getQuestionsCompletedCount, initActiveHeartbeat } from '../utils/analyticsCounter';

export default function VisitorCounter() {
  const { theme } = useTheme();
  const { appLang } = useLanguage();
  const isDark = theme === 'dark';

  const [visitorCount, setVisitorCount] = useState(14280);
  const [displayVisits, setDisplayVisits] = useState(0);
  const [activeUsers, setActiveUsers] = useState(42);
  const [questionsCount, setQuestionsCount] = useState(154200);

  useEffect(() => {
    // 1. Fetch real visit count
    fetchGlobalVisitCount().then(total => {
      setVisitorCount(total);
    });

    // 2. Fetch questions answered count
    setQuestionsCount(getQuestionsCompletedCount());

    // 3. Initialize real-time active heartbeat
    const cleanup = initActiveHeartbeat((count) => {
      setActiveUsers(count);
    });

    return () => cleanup();
  }, []);

  // Rolling count-up effect
  useEffect(() => {
    let start = 0;
    const end = visitorCount;
    const duration = 1200;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = end / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayVisits(end);
        clearInterval(timer);
      } else {
        setDisplayVisits(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [visitorCount]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full relative group"
    >
      {/* Outer Tri-Color Glowing Border Wrapper */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-rose-500 via-amber-500 to-blue-600 rounded-3xl blur-md opacity-40 group-hover:opacity-75 transition-opacity duration-500 animate-pulse-glow" />

      {/* Main Glassmorphism Container */}
      <div className={`relative w-full p-4 sm:p-6 rounded-3xl border shadow-2xl backdrop-blur-2xl grid grid-cols-1 sm:grid-cols-3 gap-4 items-center ${
        isDark 
          ? 'bg-slate-900/90 border-slate-800 text-white shadow-rose-950/30' 
          : 'bg-white/95 border-slate-200 text-slate-900 shadow-xl'
      }`}>
        
        {/* Stat Card 1: Total Global Visitors & Learners */}
        <motion.div 
          whileHover={{ y: -3, scale: 1.01 }}
          className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${
            isDark ? 'bg-slate-800/80 border-slate-700/60' : 'bg-rose-50/80 border-rose-200/80 shadow-sm'
          }`}
        >
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-rose-600 to-rose-700 text-white shadow-md shadow-rose-600/30 shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-xl sm:text-2xl font-black text-rose-500 font-latin tracking-tight">
                {displayVisits.toLocaleString()}
              </span>
              <span className="text-[10px] font-black text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded-md border border-rose-500/20">
                +
              </span>
            </div>
            <p className="text-[11px] text-theme-sub font-bold truncate">
              {appLang === 'ar' ? 'إجمالي المتقدمين والزوار' : appLang === 'en' ? 'Total App Learners' : 'Total Vizitatori ANC'}
            </p>
          </div>
        </motion.div>

        {/* Stat Card 2: Live Active Users Online with Radar Pulse */}
        <motion.div 
          whileHover={{ y: -3, scale: 1.01 }}
          className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${
            isDark ? 'bg-slate-800/80 border-slate-700/60' : 'bg-emerald-50/80 border-emerald-200/80 shadow-sm'
          }`}
        >
          <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shrink-0 relative">
            <Eye className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
            <span className="absolute top-1 right-1 w-3 h-3 rounded-full bg-emerald-500" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-lg sm:text-xl font-black text-emerald-400">
                {activeUsers}
              </span>
              <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-md border border-emerald-500/20">
                {appLang === 'ar' ? 'نشط الآن' : 'Active'}
              </span>
            </div>
            <p className="text-[11px] text-theme-sub font-bold truncate">
              {appLang === 'ar' ? 'يتدربون الآن في هذه اللحظة' : appLang === 'en' ? 'Active online right now' : 'Exersează acum'}
            </p>
          </div>
        </motion.div>

        {/* Stat Card 3: Questions Answered Milestone */}
        <motion.div 
          whileHover={{ y: -3, scale: 1.01 }}
          className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${
            isDark ? 'bg-slate-800/80 border-slate-700/60' : 'bg-amber-50/80 border-amber-200/80 shadow-sm'
          }`}
        >
          <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 shrink-0">
            <Zap className="w-6 h-6 text-amber-400 animate-bounce-subtle" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-xl sm:text-2xl font-black text-amber-400 font-latin tracking-tight">
                {questionsCount.toLocaleString()}+
              </span>
            </div>
            <p className="text-[11px] text-theme-sub font-bold truncate">
              {appLang === 'ar' ? 'إجمالي الأسئلة المُجابة' : appLang === 'en' ? 'Questions Practiced' : 'Întrebări Exersate'}
            </p>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
