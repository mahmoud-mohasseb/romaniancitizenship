'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
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
  GraduationCap, 
  ShieldCheck, 
  Globe, 
  Landmark, 
  Palette,
  Download,
  Music,
  Heart,
  FileText,
  Award,
  Layers
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

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallPWA = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`PWA User Choice Outcome: ${outcome}`);
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  const categoryCounts = CATEGORIES_LIST.reduce((acc, cat) => {
    if (cat.id === 'all') {
      acc[cat.id] = questions.length;
    } else {
      acc[cat.id] = questions.filter(q => q.category === cat.id).length;
    }
    return acc;
  }, {});

  const getCategoryIcon = (catId) => {
    switch (catId) {
      case 'constitution': return ShieldCheck;
      case 'history': return Landmark;
      case 'geography': return Globe;
      case 'culture': return Palette;
      default: return BookOpen;
    }
  };

  return (
    <div className="min-h-screen pb-28 sm:pb-24 bg-theme-main text-theme-main flex flex-col font-latin">
      {/* Sidebar Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className={`flex-1 w-full max-w-4xl mx-auto px-4 py-6 space-y-6 ${
        isRtl ? 'lg:mr-72' : 'lg:ml-72'
      } ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
        
        {/* Hero Banner with Framer Motion */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center space-y-4 pt-2"
        >
          <div className="relative w-24 h-24 rounded-2xl overflow-hidden shadow-xl border-2 border-rose-500 bg-slate-800 animate-pulse-glow">
            <Image 
              src="/icon.png" 
              alt="Romanian Citizenship Emblem Logo" 
              fill 
              className="object-cover"
            />
          </div>

          <div className="space-y-2">
            <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-black border ${
              isDark ? 'bg-slate-800 text-rose-400 border-rose-500/30' : 'bg-rose-50 text-rose-600 border-rose-200'
            }`}>
              🇷🇴 {questions.length} {strings.questionsBadge || 'سؤالاً مصوراً لاختبار الجنسية الرومانية ANC'}
            </span>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              {strings.appTitle}
            </h1>
            <p className="text-xs sm:text-sm text-theme-sub max-w-xl mx-auto leading-relaxed font-bold">
              {strings.appSubtitle}
            </p>
          </div>

          {/* Native PWA Installation Banner */}
          {isInstallable && (
            <div className="w-full p-4 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-700 to-amber-700 text-white shadow-xl flex items-center justify-between gap-3 border border-rose-400/40 animate-fade-in-up">
              <div className="flex items-center gap-3 text-right">
                <div className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center shrink-0">
                  <Smartphone className="w-6 h-6 text-white animate-bounce-subtle" />
                </div>
                <div>
                  <h3 className="text-sm font-black">{appLang === 'ar' ? 'تثبيت التطبيق على جهازك 📲' : appLang === 'en' ? 'Install App on Your Phone 📲' : 'Instalează Aplicația pe Telefon 📲'}</h3>
                  <p className="text-[11px] text-rose-100">{appLang === 'ar' ? 'احصل على تجربة تطبيق هاتف كاملة بدون إنترنت!' : 'Get a full standalone app experience offline!'}</p>
                </div>
              </div>

              <button
                onClick={handleInstallPWA}
                className="px-4 py-2.5 bg-white text-rose-700 hover:bg-rose-50 font-black rounded-xl text-xs shadow-md transition-all shrink-0 flex items-center gap-1.5"
              >
                <Download className="w-4 h-4 shrink-0" />
                <span>{appLang === 'ar' ? 'تثبيت 📲' : appLang === 'en' ? 'Install 📲' : 'Instalează 📲'}</span>
              </button>
            </div>
          )}

          {/* 3-Language Selector Bar with Animated Arabic Indicator */}
          <div className={`w-full backdrop-blur-md rounded-2xl p-3 border shadow-lg ${
            isDark ? 'bg-slate-800/80 border-slate-700/60' : 'bg-white border-slate-200'
          }`}>
            <p className="text-xs font-bold text-theme-sub text-center mb-2">
              {strings.selectLangLabel}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {/* Animated Arabic Language Indicator Badge */}
              <motion.button
                onClick={() => setAppLang('ar')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`py-2.5 px-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 relative overflow-hidden ${
                  appLang === 'ar' 
                    ? 'bg-gradient-to-r from-rose-600 via-amber-600 to-rose-600 text-white shadow-md shadow-rose-600/30' 
                    : isDark ? 'bg-slate-900/60 text-slate-400 hover:text-white border-slate-700/50' : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                <span className="relative z-10 text-sm">🇸🇦</span>
                <span className="relative z-10">العربية</span>
                {/* Subtle Professional Glow Animation */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer pointer-events-none" />
              </motion.button>

              <button
                onClick={() => setAppLang('en')}
                className={`py-2.5 px-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
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
                className={`py-2.5 px-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
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
        </motion.div>

        {/* THREE CORE LEARNING PATHWAYS */}
        <div className="space-y-3 pt-2">
          <h2 className="text-lg font-black flex items-center gap-2">
            <Award className="w-5 h-5 text-rose-500 shrink-0" />
            <span>{appLang === 'ar' ? 'المسارات الأساسية لاجتياز مقابلة الجنسية 🏆' : appLang === 'en' ? 'Core Citizenship Preparation Paths 🏆' : 'Căile Principale de Pregătire 🏆'}</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* 1. Citizenship Test (3 Levels) */}
            <Link
              href="/quiz"
              className="p-5 rounded-3xl bg-gradient-to-br from-rose-600 via-rose-700 to-amber-700 text-white shadow-xl hover:opacity-95 transition-all space-y-3 border border-rose-400/30 group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-black/20 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-amber-300" />
                </div>
                <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-black bg-black/30 text-rose-200">
                  3 المستويات (سهل • متوسط • صعب)
                </span>
                <h3 className="text-base font-black">
                  📝 {appLang === 'ar' ? 'اختبارات الجنسية' : appLang === 'en' ? 'Citizenship Tests' : 'Teste Cetățenie'}
                </h3>
                <p className="text-xs text-rose-100/90 leading-relaxed font-bold">
                  {appLang === 'ar' ? 'اختبر نفسك في 3 مستويات متدرجة تحاكي أسئلة لجنة الجنسية ANC' : 'Practice questions across 3 difficulty levels matching ANC standards'}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/20 text-xs font-black text-rose-200">
                <span>{strings.testYourself || 'ابدأ الاختبار 🏆'}</span>
                {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </div>
            </Link>

            {/* 2. Romanian Grammar (Progressive Levels) */}
            <Link
              href="/grammar"
              className="p-5 rounded-3xl bg-gradient-to-br from-amber-500 via-amber-600 to-rose-700 text-white shadow-xl hover:opacity-95 transition-all space-y-3 border border-amber-400/30 group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-black/20 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-amber-200" />
                </div>
                <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-black bg-black/30 text-amber-200">
                  مبتدئ • متوسط • متقدم
                </span>
                <h3 className="text-base font-black">
                  📚 {appLang === 'ar' ? 'قواعد الرومانية' : appLang === 'en' ? 'Romanian Grammar' : 'Gramatică Română'}
                </h3>
                <p className="text-xs text-amber-100/90 leading-relaxed font-bold">
                  {appLang === 'ar' ? 'مسار تعلم متدرج ومبسط بالأمثلة والتطبيقات والتصريفات' : 'Learn Romanian grammar progressively with exercises & clear rules'}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/20 text-xs font-black text-amber-200">
                <span>{strings.grammarNav || 'شرح القواعد 📚'}</span>
                {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </div>
            </Link>

            {/* 3. Constitution Writing Test */}
            <Link
              href="/constitution-writing"
              className="p-5 rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-700 to-rose-800 text-white shadow-xl hover:opacity-95 transition-all space-y-3 border border-blue-400/30 group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-black/20 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-200" />
                </div>
                <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-black bg-black/30 text-blue-200">
                  كتابة موجهة • المواد 1-15
                </span>
                <h3 className="text-base font-black">
                  ✍️ {appLang === 'ar' ? 'كتابة الدستور' : appLang === 'en' ? 'Constitution Writing' : 'Scriere Constituțională'}
                </h3>
                <p className="text-xs text-blue-100/90 leading-relaxed font-bold">
                  {appLang === 'ar' ? 'تدرب على كتابة وصياغة إجابات مواد الدستور الروماني' : 'Practice writing Romanian answers & understanding constitutional articles'}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/20 text-xs font-black text-blue-200">
                <span>{strings.constitutionWritingNav || 'كتابة الدستور ✍️'}</span>
                {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </div>
            </Link>
          </div>
        </div>

        {/* TEST DIFFICULTY PREVIEWS (Easy, Medium, Hard) */}
        <div className="space-y-3 pt-2">
          <h2 className="text-lg font-black flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500 shrink-0" />
            <span>{appLang === 'ar' ? 'مستويات صعوبة اختبارات الجنسية 📊' : appLang === 'en' ? 'Citizenship Test Difficulty Levels 📊' : 'Niveluri de Dificultate Examen 📊'}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link
              href="/quiz?difficulty=easy"
              className={`p-4 rounded-2xl border transition-all space-y-2 ${
                isDark ? 'bg-slate-800/80 border-slate-700/60 hover:border-emerald-500' : 'bg-white border-slate-200 shadow-sm hover:border-emerald-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Level 1 — Easy 🟢
                </span>
                {isRtl ? <ChevronLeft className="w-4 h-4 text-emerald-400" /> : <ChevronRight className="w-4 h-4 text-emerald-400" />}
              </div>
              <h4 className="text-sm font-black text-theme-main">{strings.level1Easy || 'المستوى 1 — سهل'}</h4>
              <p className="text-[11px] text-theme-sub leading-relaxed font-bold">
                {strings.levelEasyDesc}
              </p>
            </Link>

            <Link
              href="/quiz?difficulty=medium"
              className={`p-4 rounded-2xl border transition-all space-y-2 ${
                isDark ? 'bg-slate-800/80 border-slate-700/60 hover:border-amber-500' : 'bg-white border-slate-200 shadow-sm hover:border-amber-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Level 2 — Medium 🟡
                </span>
                {isRtl ? <ChevronLeft className="w-4 h-4 text-amber-400" /> : <ChevronRight className="w-4 h-4 text-amber-400" />}
              </div>
              <h4 className="text-sm font-black text-theme-main">{strings.level2Medium || 'المستوى 2 — متوسط'}</h4>
              <p className="text-[11px] text-theme-sub leading-relaxed font-bold">
                {strings.levelMediumDesc}
              </p>
            </Link>

            <Link
              href="/quiz?difficulty=hard"
              className={`p-4 rounded-2xl border transition-all space-y-2 ${
                isDark ? 'bg-slate-800/80 border-slate-700/60 hover:border-rose-500' : 'bg-white border-slate-200 shadow-sm hover:border-rose-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  Level 3 — Hard 🔴
                </span>
                {isRtl ? <ChevronLeft className="w-4 h-4 text-rose-400" /> : <ChevronRight className="w-4 h-4 text-rose-400" />}
              </div>
              <h4 className="text-sm font-black text-theme-main">{strings.level3Hard || 'المستوى 3 — صعب'}</h4>
              <p className="text-[11px] text-theme-sub leading-relaxed font-bold">
                {strings.levelHardDesc}
              </p>
            </Link>
          </div>
        </div>

        {/* Romanian National Anthem Feature Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Link
            href="/anthem"
            className="flex items-center justify-between p-5 bg-gradient-to-r from-amber-500 via-rose-600 to-rose-800 rounded-3xl border border-amber-500/40 shadow-xl hover:opacity-95 transition-all text-white group"
          >
            <div className="space-y-1">
              <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-black bg-black/20 text-white border border-white/20">
                🇷🇴 Deșteaptă-te, române! (Articolul 12 Constitutiv)
              </span>
              <h3 className="text-base sm:text-lg font-black">
                {appLang === 'ar' ? 'النشيد الوطني الروماني والترجمة والملاحظات 🎶' : appLang === 'en' ? 'Romanian National Anthem & Lyrics 🎶' : 'Imnul Național al României 🎶'}
              </h3>
              <p className="text-xs text-amber-100/90 leading-relaxed font-bold">
                {appLang === 'ar' ? 'استمع للمقاطع الأربعة بالصوت مع ترجمة السطور والملاحظات الدستورية' : 'Listen to 4 stanzas with audio, line translations & constitution notes'}
              </p>
            </div>
            <Music className="w-9 h-9 text-white shrink-0 animate-bounce-subtle" />
          </Link>
        </motion.div>

        {/* FEATURED: 469 CITIZENSHIP QUESTIONS CATEGORIZED GRID */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="space-y-3 pt-2"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-rose-500 shrink-0" />
              <span>{strings.citizenshipSectionTitle || `أسئلة امتحان الجنسية (${questions.length} سؤالاً مصوراً)`}</span>
            </h2>
            <Link
              href="/study?category=all"
              className="text-xs font-bold text-rose-500 hover:underline flex items-center gap-1"
            >
              <span>{strings.viewAllQuestions || 'عرض جميع الأسئلة'}</span>
              {isRtl ? <ChevronLeft className="w-4 h-4 shrink-0" /> : <ChevronRight className="w-4 h-4 shrink-0" />}
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CATEGORIES_LIST.filter(c => c.id !== 'all').map((cat) => {
              const IconComp = getCategoryIcon(cat.id);
              const count = categoryCounts[cat.id] || 0;
              return (
                <Link
                  key={cat.id}
                  href={`/study?category=${cat.id}`}
                  className={`flex items-center justify-between p-4 rounded-2xl border-l-4 border hover:border-rose-500 transition-all group ${
                    isDark ? 'bg-slate-800/90 border-slate-700/80' : 'bg-white border-slate-200 shadow-sm'
                  }`}
                  style={{ borderLeftColor: cat.color }}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: cat.color + '20', color: cat.color }}
                    >
                      <IconComp className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold leading-tight group-hover:text-rose-500 transition-colors">
                        {appLang === 'ar' ? cat.name_ar : appLang === 'en' ? cat.name_en : cat.name_ro}
                      </h4>
                      <p className="text-[11px] text-theme-sub leading-tight font-bold">{cat.name_ro}</p>
                      <span className="inline-block mt-1 text-[10px] font-black px-2 py-0.5 rounded-md bg-slate-900/40 text-emerald-400">
                        {count} {strings.questionsReadyBadge || 'سؤالاً جاهزاً ⚡'}
                      </span>
                    </div>
                  </div>
                  {isRtl ? <ChevronLeft className="w-5 h-5 text-slate-400 shrink-0" /> : <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" />}
                </Link>
              );
            })}
          </div>
        </motion.div>

        {/* AI Tutor & Revolut Donation Banner */}
        <div className="space-y-3">
          <Link 
            href="/ai"
            className={`flex items-center justify-between p-5 rounded-3xl border shadow-lg hover:border-amber-400 transition-all group ${
              isDark ? 'bg-gradient-to-r from-slate-800 via-slate-800 to-amber-950/40 border-amber-500/40' : 'bg-slate-900 border-slate-800'
            }`}
          >
            <div className="space-y-1">
              <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                🤖 AI Model + Ollama Support
              </span>
              <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                {strings.aiCardTitle || (appLang === 'ar' ? 'المساعد الذكي للأسئلة المفتوحة' : appLang === 'en' ? 'AI Romanian Citizenship Tutor' : 'Asistent AI Cetățenie')}
              </h3>
              <p className="text-xs text-slate-400">
                {strings.aiCardSubtitle || (appLang === 'ar' ? 'اسأل أي سؤال إضافي وتحدث مع الذكاء الاصطناعي' : appLang === 'en' ? 'Ask custom questions & practice oral responses with AI' : 'Întreabă orice despre interviu și constituție')}
              </p>
            </div>
            <Sparkles className="w-8 h-8 text-amber-400 shrink-0" />
          </Link>
        </div>
      </main>
    </div>
  );
}
