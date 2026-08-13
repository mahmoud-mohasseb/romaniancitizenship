'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  Volume2, 
  RotateCcw, 
  Trophy, 
  CheckCircle, 
  XCircle, 
  Sparkles, 
  Gamepad2, 
  ArrowLeft,
  Star
} from 'lucide-react';
import alphabetData from '../../data/romanian_alphabet.json';
import Navbar from '../../components/Navbar';
import { UI_STRINGS } from '../../utils/languageHelper';

function AlphabetQuizContent() {
  const searchParams = useSearchParams();
  const initialLang = searchParams.get('lang') || 'ar';

  const [appLang, setAppLang] = useState(initialLang);
  const strings = UI_STRINGS[appLang] || UI_STRINGS.ar;
  const isRtl = appLang === 'ar';

  const [questionCount, setQuestionCount] = useState(0);
  const [score, setScore] = useState(0);
  const [currentLetter, setCurrentLetter] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isFinished, setIsFinished] = useState(false);
  const [streak, setStreak] = useState(0);

  const TOTAL_QUESTIONS = 10;

  useEffect(() => {
    generateNewQuestion();
  }, []);

  const generateNewQuestion = () => {
    if (questionCount >= TOTAL_QUESTIONS) {
      setIsFinished(true);
      return;
    }

    const randomIdx = Math.floor(Math.random() * alphabetData.length);
    const correctLetter = alphabetData[randomIdx];

    let wrongOptions = [];
    while (wrongOptions.length < 3) {
      const wrongIdx = Math.floor(Math.random() * alphabetData.length);
      const wrongItem = alphabetData[wrongIdx];
      if (wrongItem.letter !== correctLetter.letter && !wrongOptions.some(w => w.letter === wrongItem.letter)) {
        wrongOptions.push(wrongItem);
      }
    }

    let allOptions = [correctLetter, ...wrongOptions];
    allOptions.sort(() => Math.random() - 0.5);

    setCurrentLetter(correctLetter);
    setOptions(allOptions);
    setSelectedOption(null);
    setQuestionCount(prev => prev + 1);

    setTimeout(() => {
      speakAudio(`${correctLetter.letter}. ${correctLetter.example_word_ro}.`);
    }, 400);
  };

  const speakAudio = (text) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ro-RO';
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  };

  const handleSelect = (item) => {
    if (selectedOption) return;

    setSelectedOption(item);
    if (item.letter === currentLetter.letter) {
      setScore(prev => prev + 1);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }

    setTimeout(() => {
      generateNewQuestion();
    }, 1300);
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
      <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col">
        <Navbar appLang={appLang} setAppLang={setAppLang} />

        <main className={`flex-1 max-w-lg mx-auto w-full px-4 py-8 space-y-6 ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
          <div className="bg-slate-800/90 rounded-2xl p-6 border border-slate-700/80 shadow-xl text-center space-y-6">
            <div className="w-20 h-20 rounded-full mx-auto bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Trophy className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-white">{strings.quizFinished}</h2>
              <p className="text-xs text-slate-400">{strings.alphabetGameTitle}</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/90 border-2 border-amber-500 space-y-2">
              <p className="text-4xl font-black text-amber-400">{score} / {TOTAL_QUESTIONS}</p>
              <p className="text-xs font-bold text-slate-300">{strings.score}: {percentage}%</p>
              <p className="text-xs font-bold text-emerald-400">
                {percentage >= 80 ? '🌟 ممتاز! أنقنت نطق الحروف الرومانية!' : '👍 أداء جيد! واصل التمرين واللعب!'}
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
                href={`/alphabet?lang=${appLang}`}
                className="block w-full py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold rounded-xl text-xs transition-colors"
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
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col">
      <Navbar appLang={appLang} setAppLang={setAppLang} />

      <main className={`flex-1 max-w-lg mx-auto w-full px-4 py-6 space-y-5 ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
        {/* Progress & Streak Bar */}
        <div className="flex items-center justify-between bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60 text-xs font-bold">
          <span className="text-slate-400">
            {strings.question} {questionCount} {strings.of} {TOTAL_QUESTIONS}
          </span>
          <div className="flex items-center space-x-1 space-x-reverse text-amber-400 bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/20">
            <Star className="w-4 h-4" />
            <span>Streak: {streak} 🔥</span>
          </div>
          <span className="text-emerald-400">{strings.score}: {score}</span>
        </div>

        {/* Audio Game Main Card */}
        <div className="bg-slate-800/90 rounded-2xl p-6 border border-slate-700/80 shadow-xl text-center space-y-5">
          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
            🎮 {appLang === 'ar' ? 'استمع للصوت واختر الحرف والكلمة الصحيحة' : 'Listen and pick the matching letter'}
          </span>

          <button
            onClick={() => speakAudio(`${currentLetter.letter}. ${currentLetter.example_word_ro}.`)}
            className="w-24 h-24 rounded-3xl mx-auto bg-gradient-to-tr from-rose-600 to-amber-500 hover:scale-105 transition-transform flex flex-col items-center justify-center text-white shadow-xl shadow-rose-600/30 group"
          >
            <Volume2 className="w-10 h-10 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold mt-1">اضغط للاستماع 🔊</span>
          </button>

          <div className="space-y-1">
            <h2 className="text-base font-bold text-white">
              {appLang === 'ar' ? 'ما هو الحرف المسموع؟' : 'Which letter did you hear?'}
            </h2>
            <p className="text-xs text-amber-400 font-semibold">
              🇸🇦 {currentLetter.pronunciation_ar}
            </p>
          </div>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-2 gap-3">
          {options.map((item, idx) => {
            let btnStyle = 'bg-slate-800/90 border-slate-700/80 text-white hover:border-slate-500';

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
                className={`p-5 rounded-2xl border-2 transition-all flex flex-col items-center justify-center space-y-1 ${btnStyle}`}
              >
                <span className="text-3xl font-black">{item.letter}</span>
                <span className="text-xs font-bold text-slate-300">{item.example_word_ro}</span>
                <span className="text-[10px] text-slate-400">🇸🇦 {item.example_translation_ar}</span>

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
