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
  Zap, 
  Timer, 
  X, 
  Type, 
  Gamepad2 
} from 'lucide-react';
import questions from '../data/questions_ar.json';
import Navbar from '../components/Navbar';
import { useTheme } from '../context/ThemeContext';
import { CATEGORIES_LIST } from '../utils/categories';
import { UI_STRINGS } from '../utils/languageHelper';

export default function HomePage() {
  const [appLang, setAppLang] = useState('ar');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [showInstallModal, setShowInstallModal] = useState(false);
  const [downloadMarket, setDownloadMarket] = useState('pwa');

  const strings = UI_STRINGS[appLang] || UI_STRINGS.ar;
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
    <div className="min-h-screen pb-20 bg-theme-main text-theme-main flex flex-col">
      <Navbar appLang={appLang} setAppLang={setAppLang} />

      <main className={`flex-1 w-full max-w-4xl mx-auto px-4 py-6 space-y-6 ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
        {/* Hero Banner with App Logo */}
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
            <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold border ${
              isDark ? 'bg-slate-800 text-rose-400 border-rose-500/30' : 'bg-rose-50 text-rose-600 border-rose-200'
            }`}>
              🇷🇴 Cetățenia Română Prep
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              {strings.appTitle}
            </h1>
            <p className="text-xs sm:text-sm text-theme-sub max-w-xl mx-auto leading-relaxed">
              {strings.appSubtitle}
            </p>
          </div>

          {/* 3-Language Selector Bar */}
          <div className={`w-full backdrop-blur-md rounded-2xl p-3 border shadow-lg ${
            isDark ? 'bg-slate-800/80 border-slate-700/60' : 'bg-white border-slate-200'
          }`}>
            <p className="text-xs font-semibold text-theme-sub text-center mb-2">
              {strings.selectLangLabel}
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setAppLang('ar')}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 space-x-reverse ${
                  appLang === 'ar' 
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30' 
                    : isDark ? 'bg-slate-900/60 text-slate-400 hover:text-white border-slate-700/50' : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                <span>🇸🇦</span>
                <span>العربية</span>
              </button>

              <button
                onClick={() => setAppLang('en')}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                  appLang === 'en' 
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30' 
                    : isDark ? 'bg-slate-900/60 text-slate-400 hover:text-white border-slate-700/50' : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                <span>🇬🇧</span>
                <span>English</span>
              </button>

              <button
                onClick={() => setAppLang('ro')}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                  appLang === 'ro' 
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30' 
                    : isDark ? 'bg-slate-900/60 text-slate-400 hover:text-white border-slate-700/50' : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                <span>🇷🇴</span>
                <span>Română</span>
              </button>
            </div>
          </div>
        </div>

        {/* Marketplace Downloads Section */}
        <div className={`rounded-2xl p-4 border text-center space-y-3 ${
          isDark ? 'bg-slate-800/60 border-slate-700/60' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <p className="text-xs font-bold text-theme-main">
            {appLang === 'ar' ? '📲 حمل التطبيق على جهازك المحمول (Stores & PWA)' : appLang === 'en' ? '📲 Download App on Mobile Stores & Web' : '📲 Descarcă Aplicația pe Mobil'}
          </p>

          <div className="grid grid-cols-3 gap-2">
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

            <button
              onClick={() => openDownloadModal('pwa')}
              className={`flex items-center justify-center p-3 rounded-xl border border-amber-500/40 transition-all text-white group ${
                isDark ? 'bg-slate-900 hover:bg-slate-800' : 'bg-slate-800 hover:bg-slate-700'
              }`}
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
          <div className={`rounded-2xl p-4 text-center border flex flex-col items-center justify-center ${
            isDark ? 'bg-slate-800/80 border-slate-700/60' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <Images className="w-6 h-6 text-rose-500 mb-1" />
            <span className="text-xl font-bold">{questions.length}</span>
            <span className="text-[11px] text-theme-sub mt-1">{strings.questionsCount}</span>
          </div>

          <div className={`rounded-2xl p-4 text-center border flex flex-col items-center justify-center ${
            isDark ? 'bg-slate-800/80 border-slate-700/60' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <Type className="w-6 h-6 text-amber-400 mb-1" />
            <span className="text-xl font-bold">31</span>
            <span className="text-[11px] text-theme-sub mt-1">حرفاً وأمثلة</span>
          </div>

          <div className={`rounded-2xl p-4 text-center border flex flex-col items-center justify-center ${
            isDark ? 'bg-slate-800/80 border-slate-700/60' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <Sparkles className="w-6 h-6 text-amber-400 mb-1" />
            <span className="text-xl font-bold text-amber-400">AI</span>
            <span className="text-[11px] text-theme-sub mt-1">مساعد ذكي + Ollama</span>
          </div>
        </div>

        {/* Alphabet & Language Learning Banners */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href={`/alphabet?lang=${appLang}`}
            className="flex items-center justify-between p-5 bg-gradient-to-r from-amber-600 via-amber-700 to-amber-900 rounded-2xl border border-amber-500/40 shadow-lg hover:opacity-95 transition-all text-white group"
          >
            <div className="space-y-1">
              <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-black/20 text-white border border-white/20">
                🔤 31 Litere
              </span>
              <h3 className="text-base font-bold">{strings.alphabetTitle}</h3>
              <p className="text-xs text-amber-100/90">
                {appLang === 'ar' ? 'تعلم نطق الحروف الرومانية بالأمثلة والجمل المترجمة' : 'Learn letters, pronunciation, words & sentences'}
              </p>
            </div>
            <Type className="w-8 h-8 text-white shrink-0" />
          </Link>

          <Link
            href={`/alphabet-quiz?lang=${appLang}`}
            className="flex items-center justify-between p-5 bg-gradient-to-r from-rose-600 via-rose-700 to-amber-700 rounded-2xl border border-rose-500/40 shadow-lg hover:opacity-95 transition-all text-white group"
          >
            <div className="space-y-1">
              <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-black/20 text-white border border-white/20">
                🎮 Fun Audio Game
              </span>
              <h3 className="text-base font-bold">{strings.alphabetGameTitle}</h3>
              <p className="text-xs text-rose-100/90">
                {appLang === 'ar' ? 'لعبة استماع وتفاعل ممتعة لاختبار معرفتك بالحروف' : 'Interactive sound game to test listening skills'}
              </p>
            </div>
            <Gamepad2 className="w-8 h-8 text-white shrink-0" />
          </Link>
        </div>

        {/* Action Banners for AI Tutor & Study */}
        <div className="space-y-3">
          <Link 
            href={`/ai?lang=${appLang}`}
            className={`flex items-center justify-between p-5 rounded-2xl border shadow-lg hover:border-amber-400 transition-all group ${
              isDark ? 'bg-gradient-to-r from-slate-800 via-slate-800 to-amber-950/40 border-amber-500/40' : 'bg-slate-900 border-slate-800'
            }`}
          >
            <div className="space-y-1">
              <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                🤖 AI Model + Ollama Support
              </span>
              <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                {appLang === 'ar' ? 'المساعد الذكي للأسئلة المفتوحة' : appLang === 'en' ? 'AI Romanian Citizenship Tutor' : 'Asistent AI Cetățenie'}
              </h3>
              <p className="text-xs text-slate-400">
                {appLang === 'ar' ? 'اسأل أي سؤال إضافي وتحدث مع الذكاء الاصطناعي' : 'Ask custom questions & practice oral responses with AI'}
              </p>
            </div>
            <Sparkles className="w-8 h-8 text-amber-400 shrink-0" />
          </Link>

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
          <h2 className="text-lg font-bold">{strings.testYourself} 🏆</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href={`/quiz?mode=quick&category=all&lang=${appLang}`}
              className={`flex items-center justify-between p-4 rounded-2xl border-l-4 border-l-rose-500 border hover:border-rose-500 transition-all group ${
                isDark ? 'bg-slate-800/80 border-slate-700/60' : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="w-10 h-10 rounded-xl bg-rose-500/15 flex items-center justify-center text-rose-400">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">{strings.quickQuizTitle}</h4>
                  <p className="text-[11px] text-theme-sub">{strings.quickQuizDesc}</p>
                </div>
              </div>
              {isRtl ? <ChevronLeft className="w-5 h-5 text-rose-400" /> : <ChevronRight className="w-5 h-5 text-rose-400" />}
            </Link>

            <Link
              href={`/quiz?mode=exam&category=all&lang=${appLang}`}
              className={`flex items-center justify-between p-4 rounded-2xl border-l-4 border-l-emerald-400 border hover:border-emerald-400 transition-all group ${
                isDark ? 'bg-slate-800/80 border-slate-700/60' : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-400">
                  <Timer className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">{strings.examQuizTitle}</h4>
                  <p className="text-[11px] text-theme-sub">{strings.examQuizDesc}</p>
                </div>
              </div>
              {isRtl ? <ChevronLeft className="w-5 h-5 text-emerald-400" /> : <ChevronRight className="w-5 h-5 text-emerald-400" />}
            </Link>
          </div>
        </div>

        {/* Categories Grid Section */}
        <div className="space-y-3 pt-2">
          <h2 className="text-lg font-bold">{strings.categoriesCount}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CATEGORIES_LIST.filter(c => c.id !== 'all').map((cat) => (
              <Link
                key={cat.id}
                href={`/study?category=${cat.id}&lang=${appLang}`}
                className={`flex items-center justify-between p-4 rounded-2xl border-l-4 border hover:border-slate-400 transition-all group ${
                  isDark ? 'bg-slate-800/80 border-slate-700/60' : 'bg-white border-slate-200 shadow-sm'
                }`}
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
                    <h4 className="text-sm font-bold">
                      {appLang === 'ar' ? cat.name_ar : appLang === 'en' ? cat.name_en : cat.name_ro}
                    </h4>
                    <p className="text-[11px] text-theme-sub">{cat.name_ro}</p>
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
            <div className={`rounded-2xl border max-w-md w-full p-6 space-y-4 ${
              isDark ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
            }`}>
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                <h3 className="text-base font-bold">
                  {downloadMarket === 'appstore' ? '🍏 Apple App Store Setup' : downloadMarket === 'googleplay' ? '🤖 Google Play Setup' : '📱 Universal PWA Installation'}
                </h3>
                <button onClick={() => setShowInstallModal(false)} className="text-slate-400 hover:text-rose-500">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex flex-col items-center text-center space-y-2 py-2">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden shadow-md border border-rose-500">
                  <Image src="/icon.png" alt="App Logo" fill className="object-cover" />
                </div>
                <p className="text-sm font-bold text-emerald-400">Cetățenia Română Prep</p>
              </div>

              <div className={`rounded-xl p-4 border space-y-2 text-xs ${
                isDark ? 'bg-slate-900/80 border-slate-700/80 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}>
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
      </main>
    </div>
  );
}
