'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { 
  Trophy, 
  RotateCcw, 
  CheckCircle, 
  XCircle, 
  Volume2, 
  Award, 
  Sparkles, 
  HelpCircle, 
  ChevronRight, 
  BookOpen, 
  Flame, 
  PenTool, 
  Layers, 
  Shuffle 
} from 'lucide-react';
import grammarQuizData from '../../data/romanian_grammar_quiz.json';
import Navbar from '../../components/Navbar';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

function GrammarQuizContent() {
  const { theme } = useTheme();
  const { appLang, strings, isRtl } = useLanguage();
  const isDark = theme === 'dark';

  const [activeTechnique, setActiveTechnique] = useState('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  const techniques = [
    { id: 'all', label_ar: 'جميع الأنواع (All Modes 🎮)', label_en: 'All Modes' },
    { id: 'multiple_choice', label_ar: '🎯 اختيارات متعددة (Multiple Choice)', label_en: 'Multiple Choice' },
    { id: 'fill_in_blank', label_ar: '✍️ إكمال الفراغ (Fill In The Blank)', label_en: 'Fill In The Blank' },
    { id: 'word_order', label_ar: '🧩 ترتيب الكلمات (Word Reordering)', label_en: 'Word Reordering' },
  ];

  const filteredQuestions = grammarQuizData.filter(q => 
    activeTechnique === 'all' || q.type === activeTechnique
  );

  const currentQuestion = filteredQuestions[currentIndex] || filteredQuestions[0];

  const playSound = (type) => {
    if (typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'correct') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.setValueAtTime(110, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      }
    } catch (e) {}
  };

  const handleSelectOption = (option) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);

    if (option === currentQuestion.correct_answer) {
      playSound('correct');
      setScore(prev => prev + 1);
      setStreak(prev => prev + 1);
    } else {
      playSound('wrong');
      setStreak(0);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < filteredQuestions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setStreak(0);
    setIsAnswered(false);
    setQuizFinished(false);
  };

  return (
    <div className="min-h-screen pb-20 bg-theme-main text-theme-main flex flex-col">
      <Navbar />

      <main className={`flex-1 w-full max-w-3xl mx-auto px-4 py-6 space-y-6 ${
        isRtl ? 'lg:mr-72' : 'lg:ml-72'
      } ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
        
        {/* Banner Header */}
        <div className={`rounded-2xl p-5 border shadow-xl flex flex-wrap items-center justify-between gap-3 ${
          isDark ? 'bg-slate-800/90 border-slate-700/80' : 'bg-white border-slate-200'
        }`}>
          <div>
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider block">
              🎮 Romanian Grammar Quiz Game (تقنيات ممتعة)
            </span>
            <h1 className="text-xl font-extrabold">
              تحدي وتدريبات قواعد اللغة الرومانية
            </h1>
          </div>

          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="flex items-center space-x-1 space-x-reverse px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-black">
              <Flame className="w-4 h-4 fill-amber-400" />
              <span>{streak} Streak</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-black">
              🏆 {score} / {filteredQuestions.length}
            </div>
          </div>
        </div>

        {/* Technique Mode Selector Chips */}
        <div className="flex items-center space-x-2 space-x-reverse overflow-x-auto pb-1 no-scrollbar">
          {techniques.map((t) => {
            const isActive = activeTechnique === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  setActiveTechnique(t.id);
                  handleRestartQuiz();
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                  isActive 
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30' 
                    : isDark ? 'bg-slate-800/80 text-slate-400 border border-slate-700/60 hover:text-white' : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900 shadow-sm'
                }`}
              >
                {t.label_ar}
              </button>
            );
          })}
        </div>

        {!quizFinished && currentQuestion ? (
          <div className={`rounded-2xl p-6 border shadow-2xl space-y-6 ${
            isDark ? 'bg-slate-800/90 border-slate-700/80' : 'bg-white border-slate-200'
          }`}>
            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-400">
                <span>السؤال {currentIndex + 1} من {filteredQuestions.length} ({currentQuestion.type})</span>
                <span>{Math.round(((currentIndex + 1) / filteredQuestions.length) * 100)}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-700/40 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-rose-600 transition-all duration-300" 
                  style={{ width: `${((currentIndex + 1) / filteredQuestions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Text Badge */}
            <div className="space-y-2">
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase">
                {currentQuestion.type === 'fill_in_blank' ? '✍️ أكمل الفراغ (Fill in Blank)' : currentQuestion.type === 'word_order' ? '🧩 ترتيب الكلمات (Word Reorder)' : '🎯 اختيارات (Multiple Choice)'}
              </span>
              <h2 className="text-lg font-black text-theme-main leading-relaxed">
                {currentQuestion.question_ro}
              </h2>
              <p className="text-xs font-bold text-amber-500 text-right">
                🇸🇦 {currentQuestion.question_ar}
              </p>
            </div>

            {/* Options List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQuestion.options.map((option, idx) => {
                let btnStyle = isDark 
                  ? 'bg-slate-900 border-slate-700 text-slate-200 hover:border-amber-400' 
                  : 'bg-slate-50 border-slate-200 text-slate-900 hover:border-amber-400 shadow-sm';

                if (isAnswered) {
                  if (option === currentQuestion.correct_answer) {
                    btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-black';
                  } else if (option === selectedOption) {
                    btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-400 font-black';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(option)}
                    disabled={isAnswered}
                    className={`p-4 rounded-2xl border text-right font-bold text-xs sm:text-sm transition-all flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{option}</span>
                    {isAnswered && option === currentQuestion.correct_answer && (
                      <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                    )}
                    {isAnswered && selectedOption === option && option !== currentQuestion.correct_answer && (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation & Next Button */}
            {isAnswered && (
              <div className="space-y-4 border-t border-slate-700/60 pt-4">
                <div className={`p-4 rounded-xl border text-xs space-y-1 ${
                  selectedOption === currentQuestion.correct_answer 
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                }`}>
                  <p className="font-black flex items-center space-x-1.5 space-x-reverse">
                    <Sparkles className="w-4 h-4" />
                    <span>توضيح القاعدة (Grammar Explanation):</span>
                  </p>
                  <p className="text-slate-300 font-medium leading-relaxed">
                    {currentQuestion.explanation_ar}
                  </p>
                </div>

                <button
                  onClick={handleNextQuestion}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-rose-600 hover:opacity-95 text-white font-extrabold rounded-2xl text-sm shadow-xl transition-all flex items-center justify-center space-x-2 space-x-reverse"
                >
                  <span>{currentIndex + 1 < filteredQuestions.length ? 'السؤال التالي ➔' : 'عرض النتيجة النهائية 🏆'}</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Final Results Card */
          <div className={`rounded-2xl p-8 border shadow-2xl text-center space-y-6 ${
            isDark ? 'bg-slate-800/90 border-slate-700/80' : 'bg-white border-slate-200'
          }`}>
            <div className="w-20 h-20 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border-2 border-amber-500/40 shadow-inner">
              <Trophy className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black">أحسنت! أكملت تحدي القواعد الرومانية 🎉</h2>
              <p className="text-sm font-bold text-amber-400">
                حصلت على {score} من أصل {filteredQuestions.length} إجابات صحيحة!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <button
                onClick={handleRestartQuiz}
                className="w-full sm:w-auto px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-extrabold rounded-xl text-xs flex items-center justify-center space-x-2 space-x-reverse shadow transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>إعادة التحدي مرة أخرى</span>
              </button>

              <Link
                href="/grammar"
                className="w-full sm:w-auto px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-extrabold rounded-xl text-xs flex items-center justify-center space-x-2 space-x-reverse shadow transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                <span>مراجعة القواعد والدروس 📚</span>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function GrammarQuizPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading Grammar Quiz...</div>}>
      <GrammarQuizContent />
    </Suspense>
  );
}
