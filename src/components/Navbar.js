'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  BookOpen, 
  Trophy, 
  Type, 
  Gamepad2, 
  Sparkles, 
  Moon, 
  Sun, 
  Menu, 
  X, 
  MessageSquare, 
  Puzzle, 
  GraduationCap, 
  Music,
  Heart,
  FileText,
  ExternalLink,
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { appLang, setAppLang, strings, isRtl } = useLanguage();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const isDark = theme === 'dark';

  const navLinks = [
    { href: '/', label: strings.homeNav, sub: appLang === 'ar' ? 'الصفحة الرئيسية' : appLang === 'en' ? 'Main Home Page' : 'Pagina Principală', icon: Home, color: 'text-rose-500' },
    { href: '/study', label: strings.studyNav, sub: appLang === 'ar' ? '469 سؤالاً مصوراً للجنسية' : appLang === 'en' ? '469 Visual Questions' : '469 Întrebări Ilustrate', icon: BookOpen, color: 'text-blue-400' },
    { href: '/quiz', label: strings.quizNav, sub: appLang === 'ar' ? 'اختبارات ومحاكاة الامتحان' : appLang === 'en' ? 'Exam & Quizzes' : 'Simulare Examen & Teste', icon: Trophy, color: 'text-amber-400' },
    { href: '/anthem', label: appLang === 'ar' ? 'النشيد الوطني الروماني 🇷🇴' : appLang === 'en' ? 'National Anthem 🇷🇴' : 'Imnul Național 🇷🇴', sub: appLang === 'ar' ? 'الكلمات بالصوت والترجمة للدستور' : appLang === 'en' ? 'Lyrics with Audio & Translation' : 'Versuri cu Audio & Traducere', icon: Music, color: 'text-amber-400' },
    { href: '/conversations', label: strings.conversationsNav, sub: appLang === 'ar' ? 'حوارات الرومانية والمقابلة' : appLang === 'en' ? 'Daily Dialogues' : 'Dialoguri Zilnice', icon: MessageSquare, color: 'text-emerald-400' },
    { href: '/conversation-quiz', label: strings.conversationQuizNav, sub: appLang === 'ar' ? 'لعبة حوارات الحياة اليومية' : appLang === 'en' ? 'Conversation Quiz Game' : 'Joc de Conversații', icon: Gamepad2, color: 'text-indigo-400' },
    { href: '/constitution-writing', label: strings.constitutionWritingNav || (appLang === 'ar' ? 'كتابة الدستور ✍️' : appLang === 'en' ? 'Constitution Writing ✍️' : 'Scriere Constituțională ✍️'), sub: appLang === 'ar' ? 'تدرب على كتابة وصياغة الإجابات الدستورية' : appLang === 'en' ? 'Practice writing constitutional responses' : 'Exersează redactarea răspunsurilor constituționale', icon: FileText, color: 'text-rose-400' },
    { href: '/grammar', label: strings.grammarNav || (appLang === 'ar' ? 'شرح قواعد الرومانية' : appLang === 'en' ? 'Romanian Grammar Guide' : 'Ghid de Gramatică'), sub: appLang === 'ar' ? 'الأجناس والضمائر والتصريفات' : appLang === 'en' ? 'Nouns, Articles & Conjugations' : 'Genuri, Articole & Conjugări', icon: GraduationCap, color: 'text-amber-400' },
    { href: '/grammar-quiz', label: strings.grammarQuizNav || (appLang === 'ar' ? 'لعبة اختبار القواعد' : appLang === 'en' ? 'Grammar Quiz Game' : 'Joc de Gramatică'), sub: appLang === 'ar' ? 'تحدي القواعد والتصريفات' : appLang === 'en' ? 'Grammar Challenges' : 'Sfidări de Gramatică', icon: Gamepad2, color: 'text-rose-400' },
    { href: '/alphabet', label: strings.alphabetNav, sub: appLang === 'ar' ? '31 حرفاً مع النطق والأمثلة' : appLang === 'en' ? '31 Letters with Audio' : '31 Litere cu Audio', icon: Type, color: 'text-purple-400' },
    { href: '/alphabet-quiz', label: strings.alphabetQuizNav, sub: appLang === 'ar' ? 'لعبة نطق واستماع الحروف' : appLang === 'en' ? 'Alphabet Audio Game' : 'Joc Audio Alfabet', icon: Gamepad2, color: 'text-rose-400' },
    { href: '/language-quiz', label: appLang === 'ar' ? 'اختبار المفردات والجمل' : appLang === 'en' ? 'Vocabulary Quiz' : 'Test de Vocabular', sub: appLang === 'ar' ? 'تحدي كلمات وجمل اللغة' : appLang === 'en' ? 'Vocabulary & Grammar Quiz' : 'Test Vocabular & Expresii', icon: Puzzle, color: 'text-teal-400' },
    { href: '/ai', label: strings.aiNav, sub: appLang === 'ar' ? 'المساعد الذكي Hybrid AI' : appLang === 'en' ? 'AI Citizenship Tutor' : 'Asistent AI Cetățenie', icon: Sparkles, color: 'text-amber-300' },
  ];

  const bottomMobileTabs = [
    { href: '/', label: strings.homeNav, icon: Home },
    { href: '/study', label: strings.studyNav, icon: BookOpen },
    { href: '/quiz', label: strings.quizNav, icon: Trophy },
    { href: '/anthem', label: appLang === 'ar' ? 'النشيد' : appLang === 'en' ? 'Anthem' : 'Imnul', icon: Music },
    { href: '/grammar', label: appLang === 'ar' ? 'القواعد' : appLang === 'en' ? 'Grammar' : 'Gramatică', icon: GraduationCap },
    { href: '/conversations', label: appLang === 'ar' ? 'المحادثات' : appLang === 'en' ? 'Dialogues' : 'Conversații', icon: MessageSquare },
  ];

  const sidebarContent = (
    <div className={`h-full flex flex-col justify-between p-5 space-y-4 ${
      isDark ? 'bg-slate-900 text-white border-r border-l border-slate-800' : 'bg-white text-slate-900 border-r border-l border-slate-200 shadow-xl'
    } ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Sidebar Header: Logo & Brand Title */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-700/60 pb-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 rounded-2xl overflow-hidden border-2 border-rose-500 shadow-md animate-pulse-glow group-hover:scale-105 transition-transform shrink-0 bg-slate-800">
              <Image src="/icon.png" alt="Romanian Citizenship Emblem" fill className="object-cover" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight leading-tight group-hover:text-rose-500 transition-colors">
                Cetățenia Română
              </h2>
              <span className="text-[10px] font-bold text-rose-500 block">Preparation Platform</span>
            </div>
          </Link>

          {/* Close Button on Mobile Overlay */}
          <button 
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden p-2 rounded-xl border border-slate-700 text-slate-400 hover:text-rose-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Navigation Links List */}
        <div className="space-y-1.5 overflow-y-auto max-h-[56vh] no-scrollbar pr-0.5">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileSidebarOpen(false)}
                className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                  isActive 
                    ? 'bg-rose-600 text-white border-rose-600 shadow-lg shadow-rose-600/30 animate-fade-in-up' 
                    : isDark ? 'bg-slate-800/80 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:text-white' : 'bg-slate-100/80 border-slate-200 text-slate-800 hover:bg-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl border shrink-0 ${
                    isActive ? 'bg-white/20 border-white/30 text-white' : isDark ? 'bg-slate-900 border-slate-700/80' : 'bg-white border-slate-200 shadow-sm'
                  }`}>
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : link.color}`} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold leading-tight">{link.label}</h4>
                    <p className={`text-[10px] ${isActive ? 'text-rose-100' : 'text-slate-400'}`}>{link.sub}</p>
                  </div>
                </div>

                {isRtl ? (
                  <ChevronLeft className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                ) : (
                  <ChevronRight className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Revolut Donation Link & Footer Settings */}
      <div className="pt-2 border-t border-slate-700/60 space-y-2">
        {/* Revolut Donation Button */}
        <a
          href="https://revolut.me/mahmoulxzy"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-rose-600 hover:opacity-95 text-white font-black shadow-lg shadow-blue-600/30 transition-all border border-blue-400/40 group animate-pulse-glow"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-black/20 text-white border border-white/20 shrink-0">
              <Heart className="w-4 h-4 text-rose-300 fill-current animate-bounce-subtle" />
            </div>
            <div>
              <h4 className="text-xs font-black leading-tight">
                {appLang === 'ar' ? 'دعم التطبيق عبر Revolut 💳' : appLang === 'en' ? 'Donate via Revolut 💳' : 'Donație prin Revolut 💳'}
              </h4>
              <p className="text-[10px] text-blue-100/90 font-medium">
                {appLang === 'ar' ? 'ساهم في تطوير التطبيق' : appLang === 'en' ? 'Support app development' : 'Susține تطوير التطبيق'}
              </p>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-white/80 group-hover:translate-x-0.5 transition-transform shrink-0" />
        </a>

        <div className="flex items-center justify-between p-2.5 rounded-xl border bg-slate-900/60 border-slate-800 text-xs">
          <span className="font-semibold text-slate-400">{appLang === 'ar' ? 'المظهر:' : 'Theme:'}</span>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/15 text-rose-400 border border-rose-500/20 font-bold hover:bg-rose-500/25 transition-all"
          >
            {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            <span>{isDark ? (appLang === 'ar' ? 'مضيء' : 'Light') : (appLang === 'ar' ? 'داكن' : 'Dark')}</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-1 text-[11px] font-bold">
          <button
            onClick={() => setAppLang('ar')}
            className={`py-1.5 rounded-lg border text-center transition-all ${
              appLang === 'ar' ? 'bg-rose-600 text-white border-rose-600' : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            🇸🇦 AR
          </button>
          <button
            onClick={() => setAppLang('en')}
            className={`py-1.5 rounded-lg border text-center transition-all ${
              appLang === 'en' ? 'bg-rose-600 text-white border-rose-600' : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            🇬🇧 EN
          </button>
          <button
            onClick={() => setAppLang('ro')}
            className={`py-1.5 rounded-lg border text-center transition-all ${
              appLang === 'ro' ? 'bg-rose-600 text-white border-rose-600' : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            🇷🇴 RO
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className={`hidden lg:block fixed top-0 bottom-0 w-72 z-30 ${
        isRtl ? 'right-0' : 'left-0'
      }`}>
        {sidebarContent}
      </aside>

      {/* Top Mobile Bar */}
      <header className={`lg:hidden sticky top-0 z-40 border-b backdrop-blur-md p-3 flex items-center justify-between ${
        isDark ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white/90 border-slate-200 text-slate-900 shadow-sm'
      }`}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 rounded-xl border border-slate-700 text-rose-500 hover:bg-slate-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-8 h-8 rounded-xl overflow-hidden border border-rose-500 shrink-0">
              <Image src="/icon.png" alt="Romanian Citizenship Logo" fill className="object-cover" />
            </div>
            <span className="font-extrabold text-sm tracking-tight">Cetățenia Română</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://revolut.me/mahmoulxzy"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-rose-600 text-white text-[11px] font-black flex items-center gap-1 shadow-md"
          >
            <Heart className="w-3.5 h-3.5 fill-current animate-bounce-subtle shrink-0" />
            <span>Revolut 💳</span>
          </a>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-slate-700 text-amber-400 hover:bg-slate-800 transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Mobile Sidebar Overlay Drawer */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex">
          <div className={`w-80 max-w-[85vw] h-full ${isRtl ? 'ml-auto mr-0' : 'mr-auto ml-0'}`}>
            {sidebarContent}
          </div>
          <div className="flex-1" onClick={() => setMobileSidebarOpen(false)} />
        </div>
      )}

      {/* High-Visibility Sticky Mobile Bottom Navigation Bar */}
      <nav className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-xl p-1.5 shadow-2xl ${
        isDark ? 'bg-slate-950/95 border-slate-800' : 'bg-white/95 border-slate-200 shadow-xl'
      }`}>
        <div className="grid grid-cols-6 gap-1 max-w-md mx-auto">
          {bottomMobileTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all relative ${
                  isActive 
                    ? 'text-rose-500 font-extrabold bg-rose-500/10 border border-rose-500/30 shadow-sm scale-105 animate-bounce-subtle' 
                    : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-rose-500 stroke-[2.5]' : 'text-slate-400'}`} />
                <span className="text-[10px] leading-tight font-bold truncate max-w-full">{tab.label}</span>

                {/* Active Indicator Dot */}
                {isActive && (
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
