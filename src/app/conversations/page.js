'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { 
  MessageSquare, 
  Volume2, 
  Square, 
  Gamepad2, 
  Eye, 
  Search, 
  Sparkles,
  UserCheck
} from 'lucide-react';
import conversationsData from '../../data/romanian_conversations.json';
import Navbar from '../../components/Navbar';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

function ConversationsContent() {
  const { theme } = useTheme();
  const { appLang, strings, isRtl } = useLanguage();
  const isDark = theme === 'dark';

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showTranslations, setShowTranslations] = useState(true);
  const [isSpeakingId, setIsSpeakingId] = useState(null);

  const categories = [
    { id: 'all', label_ar: 'جميع المحادثات', label_en: 'All Dialogues', label_ro: 'Toate Dialogurile' },
    { id: 'citizenship', label_ar: '🏛️ مقابلة الجنسية الرسمية', label_en: '🏛️ Citizenship Interview', label_ro: '🏛️ Interviu Cetățenie' },
    { id: 'greetings', label_ar: '🤝 التعارف والتقديم', label_en: '🤝 Greetings & Introductions', label_ro: '🤝 Saluturi & Prezentare' },
    { id: 'daily_life', label_ar: '🛒 الحياة اليومية والتسوق', label_en: '🛒 Daily Life & Shopping', label_ro: '🛒 Viața de Zi cu Zi' },
  ];

  const filteredConversations = conversationsData.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      item.title_ro.toLowerCase().includes(q) ||
      (item.title_ar && item.title_ar.includes(q)) ||
      (item.title_en && item.title_en.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  const speakLine = (id, text) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (isSpeakingId === id) {
      window.speechSynthesis.cancel();
      setIsSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ro-RO';
    utterance.rate = 0.85;
    utterance.onend = () => setIsSpeakingId(null);
    utterance.onerror = () => setIsSpeakingId(null);
    setIsSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen pb-20 bg-theme-main text-theme-main flex flex-col">
      <Navbar />

      <main className={`flex-1 w-full max-w-4xl mx-auto px-4 py-6 space-y-6 ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
        {/* Header Title Banner */}
        <div className={`rounded-2xl p-6 border shadow-xl space-y-3 text-center ${isDark ? 'bg-slate-800/90 border-slate-700/80' : 'bg-white border-slate-200'}`}>
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
            🗣️ {strings.conversationsTitle}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            {strings.conversationsTitle}
          </h1>
          <p className="text-xs sm:text-sm text-theme-sub max-w-xl mx-auto leading-relaxed">
            {strings.conversationsSubtitle}
          </p>

          <div className="pt-2 flex flex-wrap gap-2 justify-center">
            <Link
              href="/conversation-quiz"
              className="px-5 py-2.5 bg-gradient-to-r from-rose-600 to-amber-600 hover:opacity-95 text-white font-bold rounded-xl text-xs flex items-center space-x-2 space-x-reverse shadow-lg shadow-rose-600/30 transition-all"
            >
              <Gamepad2 className="w-4 h-4" />
              <span>{strings.conversationGameTitle}</span>
            </Link>

            <button
              onClick={() => setShowTranslations(!showTranslations)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-colors flex items-center space-x-1.5 space-x-reverse ${
                isDark ? 'bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>{showTranslations ? (appLang === 'ar' ? 'إخفاء الترجمات (اختبار القراءة)' : 'Hide Translations') : (appLang === 'ar' ? 'إظهار الترجمات' : 'Show Translations')}</span>
            </button>
          </div>
        </div>

        {/* Search & Category Filter Section */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-5 h-5 absolute right-3.5 top-3 text-slate-500 rtl:right-3.5 rtl:left-auto ltr:left-3.5 ltr:right-auto" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={appLang === 'ar' ? 'ابحث في المحادثات اليومية...' : 'Search daily conversations...'}
              className={`w-full border rounded-2xl py-3 px-11 text-xs sm:text-sm focus:outline-none focus:border-rose-500 ${
                isDark ? 'bg-slate-800/80 border-slate-700/80 text-white placeholder-slate-500' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 shadow-sm'
              }`}
            />
          </div>

          <div className="flex items-center space-x-2 space-x-reverse overflow-x-auto pb-1 no-scrollbar">
            {categories.map((c) => {
              const isActive = activeCategory === c.id;
              const label = appLang === 'ar' ? c.label_ar : appLang === 'en' ? c.label_en : c.label_ro;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveCategory(c.id)}
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

        {/* Conversations List */}
        <div className="space-y-6">
          {filteredConversations.map((conv) => (
            <div 
              key={conv.id}
              className={`rounded-2xl border shadow-xl overflow-hidden space-y-4 ${
                isDark ? 'bg-slate-800/90 border-slate-700/80' : 'bg-white border-slate-200'
              }`}
            >
              {/* Conversation Image Header */}
              <div className="relative w-full h-44 bg-slate-950 flex items-end p-4 border-b border-slate-700/60">
                <img 
                  src={conv.image} 
                  alt={conv.title_ro}
                  className="absolute inset-0 w-full h-full object-cover opacity-40"
                />
                <div className="relative z-10 space-y-1">
                  <span className="inline-block px-3 py-1 rounded-lg text-xs font-bold bg-rose-600 text-white shadow">
                    {appLang === 'ar' ? conv.title_ar : conv.title_en}
                  </span>
                  <h3 className="text-xl font-extrabold text-white">
                    {conv.title_ro}
                  </h3>
                  <p className="text-xs text-slate-300">
                    🇸🇦 {conv.description_ar}
                  </p>
                </div>
              </div>

              {/* Dialogue Bubbles List */}
              <div className="p-5 space-y-4">
                {conv.dialogue.map((line, idx) => {
                  const isOfficer = line.speaker_ro.includes('Ofițer') || line.speaker_ro.includes('Președintele') || line.speaker_ro.includes('Vânzător') || line.speaker_ro.includes('Chelner') || line.speaker_ro.includes('Farmacist');
                  const lineId = `${conv.id}-${idx}`;
                  const isSpeaking = isSpeakingId === lineId;

                  return (
                    <div 
                      key={idx}
                      className={`p-4 rounded-2xl border space-y-2.5 transition-all ${
                        isOfficer 
                          ? isDark ? 'bg-slate-900/90 border-rose-500/40 text-slate-100' : 'bg-rose-50 border-rose-200 text-slate-900'
                          : isDark ? 'bg-slate-800 border-emerald-500/40 text-slate-100' : 'bg-emerald-50 border-emerald-200 text-slate-900'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-lg ${
                          isOfficer ? 'bg-rose-500 text-white' : 'bg-emerald-600 text-white'
                        }`}>
                          🗣️ {line.speaker_ro}
                        </span>

                        <button
                          onClick={() => speakLine(lineId, line.text_ro)}
                          className="p-2 bg-rose-500/15 hover:bg-rose-500/25 text-rose-500 rounded-xl transition-colors flex items-center space-x-1 space-x-reverse text-xs font-bold"
                        >
                          {isSpeaking ? <Square className="w-4 h-4 text-amber-400 animate-pulse" /> : <Volume2 className="w-4 h-4" />}
                          <span>{strings.playAudio}</span>
                        </button>
                      </div>

                      <p className="text-base sm:text-lg font-bold leading-relaxed">
                        {line.text_ro}
                      </p>

                      {showTranslations && (
                        <div className="pt-2 border-t border-slate-700/40 space-y-1 text-xs">
                          <p className="text-rose-500 font-bold text-right">🇸🇦 {line.text_ar}</p>
                          <p className="text-emerald-500 font-medium">🇬🇧 {line.text_en}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default function ConversationsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading Conversations Page...</div>}>
      <ConversationsContent />
    </Suspense>
  );
}
