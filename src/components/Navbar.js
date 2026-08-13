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
  Tv, 
  Puzzle, 
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
    { href: '/', label: strings.homeNav, sub: appLang === 'ar' ? 'الصفحة الرئيسية' : 'Main Home Page', icon: Home, color: 'text-rose-500' },
    { href: '/study', label: strings.studyNav, sub: appLang === 'ar' ? '469 سؤالاً مصوراً للجنسية' : '469 Visual Questions', icon: BookOpen, color: 'text-blue-400' },
    { href: '/quiz', label: strings.quizNav, sub: appLang === 'ar' ? 'اختبارات ومحاكاة الامتحان' : 'Exam & Quizzes', icon: Trophy, color: 'text-amber-400' },
    { href: '/conversations', label: strings.conversationsNav, sub: appLang === 'ar' ? 'حوارات الرومانية والمقابلة' : 'Daily Dialogues', icon: MessageSquare, color: 'text-emerald-400' },
    { href: '/conversation-quiz', label: strings.conversationQuizNav, sub: appLang === 'ar' ? 'لعبة حوارات الحياة اليومية' : 'Conversation Quiz Game', icon: Gamepad2, color: 'text-indigo-400' },
    { href: '/alphabet', label: strings.alphabetNav, sub: appLang === 'ar' ? '31 حرفاً مع النطق والأمثلة' : '31 Letters with Audio', icon: Type, color: 'text-purple-400' },
    { href: '/alphabet-quiz', label: strings.alphabetQuizNav, sub: appLang === 'ar' ? 'لعبة نطق واستماع الحروف' : 'Alphabet Audio Game', icon: Gamepad2, color: 'text-rose-400' },
    { href: '/language-quiz', label: appLang === 'ar' ? 'اختبارات المفردات والقواعد' : 'Language Quiz', sub: appLang === 'ar' ? 'تحدي كلمات وجمل اللغة' : 'Vocabulary & Grammar Quiz', icon: Puzzle, color: 'text-teal-400' },
    { href: '/youtube', label: strings.youtubeNav, sub: appLang === 'ar' ? 'قنوات يوتيوب مع المشغل' : 'YouTube Embedded Videos', icon: Tv, color: 'text-red-500' },
    { href: '/ai', label: strings.aiNav, sub: appLang === 'ar' ? 'المساعد الذكي Ollama' : 'AI Citizenship Tutor', icon: Sparkles, color: 'text-amber-300' },
  ];

  const sidebarContent = (
    <div className={`h-full flex flex-col justify-between p-5 space-y-4 ${
      isDark ? 'bg-slate-900 text-white border-r border-l border-slate-800' : 'bg-white text-slate-900 border-r border-l border-slate-200 shadow-xl'
    } ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Sidebar Header: Logo & Brand Title */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-700/60 pb-4">
          <Link href="/" className="flex items-center space-x-3 space-x-reverse group">
            <div className="relative w-10 h-10 rounded-2xl overflow-hidden border-2 border-rose-500 shadow-md group-hover:scale-105 transition-transform shrink-0">
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
        <div className="space-y-1.5 overflow-y-auto max-h-[62vh] no-scrollbar pr-0.5">
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
                    ? 'bg-rose-600 text-white border-rose-600 shadow-lg shadow-rose-600/30' 
                    : isDark ? 'bg-slate-800/80 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:text-white' : 'bg-slate-100/80 border-slate-200 text-slate-800 hover:bg-slate-200'
                }`}
              >
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className={`p-2 rounded-xl ${isActive ? 'bg-white/20 text-white' : 'bg-slate-900/40 ' + link.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold leading-tight">{link.label}</p>
                    <p className={`text-[10px] ${isActive ? 'text-rose-100' : 'text-slate-400'}`}>{link.sub}</p>
                  </div>
                </div>

                {isRtl ? <ChevronLeft className="w-4 h-4 opacity-70" /> : <ChevronRight className="w-4 h-4 opacity-70" />}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Sidebar Footer Controls: Language Switcher & Theme Mode */}
      <div className="pt-3 border-t border-slate-700/60 space-y-3 shrink-0">
        {/* 3-Language Selector */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-slate-400 block">{strings.selectLangLabel}</span>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={() => setAppLang('ar')}
              className={`py-2 rounded-xl text-xs font-extrabold transition-all ${
                appLang === 'ar' ? 'bg-rose-600 text-white shadow' : isDark ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              🇸🇦 AR
            </button>
            <button
              onClick={() => setAppLang('en')}
              className={`py-2 rounded-xl text-xs font-extrabold transition-all ${
                appLang === 'en' ? 'bg-rose-600 text-white shadow' : isDark ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              🇬🇧 EN
            </button>
            <button
              onClick={() => setAppLang('ro')}
              className={`py-2 rounded-xl text-xs font-extrabold transition-all ${
                appLang === 'ro' ? 'bg-rose-600 text-white shadow' : isDark ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              🇷🇴 RO
            </button>
          </div>
        </div>

        {/* Theme Switcher Button */}
        <button
          onClick={toggleTheme}
          className={`w-full py-2.5 px-3 rounded-xl border flex items-center justify-between text-xs font-bold transition-all ${
            isDark 
              ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700' 
              : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <div className="flex items-center space-x-2 space-x-reverse">
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            <span>{isDark ? 'الوضع الفاتح ☀️' : 'الوضع الداكن 🌙'}</span>
          </div>
          <span>{isDark ? 'Dark' : 'Light'}</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar Drawer (Always Visible on lg: screens) */}
      <aside className={`hidden lg:block fixed top-0 bottom-0 w-72 z-40 ${
        isRtl ? 'right-0 border-l' : 'left-0 border-r'
      }`}>
        {sidebarContent}
      </aside>

      {/* Floating Mobile Sidebar Trigger Button (Visible on Mobile & Tablet) */}
      <div className={`lg:hidden fixed top-4 z-50 ${isRtl ? 'right-4' : 'left-4'}`}>
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="p-3 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl shadow-xl shadow-rose-600/40 border border-rose-400/40 flex items-center space-x-2 space-x-reverse group"
          title="Open Navigation Sidebar"
        >
          <Menu className="w-6 h-6 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-extrabold pr-1 rtl:pr-1 ltr:pl-1">القائمة ☰</span>
        </button>
      </div>

      {/* Mobile Slide-Over Sidebar Drawer Overlay */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex justify-start bg-black/80 backdrop-blur-sm transition-opacity">
          <div className="w-80 max-w-[85vw] h-full shadow-2xl">
            {sidebarContent}
          </div>
          <div className="flex-1" onClick={() => setMobileSidebarOpen(false)} />
        </div>
      )}
    </>
  );
}
