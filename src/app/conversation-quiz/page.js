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
  Flame, 
  MessageSquare,
  Star
} from 'lucide-react';
import conversationsData from '../../data/romanian_conversations.json';
import Navbar from '../../components/Navbar';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

function ConversationQuizContent() {
  const { theme } = useTheme();
  const { appLang, strings, isRtl } = useLanguage();
  const isDark = theme === 'dark';

  const [questionCount, setQuestionCount] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [currentScenario, setCurrentScenario] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isFinished, setIsFinished] = useState(false);

  const TOTAL_QUESTIONS = 5;

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

    const randomConvIdx = Math.floor(Math.random() * conversationsData.length);
    const conv = conversationsData[randomConvIdx];
    
    // Pick first line as prompt, second line as correct answer
    const promptLine = conv.dialogue[0];
    const correctLine = conv.dialogue[1];

    let wrongOptions = [];
    while (wrongOptions.length < 3) {
      const otherConvIdx = Math.floor(Math.random() * conversationsData.length);
      const otherConv = conversationsData[otherConvIdx];
      const randomLineIdx = Math.floor(Math.random() * otherConv.dialogue.length);
      const wrongText = otherConv.dialogue[randomLineIdx].text_ro;

      if (wrongText !== correctLine.text_ro && !wrongOptions.some(w => w.text_ro === wrongText)) {
        wrongOptions.push(otherConv.dialogue[randomLineIdx]);
      }
    }

    let allOptions = [correctLine, ...wrongOptions];
    allOptions.sort(() => Math.random() - 0.5);

    setCurrentScenario({ conv, promptLine, correctLine });
    setOptions(allOptions);
    setSelectedOption(null);
    setQuestionCount(prev => prev + 1);

    setTimeout(() => {
      speakAudio(promptLine.text_ro);
    }, 400);
  };

  const speakAudio = (text) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ro-RO';
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  };

  const handleSelect = (item) => {
    if (selectedOption) return;

    setSelectedOption(item);
    if (item.text_ro === currentScenario.correctLine.text_ro) {
      playSoundEffect('correct');
      setScore(prev => prev + 1);
      setStreak(prev => prev + 1);
    } else {
      playSoundEffect('wrong');
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
              <p className="text-xs text-theme-sub">{strings.conversationGameTitle}</p>
            </div>

            <div className={`p-6 rounded-2xl border-2 space-y-2 ${isDark ? 'bg-slate-900/90 border-amber-500' : 'bg-slate-50 border-amber-500'}`}>
              <p className="text-4xl font-black text-amber-400">{score} / {TOTAL_QUESTIONS}</p>
              <p className="text-xs font-bold text-theme-sub">{strings.score}: {percentage}%</p>
              <p className="text-xs font-bold text-emerald-400">
                {percentage >= 80 ? '🌟 ممتااااز! أنقنت محادثات الحياة اليومية والمقابلة!' : '👍 أداء رائع! واصل الاستماع والتمرين!'}
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
                href="/conversations"
                className={`block w-full py-3 font-bold rounded-xl text-xs transition-colors ${isDark ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'}`}
              >
                العودة لجدول المحادثات
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!currentScenario) return null;

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

        {/* Conversation Play Card */}
        <div className={`rounded-2xl p-6 border shadow-xl space-y-4 ${isDark ? 'bg-slate-800/90 border-slate-700/80' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between">
            <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
              🗣️ {appLang === 'ar' ? currentScenario.conv.title_ar : currentScenario.conv.title_en}
            </span>

            <button
              onClick={() => speakAudio(currentScenario.promptLine.text_ro)}
              className="p-2 bg-rose-500/15 text-rose-400 hover:bg-rose-500/25 rounded-xl transition-colors text-xs font-bold flex items-center space-x-1 space-x-reverse"
            >
              <Volume2 className="w-4 h-4" />
              <span>استمع 🔊</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 text-white space-y-2 border border-slate-700/80">
            <span className="text-[10px] font-bold text-rose-400 block">
              🗣️ {currentScenario.promptLine.speaker_ro}:
            </span>
            <p className="text-base sm:text-lg font-bold leading-relaxed">
              "{currentScenario.promptLine.text_ro}"
            </p>
            <p className="text-xs text-rose-400 font-bold text-right">
              🇸🇦 {currentScenario.promptLine.text_ar}
            </p>
          </div>

          <p className="text-xs font-bold text-theme-sub text-center">
            {appLang === 'ar' ? 'ما هو الرد المناسب باللغة الرومانية؟' : 'What is the correct response in Romanian?'}
          </p>
        </div>

        {/* Options List */}
        <div className="space-y-3">
          {options.map((item, idx) => {
            let btnStyle = isDark 
              ? 'bg-slate-800/90 border-slate-700/80 text-white hover:border-slate-500' 
              : 'bg-white border-slate-200 text-slate-900 hover:border-slate-400 shadow-sm';

            if (selectedOption) {
              if (item.text_ro === currentScenario.correctLine.text_ro) {
                btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-extrabold';
              } else if (item.text_ro === selectedOption.text_ro) {
                btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-400 font-extrabold';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(item)}
                disabled={selectedOption !== null}
                className={`w-full p-4 rounded-2xl border-2 transition-all flex flex-col space-y-1 text-right ${btnStyle}`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-bold text-rose-500">🗣️ {item.speaker_ro}</span>
                  {selectedOption && item.text_ro === currentScenario.correctLine.text_ro && (
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  )}
                  {selectedOption === item && item.text_ro !== currentScenario.correctLine.text_ro && (
                    <XCircle className="w-5 h-5 text-rose-400" />
                  )}
                </div>

                <p className="text-sm font-bold leading-relaxed">{item.text_ro}</p>
                <p className="text-xs text-slate-400">🇸🇦 {item.text_ar}</p>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default function ConversationQuizPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading Conversation Quiz...</div>}>
      <ConversationQuizContent />
    </Suspense>
  );
}
