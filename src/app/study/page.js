'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  ArrowLeft, 
  ArrowRight, 
  Volume2, 
  Square, 
  Eye, 
  ExternalLink, 
  Sparkles, 
  Maximize2, 
  X, 
  ChevronRight, 
  ChevronLeft 
} from 'lucide-react';
import questions from '../../data/questions_ar.json';
import Navbar from '../../components/Navbar';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { CATEGORIES_LIST, getCategoryMeta } from '../../utils/categories';
import { getQuestionText, getAnswerText } from '../../utils/languageHelper';

function StudyContent() {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get('category') || 'all';

  const { theme } = useTheme();
  const { appLang, setAppLang, strings, isRtl } = useLanguage();
  const isDark = theme === 'dark';

  const [activeCategory, setActiveCategory] = useState(initialCat);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const filteredQuestions = activeCategory === 'all' 
    ? questions 
    : questions.filter(q => q.category === activeCategory);

  const currentQ = filteredQuestions[currentIndex] || questions[0];
  const categoryMeta = getCategoryMeta(currentQ.category || activeCategory);

  useEffect(() => {
    setCurrentIndex(0);
    setShowAnswer(false);
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, [activeCategory]);

  const handleNext = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowAnswer(false);
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setShowAnswer(false);
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
    }
  };

  const speakText = (text) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ro-RO';
    utterance.rate = 0.85;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen pb-28 sm:pb-24 bg-theme-main text-theme-main flex flex-col">
      <Navbar />

      <main className={`flex-1 w-full max-w-4xl mx-auto px-4 py-6 space-y-4 animate-fade-in-up ${
        isRtl ? 'lg:mr-72' : 'lg:ml-72'
      } ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
        {/* Category Horizontal Switcher */}
        <div className="flex items-center space-x-2 space-x-reverse overflow-x-auto pb-2 no-scrollbar">
          {CATEGORIES_LIST.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all border ${
                  isActive
                    ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-600/30 animate-quiz-pop'
                    : isDark ? 'bg-slate-800 text-slate-300 border-slate-700/60 hover:bg-slate-700' : 'bg-white text-slate-700 border-slate-200 shadow-sm hover:bg-slate-100'
                }`}
              >
                {appLang === 'ar' ? cat.name_ar : appLang === 'en' ? cat.name_en : cat.name_ro}
              </button>
            );
          })}
        </div>

        {/* Question Counter & Meta Card */}
        <div className={`p-4 rounded-2xl border flex items-center justify-between shadow-sm ${
          isDark ? 'bg-slate-800/80 border-slate-700/60' : 'bg-white border-slate-200'
        }`}>
          <div>
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-md bg-rose-500/15 text-rose-500 border border-rose-500/20">
              {appLang === 'ar' ? categoryMeta.name_ar : appLang === 'en' ? categoryMeta.name_en : categoryMeta.name_ro}
            </span>
            <h3 className="text-xs sm:text-sm font-bold text-theme-sub mt-1">
              {strings.question} {currentIndex + 1} {strings.of} {filteredQuestions.length}
            </h3>
          </div>

          <div className="flex items-center space-x-2 space-x-reverse">
            <button
              onClick={() => speakText(currentQ.question)}
              className={`p-2.5 rounded-xl border font-bold text-xs flex items-center space-x-1 space-x-reverse transition-all ${
                isSpeaking 
                  ? 'bg-rose-600 text-white border-rose-600 animate-pulse' 
                  : isDark ? 'bg-slate-900 border-slate-700 text-rose-400 hover:bg-slate-800' : 'bg-slate-100 border-slate-200 text-rose-600 hover:bg-slate-200'
              }`}
              title="Ascultă întrebarea în română 🔊"
            >
              {isSpeaking ? <Square className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{strings.playAudio || 'استمع'}</span>
            </button>
          </div>
        </div>

        {/* Question & Answer Main Flashcard */}
        <div className={`rounded-2xl border shadow-xl p-5 space-y-4 animate-scale-in ${
          isDark ? 'bg-slate-800/90 border-slate-700/80' : 'bg-white border-slate-200'
        }`}>
          {/* Question Image Preview with Fallback */}
          {currentQ.image && (
            <div className="relative w-full h-56 sm:h-72 rounded-2xl overflow-hidden border-2 border-slate-700/60 bg-slate-900 group cursor-pointer shadow-lg" onClick={() => setModalVisible(true)}>
              <img 
                src={currentQ.image} 
                alt={currentQ.question}
                onError={(e) => {
                  e.currentTarget.src = '/icon.png';
                }}
                className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
              />
              <button 
                onClick={() => setModalVisible(true)}
                className="absolute bottom-3 right-3 p-2 bg-black/70 backdrop-blur-md text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 space-x-reverse border border-white/30 shadow-md"
              >
                <Maximize2 className="w-4 h-4" />
                <span>{strings.zoomImage || 'تكبير الصورة 🔍'}</span>
              </button>
            </div>
          )}

          {/* Question Text */}
          <div className="space-y-2 border-b border-slate-700/60 pb-4">
            <span className="text-[10px] font-bold text-rose-500">🇷🇴 Limba Română:</span>
            <h2 className="text-lg sm:text-xl font-extrabold leading-snug">{currentQ.question}</h2>
            <p className="text-xs sm:text-sm text-theme-sub pt-1 leading-relaxed">
              🇸🇦 {getQuestionText(currentQ, appLang)}
            </p>
          </div>

          {/* Answer Toggle Section */}
          <div className="space-y-3">
            {!showAnswer ? (
              <button
                onClick={() => setShowAnswer(true)}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-rose-600 via-amber-600 to-rose-700 hover:opacity-95 text-white font-black rounded-xl text-xs sm:text-sm shadow-md shadow-rose-600/30 transition-all flex items-center justify-center space-x-2 space-x-reverse animate-pulse-glow"
              >
                <Eye className="w-4 h-4" />
                <span>{strings.showAnswer || 'عرض الإجابة والترجمة'}</span>
              </button>
            ) : (
              <div className={`p-4 rounded-xl border space-y-2 animate-fade-in-up ${
                isDark ? 'bg-slate-900/90 border-emerald-500/40 text-slate-100' : 'bg-emerald-50 border-emerald-200 text-slate-900'
              }`}>
                <div className="flex items-center justify-between border-b border-emerald-500/30 pb-2">
                  <span className="text-[10px] font-bold text-emerald-400">🇷🇴 Răspuns Model Oficial:</span>
                  <button
                    onClick={() => speakText(currentQ.answer)}
                    className="text-xs font-bold text-emerald-400 hover:underline flex items-center space-x-1 space-x-reverse"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>استمع للإجابة 🔊</span>
                  </button>
                </div>
                <p className="text-sm sm:text-base font-extrabold text-emerald-400 leading-snug">{currentQ.answer}</p>
                <p className="text-xs sm:text-sm text-theme-sub pt-1 leading-relaxed">
                  🇸🇦 {getAnswerText(currentQ, appLang)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Pagination Control Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 space-x-reverse border transition-all disabled:opacity-40 ${
              isDark ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-800 shadow-sm hover:bg-slate-100'
            }`}
          >
            {isRtl ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            <span>{strings.prev || 'السابق'}</span>
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex === filteredQuestions.length - 1}
            className="py-3.5 px-4 bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center space-x-2 space-x-reverse shadow-md shadow-rose-600/30 transition-all"
          >
            <span>{strings.next || 'التالي'}</span>
            {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </main>

      {/* Image Full Modal */}
      {modalVisible && currentQ.image && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-scale-in" onClick={() => setModalVisible(false)}>
          <div className="relative max-w-3xl max-h-[90vh] w-full h-full flex flex-col items-center justify-center">
            <button 
              onClick={() => setModalVisible(false)}
              className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 text-white rounded-full border border-white/30"
            >
              <X className="w-6 h-6" />
            </button>
            <img 
              src={currentQ.image} 
              alt={currentQ.question} 
              onError={(e) => { e.currentTarget.src = '/icon.png'; }}
              className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl bg-slate-950 p-2 border border-slate-700/60"
            />
            <p className="text-white text-xs font-bold mt-4 text-center px-4">{currentQ.question}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function StudyPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading Study Page...</div>}>
      <StudyContent />
    </Suspense>
  );
}
