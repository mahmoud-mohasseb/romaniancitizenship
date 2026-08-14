'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
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
  BookOpen 
} from 'lucide-react';
import quizData from '../../data/romanian_language_quiz.json';
import Navbar from '../../components/Navbar';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

function LanguageQuizContent() {
  const { theme } = useTheme();
  const { appLang, strings, isRtl } = useLanguage();
  const isDark = theme === 'dark';

  const [questionCount, setQuestionCount] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [currentQ, setCurrentQ] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isFinished, setIsFinished] = useState(false);

  const TOTAL_QUESTIONS = quizData.length;

  useEffect(() => {
    generateNewQuestion();
  }, []);

  const playSoundEffect = (type) => {
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

  const generateNewQuestion = () => {
    if (questionCount >= TOTAL_QUESTIONS) {
      setIsFinished(true);
      return;
    }

    const q = quizData[questionCount];
    setCurrentQ(q);
    setSelectedOption(null);
    setQuestionCount(prev => prev + 1);
  };

  const handleSelect = (option) => {
    if (selectedOption) return;

    setSelectedOption(option);
    if (option === currentQ.correct_answer) {
      playSoundEffect('correct');
      setScore(prev => prev + 1);
      setStreak(prev => prev + 1);
    } else {
      playSoundEffect('wrong');
      setStreak(0);
    }

    setTimeout(() => {
      generateNewQuestion();
    }, 1200);
  };

  const restartGame = () => {
    setQuestionCount(0);
    setScore(0);
    setStreak(0);
    setIsFinished(false);
    generateNewQuestion();
  };

  if (isFinished) {
    const percentage = Math.round((score / TOTAL_QUESTIONS) * 100);
    return (
      <div className="min-h-screen pb-20 bg-theme-main text-theme-main flex flex-col">
        <Navbar />

        <main className={`flex-1 max-w-lg mx-auto w-full px-4 py-8 space-y-6 ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
          <div className={`rounded-2xl p-6 border shadow-xl text-center space-y-6 ${isDark ? 'bg-slate-800/90 border-slate-700/80' : 'bg-white border-slate-200'}`}>
            <div className="w-24 h-24 rounded-full mx-auto bg-emerald-500/20 text-emerald-400 flex items-center justify-center relative">
              <Trophy className="w-12 h-12" />
              <Sparkles className="w-6 h-6 text-amber-300 absolute top-2 right-2 animate-bounce" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold">{strings.quizFinished} 🎉</h2>
              <p className="text-xs text-theme-sub">اختبار مفردات وقواعد اللغة الرومانية</p>
            </div>

            <div className={`p-6 rounded-2xl border-2 space-y-2 ${isDark ? 'bg-slate-900/90 border-emerald-500' : 'bg-slate-50 border-emerald-500'}`}>
              <p className="text-4xl font-black text-emerald-400">{score} / {TOTAL_QUESTIONS}</p>
              <p className="text-xs font-bold text-theme-sub">{strings.score}: {percentage}%</p>
              <p className="text-xs font-bold text-emerald-400">
                {percentage >= 80 ? '🌟 أنقنت مفردات اللغة الرومانية الأساسية!' : '👍 أداء جيد! واصل التمرين والمذاكرة!'}
              </p>
            </div>

            <div className="space-y-2">
              <button
                onClick={restartGame}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-bold rounded-xl flex items-center justify-center space-x-2 space-x-reverse shadow-lg shadow-emerald-600/30 text-sm transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>إعادة الاختبار 🎮</span>
              </button>

              <Link
                href="/"
                className={`block w-full py-3 font-bold rounded-xl text-xs transition-colors ${isDark ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'}`}
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
    <div className="min-h-screen pb-20 bg-theme-main text-theme-main flex flex-col">
      <Navbar />

      <main className={`flex-1 max-w-lg mx-auto w-full px-4 py-6 space-y-5 ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
        {/* Progress & Streak Bar */}
        <div className={`flex items-center justify-between p-3 rounded-2xl border text-xs font-bold ${isDark ? 'bg-slate-800/80 border-slate-700/60' : 'bg-white border-slate-200 shadow-sm'}`}>
          <span className="text-theme-sub">
            {strings.question} {questionCount} {strings.of} {TOTAL_QUESTIONS}
          </span>
          <div className="flex items-center space-x-1 space-x-reverse text-amber-400 bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/20">
            <Flame className="w-4 h-4" />
            <span>Streak: {streak} 🔥</span>
          </div>
          <span className="text-emerald-400">{strings.score}: {score}</span>
        </div>

        {/* Question Card */}
        <div className={`rounded-2xl p-6 border shadow-xl space-y-4 ${isDark ? 'bg-slate-800/90 border-slate-700/80' : 'bg-white border-slate-200'}`}>
          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            🧩 {appLang === 'ar' ? 'اختبار مفردات وقواعد اللغة' : 'Language Quiz'}
          </span>

          <div className="space-y-2">
            <h2 className="text-xl font-bold leading-relaxed">
              {currentQ.question_ro}
            </h2>
            <p className="text-sm font-bold text-rose-500 text-right">
              🇸🇦 {currentQ.question_ar}
            </p>
            <p className="text-xs text-slate-400">
              🇬🇧 {currentQ.question_en}
            </p>
          </div>
        </div>

        {/* Options List */}
        <div className="space-y-3">
          {currentQ.options.map((option, idx) => {
            let btnStyle = isDark 
              ? 'bg-slate-800/90 border-slate-700/80 text-white hover:border-slate-500' 
              : 'bg-white border-slate-200 text-slate-900 hover:border-slate-400 shadow-sm';

            if (selectedOption) {
              if (option === currentQ.correct_answer) {
                btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-extrabold';
              } else if (option === selectedOption) {
                btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-400 font-extrabold';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(option)}
                disabled={selectedOption !== null}
                className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between text-right ${btnStyle}`}
              >
                <span className="text-sm font-bold">{option}</span>
                {selectedOption && option === currentQ.correct_answer && (
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                )}
                {selectedOption === option && option !== currentQ.correct_answer && (
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
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
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading Language Quiz...</div>}>
      <LanguageQuizContent />
    </Suspense>
  );
}
