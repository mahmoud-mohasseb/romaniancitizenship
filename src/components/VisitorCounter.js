'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Eye, ShieldCheck, Globe } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { fetchUserIpAndLocation, recordIpVisit, startIpHeartbeat } from '../utils/ipTracker';

export default function VisitorCounter() {
  const { theme } = useTheme();
  const { appLang } = useLanguage();
  const isDark = theme === 'dark';

  const [ipInfo, setIpInfo] = useState(null);
  const [totalIpVisits, setTotalIpVisits] = useState(18450);
  const [displayVisits, setDisplayVisits] = useState(0);
  const [activeCount, setActiveCount] = useState(42);

  useEffect(() => {
    fetchUserIpAndLocation().then(data => {
      setIpInfo(data);
      recordIpVisit(data).then(count => {
        setTotalIpVisits(count);
      });

      const cleanup = startIpHeartbeat(data, (stats) => {
        if (stats && stats.activeIpCount) {
          setActiveCount(stats.activeIpCount);
        }
      });

      return () => cleanup();
    });
  }, []);

  // Rolling count-up animation for total visits
  useEffect(() => {
    let start = 0;
    const end = totalIpVisits;
    const duration = 1000;
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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className={`px-4 py-2.5 rounded-2xl border shadow-lg backdrop-blur-xl flex items-center justify-between gap-3 text-xs font-bold transition-all ${
        isDark 
          ? 'bg-slate-800/90 border-slate-700/80 text-white shadow-rose-950/20' 
          : 'bg-white/95 border-slate-200 text-slate-900 shadow-md'
      }`}>
        
        {/* 1. Total IP Visitors */}
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-rose-500/15 text-rose-500 border border-rose-500/20">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-black text-sm text-rose-500 font-latin tracking-tight">
                {displayVisits.toLocaleString()}
              </span>
              <span className="text-[10px] text-rose-400 font-black">+</span>
            </div>
            <span className="text-[10px] text-theme-sub block font-semibold leading-none">
              {appLang === 'ar' ? 'إجمالي الزوار (IPs)' : appLang === 'en' ? 'Total Visitors' : 'Vizitatori IP'}
            </span>
          </div>
        </div>

        <div className="w-px h-6 bg-slate-700/50 shrink-0" />

        {/* 2. Active IP Visitors */}
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 relative">
            <Eye className="w-4 h-4" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-black text-sm text-emerald-400 font-latin tracking-tight">
                {activeCount}
              </span>
            </div>
            <span className="text-[10px] text-theme-sub block font-semibold leading-none">
              {appLang === 'ar' ? 'نشط الآن 🟢' : appLang === 'en' ? 'Active Now 🟢' : 'Activi Acum 🟢'}
            </span>
          </div>
        </div>

        {/* 3. Detected IP Location Badge */}
        {ipInfo && (
          <>
            <div className="hidden sm:block w-px h-6 bg-slate-700/50 shrink-0" />
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900/60 border border-slate-700/60 text-[11px] font-black text-slate-300 shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{ipInfo.flag}</span>
              <span>{ipInfo.countryName}</span>
            </div>
          </>
        )}

      </div>
    </motion.div>
  );
}
