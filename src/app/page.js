'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  BookOpen, 
  Trophy, 
  Sparkles, 
  Smartphone, 
  Grid, 
  Images, 
  Globe, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Zap, 
  Timer, 
  X 
} from 'lucide-react';
import questions from '../data/questions_ar.json';
import { CATEGORIES_LIST } from '../utils/categories';
import { UI_STRINGS } from '../utils/languageHelper';

export default function HomePage() {
  const [appLang, setAppLang] = useState('ar'); // 'ar' or 'en'
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [downloadMarket, setDownloadMarket] = useState('pwa');

  const strings = UI_STRINGS[appLang];
  const isRtl = appLang === 'ar';

  const categoryCounts = CATEGORIES_LIST.reduce((acc, cat) => {
    if (cat.id === 'all') {
      acc[cat.id] = questions.length;
    } else {
      acc[cat.id] = questions.filter(q => q.category === cat.id).length;
    }
    return acc;
  }, {});

  const openDownloadModal = (market) => {
    setDownloadMarket(market);
    setShowInstallModal(true);
  };

  return (
    <div className={`space-y-6 ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header Badge & Title */}
      <div className="flex flex-col items-center text-center space-y-4 pt-2">
        <div className="relative w-24 h-24 rounded-2xl overflow-hidden shadow-xl border-2 border-rose-500 bg-slate-800">
          <Image 
            src="/icon.png" 
            alt="Romanian Citizenship Logo" 
            fill 
            className="object-cover"
          />
        </div>

        <div className="space-y-2">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold bg-slate-800 text-rose-400 border border-rose-500/30">
            🇷🇴 Cetățenia Română Prep
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
            {strings.appTitle}
          </h1>
          <p className="text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            {strings.appSubtitle}
          </p>
        </div>

        {/* Global Language Selector */}
        <div className="w-full bg-slate-800/80 backdrop-blur-md rounded-2xl p-3 border border-slate-700/60 shadow-lg">
          <p className="text-xs font-semibold text-slate-400 text-center mb-2">
            {strings.selectLangLabel}
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setAppLang('ar')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 space-x-reverse ${
                appLang === 'ar' 
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30' 
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-700/50'
              }`}
            >
              <span>🇸🇦</span>
              <span>العربية (Arabic)</span>
            </button>

            <button
              onClick={() => setAppLang('en')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
                appLang === 'en' 
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30' 
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-700/50'
              }`}
            >
              <span>🇬🇧</span>
              <span>English</span>
            </button>
          </div>
        </div>
      </div>

      {/* Marketplace App Store Downloads Section */}
      <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/60 text-center space-y-3">
        <p className="text-xs font-bold text-slate-300">
          {appLang === 'ar' ? '📲 حمل التطبيق على جهازك المحمول (Stores & PWA)' : '📲 Download App on Mobile Stores & Web'}
        </p>

        <div className="grid grid-cols-3 gap-2">
          {/* Apple App Store */}
          <button
            onClick={() => openDownloadModal('appstore')}
            className="flex items-center justify-center p-3 bg-black hover:bg-slate-900 rounded-xl border border-slate-700 transition-all text-white group"
          >
            <div className="flex items-center space-x-2 space-x-reverse">
              <span className="text-xl">🍏</span>
              <div className="text-left rtl:text-right">
                <p className="text-[9px] text-slate-400 font-semibold uppercase leading-tight">App Store</p>
                <p className="text-xs font-bold text-white leading-tight">Download</p>
              </div>
            </div>
          </button>

          {/* Google Play Store */}
          <button
            onClick={() => openDownloadModal('googleplay')}
            className="flex items-center justify-center p-3 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-700 transition-all text-white group"
          >
            <div className="flex items-center space-x-2 space-x-reverse">
              <span className="text-xl">🤖</span>
              <div className="text-left rtl:text-right">
                <p className="text-[9px] text-slate-400 font-semibold uppercase leading-tight">Google Play</p>
                <p className="text-xs font-bold text-emerald-400 leading-tight">Get It On</p>
              </div>
            </div>
          </button>

          {/* PWA Direct Install */}
          <button
            onClick={() => openDownloadModal('pwa')}
            className="flex items-center justify-center p-3 bg-slate-900 hover:bg-slate-800 rounded-xl border border-amber-500/40 transition-all text-white group"
          >
            <div className="flex items-center space-x-2 space-x-reverse">
              <Smartphone className="w-5 h-5 text-amber-400" />
              <div className="text-left rtl:text-right">
                <p className="text-[9px] text-amber-400 font-semibold uppercase leading-tight">Direct PWA</p>
                <p className="text-xs font-bold text-white leading-tight">Install</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-800/80 rounded-2xl p-4 text-center border border-slate-700/60 flex flex-col items-center justify-center">
          <Images className="w-6 h-6 text-rose-500 mb-1" />
          <span className="text-xl font-bold text-white">{questions.length}</span>
          <span className="text-[11px] text-slate-400 mt-1">{strings.questionsCount}</span>
        </div>

        <div className="bg-slate-800/80 rounded-2xl p-4 text-center border border-slate-700/60 flex flex-col items-center justify-center">
          <Grid className="w-6 h-6 text-emerald-400 mb-1" />
          <span className="text-xl font-bold text-white">5</span>
          <span className="text-[11px] text-slate-400 mt-1">{strings.categoriesCount}</span>
        </div>

        <div className="bg-slate-800/80 rounded-2xl p-4 text-center border border-slate-700/60 flex flex-col items-center justify-center">
          <Sparkles className="w-6 h-6 text-amber-400 mb-1" />
          <span className="text-xl font-bold text-amber-400">AI</span>
          <span className="text-[11px] text-slate-400 mt-1">مساعد ذكي + Ollama</span>
        </div>
      </div>

      {/* Action Banners */}
      <div className="space-y-3">
        {/* AI Tutor Assistant Banner */}
        <Link 
          href={`/ai?lang=${appLang}`}
          className="flex items-center justify-between p-5 bg-gradient-to-r from-slate-800 via-slate-800 to-amber-950/40 rounded-2xl border border-amber-500/40 shadow-lg hover:border-amber-400 transition-all group"
        >
          <div className="space-y-1">
            <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
              🤖 AI Model + Ollama Support
            </span>
            <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
              {appLang === 'ar' ? 'المساعد الذكي للأسئلة المفتوحة' : 'AI Romanian Citizenship Tutor'}
            </h3>
            <p className="text-xs text-slate-400">
              {appLang === 'ar' ? 'اسأل أي سؤال إضافي وتحدث مع الذكاء الاصطناعي' : 'Ask custom questions & practice oral responses with AI'}
            </p>
          </div>
          <Sparkles className="w-8 h-8 text-amber-400 shrink-0" />
        </Link>

        {/* Primary Study Banner */}
        <Link 
          href={`/study?category=all&lang=${appLang}`}
          className="flex items-center justify-between p-5 bg-gradient-to-r from-rose-600 to-rose-700 rounded-2xl shadow-lg shadow-rose-600/30 hover:opacity-95 transition-all text-white group"
        >
          <div className="space-y-1">
            <h3 className="text-lg font-bold">{strings.studyNow}</h3>
            <p className="text-xs text-rose-100/90">
              {appLang === 'ar' ? 'تصفح الأسئلة مع صور ويكيبيديا الواضحة والروابط المعرفية' : 'Browse questions with clear Wikipedia photos & article references'}
            </p>
          </div>
          <BookOpen className="w-8 h-8 text-white shrink-0" />
        </Link>
      </div>

      {/* Quiz Modes Section */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-white">{strings.testYourself} 🏆</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Quick Quiz */}
          <Link
            href={`/quiz?mode=quick&category=all&lang=${appLang}`}
            className="flex items-center justify-between p-4 bg-slate-800/80 rounded-2xl border-l-4 border-l-rose-500 border border-slate-700/60 hover:border-rose-500 transition-all group"
          >
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="w-10 h-10 rounded-xl bg-rose-500/15 flex items-center justify-center text-rose-400">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{strings.quickQuizTitle}</h4>
                <p className="text-[11px] text-slate-400">{strings.quickQuizDesc}</p>
              </div>
            </div>
            {isRtl ? <ChevronLeft className="w-5 h-5 text-rose-400" /> : <ChevronRight className="w-5 h-5 text-rose-400" />}
          </Link>

          {/* Official Exam Simulation */}
          <Link
            href={`/quiz?mode=exam&category=all&lang=${appLang}`}
            className="flex items-center justify-between p-4 bg-slate-800/80 rounded-2xl border-l-4 border-l-emerald-400 border border-slate-700/60 hover:border-emerald-400 transition-all group"
          >
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-400">
                <Timer className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{strings.examQuizTitle}</h4>
                <p className="text-[11px] text-slate-400">{strings.examQuizDesc}</p>
              </div>
            </div>
            {isRtl ? <ChevronLeft className="w-5 h-5 text-emerald-400" /> : <ChevronRight className="w-5 h-5 text-emerald-400" />}
          </Link>
        </div>
      </div>

      {/* Categories Grid Section */}
      <div className="space-y-3 pt-2">
        <h2 className="text-lg font-bold text-white">{strings.categoriesCount}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CATEGORIES_LIST.filter(c => c.id !== 'all').map((cat) => (
            <Link
              key={cat.id}
              href={`/study?category=${cat.id}&lang=${appLang}`}
              className="flex items-center justify-between p-4 bg-slate-800/80 rounded-2xl border-l-4 border border-slate-700/60 hover:border-slate-500 transition-all group"
              style={{ borderLeftColor: cat.color }}
            >
              <div className="flex items-center space-x-3 space-x-reverse">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: cat.color + '20', color: cat.color }}
                >
                  <Grid className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {appLang === 'ar' ? cat.name_ar : cat.name_en}
                  </h4>
                  <p className="text-[11px] text-slate-400">{cat.name_ro}</p>
                  <p className="text-[11px] font-semibold mt-0.5" style={{ color: cat.color }}>
                    {categoryCounts[cat.id]} {strings.questionsCount}
                  </p>
                </div>
              </div>
              {isRtl ? <ChevronLeft className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
            </Link>
          ))}
        </div>
      </div>

      {/* Install Modal */}
      {showInstallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 max-w-md w-full p-6 space-y-4 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <h3 className="text-base font-bold">
                {downloadMarket === 'appstore' ? '🍏 Apple App Store Setup' : downloadMarket === 'googleplay' ? '🤖 Google Play Setup' : '📱 Universal PWA Installation'}
              </h3>
              <button onClick={() => setShowInstallModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex flex-col items-center text-center space-y-2 py-2">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden shadow-md border border-rose-500">
                <Image src="/icon.png" alt="App Logo" fill className="object-cover" />
              </div>
              <p className="text-sm font-bold text-emerald-400">Cetățenia Română Prep</p>
            </div>

            <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-700/80 space-y-2 text-xs text-slate-300">
              {downloadMarket === 'appstore' && (
                <>
                  <p className="font-bold text-amber-400">🍏 iPhone / iPad (iOS Safari):</p>
                  <p>1. Open this website in Safari on your iPhone.</p>
                  <p>2. Tap the Share icon 📤 at the bottom.</p>
                  <p>3. Tap "Add to Home Screen" to install the app icon onto your phone!</p>
                </>
              )}
              {downloadMarket === 'googleplay' && (
                <>
                  <p className="font-bold text-emerald-400">🤖 Android Chrome:</p>
                  <p>1. Open this website in Chrome on your Android device.</p>
                  <p>2. Tap the 3 dots menu ≡ in top corner.</p>
                  <p>3. Tap "Install App" to download directly to your home screen.</p>
                </>
              )}
              {downloadMarket === 'pwa' && (
                <>
                  <p className="font-bold text-amber-400">📱 Universal PWA Mobile Download:</p>
                  <p>• iOS Safari: Share 📤 &rarr; Add to Home Screen</p>
                  <p>• Android Chrome: Options ≡ &rarr; Install App</p>
                </>
              )}
            </div>

            <button
              onClick={() => setShowInstallModal(false)}
              className="w-full py-3 bg-rose-600 hover:bg-rose-500 font-bold rounded-xl text-white shadow-lg transition-all"
            >
              Done (تم)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
