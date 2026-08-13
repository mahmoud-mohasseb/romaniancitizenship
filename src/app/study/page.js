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
    <div className="min-h-screen pb-20 bg-theme-main text-theme-main flex flex-col">
      <Navbar />

      <main className={`flex-1 w-full max-w-4xl mx-auto px-4 py-6 space-y-4 ${
        isRtl ? 'lg:mr-72' : 'lg:ml-72'
      } ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
        {/* Category Filters Horizontal Scroll */}
        <div className="flex items-center space-x-2 space-x-reverse overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES_LIST.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-2 space-x-reverse shrink-0 ${
                  isActive 
                    ? 'text-white shadow-md' 
                    : isDark ? 'bg-slate-800/80 text-slate-400 border border-slate-700/60 hover:text-white' : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900 shadow-sm'
                }`}
                style={isActive ? { backgroundColor: cat.color } : {}}
              >
                <span>{appLang === 'ar' ? cat.name_ar : appLang === 'en' ? cat.name_en : cat.name_ro}</span>
              </button>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className={`rounded-xl p-3 border space-y-1.5 ${isDark ? 'bg-slate-800/80 border-slate-700/60' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex justify-between text-xs font-semibold">
            <span style={{ color: categoryMeta.color }}>
              {appLang === 'ar' ? categoryMeta.name_ar : appLang === 'en' ? categoryMeta.name_en : categoryMeta.name_ro}
            </span>
            <span className="text-theme-sub">
              {strings.question} {currentIndex + 1} {strings.of} {filteredQuestions.length}
            </span>
          </div>
          <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-900' : 'bg-slate-100'}`}>
            <div 
              className="h-full transition-all duration-300"
              style={{ 
                width: `${((currentIndex + 1) / Math.max(filteredQuestions.length, 1)) * 100}%`,
                backgroundColor: categoryMeta.color
              }}
            />
          </div>
        </div>

        {/* Main Question Card */}
        <div className={`rounded-2xl border overflow-hidden shadow-xl ${isDark ? 'bg-slate-800/90 border-slate-700/80' : 'bg-white border-slate-200'}`}>
          {/* Uncropped Wikipedia Image Container */}
          <div 
            onClick={() => setModalVisible(true)}
            className="relative w-full h-56 bg-slate-950 flex items-center justify-center p-3 cursor-pointer group border-b border-slate-700/60"
          >
            <img 
              src={currentQ.image} 
              alt={currentQ.question}
              className="max-h-full max-w-full object-contain transition-transform group-hover:scale-105"
            />

            <span 
              className="absolute top-3 right-3 text-xs font-bold text-white px-3 py-1 rounded-lg shadow"
              style={{ backgroundColor: categoryMeta.color }}
            >
              {appLang === 'ar' ? categoryMeta.name_ar : appLang === 'en' ? categoryMeta.name_en : categoryMeta.name_ro}
            </span>

            <button className="absolute bottom-3 left-3 bg-black/75 hover:bg-black text-white px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1 space-x-reverse backdrop-blur-sm">
              <Maximize2 className="w-3.5 h-3.5" />
              <span>{strings.zoomImage}</span>
            </button>

            <span className="absolute top-3 left-3 bg-black/75 text-white px-2.5 py-1 rounded-lg text-xs font-bold">
              #{currentQ.id}
            </span>
          </div>

          {/* Action Toolbar */}
          <div className={`flex items-center justify-between p-3 border-b gap-2 ${isDark ? 'bg-slate-900/90 border-slate-700/60' : 'bg-slate-50 border-slate-200'}`}>
            <a
              href={currentQ.wiki_url || 'https://en.wikipedia.org/wiki/Romania'}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex-1 flex items-center justify-center space-x-2 space-x-reverse py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                isDark ? 'bg-slate-800 hover:bg-slate-700/80 text-slate-200 border-slate-700/80' : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300'
              }`}
            >
              <ExternalLink className="w-4 h-4 text-rose-400" />
              <span>{appLang === 'ar' ? 'اقرأ المقال على ويكيبيديا ℹ️' : appLang === 'en' ? 'Read Article on Wikipedia ℹ️' : 'Citește articolul pe Wikipedia ℹ️'}</span>
            </a>

            <Link
              href={`/ai?q=${encodeURIComponent(currentQ.question)}`}
              className="flex items-center space-x-1.5 space-x-reverse py-2 px-3.5 bg-amber-500/15 hover:bg-amber-500/25 rounded-xl text-xs font-bold text-amber-500 border border-amber-500/40 transition-colors shrink-0"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>اسأل AI</span>
            </Link>
          </div>

          {/* Question Text */}
          <div className="p-5 space-y-4">
            <div className="flex items-start space-x-3 space-x-reverse">
              <button
                onClick={() => speakText(currentQ.question)}
                className="p-3 bg-rose-500/15 hover:bg-rose-500/25 rounded-xl text-rose-400 shrink-0 transition-colors"
              >
                {isSpeaking ? <Square className="w-5 h-5 animate-pulse text-amber-400" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <h2 className="text-xl font-semibold leading-relaxed">
                {currentQ.question}
              </h2>
            </div>

            <div className={`h-px w-full ${isDark ? 'bg-slate-700/80' : 'bg-slate-200'}`} />

            {/* Translations */}
            <div className="space-y-3">
              <div>
                <span className="text-[11px] font-bold text-rose-500 block mb-1">🇸🇦 {strings.arabicText}:</span>
                <p className="text-lg font-bold text-rose-500 text-right leading-relaxed">
                  {currentQ.question_ar}
                </p>
              </div>

              <div>
                <span className="text-[11px] font-bold text-emerald-500 block mb-1">🇬🇧 {strings.englishText}:</span>
                <p className="text-sm font-medium leading-relaxed">
                  {getQuestionText(currentQ, 'en')}
                </p>
              </div>
            </div>

            {/* Answer Toggle */}
            {!showAnswer ? (
              <button
                onClick={() => setShowAnswer(true)}
                className="w-full py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl flex items-center justify-center space-x-2 space-x-reverse shadow-lg shadow-rose-600/30 transition-all mt-4"
              >
                <Eye className="w-5 h-5" />
                <span>{strings.showAnswer}</span>
              </button>
            ) : (
              <div className={`pt-4 border-t space-y-3 ${isDark ? 'border-slate-700/80' : 'border-slate-200'}`}>
                <span className="text-xs font-bold text-emerald-500 block">{strings.modelAnswer}</span>
                
                <div className="flex items-start space-x-3 space-x-reverse">
                  <button
                    onClick={() => speakText(currentQ.answer)}
                    className="p-3 bg-emerald-500/15 hover:bg-emerald-500/25 rounded-xl text-emerald-500 shrink-0 transition-colors"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                  <p className="text-lg font-bold text-emerald-500 leading-relaxed">
                    {currentQ.answer}
                  </p>
                </div>

                <div className={`h-px w-full ${isDark ? 'bg-slate-700/80' : 'bg-slate-200'}`} />

                <div className="space-y-2 text-right">
                  <p className="text-lg font-bold text-emerald-500">🇸🇦 {currentQ.answer_ar}</p>
                  <p className="text-sm font-medium text-emerald-600">🇬🇧 {getAnswerText(currentQ, 'en')}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Footer */}
        <div className={`flex justify-between items-center p-3 rounded-2xl border ${isDark ? 'bg-slate-800/80 border-slate-700/60' : 'bg-white border-slate-200 shadow-sm'}`}>
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`flex items-center space-x-2 space-x-reverse px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              currentIndex === 0 
                ? 'opacity-40 cursor-not-allowed' 
                : 'bg-slate-700 hover:bg-slate-600 text-white'
            }`}
          >
            {isRtl ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            <span>{strings.prev}</span>
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex === filteredQuestions.length - 1}
            className={`flex items-center space-x-2 space-x-reverse px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              currentIndex === filteredQuestions.length - 1 
                ? 'opacity-40 cursor-not-allowed' 
                : 'bg-slate-700 hover:bg-slate-600 text-white'
            }`}
          >
            <span>{strings.next}</span>
            {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        {/* Fullscreen Image Modal */}
        {modalVisible && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95">
            <button 
              onClick={() => setModalVisible(false)}
              className="absolute top-6 right-6 p-2 text-white bg-slate-800/80 hover:bg-slate-700 rounded-full"
            >
              <X className="w-8 h-8" />
            </button>
            <img 
              src={currentQ.image} 
              alt={currentQ.question}
              className="max-h-[80vh] max-w-[95vw] object-contain rounded-xl"
            />
          </div>
        )}
      </main>
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
