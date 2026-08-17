'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { 
  Volume2, 
  RotateCcw, 
  Trophy, 
  CheckCircle, 
  XCircle, 
  Sparkles, 
  Gamepad2, 
  Zap, 
  Flame, 
  Timer, 
  Star
} from 'lucide-react';
import alphabetData from '../../data/romanian_alphabet.json';
import Navbar from '../../components/Navbar';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { shuffleArray, triggerConfetti, playVictorySound, playOptionFeedbackSound } from '../../utils/quizUtils';
import { speakText as speakTTS, stopSpeech } from '../../utils/speechHelper';

function AlphabetQuizContent() {
  const { theme } = useTheme();
  const { appLang, strings, isRtl } = useLanguage();
  const isDark = theme === 'dark';

  const [gameMode, setGameMode] = useState('audio'); // 'audio', 'special', 'speed'
  const [questionCount, setQuestionCount] = useState(0);
  const [score, setScore] = useState(0);
  const [currentLetter, setCurrentLetter] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isFinished, setIsFinished] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [speedTimeLeft, setSpeedTimeLeft] = useState(30);

  const speedTimerRef = useRef(null);

  const TOTAL_QUESTIONS = gameMode === 'speed' ? 99 : 10;

  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  useEffect(() => {
    stopSpeech();
  }, [gameMode, questionCount, isFinished]);

  useEffect(() => {
    const savedBest = localStorage.getItem('alphabet_quiz_best');
    if (savedBest) setBestScore(parseInt(savedBest));
  }, []);

  useEffect(() => {
    restartGame();
  }, [gameMode]);

  useEffect(() => {
    if (gameMode === 'speed' && !isFinished) {
      if (speedTimeLeft <= 0) {
        setIsFinished(true);
        return;
      }
      speedTimerRef.current = setTimeout(() => {
        setSpeedTimeLeft(prev => prev - 1);
      }, 1000);
    }
    return () => {
      if (speedTimerRef.current) clearTimeout(speedTimerRef.current);
    };
  }, [speedTimeLeft, isFinished, gameMode]);

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
    let pool = alphabetData;
    if (gameMode === 'special') {
      pool = alphabetData.filter(item => item.category.startsWith('special'));
    }

    if ((gameMode !== 'speed' && questionCount >= TOTAL_QUESTIONS) || pool.length === 0) {
      finishGame();
      return;
    }

    const randomIdx = Math.floor(Math.random() * pool.length);
    const correctLetter = pool[randomIdx];

    let wrongOptions = [];
    while (wrongOptions.length < 3) {
      const wrongIdx = Math.floor(Math.random() * alphabetData.length);
      const wrongItem = alphabetData[wrongIdx];
      if (wrongItem.letter !== correctLetter.letter && !wrongOptions.some(w => w.letter === wrongItem.letter)) {
        wrongOptions.push(wrongItem);
      }
    }

    const allOptions = shuffleArray([correctLetter, ...wrongOptions]);

    setCurrentLetter(correctLetter);
    setOptions(allOptions);
    setSelectedOption(null);
    setQuestionCount(prev => prev + 1);

    if (gameMode === 'audio') {
      setTimeout(() => {
        speakAudio(`${correctLetter.letter}. ${correctLetter.example_word_ro}.`);
      }, 300);
    }
  };

  const finishGame = () => {
    setIsFinished(true);
    if (score > bestScore || score >= 7) {
      if (score > bestScore) {
        setBestScore(score);
        localStorage.setItem('alphabet_quiz_best', score.toString());
      }
      triggerConfetti();
      playVictorySound();
    }
  };

  const speakAudio = (text) => {
    speakTTS(text, 'ro', 0.8);
  };

  const handleSelect = (item) => {
    if (selectedOption) return;

    setSelectedOption(item);
    if (item.letter === currentLetter.letter) {
      playSoundEffect('correct');
      setScore(prev => {
        const newScore = prev + 1;
        if (newScore > bestScore) {
          setBestScore(newScore);
          localStorage.setItem('alphabet_quiz_best', newScore.toString());
        }
        return newScore;
      });
      setStreak(prev => prev + 1);
    } else {
      playSoundEffect('wrong');
      setStreak(0);
    }

    setTimeout(() => {
      generateNewQuestion();
    }, 1100);
  };

  const restartGame = () => {
    setQuestionCount(0);
    setScore(0);
    setStreak(0);
    setIsFinished(false);
    setSpeedTimeLeft(30);
    generateNewQuestion();
  };

  if (isFinished) {
    const percentage = Math.round((score / Math.max(questionCount, 1)) * 100);

    return (
      <div className="min-h-screen pb-20 bg-theme-main text-theme-main flex flex-col">
        <Navbar />

        <main className={`flex-1 max-w-lg mx-auto w-full px-4 py-8 space-y-6 ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
          <div className={`rounded-2xl p-6 border shadow-xl text-center space-y-6 ${isDark ? 'bg-slate-800/90 border-slate-700/80' : 'bg-white border-slate-200'}`}>
            <div className="w-24 h-24 rounded-full mx-auto bg-amber-500/20 text-amber-400 flex items-center justify-center relative">
              <Trophy className="w-12 h-12" />
              <Sparkles className="w-6 h-6 text-amber-300 absolute top-2 right-2 animate-bounce" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold">{strings.quizFinished} 🎉</h2>
              <p className="text-xs text-theme-sub">
                {gameMode === 'audio' ? (appLang === 'ar' ? '🎧 سماع الحروف والكلمات' : '🎧 Audio Pronunciation') : gameMode === 'special' ? '🔤 Ă, Â, Î, Ș, Ț Special Letters' : '⚡ 30-Second Challenge'}
              </p>
            </div>

            <div className={`p-6 rounded-2xl border-2 space-y-2 ${isDark ? 'bg-slate-900/90 border-amber-500' : 'bg-slate-50 border-amber-500'}`}>
              <p className="text-4xl font-black text-amber-400">{score} {appLang === 'ar' ? 'إجابات صحيحة' : appLang === 'en' ? 'Correct' : 'Corecte'}</p>
              <p className="text-xs font-bold text-theme-sub">{strings.score}: {percentage}%</p>
              <p className="text-xs font-bold text-emerald-400">
                🏆 Best Score: {bestScore}
              </p>
            </div>

            <div className="space-y-2">
              <button
                onClick={restartGame}
                className="w-full py-3.5 bg-gradient-to-r from-rose-600 to-amber-600 hover:opacity-95 text-white font-bold rounded-xl flex items-center justify-center space-x-2 space-x-reverse shadow-lg shadow-rose-600/30 text-sm transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>إعادة اللعب 🎮</span>
              </button>

              <Link
                href="/alphabet"
                className={`block w-full py-3 font-bold rounded-xl text-xs transition-colors ${isDark ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'}`}
              >
                العودة لجدول الأبجدية
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!currentLetter) return null;

  return (
    <div className="min-h-screen pb-20 bg-theme-main text-theme-main flex flex-col">
      <Navbar />

      <main className={`flex-1 max-w-lg mx-auto w-full px-4 py-6 space-y-5 ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
        {/* Game Mode Switcher Chips */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <button
            onClick={() => setGameMode('audio')}
            className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
              gameMode === 'audio' 
                ? 'bg-rose-600 text-white border-rose-600 shadow' 
                : isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
            }`}
          >
            🎧 الصوت والكلمة
          </button>
          
          <button
            onClick={() => setGameMode('special')}
            className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
              gameMode === 'special' 
                ? 'bg-amber-600 text-white border-amber-600 shadow' 
                : isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
            }`}
          >
            🔤 الحروف الخاصة
          </button>

          <button
            onClick={() => setGameMode('speed')}
            className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
              gameMode === 'speed' 
                ? 'bg-emerald-600 text-white border-emerald-600 shadow' 
                : isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
            }`}
          >
            ⚡ سرعة 30 ثانية
          </button>
        </div>

        {/* Status Dashboard: Streak, Timer, Score */}
        <div className={`flex items-center justify-between p-3 rounded-2xl border text-xs font-bold ${
          isDark ? 'bg-slate-800/80 border-slate-700/60' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          {gameMode === 'speed' ? (
            <div className="flex items-center space-x-1.5 space-x-reverse text-rose-500 font-extrabold animate-pulse">
              <Timer className="w-4 h-4" />
              <span>{speedTimeLeft}s</span>
            </div>
          ) : (
            <span className="text-theme-sub">
              {strings.question} {questionCount} / {TOTAL_QUESTIONS}
            </span>
          )}

          <div className="flex items-center space-x-1 space-x-reverse text-amber-400 bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/20">
            <Flame className="w-4 h-4" />
            <span>Streak: {streak} 🔥</span>
          </div>

          <span className="text-emerald-400">{strings.score}: {score}</span>
        </div>

        {/* Main Interactive Play Card */}
        <div className={`rounded-2xl p-6 border shadow-xl text-center space-y-4 ${
          isDark ? 'bg-slate-800/90 border-slate-700/80' : 'bg-white border-slate-200'
        }`}>
          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
            🎮 {gameMode === 'audio' ? 'استمع للصوت واختر الحرف المناسب' : gameMode === 'special' ? 'خبير الحروف الرومانية الخاصة (Ă, Â, Î, Ș, Ț)' : 'اختر بأسرع وقت ممكن!'}
          </span>

          {gameMode === 'audio' ? (
            <button
              onClick={() => speakAudio(`${currentLetter.letter}. ${currentLetter.example_word_ro}.`)}
              className="w-24 h-24 rounded-3xl mx-auto bg-gradient-to-tr from-rose-600 to-amber-500 hover:scale-105 transition-transform flex flex-col items-center justify-center text-white shadow-xl shadow-rose-600/30 group"
            >
              <Volume2 className="w-10 h-10 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold mt-1">اضغط للاستماع 🔊</span>
            </button>
          ) : (
            <div className="w-24 h-24 rounded-3xl mx-auto bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-white text-5xl font-black shadow-xl">
              {currentLetter.letter}
            </div>
          )}

          <div className="space-y-1">
            <h2 className="text-base font-bold">
              {gameMode === 'audio' ? 'ما هو الحرف المسموع؟' : `ما هي الكلمة والمثال للحرف (${currentLetter.letter})؟`}
            </h2>
            <p className="text-xs text-amber-400 font-semibold">
              🇸🇦 {currentLetter.pronunciation_ar}
            </p>
          </div>
        </div>

        {/* Multiple Choice Options Grid */}
        <div className="grid grid-cols-2 gap-3">
          {options.map((item, idx) => {
            let btnStyle = isDark 
              ? 'bg-slate-800/90 border-slate-700/80 text-white hover:border-slate-500' 
              : 'bg-white border-slate-200 text-slate-900 hover:border-slate-400 shadow-sm';

            if (selectedOption) {
              if (item.letter === currentLetter.letter) {
                btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-extrabold';
              } else if (item.letter === selectedOption.letter) {
                btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-400 font-extrabold';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(item)}
                disabled={selectedOption !== null}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center space-y-1 ${btnStyle}`}
              >
                <span className="text-3xl font-black">{item.letter}</span>
                <span className="text-xs font-bold text-emerald-400">{item.example_word_ro}</span>
                <span className="text-[10px] text-theme-sub">🇸🇦 {item.example_translation_ar}</span>

                {selectedOption && item.letter === currentLetter.letter && (
                  <CheckCircle className="w-5 h-5 text-emerald-400 mt-1" />
                )}
                {selectedOption === item && item.letter !== currentLetter.letter && (
                  <XCircle className="w-5 h-5 text-rose-400 mt-1" />
                )}
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default function AlphabetQuizPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading Alphabet Quiz...</div>}>
      <AlphabetQuizContent />
    </Suspense>
  );
}
