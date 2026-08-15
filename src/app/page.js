'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
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
  Layers,
  Building2,
  Volume2,
  CheckCircle2,
  Flame
} from 'lucide-react';
import questions from '../data/questions_ar.json';
import Navbar from '../components/Navbar';
import ArabFlagsConstellation from '../components/ArabFlagsConstellation';
import AudioPlayerButton from '../components/AudioPlayerButton';
import VisitorCounter from '../components/VisitorCounter';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { CATEGORIES_LIST } from '../utils/categories';

export default function HomePage() {
  const { theme } = useTheme();
  const { appLang, setAppLang, strings, isRtl } = useLanguage();
  const isDark = theme === 'dark';

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [dailyCardIndex, setDailyCardIndex] = useState(0);
  const [showDailyAnswer, setShowDailyAnswer] = useState(false);

  useEffect(() => {
    // Pick a daily featured question based on today's date
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    setDailyCardIndex(dayOfYear % questions.length);

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

  const dailyQ = questions[dailyCardIndex] || questions[0];

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

  // Framer Motion Stagger Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } }
  };

  return (
    <div className="min-h-screen pb-28 sm:pb-24 bg-theme-main text-theme-main flex flex-col font-latin">
      {/* Sidebar Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className={`flex-1 w-full max-w-4xl mx-auto px-4 py-6 space-y-6 ${
        isRtl ? 'lg:mr-72' : 'lg:ml-72'
      } ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
        
        {/* Hero Banner with Framer Motion Spring Animations */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: -15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="flex flex-col items-center text-center space-y-4 pt-2"
        >
          <motion.div 
            whileHover={{ scale: 1.08, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden shadow-2xl border-4 border-rose-500 bg-slate-800 animate-pulse-glow cursor-pointer"
          >
            <Image 
              src="/icon.png" 
              alt="Romanian Citizenship Emblem Logo" 
              fill 
              className="object-cover"
            />
          </motion.div>

          <div className="space-y-2">
            <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-black border ${
              isDark ? 'bg-slate-800 text-rose-400 border-rose-500/30' : 'bg-rose-50 text-rose-600 border-rose-200'
            }`}>
              🇷🇴 {questions.length} {strings.questionsBadge || 'سؤالاً مصوراً لاختبار الجنسية الرومانية ANC'}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              {strings.appTitle}
            </h1>
            <p className="text-xs sm:text-sm text-theme-sub max-w-xl mx-auto leading-relaxed font-bold">
              {strings.appSubtitle}
            </p>
          </div>

          {/* Native PWA Installation Banner */}
          {isInstallable && (
            <motion.div 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full p-4 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-700 to-amber-700 text-white shadow-xl flex items-center justify-between gap-3 border border-rose-400/40"
            >
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
            </motion.div>
          )}

          {/* Animated Arab Country Flags & Language Constellation */}
          <ArabFlagsConstellation />
        </motion.div>

        {/* ANIMATED VISITOR & LIVE LEARNER COUNTER BADGE */}
        <VisitorCounter />

        {/* INTERACTIVE QUESTION OF THE DAY CARD */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className={`p-5 rounded-3xl border shadow-xl space-y-3 relative overflow-hidden ${
            isDark ? 'bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 border-amber-500/40' : 'bg-gradient-to-br from-amber-500/10 via-white to-rose-50 border-amber-300 shadow-md'
          }`}
        >
          <div className="flex items-center justify-between border-b border-amber-500/30 pb-2">
            <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-black flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>{appLang === 'ar' ? 'سؤال اليوم التفاعلي لمقابلة التجنيس 💡' : 'Daily Featured Citizenship Question 💡'}</span>
            </span>

            <AudioPlayerButton text={dailyQ.question} lang="ro" label="استمع بالرومانية" />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider block">🇷🇴 Întrebare oficială:</span>
            <h3 className="text-base sm:text-lg font-black leading-snug">{dailyQ.question}</h3>
            <p className="text-xs text-theme-sub font-bold pt-0.5">🇸🇦 {dailyQ.question_ar}</p>
          </div>

          <div className="pt-1">
            {!showDailyAnswer ? (
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowDailyAnswer(true)}
                className="w-full py-2.5 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>إظهار الإجابة النموذجية بالصوت 🔊</span>
              </motion.button>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 space-y-1 text-xs font-bold"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-emerald-400 font-black">🇷🇴 Răspuns oficial:</span>
                  <AudioPlayerButton text={dailyQ.answer} lang="ro" label="استمع للإجابة" />
                </div>
                <p className="text-sm font-black text-emerald-400">{dailyQ.answer}</p>
                <p className="text-xs text-slate-300">🇸🇦 {dailyQ.answer_ar}</p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* FOUR CORE LEARNING PATHWAYS WITH HOVER MOTION */}
        <div className="space-y-3 pt-2">
          <h2 className="text-lg font-black flex items-center gap-2">
            <Award className="w-5 h-5 text-rose-500 shrink-0" />
            <span>{appLang === 'ar' ? 'المسارات الأساسية لاجتياز مقابلة الجنسية 🏆' : appLang === 'en' ? 'Core Citizenship Preparation Paths 🏆' : 'Căile Principale de Pregătire 🏆'}</span>
          </h2>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3"
          >
            {/* 1. Citizenship Test */}
            <motion.div variants={itemVariants} whileHover={{ y: -5 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/quiz"
                className="p-5 rounded-3xl bg-gradient-to-br from-rose-600 via-rose-700 to-amber-700 text-white shadow-xl hover:opacity-95 transition-all space-y-3 border border-rose-400/30 group flex flex-col justify-between h-full"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-black/20 flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-amber-300" />
                  </div>
                  <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-black bg-black/30 text-rose-200">
                    3 المستويات
                  </span>
                  <h3 className="text-base font-black">
                    📝 {appLang === 'ar' ? 'اختبارات الجنسية' : 'Citizenship Tests'}
                  </h3>
                  <p className="text-xs text-rose-100/90 leading-relaxed font-bold">
                    {appLang === 'ar' ? '3 مستويات متدرجة (25 سؤالاً لكل مستوى)' : '3 difficulty levels (25 questions each)'}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/20 text-xs font-black text-rose-200">
                  <span>{strings.testYourself || 'ابدأ الاختبار 🏆'}</span>
                  {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </div>
              </Link>
            </motion.div>

            {/* 2. Romanian Constitution Reader */}
            <motion.div variants={itemVariants} whileHover={{ y: -5 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/constitution"
                className="p-5 rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-900 text-white shadow-xl hover:opacity-95 transition-all space-y-3 border border-emerald-400/30 group flex flex-col justify-between h-full"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-black/20 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-emerald-200" />
                  </div>
                  <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-black bg-black/30 text-emerald-200">
                    الأبواب I-VIII
                  </span>
                  <h3 className="text-base font-black">
                    📜 {appLang === 'ar' ? 'الدستور الروماني' : 'Constitution Guide'}
                  </h3>
                  <p className="text-xs text-emerald-100/90 leading-relaxed font-bold">
                    {appLang === 'ar' ? 'قراءة المواد الرسمية مع شروحات وقرارات CCR' : 'Browse official articles with simplified notes & CCR rulings'}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/20 text-xs font-black text-emerald-200">
                  <span>{appLang === 'ar' ? 'قراءة الدستور 📖' : 'Read Constitution 📖'}</span>
                  {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </div>
              </Link>
            </motion.div>

            {/* 3. Official ANC Authority Hub */}
            <motion.div variants={itemVariants} whileHover={{ y: -5 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/anc-info"
                className="p-5 rounded-3xl bg-gradient-to-br from-amber-500 via-amber-600 to-rose-700 text-white shadow-xl hover:opacity-95 transition-all space-y-3 border border-amber-400/30 group flex flex-col justify-between h-full"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-black/20 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-amber-200" />
                  </div>
                  <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-black bg-black/30 text-amber-200">
                    قانون 21/1991
                  </span>
                  <h3 className="text-base font-black">
                    🏛️ {appLang === 'ar' ? 'إجراءات ANC' : 'ANC Procedures'}
                  </h3>
                  <p className="text-xs text-amber-100/90 leading-relaxed font-bold">
                    {appLang === 'ar' ? 'مستندات الملف، خطوات التقديم والمقابلة، وقسم اليمين' : 'Dossier checklist, step roadmap & oath allegiance'}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/20 text-xs font-black text-amber-200">
                  <span>{appLang === 'ar' ? 'دليل ANC 🏛️' : 'ANC Info 🏛️'}</span>
                  {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </div>
              </Link>
            </motion.div>

            {/* 4. Constitution Writing Practice */}
            <motion.div variants={itemVariants} whileHover={{ y: -5 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/constitution-writing"
                className="p-5 rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-700 to-rose-800 text-white shadow-xl hover:opacity-95 transition-all space-y-3 border border-blue-400/30 group flex flex-col justify-between h-full"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-black/20 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-200" />
                  </div>
                  <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-black bg-black/30 text-blue-200">
                    كتابة موجهة
                  </span>
                  <h3 className="text-base font-black">
                    ✍️ {appLang === 'ar' ? 'كتابة الدستور' : 'Constitution Writing'}
                  </h3>
                  <p className="text-xs text-blue-100/90 leading-relaxed font-bold">
                    {appLang === 'ar' ? 'تدرب على كتابة وصياغة الإجابات وقسم اليمين' : 'Practice writing Romanian constitutional answers'}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/20 text-xs font-black text-blue-200">
                  <span>{strings.constitutionWritingNav || 'كتابة الدستور ✍️'}</span>
                  {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </div>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* TEST DIFFICULTY PREVIEWS (Easy, Medium, Hard) */}
        <div className="space-y-3 pt-2">
          <h2 className="text-lg font-black flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500 shrink-0" />
            <span>{appLang === 'ar' ? 'مستويات صعوبة اختبارات الجنسية (25 سؤالاً لكل مستوى) 📊' : 'Citizenship Test Difficulty Levels (25 Questions Each) 📊'}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/quiz?difficulty=easy"
                className={`p-4 rounded-2xl border transition-all space-y-2 block ${
                  isDark ? 'bg-slate-800/80 border-slate-700/60 hover:border-emerald-500' : 'bg-white border-slate-200 shadow-sm hover:border-emerald-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Level 1 — Easy 🟢
                  </span>
                  {isRtl ? <ChevronLeft className="w-4 h-4 text-emerald-400" /> : <ChevronRight className="w-4 h-4 text-emerald-400" />}
                </div>
                <h4 className="text-sm font-black text-theme-main">{strings.level1Easy || 'المستوى 1 — سهل (25 سؤالاً)'}</h4>
                <p className="text-[11px] text-theme-sub leading-relaxed font-bold">
                  {strings.levelEasyDesc}
                </p>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/quiz?difficulty=medium"
                className={`p-4 rounded-2xl border transition-all space-y-2 block ${
                  isDark ? 'bg-slate-800/80 border-slate-700/60 hover:border-amber-500' : 'bg-white border-slate-200 shadow-sm hover:border-amber-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    Level 2 — Medium 🟡
                  </span>
                  {isRtl ? <ChevronLeft className="w-4 h-4 text-amber-400" /> : <ChevronRight className="w-4 h-4 text-amber-400" />}
                </div>
                <h4 className="text-sm font-black text-theme-main">{strings.level2Medium || 'المستوى 2 — متوسط (25 سؤالاً)'}</h4>
                <p className="text-[11px] text-theme-sub leading-relaxed font-bold">
                  {strings.levelMediumDesc}
                </p>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/quiz?difficulty=hard"
                className={`p-4 rounded-2xl border transition-all space-y-2 block ${
                  isDark ? 'bg-slate-800/80 border-slate-700/60 hover:border-rose-500' : 'bg-white border-slate-200 shadow-sm hover:border-rose-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    Level 3 — Hard 🔴
                  </span>
                  {isRtl ? <ChevronLeft className="w-4 h-4 text-rose-400" /> : <ChevronRight className="w-4 h-4 text-rose-400" />}
                </div>
                <h4 className="text-sm font-black text-theme-main">{strings.level3Hard || 'المستوى 3 — صعب (25 سؤالاً)'}</h4>
                <p className="text-[11px] text-theme-sub leading-relaxed font-bold">
                  {strings.levelHardDesc}
                </p>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Romanian National Anthem Feature Card */}
        <motion.div
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link
            href="/anthem"
            className="flex items-center justify-between p-5 bg-gradient-to-r from-amber-500 via-rose-600 to-rose-800 rounded-3xl border border-amber-500/40 shadow-xl hover:opacity-95 transition-all text-white group block"
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
        <div className="space-y-3 pt-2">
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

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {CATEGORIES_LIST.filter(c => c.id !== 'all').map((cat) => {
              const IconComp = getCategoryIcon(cat.id);
              const count = categoryCounts[cat.id] || 0;
              return (
                <motion.div key={cat.id} variants={itemVariants} whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href={`/study?category=${cat.id}`}
                    className={`flex items-center justify-between p-4 rounded-2xl border-l-4 border transition-all group block ${
                      isDark ? 'bg-slate-800/90 border-slate-700/80 hover:border-rose-500' : 'bg-white border-slate-200 shadow-sm hover:border-rose-500'
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
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* AI Tutor Card */}
        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
          <Link 
            href="/ai"
            className={`flex items-center justify-between p-5 rounded-3xl border shadow-lg hover:border-amber-400 transition-all group block ${
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
        </motion.div>
      </main>
    </div>
  );
}
