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
  ChevronLeft,
  Lightbulb
} from 'lucide-react';
import questions from '../../data/questions_ar.json';
import Navbar from '../../components/Navbar';
import ImageModal from '../../components/ImageModal';
import AudioPlayerButton from '../../components/AudioPlayerButton';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { CATEGORIES_LIST, getCategoryMeta } from '../../utils/categories';
import { getQuestionText, getAnswerText } from '../../utils/languageHelper';
import { stopSpeech } from '../../utils/speechHelper';

function StudyContent() {
  const searchParams = useSearchParams();

  const { theme } = useTheme();
  const { appLang, setAppLang, strings, isRtl } = useLanguage();
  const isDark = theme === 'dark';

  const [activeCategory, setActiveCategory] = useState('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setActiveCategory(cat);
    }
  }, [searchParams]);

  const filteredQuestions = activeCategory === 'all' 
    ? questions 
    : questions.filter(q => q.category === activeCategory);

  const currentQ = filteredQuestions[currentIndex] || questions[0];
  const categoryMeta = getCategoryMeta(currentQ.category || activeCategory);
  const imageSrc = currentQ?.image || currentQ?.image_url;

  useEffect(() => {
    setCurrentIndex(0);
    setShowAnswer(false);
    stopSpeech();
  }, [activeCategory]);

  const handleNext = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowAnswer(false);
      stopSpeech();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setShowAnswer(false);
      stopSpeech();
    }
  };

  return (
    <div className="min-h-screen pb-28 sm:pb-24 bg-theme-main text-theme-main flex flex-col font-latin">
      <Navbar />

      <main className={`flex-1 w-full max-w-4xl mx-auto px-4 py-6 space-y-4 animate-fade-in-up ${
        isRtl ? 'lg:mr-72' : 'lg:ml-72'
      } ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
        {/* Category Horizontal Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2.5 px-0.5 no-scrollbar mobile-touch-scroll">
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

        {/* Enriched Category Overview & Key Interview Facts Banner */}
        {categoryMeta && categoryMeta.key_facts_ar && (
          <div className={`p-4 rounded-3xl border space-y-2 text-xs sm:text-sm font-bold animate-fade-in-up ${
            isDark ? 'bg-slate-800/90 border-slate-700/80 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-md'
          }`}>
            <div className="flex items-center justify-between border-b border-slate-700/50 pb-2">
              <span className="text-[11px] font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{appLang === 'ar' ? 'أهم حقائق وملاحظات هذا القسم للمقابلة:' : 'Key Interview Facts for this Category:'}</span>
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-400 border border-rose-500/30">
                {filteredQuestions.length} {strings.questionsBadge || 'أسئلة'}
              </span>
            </div>
            <p className="text-theme-sub text-xs leading-relaxed font-semibold">
              {appLang === 'ar' ? categoryMeta.description_ar : categoryMeta.description_en || categoryMeta.description_ro}
            </p>
            <ul className="space-y-1.5 pt-1 text-xs">
              {(appLang === 'ar' ? categoryMeta.key_facts_ar : (categoryMeta.key_facts_en || categoryMeta.key_facts_ar)).map((fact, fIdx) => (
                <li key={fIdx} className="flex items-start gap-2 text-amber-300 font-bold">
                  <span className="text-amber-500 font-black">•</span>
                  <span>{fact}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

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
            <AudioPlayerButton 
              text={currentQ.question}
              lang="ro"
              label={strings.playAudio || 'استمع بالرومانية'}
            />
          </div>
        </div>

        {/* Question & Answer Main Flashcard */}
        <div className={`rounded-3xl border shadow-xl p-5 space-y-4 animate-scale-in ${
          isDark ? 'bg-slate-800/90 border-slate-700/80 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}>
          {/* Question Image Preview with Fallback */}
          {imageSrc && (
            <div className="relative w-full h-56 sm:h-72 rounded-2xl overflow-hidden border-2 border-slate-700/60 bg-slate-950 group cursor-pointer shadow-lg" onClick={() => setModalVisible(true)}>
              <img 
                src={imageSrc} 
                alt={currentQ.question}
                onError={(e) => {
                  e.currentTarget.src = '/icon.png';
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
            <p className="text-xs sm:text-sm text-theme-sub pt-1 leading-relaxed font-bold">
              🇸🇦 {getQuestionText(currentQ, appLang)}
            </p>
          </div>

          {/* Answer Toggle Section */}
          <div className="space-y-3">
            {!showAnswer ? (
              <button
                onClick={() => setShowAnswer(true)}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-rose-600 via-amber-600 to-rose-700 hover:opacity-95 text-white font-black rounded-2xl text-xs sm:text-sm shadow-md shadow-rose-600/30 transition-all flex items-center justify-center space-x-2 space-x-reverse animate-pulse-glow"
              >
                <Eye className="w-4 h-4" />
                <span>{strings.showAnswer || 'عرض الإجابة والترجمة'}</span>
              </button>
            ) : (
              <div className="space-y-3 animate-fade-in-up">
                <div className={`p-4 rounded-2xl border space-y-2 ${
                  isDark ? 'bg-slate-900/90 border-emerald-500/40 text-slate-100' : 'bg-emerald-50 border-emerald-200 text-slate-900'
                }`}>
                  <div className="flex items-center justify-between border-b border-emerald-500/30 pb-2">
                    <span className="text-[10px] font-bold text-emerald-400">🇷🇴 Răspuns Model Oficial:</span>
                    <AudioPlayerButton 
                      text={currentQ.answer}
                      lang="ro"
                      label="استمع للإجابة 🔊"
                    />
                  </div>
                  <p className="text-sm sm:text-base font-extrabold text-emerald-400 leading-snug">{currentQ.answer}</p>
                  <p className="text-xs sm:text-sm text-theme-sub pt-1 leading-relaxed font-bold">
                    🇸🇦 {getAnswerText(currentQ, appLang)}
                  </p>
                </div>

                {/* Factually Accurate Educational & Context Insights Card */}
                {(currentQ.explanation_ar || currentQ.explanation_en) && (
                  <div className={`p-4 rounded-2xl border-2 space-y-2 ${
                    isDark ? 'bg-amber-500/10 border-amber-500/30 text-amber-200' : 'bg-amber-50 border-amber-300 text-amber-950'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black text-amber-400 flex items-center gap-1.5">
                        <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>{appLang === 'ar' ? 'توضيح ومعلومات إضافية للمقابلة:' : 'Educational Insight & Interview Note:'}</span>
                      </span>
                      <AudioPlayerButton 
                        text={currentQ.explanation_ar || currentQ.explanation_en}
                        lang={appLang === 'ar' ? 'ar' : 'en'}
                        label="استمع للتوضيح"
                      />
                    </div>
                    <p className="text-xs sm:text-sm font-bold leading-relaxed">
                      {appLang === 'ar' ? currentQ.explanation_ar : (currentQ.explanation_en || currentQ.explanation_ar)}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Pagination Control Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 space-x-reverse border transition-all disabled:opacity-40 ${
              isDark ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-800 shadow-sm hover:bg-slate-100'
            }`}
          >
            {isRtl ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            <span>{strings.prev || 'السابق'}</span>
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex === filteredQuestions.length - 1}
            className="py-3.5 px-4 bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white font-bold text-xs sm:text-sm rounded-2xl flex items-center justify-center space-x-2 space-x-reverse shadow-md shadow-rose-600/30 transition-all"
          >
            <span>{strings.next || 'التالي'}</span>
            {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </main>

      {/* Universal Fullscreen Image Review Modal */}
      <ImageModal 
        isOpen={modalVisible}
        onClose={() => setModalVisible(false)}
        imageUrl={imageSrc}
        title={currentQ?.question}
        caption={getQuestionText(currentQ, appLang)}
      />
    </div>
  );
}

export default function StudyPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400 font-bold">Loading Study Page...</div>}>
      <StudyContent />
    </Suspense>
  );
}
