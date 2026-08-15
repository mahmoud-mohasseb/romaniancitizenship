'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Eye, Zap, Flame, Award } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export default function VisitorCounter() {
  const { theme } = useTheme();
  const { appLang } = useLanguage();
  const isDark = theme === 'dark';

  const [visitorCount, setVisitorCount] = useState(12840);
  const [activeUsers, setActiveUsers] = useState(38);
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    // 1. Calculate persistent visit count in localStorage
    if (typeof window !== 'undefined') {
      const storedVisits = localStorage.getItem('app_visit_count');
      const visitNum = storedVisits ? parseInt(storedVisits, 10) + 1 : 1;
      localStorage.setItem('app_visit_count', visitNum.toString());

      const baseTotal = 12840 + visitNum;
      setVisitorCount(baseTotal);

      // Random live online fluctuation (32 - 48 users)
      const liveNow = 35 + Math.floor(Math.random() * 14);
      setActiveUsers(liveNow);
    }
  }, []);

  // 2. Rolling Number Count-Up Animation
  useEffect(() => {
    let start = 0;
    const end = visitorCount;
    const duration = 1200; // ms
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = end / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayCount(end);
        clearInterval(timer);
      } else {
        setDisplayCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [visitorCount]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`w-full p-4 sm:p-5 rounded-3xl border shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden backdrop-blur-xl ${
        isDark 
          ? 'bg-slate-800/80 border-slate-700/80 text-white shadow-rose-950/20' 
          : 'bg-white/90 border-slate-200 text-slate-900 shadow-md'
      }`}
    >
      {/* 1. Total Cumulative Learners Counter */}
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="p-3 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 text-white shadow-md shadow-rose-600/30 shrink-0">
          <Users className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-1">
            <span className="text-xl sm:text-2xl font-black tracking-tight text-rose-500 font-latin">
              {displayCount.toLocaleString()}+
            </span>
            <span className="text-xs font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              {appLang === 'ar' ? 'مستخدم' : appLang === 'en' ? 'Learners' : 'Utilizatori'}
            </span>
          </div>
          <p className="text-xs text-theme-sub font-bold">
            {appLang === 'ar' ? 'إجمالي زوار ومستخدمي التطبيق للتحضير' : appLang === 'en' ? 'Total app visitors & ANC citizenship applicants' : 'Total vizitatori și candidați ANC'}
          </p>
        </div>
      </div>

      {/* Vertical Divider line for desktop */}
      <div className="hidden sm:block w-px h-10 bg-slate-700/50" />

      {/* 2. Live Active Users Online Badge */}
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shrink-0 relative">
          <Eye className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-500" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm sm:text-base font-black text-emerald-400">
              {activeUsers} {appLang === 'ar' ? 'نشطين الآن 🟢' : appLang === 'en' ? 'Active Now 🟢' : 'Activi Acum 🟢'}
            </span>
          </div>
          <p className="text-[11px] text-theme-sub font-bold">
            {appLang === 'ar' ? 'يتدربون الآن على أسئلة الامتحان والدستور' : appLang === 'en' ? 'Practicing questions right now' : 'Exersează întrebările acum'}
          </p>
        </div>
      </div>

      {/* 3. Total Questions Answered Milestone */}
      <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-2xl bg-slate-900/60 border border-slate-700/60 text-xs font-black text-amber-300">
        <Zap className="w-4 h-4 text-amber-400 shrink-0" />
        <span>150,000+ {appLang === 'ar' ? 'سؤال مجاب' : 'Questions Done'}</span>
      </div>
    </motion.div>
  );
}
