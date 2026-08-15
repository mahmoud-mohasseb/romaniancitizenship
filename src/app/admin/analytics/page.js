'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { 
  Users, 
  Eye, 
  Globe, 
  Smartphone, 
  Monitor, 
  Tablet, 
  Clock, 
  TrendingUp, 
  BarChart3, 
  RefreshCw, 
  ShieldCheck, 
  Layers, 
  ArrowLeft,
  FileText,
  CheckCircle2
} from 'lucide-react';
import Navbar from '../../../components/Navbar';
import { useTheme } from '../../../context/ThemeContext';
import { useLanguage } from '../../../context/LanguageContext';

function AdminAnalyticsContent() {
  const { theme } = useTheme();
  const { appLang, strings, isRtl } = useLanguage();
  const isDark = theme === 'dark';

  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchMetrics = async () => {
    try {
      const res = await fetch('/api/analytics/dashboard', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data && data.metrics) {
          setMetrics(data.metrics);
          setLastUpdated(new Date());
        }
      }
    } catch (e) {
      console.error('Failed to fetch analytics metrics:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    // Auto-refresh Active Now & Dashboard polling every 10 seconds
    const timer = setInterval(fetchMetrics, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen pb-28 sm:pb-24 bg-theme-main text-theme-main flex flex-col font-latin">
      <Navbar />

      <main className={`flex-1 w-full max-w-5xl mx-auto px-4 py-6 space-y-6 animate-fade-in-up ${
        isRtl ? 'lg:mr-72' : 'lg:ml-72'
      } ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
        
        {/* Dashboard Title Header */}
        <div className={`p-6 rounded-3xl border shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          isDark ? 'bg-slate-800/90 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-rose-400" />
                <span>{appLang === 'ar' ? 'لوحة تحكم التحليلات الإدارية الرسمية 🛡️' : 'Official Admin Analytics Dashboard 🛡️'}</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                10s Live Polling
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black">
              {appLang === 'ar' ? 'إحصائيات الزوار والمستخدمين النشطين 📊' : 'Real-Time Visitors & Active Users Analytics 📊'}
            </h1>
            <p className="text-xs text-theme-sub font-semibold">
              {appLang === 'ar' 
                ? 'تتبع دقيق للزوار الفريدين (Unique Visitors)، الجلسات (Sessions)، والنشطين في آخر 5 دقائق.' 
                : 'Accurate tracking of Unique Visitors, Sessions, Page Views, and Active Users in the last 5 minutes.'}
            </p>
          </div>

          <button
            onClick={fetchMetrics}
            className="px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow-md transition-all flex items-center gap-2 shrink-0 self-start sm:self-auto"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{appLang === 'ar' ? 'تحديث الآن' : 'Refresh Now'}</span>
          </button>
        </div>

        {/* Loading State */}
        {loading && !metrics ? (
          <div className="p-12 text-center text-slate-400 font-bold text-sm">
            جاري تحميل بيانات التحليلات بدقة... ⏳
          </div>
        ) : metrics && (
          <div className="space-y-6">
            
            {/* 1. OVERVIEW METRIC CARDS (4 Columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Card 1: Unique Visitors */}
              <div className={`p-5 rounded-3xl border shadow-xl space-y-2 ${
                isDark ? 'bg-slate-800/90 border-slate-700' : 'bg-white border-slate-200'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-rose-500 uppercase tracking-wider">👥 Unique Visitors</span>
                  <Users className="w-5 h-5 text-rose-500" />
                </div>
                <div className="text-2xl font-black text-theme-main">
                  {(metrics.uniqueVisitors?.allTime || 0).toLocaleString()}
                </div>
                <div className="text-[11px] text-theme-sub font-bold pt-1 border-t border-slate-700/40 space-y-0.5">
                  <div className="flex justify-between"><span>اليوم (Today):</span><span className="text-rose-400 font-black">{metrics.uniqueVisitors?.today}</span></div>
                  <div className="flex justify-between"><span>آخر 7 أيام (7D):</span><span className="text-rose-400 font-black">{metrics.uniqueVisitors?.last7Days}</span></div>
                  <div className="flex justify-between"><span>آخر 30 يوم (30D):</span><span className="text-rose-400 font-black">{metrics.uniqueVisitors?.last30Days}</span></div>
                </div>
              </div>

              {/* Card 2: Active Users Now (5 Min Threshold) */}
              <div className={`p-5 rounded-3xl border shadow-xl space-y-2 relative overflow-hidden ${
                isDark ? 'bg-slate-800/90 border-emerald-500/40' : 'bg-emerald-50/90 border-emerald-300'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">🟢 Active Now (5 Min)</span>
                  <div className="relative">
                    <Eye className="w-5 h-5 text-emerald-400" />
                    <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  </div>
                </div>
                <div className="text-3xl font-black text-emerald-400">
                  {metrics.activeNow || 0}
                </div>
                <p className="text-[11px] text-emerald-300 font-bold pt-1">
                  تفاعلوا خلال آخر 5 دقائق في الموقع ⚡
                </p>
              </div>

              {/* Card 3: Total Page Views */}
              <div className={`p-5 rounded-3xl border shadow-xl space-y-2 ${
                isDark ? 'bg-slate-800/90 border-slate-700' : 'bg-white border-slate-200'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-400 uppercase tracking-wider">📊 Total Page Views</span>
                  <BarChart3 className="w-5 h-5 text-amber-400" />
                </div>
                <div className="text-2xl font-black text-theme-main">
                  {(metrics.totalPageViews || 0).toLocaleString()}
                </div>
                <p className="text-[11px] text-theme-sub font-bold pt-1 border-t border-slate-700/40">
                  معدل التصفح: {((metrics.totalPageViews || 0) / Math.max(metrics.totalSessions || 1, 1)).toFixed(1)} صفحة/جلسة
                </p>
              </div>

              {/* Card 4: Total Sessions */}
              <div className={`p-5 rounded-3xl border shadow-xl space-y-2 ${
                isDark ? 'bg-slate-800/90 border-slate-700' : 'bg-white border-slate-200'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-blue-400 uppercase tracking-wider">⚡ Total Sessions</span>
                  <Clock className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-2xl font-black text-theme-main">
                  {(metrics.totalSessions || 0).toLocaleString()}
                </div>
                <p className="text-[11px] text-theme-sub font-bold pt-1 border-t border-slate-700/40">
                  انقطاع 30 دقيقة يبدأ جلسة جديدة
                </p>
              </div>

            </div>

            {/* 2. REAL-TIME ACTIVE USERS BREAKDOWN (By Page, Language, Device) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Active By Page */}
              <div className={`p-5 rounded-3xl border shadow-xl space-y-3 ${
                isDark ? 'bg-slate-800/90 border-slate-700' : 'bg-white border-slate-200'
              }`}>
                <h3 className="text-sm font-black text-theme-main flex items-center justify-between">
                  <span>📄 النشطين حسب الصفحة</span>
                  <span className="text-xs text-rose-500 font-bold">{metrics.activeNow} نشط</span>
                </h3>
                <div className="space-y-2 text-xs font-bold">
                  {Object.entries(metrics.activeByPage || {}).length === 0 ? (
                    <p className="text-slate-400">لا يوجد نشطين حالياً</p>
                  ) : (
                    Object.entries(metrics.activeByPage || {}).map(([pagePath, count]) => (
                      <div key={pagePath} className="flex justify-between items-center p-2 rounded-xl bg-slate-900/40 border border-slate-700/50">
                        <span className="font-latin text-rose-400 truncate max-w-[180px]">{pagePath}</span>
                        <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-black">{count}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Active By Language */}
              <div className={`p-5 rounded-3xl border shadow-xl space-y-3 ${
                isDark ? 'bg-slate-800/90 border-slate-700' : 'bg-white border-slate-200'
              }`}>
                <h3 className="text-sm font-black text-theme-main">🌐 النشطين حسب اللغة</h3>
                <div className="space-y-2 text-xs font-bold">
                  <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-900/40 border border-slate-700/50">
                    <span>🇸🇦 العربية (Arabic):</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-black">
                      {metrics.activeByLanguage?.ar || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-900/40 border border-slate-700/50">
                    <span>🇷🇴 الرومانية (Romanian):</span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-black">
                      {metrics.activeByLanguage?.ro || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-900/40 border border-slate-700/50">
                    <span>🇬🇧 الإنجليزية (English):</span>
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-black">
                      {metrics.activeByLanguage?.en || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Active By Device */}
              <div className={`p-5 rounded-3xl border shadow-xl space-y-3 ${
                isDark ? 'bg-slate-800/90 border-slate-700' : 'bg-white border-slate-200'
              }`}>
                <h3 className="text-sm font-black text-theme-main">📱 النشطين حسب الجهاز</h3>
                <div className="space-y-2 text-xs font-bold">
                  <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-900/40 border border-slate-700/50">
                    <span className="flex items-center gap-1.5"><Smartphone className="w-4 h-4 text-rose-400" /> هاتف (Mobile):</span>
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-black">
                      {metrics.activeByDevice?.mobile || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-900/40 border border-slate-700/50">
                    <span className="flex items-center gap-1.5"><Monitor className="w-4 h-4 text-blue-400" /> كمبيوتر (Desktop):</span>
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-black">
                      {metrics.activeByDevice?.desktop || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-900/40 border border-slate-700/50">
                    <span className="flex items-center gap-1.5"><Tablet className="w-4 h-4 text-amber-400" /> تابلت (Tablet):</span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-black">
                      {metrics.activeByDevice?.tablet || 0}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* 3. POPULAR PAGES TABLE */}
            <div className={`p-6 rounded-3xl border shadow-xl space-y-4 ${
              isDark ? 'bg-slate-800/90 border-slate-700' : 'bg-white border-slate-200'
            }`}>
              <h3 className="text-base font-black flex items-center gap-2">
                <FileText className="w-5 h-5 text-rose-500" />
                <span>الصفحات الأكثر زيارة (Popular Pages Breakdown)</span>
              </h3>

              <div className="overflow-x-auto rounded-2xl border border-slate-700/60">
                <table className="w-full text-xs sm:text-sm text-right">
                  <thead className={`border-b ${isDark ? 'bg-slate-900 text-slate-200' : 'bg-slate-100 text-slate-800'}`}>
                    <tr>
                      <th className="p-3 text-right font-black">مسار الصفحة (Page Route)</th>
                      <th className="p-3 text-center font-black">عدد الزيارات (Views)</th>
                      <th className="p-3 text-center font-black">النسبة المئوية (%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/40">
                    {(metrics.popularPages || []).map((p, idx) => {
                      const pct = Math.round((p.views / Math.max(metrics.totalPageViews, 1)) * 100);
                      return (
                        <tr key={idx} className={isDark ? 'hover:bg-slate-900/50' : 'hover:bg-slate-100/60'}>
                          <td className="p-3 font-black font-latin text-rose-400">{p.path}</td>
                          <td className="p-3 text-center font-bold">{p.views}</td>
                          <td className="p-3 text-center font-bold text-emerald-400">{pct}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 4. DEFINITIONS DOCUMENTATION CARD */}
            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs font-bold space-y-2">
              <span className="text-amber-400 font-black block">📖 تعريفات المقاييس المعتمدة في النظام:</span>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                <li><strong className="text-white">Unique Visitors:</strong> عدد الزوار الفريدين المعرفين برقم مجهول ثابت دون تكرار عند إعادة التحديث.</li>
                <li><strong className="text-white">Active Now:</strong> المستخدمون الذين أرسلوا نبض تفاعل (Heartbeat) خلال آخر 5 دقائق.</li>
                <li><strong className="text-white">Sessions:</strong> الجلسات المنفصلة وتتجدد تلقائياً بعد 30 دقيقة من الخمول.</li>
                <li><strong className="text-white">Page Views:</strong> عدد مرات تصفح التنقلات في التطبيق مع إلغاء تكرار React StrictMode.</li>
              </ul>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}

export default function AdminAnalyticsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400 font-bold">Loading Analytics Dashboard...</div>}>
      <AdminAnalyticsContent />
    </Suspense>
  );
}
