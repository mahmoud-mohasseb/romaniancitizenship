'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Eye, Zap, Flame, Award, Globe, ShieldCheck, Sparkles, MapPin, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { fetchUserIpAndLocation, recordIpVisit, startIpHeartbeat } from '../utils/ipTracker';
import { getQuestionsCompletedCount } from '../utils/analyticsCounter';

export default function VisitorCounter() {
  const { theme } = useTheme();
  const { appLang } = useLanguage();
  const isDark = theme === 'dark';

  const [ipInfo, setIpInfo] = useState(null);
  const [totalIpVisits, setTotalIpVisits] = useState(18450);
  const [displayVisits, setDisplayVisits] = useState(0);
  const [activeIpStats, setActiveIpStats] = useState({
    activeIpCount: 42,
    uniqueFlags: ['🇷🇴', '🇪🇬', '🇩🇪', '🇸🇦', '🇲🇦'],
    clientIp: 'IP-Verified',
    clientCountry: 'Romania',
    clientFlag: '🇷🇴'
  });
  const [questionsCount, setQuestionsCount] = useState(154200);

  useEffect(() => {
    // 1. Fetch real IP & Location
    fetchUserIpAndLocation().then(data => {
      setIpInfo(data);
      // Record visit for this IP
      recordIpVisit(data).then(count => {
        setTotalIpVisits(count);
      });

      // Start IP Heartbeat
      const cleanup = startIpHeartbeat(data, (stats) => {
        setActiveIpStats(stats);
      });

      return () => cleanup();
    });

    // 2. Fetch questions completed count
    setQuestionsCount(getQuestionsCompletedCount());
  }, []);

  // Rolling count-up effect
  useEffect(() => {
    let start = 0;
    const end = totalIpVisits;
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
  }, [totalIpVisits]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full relative group space-y-2"
    >
      {/* Outer Tri-Color Glowing Border Wrapper */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-rose-500 via-amber-500 to-blue-600 rounded-3xl blur-md opacity-45 group-hover:opacity-80 transition-opacity duration-500 animate-pulse-glow" />

      {/* Main Glassmorphism Container */}
      <div className={`relative w-full p-5 sm:p-6 rounded-3xl border shadow-2xl backdrop-blur-2xl space-y-4 ${
        isDark 
          ? 'bg-slate-900/95 border-slate-800 text-white shadow-rose-950/30' 
          : 'bg-white/95 border-slate-200 text-slate-900 shadow-xl'
      }`}>
        
        {/* Top Header Bar: IP Verification Status & Detected Geolocation */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700/50 pb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{appLang === 'ar' ? 'جلسة نشطة موثقة بـ IP ✅' : 'IP-Verified Active Learner Session ✅'}</span>
            </span>

            {ipInfo && (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                <span>{ipInfo.flag}</span>
                <span>{ipInfo.countryName}</span>
                <span className="opacity-60 text-[10px]">({ipInfo.ip.substring(0, 7)}***)</span>
              </span>
            )}
          </div>

          {/* Active Learner Countries Flag Bar */}
          <div className="flex items-center gap-1 text-xs font-bold text-theme-sub">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider pl-1">
              {appLang === 'ar' ? 'الدول النشطة:' : 'Active Countries:'}
            </span>
            <div className="flex items-center gap-1">
              {activeIpStats.uniqueFlags.map((flag, idx) => (
                <span key={idx} className="text-sm hover:scale-125 transition-transform">{flag}</span>
              ))}
            </div>
          </div>
        </div>

        {/* 3 Main IP-Verified Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          
          {/* Card 1: IP-Verified Unique Visitors */}
          <motion.div 
            whileHover={{ y: -3, scale: 1.01 }}
            className={`p-4 rounded-2xl border flex items-center gap-3 transition-all ${
              isDark ? 'bg-slate-800/80 border-slate-700/60' : 'bg-rose-50/80 border-rose-200/80 shadow-sm'
            }`}
          >
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-rose-600 to-rose-700 text-white shadow-md shadow-rose-600/30 shrink-0">
              <Globe className="w-6 h-6" />
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
                {appLang === 'ar' ? 'زوار موثقون بـ IP (Unique IPs)' : appLang === 'en' ? 'IP-Verified Unique Visitors' : 'Vizitatori Unici IP'}
              </p>
            </div>
          </motion.div>

          {/* Card 2: Real Active Connected IP Sessions */}
          <motion.div 
            whileHover={{ y: -3, scale: 1.01 }}
            className={`p-4 rounded-2xl border flex items-center gap-3 transition-all ${
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
                  {activeIpStats.activeIpCount}
                </span>
                <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-md border border-emerald-500/20">
                  IP Active
                </span>
              </div>
              <p className="text-[11px] text-theme-sub font-bold truncate">
                {appLang === 'ar' ? 'جلسات IP نشطة الآن في الموقع' : appLang === 'en' ? 'Live Connected IP Sessions' : 'Sesiuni IP Active Acum'}
              </p>
            </div>
          </motion.div>

          {/* Card 3: Questions Answered Milestone */}
          <motion.div 
            whileHover={{ y: -3, scale: 1.01 }}
            className={`p-4 rounded-2xl border flex items-center gap-3 transition-all ${
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
                {appLang === 'ar' ? 'أسئلة تم حلها واجتيازها' : appLang === 'en' ? 'Questions Answered' : 'Întrebări Rezolvate'}
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
}
