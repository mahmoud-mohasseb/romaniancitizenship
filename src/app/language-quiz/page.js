'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { 
  RotateCcw, 
  Trophy, 
  CheckCircle, 
  XCircle, 
  Sparkles, 
  Gamepad2, 
  Flame, 
  Timer, 
  BookOpen,
  PartyPopper,
  Zap,
  Award
} from 'lucide-react';
import quizData from '../../data/romanian_language_quiz.json';
import Navbar from '../../components/Navbar';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { shuffleArray, triggerConfetti, playVictorySound, playOptionFeedbackSound } from '../../utils/quizUtils';

function LanguageQuizContent() {
  const { theme } = useTheme();
  const { appLang, strings, isRtl } = useLanguage();
  const isDark = theme === 'dark';

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [currentQ, setCurrentQ] = useState(null);
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isFinished, setIsFinished] = useState(false);
  const [isNewHighScore, setIsNewHighScore] = useState(false);

  const TOTAL_QUESTIONS = quizData.length;

  useEffect(() => {
    const saved = localStorage.getItem('language_quiz_best');
    if (saved) setBestScore(parseInt(saved, 10));
    loadQuestion(0);
  }, []);

  const loadQuestion = (index) => {
    if (index >= TOTAL_QUESTIONS) {
      finishGame(score);
      return;
    }
    const q = quizData[index];
    setCurrentQ(q);
    if (q && q.options) {
      setShuffledOptions(shuffleArray(q.options));
    }
    setSelectedOption(null);
  };

  const finishGame = (finalScore) => {
    setIsFinished(true);
    const saved = parseInt(localStorage.getItem('language_quiz_best') || '0', 10);
    const isNewBest = finalScore > saved;
    setIsNewHighScore(isNewBest);

    if (isNewBest) {
      setBestScore(finalScore);
      localStorage.setItem('language_quiz_best', finalScore.toString());
    }

    if (isNewBest || finalScore >= Math.ceil(TOTAL_QUESTIONS * 0.7)) {
      triggerConfetti();
      playVictorySound();
    }
  };

  const handleSelect = (option) => {
    if (selectedOption) return;

    setSelectedOption(option);
    const isCorrect = option === currentQ.correct_answer;
    playOptionFeedbackSound(isCorrect);

    let newScore = score;
    if (isCorrect) {
      newScore = score + 1;
      setScore(newScore);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }

    setTimeout(() => {
      const nextIdx = currentIndex + 1;
      if (nextIdx >= TOTAL_QUESTIONS) {
        finishGame(newScore);
      } else {
        setCurrentIndex(nextIdx);
        loadQuestion(nextIdx);
      }
    }, 1100);
  };

  const restartGame = () => {
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setIsFinished(false);
    setIsNewHighScore(false);
    loadQuestion(0);
  };

  if (isFinished) {
    const percentage = Math.round((score / TOTAL_QUESTIONS) * 100);
    return (
      <div className="min-h-screen pb-20 bg-theme-main text-theme-main flex flex-col font-cairo">
        <Navbar />

        <main className={`flex-1 max-w-lg mx-auto w-full px-4 py-8 space-y-6 animate-scale-in ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
          <div className={`rounded-3xl p-7 border shadow-2xl text-center space-y-6 relative overflow-hidden ${isDark ? 'bg-slate-800/90 border-slate-700/80' : 'bg-white border-slate-200'}`}>
            {isNewHighScore && (
              <div className="bg-gradient-to-r from-amber-500 via-rose-500 to-amber-600 text-white text-xs font-black py-2 px-6 rounded-full inline-flex items-center space-x-2 space-x-reverse shadow-xl animate-bounce-subtle">
                <PartyPopper className="w-4 h-4" />
                <span>🏆 NEW RECORD HIGH SCORE! 🎉</span>
              </div>
            )}

            <div className="w-28 h-28 rounded-full mx-auto bg-gradient-to-tr from-emerald-500 via-teal-500 to-amber-500 text-white flex items-center justify-center relative border-4 border-amber-300 shadow-2xl animate-pulse-glow">
              <Trophy className="w-14 h-14 animate-bounce-subtle" />
              <Sparkles className="w-7 h-7 text-amber-300 absolute top-2 right-2 animate-bounce" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-black">{strings.quizFinished} 🎉</h2>
              <p className="text-xs text-theme-sub font-bold">تحدي مفردات وقواعد اللغة الرومانية للمقابلة الشفهية</p>
            </div>

            <div className={`p-6 rounded-2xl border-2 space-y-2 ${isDark ? 'bg-slate-900/90 border-emerald-500' : 'bg-slate-50 border-emerald-500'}`}>
              <p className="text-4xl font-black text-emerald-400">{score} / {TOTAL_QUESTIONS}</p>
              <p className="text-xs font-extrabold text-theme-sub">{strings.score}: {percentage}% | 🏆 Best: {bestScore}</p>
              <p className="text-xs font-black text-emerald-400 pt-1">
                {percentage >= 80 ? '🌟 ممتاز جداً! أتقنت المفردات الأساسية للغة الرومانية!' : '👍 أداء جيد! واصل التمرين والمذاكرة!'}
              </p>
            </div>

            <div className="space-y-2.5">
              <button
                onClick={restartGame}
                className="w-full py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:opacity-95 text-white font-black rounded-2xl flex items-center justify-center space-x-2 space-x-reverse shadow-xl shadow-emerald-600/30 text-sm transition-all"
              >
                <RotateCcw className="w-5 h-5" />
                <span>إعادة الاختبار الخاطف 🎮</span>
              </button>

              <Link
                href="/"
                className={`block w-full py-3.5 font-extrabold rounded-2xl text-xs transition-colors border text-center ${isDark ? 'bg-slate-700 hover:bg-slate-600 text-slate-200 border-slate-600' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'}`}
              >
                {strings.backHome}
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!currentQ) return null;

  return (
    <div className="min-h-screen pb-20 bg-theme-main text-theme-main flex flex-col font-cairo">
      <Navbar />

      <main className={`flex-1 max-w-lg mx-auto w-full px-4 py-6 space-y-5 ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
        {/* Progress & Streak Header */}
        <div className={`flex items-center justify-between p-3.5 rounded-2xl border text-xs font-bold ${isDark ? 'bg-slate-800/80 border-slate-700/60' : 'bg-white border-slate-200 shadow-sm'}`}>
          <span className="text-theme-sub">
            {strings.question} {currentIndex + 1} {strings.of} {TOTAL_QUESTIONS}
          </span>
          <div className="flex items-center space-x-1 space-x-reverse text-amber-400 bg-amber-500/15 px-3 py-1 rounded-xl border border-amber-500/30 animate-pulse-glow">
            <Flame className="w-4 h-4 fill-current animate-bounce-subtle" />
            <span>Streak: {streak} 🔥</span>
          </div>
          <span className="text-emerald-400 font-black">🏆 Best: {bestScore}</span>
        </div>

        {/* Question Card */}
        <div className={`rounded-3xl p-6 border shadow-2xl space-y-4 ${isDark ? 'bg-slate-800/90 border-slate-700/80' : 'bg-white border-slate-200'}`}>
          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            🧩 {appLang === 'ar' ? 'اختبار المفردات والجمل' : 'Language Vocabulary Quiz'}
          </span>

          <div className="space-y-2">
            <h2 className="text-xl font-black leading-relaxed text-theme-main">
              {currentQ.question_ro}
            </h2>
            <p className="text-sm font-black text-rose-500 text-right">
              🇸🇦 {currentQ.question_ar}
            </p>
            <p className="text-xs font-bold text-slate-400">
              🇬🇧 {currentQ.question_en}
            </p>
          </div>
        </div>

        {/* Shuffled Options Grid */}
        <div className="space-y-3">
          {shuffledOptions.map((option, idx) => {
            let btnStyle = isDark 
              ? 'bg-slate-800/90 border-slate-700/80 text-white hover:border-slate-500' 
              : 'bg-white border-slate-200 text-slate-900 hover:border-slate-400 shadow-sm';

            if (selectedOption) {
              if (option === currentQ.correct_answer) {
                btnStyle = 'bg-emerald-600 text-white border-emerald-600 font-black scale-[1.02] shadow-lg shadow-emerald-600/40 animate-quiz-pop';
              } else if (option === selectedOption) {
                btnStyle = 'bg-rose-600 text-white border-rose-600 font-black animate-quiz-shake';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(option)}
                disabled={selectedOption !== null}
                className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between text-right font-bold text-xs sm:text-sm ${btnStyle}`}
              >
                <span>{option}</span>
                {selectedOption && option === currentQ.correct_answer && (
                  <CheckCircle className="w-5 h-5 text-white shrink-0" />
                )}
                {selectedOption === option && option !== currentQ.correct_answer && (
                  <XCircle className="w-5 h-5 text-white shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default function LanguageQuizPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400 font-bold">Loading Language Quiz...</div>}>
      <LanguageQuizContent />
    </Suspense>
  );
}
