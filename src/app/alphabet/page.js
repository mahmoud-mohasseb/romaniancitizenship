'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { 
  Volume2, 
  Square, 
  Gamepad2, 
  Sparkles, 
  Info, 
  Search 
} from 'lucide-react';
import alphabetData from '../../data/romanian_alphabet.json';
import Navbar from '../../components/Navbar';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

function AlphabetContent() {
  const { theme } = useTheme();
  const { appLang, strings, isRtl } = useLanguage();
  const isDark = theme === 'dark';

  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSpeakingId, setIsSpeakingId] = useState(null);

  const filters = [
    { id: 'all', label_ar: 'الكل (31 حرفاً)', label_en: 'All (31 Letters)', label_ro: 'Toate (31 Litere)' },
    { id: 'special_vowels', label_ar: 'حروف صوتية خاصة (Ă, Â, Î)', label_en: 'Special Vowels (Ă, Â, Î)', label_ro: 'Vocale Speciale (Ă, Â, Î)' },
    { id: 'special_consonants', label_ar: 'حروف ساكنة خاصة (Ș, Ț)', label_en: 'Special Consonants (Ș, Ț)', label_ro: 'Consoane Speciale (Ș, Ț)' },
    { id: 'vowels', label_ar: 'الحروف الصوتية (A, E, I, O, U, Y)', label_en: 'Vowels (A, E, I, O, U, Y)', label_ro: 'Vocale (A, E, I, O, U, Y)' },
    { id: 'consonants', label_ar: 'الحروف الساكنة', label_en: 'Consonants', label_ro: 'Consoane' },
  ];

  const filteredData = alphabetData.filter((item) => {
    const matchesFilter = activeFilter === 'all' || item.category === activeFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      item.letter.toLowerCase().includes(q) ||
      item.example_word_ro.toLowerCase().includes(q) ||
      (item.example_translation_ar && item.example_translation_ar.includes(q)) ||
      (item.example_translation_en && item.example_translation_en.toLowerCase().includes(q));
    return matchesFilter && matchesSearch;
  });

  const speakText = (id, text) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (isSpeakingId === id) {
      window.speechSynthesis.cancel();
      setIsSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ro-RO';
    utterance.rate = 0.8;
    utterance.onend = () => setIsSpeakingId(null);
    utterance.onerror = () => setIsSpeakingId(null);
    setIsSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen pb-20 bg-theme-main text-theme-main flex flex-col">
      <Navbar />

      <main className={`flex-1 w-full max-w-4xl mx-auto px-4 py-6 space-y-6 ${
        isRtl ? 'lg:mr-72' : 'lg:ml-72'
      } ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
        {/* Header Title Banner */}
        <div className={`rounded-2xl p-6 border shadow-xl space-y-3 text-center ${isDark ? 'bg-slate-800/90 border-slate-700/80' : 'bg-white border-slate-200'}`}>
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
            🔤 {strings.alphabetTitle}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            {strings.alphabetTitle}
          </h1>
          <p className="text-xs sm:text-sm text-theme-sub max-w-xl mx-auto leading-relaxed">
            {strings.alphabetSubtitle}
          </p>

          <div className="pt-2 flex flex-wrap gap-2 justify-center">
            <Link
              href="/alphabet-quiz"
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-rose-600 hover:opacity-95 text-white font-bold rounded-xl text-xs flex items-center space-x-2 space-x-reverse shadow-lg shadow-rose-600/30 transition-all"
            >
              <Gamepad2 className="w-4 h-4" />
              <span>{strings.alphabetGameTitle}</span>
            </Link>
          </div>
        </div>

        {/* Search & Filter Section */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-5 h-5 absolute right-3.5 top-3 text-slate-500 rtl:right-3.5 rtl:left-auto ltr:left-3.5 ltr:right-auto" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={appLang === 'ar' ? 'ابحث عن حرف أو كلمة رومانية...' : appLang === 'en' ? 'Search letter or word...' : 'Căutați o literă sau un cuvânt...'}
              className={`w-full border rounded-2xl py-3 px-11 text-xs sm:text-sm focus:outline-none focus:border-rose-500 ${
                isDark ? 'bg-slate-800/80 border-slate-700/80 text-white placeholder-slate-500' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 shadow-sm'
              }`}
            />
          </div>

          <div className="flex items-center space-x-2 space-x-reverse overflow-x-auto pb-1 no-scrollbar">
            {filters.map((f) => {
              const isActive = activeFilter === f.id;
              const label = appLang === 'ar' ? f.label_ar : appLang === 'en' ? f.label_en : f.label_ro;
              return (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                    isActive 
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30' 
                      : isDark ? 'bg-slate-800/80 text-slate-400 border border-slate-700/60 hover:text-white' : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900 shadow-sm'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Letters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredData.map((item) => {
            const isSpecial = item.category.startsWith('special');
            const isSpeaking = isSpeakingId === item.id;

            return (
              <div 
                key={item.id}
                className={`rounded-2xl p-5 border shadow-xl flex flex-col justify-between space-y-4 transition-all ${
                  isSpecial ? 'border-amber-500/50 bg-gradient-to-br from-slate-800 to-amber-950/20 text-white' : isDark ? 'bg-slate-800/90 border-slate-700/80 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
                }`}
              >
                {/* Header Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black shadow-inner ${
                      isSpecial ? 'bg-amber-500 text-slate-950' : 'bg-rose-600 text-white'
                    }`}>
                      {item.letter}
                    </div>
                    <div>
                      <h3 className="text-base font-bold">
                        {item.name_ro} <span className="text-xs font-normal text-theme-sub">{item.pronunciation_ro}</span>
                      </h3>
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md mt-0.5 ${
                        isSpecial ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {item.category === 'special_vowels' || item.category === 'special_consonants' ? (appLang === 'ar' ? 'حرف روماني خاص' : 'Special Letter') : (appLang === 'ar' ? 'حرف أساسي' : 'Standard Letter')}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => speakText(item.id, `${item.letter}. ${item.example_word_ro}.`)}
                    className="p-3 bg-rose-500/15 hover:bg-rose-500/25 text-rose-500 rounded-xl transition-colors flex items-center space-x-1.5 space-x-reverse"
                    title={strings.playAudio}
                  >
                    {isSpeaking ? <Square className="w-5 h-5 text-amber-400 animate-pulse" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                </div>

                {/* Pronunciation Notes */}
                <div className={`rounded-xl p-3 border space-y-1.5 text-xs ${isDark ? 'bg-slate-900/90 border-slate-700/80' : 'bg-slate-50 border-slate-200'}`}>
                  <p className="font-bold text-amber-500 flex items-center space-x-1 space-x-reverse">
                    <Info className="w-3.5 h-3.5 shrink-0" />
                    <span>🇸🇦 النطق بالعربية:</span>
                  </p>
                  <p className="text-right leading-relaxed font-semibold">
                    {item.pronunciation_ar}
                  </p>

                  <div className={`h-px w-full ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />

                  <p className="text-left font-medium">
                    🇬🇧 <span className="font-bold text-emerald-500">English:</span> {item.pronunciation_en}
                  </p>
                </div>

                {/* Example Word & Image */}
                <div className={`flex items-center justify-between rounded-xl p-3 border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-theme-sub uppercase tracking-wider block">
                      {strings.exampleWord}
                    </span>
                    <p className="text-base font-extrabold">
                      {item.example_word_ro}
                    </p>
                    <p className="text-xs text-rose-500 font-bold">
                      🇸🇦 {item.example_translation_ar} <span className="text-theme-sub font-normal">| 🇬🇧 {item.example_translation_en}</span>
                    </p>
                  </div>

                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-950 border border-slate-700 shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.example_word_ro}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Example Sentence */}
                <div className={`space-y-1 text-xs pt-1 border-t ${isDark ? 'border-slate-700/60' : 'border-slate-200'}`}>
                  <span className="text-[10px] font-bold text-theme-sub block">{strings.exampleSentence}</span>
                  <p className="font-bold text-emerald-500">{item.example_sentence_ro}</p>
                  <p className="text-right">🇸🇦 {item.example_sentence_ar}</p>
                  <p className="text-theme-sub">🇬🇧 {item.example_sentence_en}</p>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default function AlphabetPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading Alphabet Page...</div>}>
      <AlphabetContent />
    </Suspense>
  );
}
