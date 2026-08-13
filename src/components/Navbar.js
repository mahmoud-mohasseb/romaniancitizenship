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
  Menu, 
  X, 
  Globe 
} from 'lucide-react';
import { UI_STRINGS } from '../utils/languageHelper';

export default function Navbar({ appLang = 'ar', setAppLang }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const strings = UI_STRINGS[appLang] || UI_STRINGS.ar;
  const isRtl = appLang === 'ar';

  const navLinks = [
    { href: '/', label: strings.homeNav, icon: Home },
    { href: '/study', label: strings.studyNav, icon: BookOpen },
    { href: '/quiz', label: strings.quizNav, icon: Trophy },
    { href: '/alphabet', label: strings.alphabetNav, icon: Type },
    { href: '/alphabet-quiz', label: strings.alphabetQuizNav, icon: Gamepad2 },
    { href: '/ai', label: strings.aiNav, icon: Sparkles },
  ];

  return (
    <header className={`sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center justify-between">
        {/* App Logo & Title */}
        <Link href="/" className="flex items-center space-x-2.5 space-x-reverse group">
          <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow border border-rose-500/80 group-hover:scale-105 transition-transform">
            <Image src="/icon.png" alt="Logo" fill className="object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-extrabold text-white group-hover:text-rose-400 transition-colors leading-none">
              Cetățenia RO
            </span>
            <span className="text-[10px] text-slate-400 font-semibold leading-tight mt-0.5">
              Prep App
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 space-x-reverse bg-slate-800/80 p-1 rounded-2xl border border-slate-700/60">
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
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Language Pills & Mobile Menu Toggle */}
        <div className="flex items-center space-x-2 space-x-reverse">
          {/* 3-Language Selector */}
          <div className="flex items-center bg-slate-800 p-0.5 rounded-xl border border-slate-700">
            <button
              onClick={() => setAppLang && setAppLang('ar')}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all ${
                appLang === 'ar' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              🇸🇦 AR
            </button>
            <button
              onClick={() => setAppLang && setAppLang('en')}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all ${
                appLang === 'en' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              🇬🇧 EN
            </button>
            <button
              onClick={() => setAppLang && setAppLang('ro')}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all ${
                appLang === 'ro' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              🇷🇴 RO
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 py-3 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={`${link.href}?lang=${appLang}`}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 space-x-reverse px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive 
                    ? 'bg-rose-600 text-white' 
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
