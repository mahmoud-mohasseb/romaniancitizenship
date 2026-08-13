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
  Sun 
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { UI_STRINGS } from '../utils/languageHelper';

export default function Navbar({ appLang = 'ar', setAppLang }) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const strings = UI_STRINGS[appLang] || UI_STRINGS.ar;
  const isRtl = appLang === 'ar';
  const isDark = theme === 'dark';

  const navLinks = [
    { href: '/', label: strings.homeNav, icon: Home },
    { href: '/study', label: strings.studyNav, icon: BookOpen },
    { href: '/quiz', label: strings.quizNav, icon: Trophy },
    { href: '/alphabet', label: strings.alphabetNav, icon: Type },
    { href: '/alphabet-quiz', label: strings.alphabetQuizNav, icon: Gamepad2 },
    { href: '/ai', label: strings.aiNav, icon: Sparkles },
  ];

  return (
    <>
      {/* Top Mobile & Web App Bar Header */}
      <header className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors ${
        isDark 
          ? 'bg-slate-900/90 border-slate-800 text-white' 
          : 'bg-white/90 border-slate-200 text-slate-900'
      } ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center justify-between">
          {/* Logo & Mobile Brand */}
          <Link href="/" className="flex items-center space-x-2 space-x-reverse group">
            <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow border border-rose-500/80 group-hover:scale-105 transition-transform">
              <Image src="/icon.png" alt="Logo" fill className="object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-extrabold group-hover:text-rose-500 transition-colors leading-none">
                Cetățenia RO
              </span>
              <span className={`text-[10px] font-semibold leading-tight mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Mobile Prep
              </span>
            </div>
          </Link>

          {/* Desktop Web Nav Bar Links */}
          <nav className={`hidden md:flex items-center space-x-1 space-x-reverse p-1 rounded-2xl border ${
            isDark ? 'bg-slate-800/80 border-slate-700/60' : 'bg-slate-100 border-slate-200'
          }`}>
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={`${link.href}?lang=${appLang}`}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 space-x-reverse ${
                    isActive 
                      ? 'bg-rose-600 text-white shadow' 
                      : isDark ? 'text-slate-300 hover:text-white hover:bg-slate-700/50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Controls: Dark/Light Switcher & 3-Language Selector */}
          <div className="flex items-center space-x-2 space-x-reverse">
            {/* Dark/Light Mode Button */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl border transition-all ${
                isDark 
                  ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700' 
                  : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
              }`}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* 3-Language Selector */}
            <div className={`flex items-center p-0.5 rounded-xl border ${
              isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-300'
            }`}>
              <button
                onClick={() => setAppLang && setAppLang('ar')}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  appLang === 'ar' ? 'bg-rose-600 text-white shadow' : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🇸🇦 AR
              </button>
              <button
                onClick={() => setAppLang && setAppLang('en')}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  appLang === 'en' ? 'bg-rose-600 text-white shadow' : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🇬🇧 EN
              </button>
              <button
                onClick={() => setAppLang && setAppLang('ro')}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  appLang === 'ro' ? 'bg-rose-600 text-white shadow' : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🇷🇴 RO
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Bottom Fixed Mobile App Navigation Bar (App Dock) */}
      <nav className={`md:hidden fixed bottom-0 left-0 right-0 z-50 border-t backdrop-blur-lg px-2 py-1.5 transition-colors ${
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
                href={`${link.href}?lang=${appLang}`}
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
