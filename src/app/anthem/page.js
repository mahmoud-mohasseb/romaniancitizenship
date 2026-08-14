'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Volume2, 
  Square, 
  Sparkles, 
  Landmark, 
  BookOpen, 
  ShieldCheck, 
  Music, 
  Award,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import anthemData from '../../data/romanian_anthem.json';
import Navbar from '../../components/Navbar';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

function AnthemContent() {
  const { theme } = useTheme();
  const { appLang, strings, isRtl } = useLanguage();
  const isDark = theme === 'dark';

  const [activeStanza, setActiveStanza] = useState(null);
  const [isPlayingAll, setIsPlayingAll] = useState(false);

  const speakStanza = (stanzaIndex, textList) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (activeStanza === stanzaIndex) {
      window.speechSynthesis.cancel();
      setActiveStanza(null);
      setIsPlayingAll(false);
      return;
    }

    window.speechSynthesis.cancel();
    const fullText = textList.join('. ');
    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.lang = 'ro-RO';
    utterance.rate = 0.85;
    utterance.onend = () => {
      setActiveStanza(null);
      setIsPlayingAll(false);
    };
    utterance.onerror = () => {
      setActiveStanza(null);
      setIsPlayingAll(false);
    };
    setActiveStanza(stanzaIndex);
    window.speechSynthesis.speak(utterance);
  };

  const playFullAnthem = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (isPlayingAll) {
      window.speechSynthesis.cancel();
      setIsPlayingAll(false);
      setActiveStanza(null);
      return;
    }

    window.speechSynthesis.cancel();
    const allLines = anthemData.stanzas.flatMap(s => s.lines_ro).join('. ');
    const utterance = new SpeechSynthesisUtterance(allLines);
    utterance.lang = 'ro-RO';
    utterance.rate = 0.85;
    utterance.onend = () => {
      setIsPlayingAll(false);
      setActiveStanza(null);
    };
    utterance.onerror = () => {
      setIsPlayingAll(false);
      setActiveStanza(null);
    };
    setIsPlayingAll(true);
    setActiveStanza(0);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen pb-28 sm:pb-24 bg-theme-main text-theme-main flex flex-col">
      <Navbar />

      <main className={`flex-1 w-full max-w-4xl mx-auto px-4 py-6 space-y-6 ${
        isRtl ? 'lg:mr-72' : 'lg:ml-72'
      } ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
        
        {/* Banner Header with Framer Motion */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`rounded-2xl p-6 border shadow-2xl space-y-4 text-center ${
            isDark ? 'bg-gradient-to-r from-slate-800 via-slate-800 to-amber-950/40 border-slate-700/80' : 'bg-white border-slate-200'
          }`}
        >
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
            <Music className="w-8 h-8 animate-bounce-subtle" />
          </div>

          <div className="space-y-1">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-black bg-rose-500/20 text-rose-400 border border-rose-500/30">
              🇷🇴 Imnul Național al României (المادة 12 من الدستور)
            </span>
            <h1 className="text-2xl sm:text-3xl font-black pt-1">
              {appLang === 'ar' ? anthemData.title_ar : appLang === 'en' ? anthemData.title_en : anthemData.title_ro}
            </h1>
            <p className="text-xs sm:text-sm text-theme-sub max-w-xl mx-auto leading-relaxed">
              كلمات: {anthemData.author} | ألحان: {anthemData.composer}
            </p>
          </div>

          {/* Action Player Button */}
          <div className="pt-2">
            <button
              onClick={playFullAnthem}
              className={`px-6 py-3.5 rounded-2xl font-black text-xs sm:text-sm shadow-xl transition-all flex items-center justify-center space-x-2 space-x-reverse mx-auto ${
                isPlayingAll 
                  ? 'bg-rose-600 text-white animate-pulse' 
                  : 'bg-gradient-to-r from-rose-600 via-amber-600 to-rose-700 hover:opacity-95 text-white shadow-rose-600/30'
              }`}
            >
              {isPlayingAll ? <Square className="w-5 h-5 fill-current" /> : <Volume2 className="w-5 h-5" />}
              <span>{isPlayingAll ? (appLang === 'ar' ? 'إيقاف النشيد ⏹️' : 'Stop Anthem ⏹️') : (appLang === 'ar' ? 'استمع للنشيد الوطني كاملاً 🇷🇴' : 'Listen to Full National Anthem 🇷🇴')}</span>
            </button>
          </div>
        </motion.div>

        {/* Citizenship ANC Exam Fact Box */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="p-4 rounded-2xl bg-amber-500/15 border-2 border-amber-500/40 text-amber-300 text-xs sm:text-sm font-bold flex items-start space-x-3 space-x-reverse shadow-lg"
        >
          <ShieldCheck className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="block text-amber-400 font-black text-xs uppercase tracking-wider">
              📜 سؤال مهم في مقابلة الجنسية ANC:
            </span>
            <p className="leading-relaxed text-amber-100 font-bold">
              {appLang === 'en' ? anthemData.citizenship_fact_en : anthemData.citizenship_fact_ar}
            </p>
          </div>
        </motion.div>

        {/* Stanzas Cards Grid with Framer Motion */}
        <div className="space-y-6">
          {anthemData.stanzas.map((stanza, idx) => {
            const isPlayingThis = activeStanza === stanza.number;

            return (
              <motion.div
                key={stanza.number}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 * idx }}
                className={`p-5 sm:p-6 rounded-2xl border space-y-4 shadow-xl transition-all ${
                  isDark ? 'bg-slate-800/90 border-slate-700/80' : 'bg-white border-slate-200'
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center font-black text-xs">
                      #{stanza.number}
                    </span>
                    <h3 className="text-sm font-extrabold text-theme-main">
                      {appLang === 'ar' ? `المقطع ${stanza.number}` : appLang === 'en' ? `Stanza ${stanza.number}` : `Strofa ${stanza.number}`}
                    </h3>
                  </div>

                  <button
                    onClick={() => speakStanza(stanza.number, stanza.lines_ro)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center space-x-1.5 space-x-reverse transition-all ${
                      isPlayingThis 
                        ? 'bg-rose-600 text-white border-rose-600 animate-pulse' 
                        : isDark ? 'bg-slate-900 border-slate-700 text-rose-400 hover:bg-slate-800' : 'bg-slate-100 border-slate-200 text-rose-600 hover:bg-slate-200'
                    }`}
                  >
                    {isPlayingThis ? <Square className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    <span>{isPlayingThis ? 'إيقاف' : 'استمع 🔊'}</span>
                  </button>
                </div>

                {/* Verses Parallel Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Romanian Verse */}
                  <div className={`p-4 rounded-xl border space-y-2 ${
                    isDark ? 'bg-slate-900/80 border-slate-700/80' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <span className="text-[10px] font-black text-rose-400 block uppercase">🇷🇴 Limba Română:</span>
                    {stanza.lines_ro.map((line, lIdx) => (
                      <p key={lIdx} className="text-xs sm:text-sm font-black text-theme-main leading-snug">
                        {line}
                      </p>
                    ))}
                  </div>

                  {/* Translated Verse */}
                  <div className={`p-4 rounded-xl border space-y-2 ${
                    isDark ? 'bg-slate-900/50 border-slate-700/50' : 'bg-amber-50/60 border-amber-200'
                  }`}>
                    <span className="text-[10px] font-black text-amber-400 block uppercase">
                      {appLang === 'en' ? '🇬🇧 English Translation:' : '🇸🇦 الترجمة العربية:'}
                    </span>
                    {(appLang === 'en' ? stanza.lines_en : stanza.lines_ar).map((line, lIdx) => (
                      <p key={lIdx} className="text-xs sm:text-sm font-semibold text-theme-sub leading-snug">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default function AnthemPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading Romanian National Anthem...</div>}>
      <AnthemContent />
    </Suspense>
  );
}
