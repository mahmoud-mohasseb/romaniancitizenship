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
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { appLang, setAppLang, strings, isRtl } = useLanguage();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isDark = theme === 'dark';

  const navLinks = [
    { href: '/', label: strings.homeNav, sub: appLang === 'ar' ? 'الصفحة الرئيسية' : appLang === 'en' ? 'Main Home Page' : 'Pagina Principală', icon: Home, color: 'text-rose-500' },
    { href: '/study', label: strings.studyNav, sub: appLang === 'ar' ? '469 سؤالاً مصوراً' : appLang === 'en' ? '469 Visual Questions' : '469 Întrebări Ilustrate', icon: BookOpen, color: 'text-blue-400' },
    { href: '/quiz', label: strings.quizNav, sub: appLang === 'ar' ? 'اختبارات ومحاكاة الامتحان' : appLang === 'en' ? 'Quizzes & Exam Simulation' : 'Teste și Simulare Examen', icon: Trophy, color: 'text-amber-400' },
    { href: '/alphabet', label: strings.alphabetNav, sub: appLang === 'ar' ? '31 حرفاً مع النطق' : appLang === 'en' ? '31 Letters with Audio' : '31 Litere cu Pronunție', icon: Type, color: 'text-purple-400' },
    { href: '/alphabet-quiz', label: strings.alphabetQuizNav, sub: appLang === 'ar' ? 'لعبة استماع وتفاعل' : appLang === 'en' ? 'Sound Listening Game' : 'Joc Interactiv Audio', icon: Gamepad2, color: 'text-emerald-400' },
    { href: '/ai', label: strings.aiNav, sub: appLang === 'ar' ? 'Ollama + مساعد مدمج' : appLang === 'en' ? 'Ollama + Embedded AI' : 'Ollama + Asistent AI', icon: Sparkles, color: 'text-amber-300' },
  ];

  return (
    <>
      {/* Top App Header Bar */}
      <header className={`sticky top-0 z-40 backdrop-blur-xl border-b transition-colors ${
        isDark 
          ? 'bg-slate-900/95 border-slate-800 text-white' 
          : 'bg-white/95 border-slate-200 text-slate-900 shadow-sm'
      } ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Crisp Clean Logo & Brand Title */}
          <Link href="/" className="flex items-center space-x-2.5 space-x-reverse group">
            <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-rose-500/80 shadow-md group-hover:scale-105 transition-transform shrink-0">
              <Image src="/icon.png" alt="Romanian Citizenship Logo" fill className="object-cover" />
            </div>
            <span className="text-base font-black tracking-tight group-hover:text-rose-500 transition-colors">
              Cetățenia Română
            </span>
          </Link>

          {/* Controls: Dark/Light Mode, 3-Language Selector, Mobile Menu */}
          <div className="flex items-center space-x-2 space-x-reverse">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl border transition-all ${
                isDark 
                  ? 'bg-slate-800 border-slate-700 text-amber-400' 
                  : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}
              title="Toggle Dark/Light Mode"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* 3-Language Switcher Pills */}
            <div className={`flex items-center p-0.5 rounded-xl border ${
              isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'
            }`}>
              <button
                onClick={() => setAppLang('ar')}
                className={`px-2 py-1 rounded-lg text-[11px] font-extrabold transition-all ${
                  appLang === 'ar' ? 'bg-rose-600 text-white shadow' : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🇸🇦 AR
              </button>
              <button
                onClick={() => setAppLang('en')}
                className={`px-2 py-1 rounded-lg text-[11px] font-extrabold transition-all ${
                  appLang === 'en' ? 'bg-rose-600 text-white shadow' : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🇬🇧 EN
              </button>
              <button
                onClick={() => setAppLang('ro')}
                className={`px-2 py-1 rounded-lg text-[11px] font-extrabold transition-all ${
                  appLang === 'ro' ? 'bg-rose-600 text-white shadow' : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🇷🇴 RO
              </button>
            </div>

            {/* Mobile Drawer Hamburger Button */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="p-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/30"
              title="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Slide-Over Drawer Sheet */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm transition-opacity">
          <div className={`w-full max-w-xs h-full flex flex-col justify-between p-5 shadow-2xl transition-transform ${
            isDark ? 'bg-slate-900 text-white border-l border-slate-800' : 'bg-white text-slate-900 border-l border-slate-200'
          } ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
            
            {/* Drawer Header */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                <div className="flex items-center space-x-2.5 space-x-reverse">
                  <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-rose-500">
                    <Image src="/icon.png" alt="App Logo" fill className="object-cover" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold leading-tight">Cetățenia Română</h3>
                    <p className="text-[10px] text-rose-500 font-bold">Preparation Guide</p>
                  </div>
                </div>

                <button 
                  onClick={() => setDrawerOpen(false)}
                  className={`p-2 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'}`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Links List */}
              <div className="space-y-2 pt-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setDrawerOpen(false)}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                        isActive 
                          ? 'bg-rose-600 text-white border-rose-600 shadow-lg shadow-rose-600/30' 
                          : isDark ? 'bg-slate-800/80 border-slate-700/60 text-slate-200 hover:bg-slate-800' : 'bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200'
                      }`}
                    >
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <div className={`p-2 rounded-xl ${isActive ? 'bg-white/20 text-white' : 'bg-slate-900/40 ' + link.color}`}>
                          <Icon className="w-5 h-5" />
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

            {/* Drawer Footer Controls */}
            <div className="pt-4 border-t border-slate-700/60 space-y-3">
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 block">{strings.selectLangLabel}</span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setAppLang('ar')}
                    className={`py-2 rounded-xl text-xs font-bold ${appLang === 'ar' ? 'bg-rose-600 text-white shadow' : 'bg-slate-800 text-slate-400'}`}
                  >
                    🇸🇦 العربية
                  </button>
                  <button
                    onClick={() => setAppLang('en')}
                    className={`py-2 rounded-xl text-xs font-bold ${appLang === 'en' ? 'bg-rose-600 text-white shadow' : 'bg-slate-800 text-slate-400'}`}
                  >
                    🇬🇧 English
                  </button>
                  <button
                    onClick={() => setAppLang('ro')}
                    className={`py-2 rounded-xl text-xs font-bold ${appLang === 'ro' ? 'bg-rose-600 text-white shadow' : 'bg-slate-800 text-slate-400'}`}
                  >
                    🇷🇴 Română
                  </button>
                </div>
              </div>

              <button
                onClick={toggleTheme}
                className={`w-full py-2.5 px-3 rounded-xl border flex items-center justify-between text-xs font-bold ${
                  isDark ? 'bg-slate-800 border-slate-700 text-amber-400' : 'bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center space-x-2 space-x-reverse">
                  {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  <span>{isDark ? 'الوضع الفاتح ☀️' : 'الوضع الداكن 🌙'}</span>
                </div>
                <span>{isDark ? 'Dark' : 'Light'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fixed Bottom Mobile App Navigation Dock */}
      <nav className={`fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-xl px-2 py-1.5 transition-colors ${
        isDark 
          ? 'bg-slate-900/95 border-slate-800 text-slate-300' 
          : 'bg-white/95 border-slate-200 text-slate-700 shadow-lg'
      } ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="max-w-md mx-auto grid grid-cols-6 gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center justify-center py-1 rounded-xl text-[10px] font-bold transition-all ${
                  isActive 
                    ? 'text-rose-500 scale-105' 
                    : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <div className={`p-1 rounded-lg ${isActive ? 'bg-rose-500/15' : ''}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="truncate w-full text-center leading-none mt-0.5">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
