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
  ShieldCheck,
  Building2,
  ExternalLink,
  MapPin,
  ChevronLeft, 
  ChevronRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { appLang, setAppLang, strings, isRtl } = useLanguage();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const isDark = theme === 'dark';

  // State for collapsible category accordion sections
  const [openCategories, setOpenCategories] = useState({
    prep: true,
    language: true,
    games: true
  });

  const toggleCategory = (cat) => {
    setOpenCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const navGroups = [
    {
      id: 'prep',
      title_ar: '🎓 تحضير امتحان الجنسية والقوانين',
      title_en: '🎓 ANC Exam Prep & Laws',
      title_ro: '🎓 Pregătire Examen & Legislație',
      links: [
        { href: '/', label: strings.homeNav, sub: appLang === 'ar' ? 'الصفحة الرئيسية' : appLang === 'en' ? 'Main Home Page' : 'Pagina Principală', icon: Home, color: 'text-rose-500' },
        { href: '/study', label: strings.studyNav, sub: appLang === 'ar' ? '469 سؤالاً مصوراً للجنسية' : appLang === 'en' ? '469 Visual Questions' : '469 Întrebări Ilustrate', icon: BookOpen, color: 'text-blue-400' },
        { href: '/quiz', label: strings.quizNav, sub: appLang === 'ar' ? 'اختبارات ومحاكاة الامتحان' : appLang === 'en' ? 'Exam & Quizzes' : 'Simulare Examen & Teste', icon: Trophy, color: 'text-amber-400' },
        { href: '/constitution', label: appLang === 'ar' ? 'قراءة الدستور الروماني 📖' : appLang === 'en' ? 'Romanian Constitution 📖' : 'Constituția României 📖', sub: appLang === 'ar' ? 'تصفح مواد وأبواب الدستور الرسمي' : appLang === 'en' ? 'Browse Official Articles' : 'Răsfoiește Articolele', icon: ShieldCheck, color: 'text-emerald-400' },
        { href: '/anc-info', label: appLang === 'ar' ? 'إجراءات ومستندات ANC 🏛️' : appLang === 'en' ? 'ANC Official Procedures 🏛️' : 'Proceduri Oficiale ANC 🏛️', sub: appLang === 'ar' ? 'قانون 21/1991 والمستندات وقسم اليمين' : appLang === 'en' ? 'Law 21/1991, Dossier & Oath' : 'Legea 21/1991, Dosar & Jurământ', icon: Building2, color: 'text-amber-400' },
        { href: '/map', label: appLang === 'ar' ? 'خريطة الجنسية التفاعلية 🗺️' : appLang === 'en' ? 'Citizenship Map 🗺️' : 'Harta Cetățeniei 🗺️', sub: appLang === 'ar' ? 'خريطة تفاعلية لمقرات ANC والمحافظات' : appLang === 'en' ? 'Interactive Map & ANC Hubs' : 'Hartă Interactivă ANC', icon: MapPin, color: 'text-rose-400' },
        { href: '/constitution-writing', label: strings.constitutionWritingNav || (appLang === 'ar' ? 'كتابة الدستور ✍️' : appLang === 'en' ? 'Constitution Writing ✍️' : 'Scriere Constituțională ✍️'), sub: appLang === 'ar' ? 'تدرب على كتابة الإجابات وقسم اليمين' : appLang === 'en' ? 'Practice writing responses & oath' : 'Exersează redactarea răspunsurilor', icon: FileText, color: 'text-amber-400' },
      ]
    },
    {
      id: 'language',
      title_ar: '🗣️ اللغة والثقافة والحوارات',
      title_en: '🗣️ Language & Cultural Dialogues',
      title_ro: '🗣️ Limbă & Dialoguri Culturale',
      links: [
        { href: '/grammar', label: strings.grammarNav || (appLang === 'ar' ? 'شرح قواعد الرومانية' : appLang === 'en' ? 'Romanian Grammar Guide' : 'Ghid de Gramatică'), sub: appLang === 'ar' ? 'الأجناس والضمائر والتصريفات' : appLang === 'en' ? 'Nouns, Articles & Conjugations' : 'Genuri, Articole & Conjugări', icon: GraduationCap, color: 'text-amber-400' },
        { href: '/grammar-books', label: appLang === 'ar' ? 'مكتبة كتب القواعد PDF 📚' : appLang === 'en' ? 'Grammar Books Library 📚' : 'Biblioteca Manuale PDF 📚', sub: appLang === 'ar' ? 'تحميل وقراءة الكتب المعتمدة' : appLang === 'en' ? 'Download & Read PDF Books' : 'Descarcă & Citește Manuale PDF', icon: BookOpen, color: 'text-amber-400' },
        { href: '/conversations', label: strings.conversationsNav, sub: appLang === 'ar' ? 'حوارات الرومانية والمقابلة' : appLang === 'en' ? 'Daily Dialogues' : 'Dialoguri Zilnice', icon: MessageSquare, color: 'text-emerald-400' },
        { href: '/conversation-quiz', label: strings.conversationQuizNav, sub: appLang === 'ar' ? 'لعبة حوارات الحياة اليومية' : appLang === 'en' ? 'Conversation Quiz Game' : 'Joc de Conversații', icon: Gamepad2, color: 'text-indigo-400' },
        { href: '/anthem', label: appLang === 'ar' ? 'النشيد الوطني الروماني 🇷🇴' : appLang === 'en' ? 'National Anthem 🇷🇴' : 'Imnul Național 🇷🇴', sub: appLang === 'ar' ? 'الكلمات بالفيديو والصوت والترجمة' : appLang === 'en' ? 'Lyrics with Video, Audio & Notes' : 'Versuri cu Video & Audio', icon: Music, color: 'text-amber-400' },
        { href: '/explore-romania', label: appLang === 'ar' ? 'أطلس استكشاف رومانيا 🗺️' : appLang === 'en' ? 'Explore Romania Atlas 🗺️' : 'Atlas Explorează România 🗺️', sub: appLang === 'ar' ? 'التاريخ والجغرافيا والمعالم لكل مدينة' : appLang === 'en' ? 'History, Geography & Landmarks' : 'Istorie, Geografie & Monumente', icon: MapPin, color: 'text-emerald-400' },
      ]
    },
    {
      id: 'games',
      title_ar: '🧩 الألعاب التفاعلية والمساعد الذكي',
      title_en: '🧩 Interactive Games & AI',
      title_ro: '🧩 Jocuri Interactive & Asistent AI',
      links: [
        { href: '/grammar-quiz', label: strings.grammarQuizNav || (appLang === 'ar' ? 'لعبة اختبار القواعد' : appLang === 'en' ? 'Grammar Quiz Game' : 'Joc de Gramatică'), sub: appLang === 'ar' ? 'تحدي القواعد والتصريفات' : appLang === 'en' ? 'Grammar Challenges' : 'Sfidări de Gramatică', icon: Gamepad2, color: 'text-rose-400' },
        { href: '/alphabet', label: strings.alphabetNav, sub: appLang === 'ar' ? '31 حرفاً مع النطق والأمثلة' : appLang === 'en' ? '31 Letters with Audio' : '31 Litere cu Audio', icon: Type, color: 'text-purple-400' },
        { href: '/alphabet-quiz', label: strings.alphabetQuizNav, sub: appLang === 'ar' ? 'لعبة نطق واستماع الحروف' : appLang === 'en' ? 'Alphabet Audio Game' : 'Joc Audio Alfabet', icon: Gamepad2, color: 'text-rose-400' },
        { href: '/language-quiz', label: appLang === 'ar' ? 'اختبار المفردات والجمل' : appLang === 'en' ? 'Vocabulary Quiz' : 'Test de Vocabular', sub: appLang === 'ar' ? 'تحدي كلمات وجمل اللغة' : appLang === 'en' ? 'Vocabulary & Grammar Quiz' : 'Test Vocabular & Expresii', icon: Puzzle, color: 'text-teal-400' },
        { href: '/ai', label: strings.aiNav, sub: appLang === 'ar' ? 'المساعد الذكي Hybrid AI' : appLang === 'en' ? 'AI Citizenship Tutor' : 'Asistent AI Cetățenie', icon: Sparkles, color: 'text-amber-300' },
      ]
    }
  ];

  const bottomMobileTabs = [
    { href: '/', label: strings.homeNav, icon: Home },
    { href: '/study', label: strings.studyNav, icon: BookOpen },
    { href: '/quiz', label: strings.quizNav, icon: Trophy },
    { href: '/constitution', label: appLang === 'ar' ? 'الدستور' : 'Constituția', icon: ShieldCheck },
    { href: '/anc-info', label: appLang === 'ar' ? 'ANC' : 'ANC Info', icon: Building2 },
    { href: '/conversations', label: appLang === 'ar' ? 'المحادثات' : 'Dialogues', icon: MessageSquare },
  ];

  const sidebarContent = (
    <div className={`h-full p-4 sm:p-5 flex flex-col justify-between overflow-y-auto backdrop-blur-xl ${
      isDark ? 'bg-slate-900 text-white border-r border-l border-slate-800' : 'bg-white text-slate-900 border-r border-l border-slate-200 shadow-xl'
    } ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Sidebar Header: Logo & Brand Emblem */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-2xl overflow-hidden border-2 border-rose-500 shadow-md animate-pulse-glow group-hover:scale-105 transition-transform shrink-0 bg-slate-800">
              <Image src="/icon.png" alt="Romanian Citizenship Emblem" fill className="object-cover" />
            </div>
            <div>
              <h2 className="text-sm font-black tracking-tight leading-tight group-hover:text-rose-500 transition-colors">
                Cetățenia Română
              </h2>
              <span className="text-[9px] font-extrabold text-rose-500 block">ANC Preparation Platform</span>
            </div>
          </Link>

          {/* Close Button on Mobile Drawer */}
          <button 
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden p-2 rounded-xl border border-slate-700 text-slate-400 hover:text-rose-500 min-h-[40px] min-w-[40px] flex items-center justify-center"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Collapsible Categorized Links List */}
        <div className="space-y-3 overflow-y-auto max-h-[58vh] no-scrollbar pr-0.5">
          {navGroups.map((group) => {
            const isOpen = openCategories[group.id];
            return (
              <div key={group.id} className="space-y-1">
                <button
                  onClick={() => toggleCategory(group.id)}
                  className="w-full flex items-center justify-between py-1 px-2 text-[11px] font-black text-rose-400 uppercase tracking-wider hover:opacity-80 transition-opacity"
                >
                  <span>{appLang === 'ar' ? group.title_ar : appLang === 'en' ? group.title_en : group.title_ro}</span>
                  {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {isOpen && (
                  <div className="space-y-1 pt-0.5">
                    {group.links.map((link) => {
                      const Icon = link.icon;
                      const isActive = pathname === link.href;
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setMobileSidebarOpen(false)}
                          className={`flex items-center justify-between p-2.5 rounded-2xl border transition-all min-h-[44px] ${
                            isActive 
                              ? 'bg-rose-600 text-white border-rose-600 shadow-lg shadow-rose-600/30' 
                              : isDark ? 'bg-slate-800/80 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:text-white' : 'bg-slate-100/80 border-slate-200 text-slate-800 hover:bg-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className={`p-1.5 rounded-xl border shrink-0 ${
                              isActive ? 'bg-white/20 border-white/30 text-white' : isDark ? 'bg-slate-900 border-slate-700/80' : 'bg-white border-slate-200 shadow-sm'
                            }`}>
                              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : link.color}`} />
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold leading-tight truncate">{link.label}</h4>
                              <p className={`text-[9px] truncate ${isActive ? 'text-rose-100' : 'text-slate-400'}`}>{link.sub}</p>
                            </div>
                          </div>

                          {isRtl ? (
                            <ChevronLeft className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                          ) : (
                            <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Revolut Donation Link & Footer Settings */}
      <div className="pt-2 border-t border-slate-700/60 space-y-2">
        <a
          href="https://revolut.me/mahmoulxzy"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-2.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-rose-600 hover:opacity-95 text-white font-black shadow-lg shadow-blue-600/30 transition-all border border-blue-400/40 group animate-pulse-glow"
        >
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-black/20 text-white border border-white/20 shrink-0">
              <Heart className="w-3.5 h-3.5 text-rose-300 fill-current animate-bounce-subtle" />
            </div>
            <div>
              <h4 className="text-xs font-black leading-tight">
                {appLang === 'ar' ? 'دعم التطبيق عبر Revolut 💳' : 'Donate via Revolut 💳'}
              </h4>
            </div>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-white/80 group-hover:translate-x-0.5 transition-transform shrink-0" />
        </a>

        <div className="flex items-center justify-between p-2 rounded-xl border bg-slate-900/60 border-slate-800 text-xs">
          <span className="font-semibold text-slate-400 text-[11px]">{appLang === 'ar' ? 'المظهر:' : 'Theme:'}</span>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/15 text-rose-400 border border-rose-500/20 font-bold hover:bg-rose-500/25 transition-all text-xs"
          >
            {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            <span>{isDark ? (appLang === 'ar' ? 'مضيء' : 'Light') : (appLang === 'ar' ? 'داكن' : 'Dark')}</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-1 text-[11px] font-bold">
          <button
            onClick={() => setAppLang('ar')}
            className={`py-1 rounded-lg border text-center transition-all ${
              appLang === 'ar' ? 'bg-rose-600 text-white border-rose-600' : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            🇸🇦 AR
          </button>
          <button
            onClick={() => setAppLang('en')}
            className={`py-1 rounded-lg border text-center transition-all ${
              appLang === 'en' ? 'bg-rose-600 text-white border-rose-600' : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            🇬🇧 EN
          </button>
          <button
            onClick={() => setAppLang('ro')}
            className={`py-1 rounded-lg border text-center transition-all ${
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

      {/* Top Mobile Bar - Sleek & Mobile Optimized */}
      <header className={`lg:hidden sticky top-0 z-40 border-b backdrop-blur-md px-3 sm:px-4 py-2.5 flex items-center justify-between shadow-md transition-all ${
        isDark ? 'bg-slate-900/95 border-slate-800 text-white' : 'bg-white/95 border-slate-200 text-slate-900 shadow-sm'
      }`}>
        {/* Start: Menu Toggle & Brand Logo Title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 rounded-xl border border-slate-700/80 text-rose-500 hover:bg-slate-800 transition-colors flex items-center justify-center shrink-0 min-h-[40px] min-w-[40px]"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link href="/" className="flex items-center gap-2 group min-w-0">
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden border-2 border-rose-500 shadow-sm shrink-0 bg-slate-800">
              <Image src="/icon.png" alt="Romanian Citizenship Logo" fill className="object-cover" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-black text-xs sm:text-sm tracking-tight leading-tight truncate group-hover:text-rose-500 transition-colors">
                Cetățenia Română
              </span>
              <span className="text-[9px] font-extrabold text-rose-500 leading-none truncate">
                ANC Prep
              </span>
            </div>
          </Link>
        </div>

        {/* End: Compact Revolut Heart Badge & Theme Toggle */}
        <div className="flex items-center gap-1.5 shrink-0">
          <a
            href="https://revolut.me/mahmoulxzy"
            target="_blank"
            rel="noopener noreferrer"
            title="Donate via Revolut"
            className="p-2 px-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-rose-600 text-white text-xs font-black flex items-center justify-center gap-1 shadow-md hover:opacity-95 transition-all min-h-[40px] shrink-0"
          >
            <Heart className="w-4 h-4 fill-current animate-bounce-subtle shrink-0 text-rose-300" />
            <span className="hidden xs:inline text-[10px]">Revolut</span>
          </a>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-slate-700/80 text-amber-400 hover:bg-slate-800 transition-colors flex items-center justify-center shrink-0 min-h-[40px] min-w-[40px]"
            aria-label="Toggle Dark Light Theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Framer Motion Mobile Sidebar Overlay Drawer */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            {/* Backdrop Blur Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setMobileSidebarOpen(false)}
            />

            {/* Slide-in Drawer Container */}
            <motion.aside
              initial={{ x: isRtl ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRtl ? '100%' : '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className={`relative z-10 w-80 max-w-[85vw] h-full ${
                isRtl ? 'ml-auto mr-0' : 'mr-auto ml-0'
              }`}
            >
              {sidebarContent}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* High-Visibility Sticky Mobile Bottom Navigation Bar */}
      <nav className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-xl px-2 py-1.5 shadow-2xl ${
        isDark ? 'bg-slate-950/95 border-slate-800/80' : 'bg-white/95 border-slate-200 shadow-2xl'
      }`}>
        <div className="grid grid-cols-6 gap-1 max-w-md mx-auto items-center">
          {bottomMobileTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all relative min-h-[44px] ${
                  isActive 
                    ? 'text-rose-500 font-black bg-rose-500/10 border border-rose-500/30 shadow-sm scale-105 animate-bounce-subtle' 
                    : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-rose-500 stroke-[2.5]' : 'text-slate-400'}`} />
                <span className="text-[10px] leading-tight font-extrabold truncate max-w-full">{tab.label}</span>

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
