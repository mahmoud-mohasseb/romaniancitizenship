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
  ChevronLeft, 
  ChevronRight, 
  Zap, 
  Timer, 
  X, 
  Type, 
  Gamepad2, 
  MessageSquare, 
  Puzzle, 
  GraduationCap 
} from 'lucide-react';
import questions from '../data/questions_ar.json';
import Navbar from '../components/Navbar';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { CATEGORIES_LIST } from '../utils/categories';

export default function HomePage() {
  const { theme } = useTheme();
  const { appLang, setAppLang, strings, isRtl } = useLanguage();
  const isDark = theme === 'dark';

  const [showInstallModal, setShowInstallModal] = useState(false);
  const [downloadMarket, setDownloadMarket] = useState('pwa');

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
      {/* Sidebar Navigation */}
      <Navbar />

      {/* Main Content Area with Desktop Sidebar Offset */}
      <main className={`flex-1 w-full max-w-4xl mx-auto px-4 py-6 space-y-6 ${
        isRtl ? 'lg:mr-72' : 'lg:ml-72'
      } ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
        
        {/* Hero Banner */}
        <div className="flex flex-col items-center text-center space-y-4 pt-2">
          <div className="relative w-24 h-24 rounded-2xl overflow-hidden shadow-xl border-2 border-rose-500 bg-slate-800">
            <Image 
              src="/icon.png" 
              alt="Romanian Citizenship Emblem Logo" 
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
                className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 space-x-reverse ${
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
                className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
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
                className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
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

        {/* Learning Modules Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Romanian Grammar Guide Card */}
          <Link
            href="/grammar"
            className="flex items-center justify-between p-5 bg-gradient-to-r from-amber-500 via-amber-600 to-rose-700 rounded-2xl border border-amber-500/40 shadow-lg hover:opacity-95 transition-all text-white group"
          >
            <div className="space-y-1">
              <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-black/20 text-white border border-white/20">
                📚 Gramatica Limbii Române
              </span>
              <h3 className="text-base font-bold">{appLang === 'ar' ? 'شرح قواعد الرومانية والضمائر' : 'Romanian Grammar Guide'}</h3>
              <p className="text-xs text-amber-100/90">
                {appLang === 'ar' ? 'الأجناس وأدوات التعريف وتصريف الأفعال مع الصوت' : 'Nouns, Definite articles & Verb conjugations'}
              </p>
            </div>
            <GraduationCap className="w-8 h-8 text-white shrink-0" />
          </Link>

          {/* Grammar Quiz Game Card */}
          <Link
            href="/grammar-quiz"
            className="flex items-center justify-between p-5 bg-gradient-to-r from-rose-600 via-rose-700 to-amber-800 rounded-2xl border border-rose-500/40 shadow-lg hover:opacity-95 transition-all text-white group"
          >
            <div className="space-y-1">
              <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-black/20 text-white border border-white/20">
                🎮 Grammar Quiz Challenge
              </span>
              <h3 className="text-base font-bold">{appLang === 'ar' ? 'لعبة اختبار القواعد 🎮' : 'Grammar Quiz Game'}</h3>
              <p className="text-xs text-rose-100/90">
                {appLang === 'ar' ? 'تحديات ممتعة لاختبار معرفتك بتصريف الأفعال والأدوات' : 'Fun interactive verb & article quizzes'}
              </p>
            </div>
            <Trophy className="w-8 h-8 text-white shrink-0" />
          </Link>

          {/* Daily Conversations Card */}
          <Link
            href="/conversations"
            className="flex items-center justify-between p-5 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-900 rounded-2xl border border-blue-500/40 shadow-lg hover:opacity-95 transition-all text-white group"
          >
            <div className="space-y-1">
              <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-black/20 text-white border border-white/20">
                🗣️ Daily Dialogues
              </span>
              <h3 className="text-base font-bold">{strings.conversationsTitle}</h3>
              <p className="text-xs text-blue-100/90">
                {appLang === 'ar' ? 'حوارات الفندق والقطار والطوارئ والمقابلة بالصوت' : 'Translated dialogues with native audio'}
              </p>
            </div>
            <MessageSquare className="w-8 h-8 text-white shrink-0" />
          </Link>

          {/* Fun Language Learning Quiz Card */}
          <Link
            href="/language-quiz"
            className="flex items-center justify-between p-5 bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-900 rounded-2xl border border-emerald-500/40 shadow-lg hover:opacity-95 transition-all text-white group"
          >
            <div className="space-y-1">
              <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-black/20 text-white border border-white/20">
                🧩 Vocabulary & Phrases
              </span>
              <h3 className="text-base font-bold">{appLang === 'ar' ? 'اختبار المفردات والجمل 🎮' : 'Vocabulary Quiz'}</h3>
              <p className="text-xs text-emerald-100/90">
                {appLang === 'ar' ? 'تحدي الكلمات والجمل الرومانية اليومية' : 'Fun vocabulary & phrase challenges'}
              </p>
            </div>
            <Puzzle className="w-8 h-8 text-white shrink-0" />
          </Link>
        </div>

        {/* Action Banners for AI Tutor & Study */}
        <div className="space-y-3">
          <Link 
            href="/ai"
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
                {appLang === 'ar' ? 'اسأل أي سؤال إضافي وتحدث مع الذكاء الاصطناعي' : appLang === 'en' ? 'Ask custom questions & practice oral responses with AI' : 'Întreabă orice despre interviu și constituție'}
              </p>
            </div>
            <Sparkles className="w-8 h-8 text-amber-400 shrink-0" />
          </Link>

          <Link 
            href="/study?category=all"
            className="flex items-center justify-between p-5 bg-gradient-to-r from-rose-600 to-rose-700 rounded-2xl shadow-lg shadow-rose-600/30 hover:opacity-95 transition-all text-white group"
          >
            <div className="space-y-1">
              <h3 className="text-lg font-bold">{strings.studyNow}</h3>
              <p className="text-xs text-rose-100/90">
                {appLang === 'ar' ? 'تصفح الأسئلة مع صور ويكيبيديا الواضحة والروابط المعرفية' : appLang === 'en' ? 'Browse questions with clear Wikipedia photos & article references' : 'Răsfoiește întrebările cu imagini clare și referințe Wikipedia'}
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
              href="/quiz?mode=quick&category=all"
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
              href="/quiz?mode=exam&category=all"
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
      </main>
    </div>
  );
}
