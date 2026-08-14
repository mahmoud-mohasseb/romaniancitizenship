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
  UserCheck,
  Maximize2
} from 'lucide-react';
import conversationsData from '../../data/romanian_conversations.json';
import Navbar from '../../components/Navbar';
import ImageModal from '../../components/ImageModal';
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
  const [selectedImage, setSelectedImage] = useState(null);

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
    <div className="min-h-screen pb-28 sm:pb-24 bg-theme-main text-theme-main flex flex-col font-cairo">
      <Navbar />

      <main className={`flex-1 w-full max-w-4xl mx-auto px-4 py-6 space-y-6 animate-fade-in-up ${
        isRtl ? 'lg:mr-72' : 'lg:ml-72'
      } ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
        {/* Header Title Banner */}
        <div className={`rounded-2xl p-6 border shadow-xl space-y-3 text-center ${isDark ? 'bg-slate-800/90 border-slate-700/80 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
            🗣️ {strings.conversationsTitle}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            {strings.conversationsTitle}
          </h1>
          <p className="text-xs sm:text-sm text-theme-sub max-w-xl mx-auto leading-relaxed font-bold">
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
              <span>{showTranslations ? (appLang === 'ar' ? 'إخفاء الترجمة' : 'Hide Translations') : (appLang === 'ar' ? 'عرض الترجمة' : 'Show Translations')}</span>
            </button>
          </div>
        </div>

        {/* Search & Category Filter Section */}
        <div className="space-y-3">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={appLang === 'ar' ? 'ابحث في محادثات اليمين أو الفندق أو التسوق...' : appLang === 'en' ? 'Search dialogues...' : 'Caută conversații...'}
              className={`w-full border rounded-2xl px-4 py-3 text-xs sm:text-sm pl-10 focus:outline-none focus:border-rose-500 font-bold ${
                isDark ? 'bg-slate-800 border-slate-700/80 text-white placeholder-slate-500' : 'bg-white border-slate-200 text-slate-900 shadow-sm placeholder-slate-400'
              }`}
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          </div>

          <div className="flex items-center space-x-2 space-x-reverse overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all border ${
                  activeCategory === cat.id
                    ? 'bg-rose-600 text-white border-rose-600 shadow-md animate-quiz-pop'
                    : isDark ? 'bg-slate-800 text-slate-300 border-slate-700/60 hover:bg-slate-700' : 'bg-white text-slate-700 border-slate-200 shadow-sm hover:bg-slate-100'
                }`}
              >
                {appLang === 'ar' ? cat.label_ar : appLang === 'en' ? cat.label_en : cat.label_ro}
              </button>
            ))}
          </div>
        </div>

        {/* Dialogues List */}
        <div className="space-y-4">
          {filteredConversations.map((dialogue) => {
            const linesList = dialogue.dialogue || dialogue.lines || [];
            const titleText = appLang === 'ar' ? dialogue.title_ar : appLang === 'en' ? dialogue.title_en : dialogue.title_ro;

            return (
              <div
                key={dialogue.id}
                className={`p-5 rounded-2xl border space-y-4 shadow-lg animate-fade-in-up ${
                  isDark ? 'bg-slate-800/90 border-slate-700/80 text-white' : 'bg-white border-slate-200 text-slate-900'
                }`}
              >
                {/* Dialogue Cover Image Preview */}
                {dialogue.image && (
                  <div 
                    className="relative w-full h-44 sm:h-56 rounded-2xl overflow-hidden border-2 border-slate-700/60 bg-slate-950 group cursor-pointer shadow-md"
                    onClick={() => setSelectedImage({ url: dialogue.image, title: titleText })}
                  >
                    <img 
                      src={dialogue.image} 
                      alt={titleText}
                      onError={(e) => { e.currentTarget.src = '/icon.png'; }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button 
                      onClick={() => setSelectedImage({ url: dialogue.image, title: titleText })}
                      className="absolute bottom-2.5 right-2.5 p-2 bg-black/70 backdrop-blur-md text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 space-x-reverse border border-white/20 shadow-md"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>تكبير الصورة 🔍</span>
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-extrabold text-rose-500 block uppercase tracking-wider">
                      {dialogue.category_ar || dialogue.category}
                    </span>
                    <h2 className="text-base sm:text-lg font-black">
                      {titleText}
                    </h2>
                  </div>
                </div>

                {/* Dialogue Lines */}
                <div className="space-y-3">
                  {linesList.map((line, lIdx) => {
                    const speakerText = line.speaker_ro || line.speaker || '🗣️ Person';
                    const textRo = line.text_ro || line.ro;
                    const textAr = line.text_ar || line.ar;
                    const textEn = line.text_en || line.en;
                    const lineId = `${dialogue.id}-${lIdx}`;
                    const isSpeaking = isSpeakingId === lineId;

                    return (
                      <div
                        key={lIdx}
                        className={`p-3.5 rounded-xl border space-y-1.5 transition-all ${
                          speakerText.includes('Ofițer') || speakerText.includes('commission')
                            ? isDark ? 'bg-slate-900/80 border-slate-700' : 'bg-slate-50 border-slate-200'
                            : isDark ? 'bg-rose-950/20 border-rose-500/30' : 'bg-rose-50 border-rose-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-black text-rose-500">{speakerText}</span>
                          <button
                            onClick={() => speakLine(lineId, textRo)}
                            className={`p-1.5 rounded-lg border text-xs font-bold flex items-center space-x-1 space-x-reverse transition-all ${
                              isSpeaking 
                                ? 'bg-rose-600 text-white border-rose-600 animate-pulse' 
                                : isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {isSpeaking ? <Square className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                            <span className="text-[10px]">استمع 🔊</span>
                          </button>
                        </div>

                        <p className="text-xs sm:text-sm font-black text-theme-main leading-snug">{textRo}</p>

                        {showTranslations && (
                          <p className="text-xs text-theme-sub pt-0.5 leading-relaxed font-bold">
                            {appLang === 'en' ? `🇬🇧 ${textEn || textRo}` : `🇸🇦 ${textAr}`}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Universal Fullscreen Image Review Modal */}
      <ImageModal 
        isOpen={Boolean(selectedImage)}
        onClose={() => setSelectedImage(null)}
        imageUrl={selectedImage?.url}
        title={selectedImage?.title}
      />
    </div>
  );
}

export default function ConversationsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400 font-bold">Loading Conversations Page...</div>}>
      <ConversationsContent />
    </Suspense>
  );
}
