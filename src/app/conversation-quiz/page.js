'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
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
  Star,
  PartyPopper
} from 'lucide-react';
import conversationsData from '../../data/romanian_conversations.json';
import Navbar from '../../components/Navbar';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { shuffleArray, triggerConfetti, playVictorySound, playOptionFeedbackSound } from '../../utils/quizUtils';

function ConversationQuizContent() {
  const { theme } = useTheme();
  const { appLang, strings, isRtl } = useLanguage();
  const isDark = theme === 'dark';

  const [questionCount, setQuestionCount] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [currentScenario, setCurrentScenario] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isFinished, setIsFinished] = useState(false);
  const [isNewHighScore, setIsNewHighScore] = useState(false);

  const TOTAL_QUESTIONS = 10;

  useEffect(() => {
    const saved = localStorage.getItem('conversation_quiz_best');
    if (saved) setBestScore(parseInt(saved, 10));
    generateNewQuestion(0);
  }, []);

  const generateNewQuestion = (nextCount = questionCount) => {
    if (nextCount >= TOTAL_QUESTIONS) {
      finishGame();
      return;
    }

    const randomConvIdx = Math.floor(Math.random() * conversationsData.length);
    const conv = conversationsData[randomConvIdx];
    
    // Pick any valid adjacent pair from dialogue (e.g. index 0 -> 1 or 2 -> 3)
    const maxStartIdx = Math.max(0, conv.dialogue.length - 2);
    const startIdx = Math.floor(Math.random() * (maxStartIdx + 1));

    const promptLine = conv.dialogue[startIdx];
    const correctLine = conv.dialogue[startIdx + 1] || conv.dialogue[1] || conv.dialogue[0];

    let wrongOptions = [];
    let attempts = 0;
    while (wrongOptions.length < 3 && attempts < 50) {
      attempts++;
      const otherConvIdx = Math.floor(Math.random() * conversationsData.length);
      const otherConv = conversationsData[otherConvIdx];
      const randomLineIdx = Math.floor(Math.random() * otherConv.dialogue.length);
      const candidate = otherConv.dialogue[randomLineIdx];

      if (candidate.text_ro !== correctLine.text_ro && !wrongOptions.some(w => w.text_ro === candidate.text_ro)) {
        wrongOptions.push(candidate);
      }
    }

    const allOptions = shuffleArray([correctLine, ...wrongOptions]);

    setCurrentScenario({ conv, promptLine, correctLine });
    setOptions(allOptions);
    setSelectedOption(null);
    setQuestionCount(nextCount + 1);

    setTimeout(() => {
      speakAudio(promptLine.text_ro);
    }, 400);
  };

  const finishGame = () => {
    setIsFinished(true);
    const saved = parseInt(localStorage.getItem('conversation_quiz_best') || '0', 10);
    if (score > saved || score >= Math.ceil(TOTAL_QUESTIONS * 0.7)) {
      setIsNewHighScore(score > saved);
      if (score > saved) {
        setBestScore(score);
        localStorage.setItem('conversation_quiz_best', score.toString());
      }
      triggerConfetti();
      playVictorySound();
    }
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
    const isCorrect = item.text_ro === currentScenario.correctLine.text_ro;
    playOptionFeedbackSound(isCorrect);

    let nextScore = score;
    if (isCorrect) {
      nextScore = score + 1;
      setScore(nextScore);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }

    setTimeout(() => {
      if (questionCount >= TOTAL_QUESTIONS) {
        finishGame();
      } else {
        generateNewQuestion(questionCount);
      }
    }, 1300);
  };

  const restartGame = () => {
    setQuestionCount(0);
    setScore(0);
    setStreak(0);
    setIsFinished(false);
    setIsNewHighScore(false);
    generateNewQuestion(0);
  };

  if (isFinished) {
    const percentage = Math.round((score / TOTAL_QUESTIONS) * 100);
    return (
      <div className="min-h-screen pb-20 bg-theme-main text-theme-main flex flex-col font-cairo">
        <Navbar />

        <main className={`flex-1 max-w-lg mx-auto w-full px-4 py-8 space-y-6 ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
          <div className={`rounded-2xl p-6 border shadow-xl text-center space-y-6 relative overflow-hidden ${isDark ? 'bg-slate-800/90 border-slate-700/80' : 'bg-white border-slate-200'}`}>
            {isNewHighScore && (
              <div className="bg-gradient-to-r from-amber-500 to-rose-600 text-white text-xs font-black py-1.5 px-6 rounded-full inline-flex items-center space-x-2 space-x-reverse shadow-lg animate-bounce-subtle">
                <PartyPopper className="w-4 h-4" />
                <span>🏆 NEW CONVERSATION HIGH SCORE! 🎉</span>
              </div>
            )}

            <div className="w-24 h-24 rounded-full mx-auto bg-gradient-to-tr from-amber-500 to-rose-500 text-white flex items-center justify-center relative border-4 border-amber-300 shadow-2xl animate-pulse-glow">
              <Trophy className="w-12 h-12 animate-bounce-subtle" />
              <Sparkles className="w-6 h-6 text-amber-300 absolute top-2 right-2 animate-bounce" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold">{strings.quizFinished} 🎉</h2>
              <p className="text-xs text-theme-sub">{strings.conversationGameTitle}</p>
            </div>

            <div className={`p-6 rounded-2xl border-2 space-y-2 ${isDark ? 'bg-slate-900/90 border-amber-500' : 'bg-slate-50 border-amber-500'}`}>
              <p className="text-4xl font-black text-amber-400">{score} / {TOTAL_QUESTIONS}</p>
              <p className="text-xs font-bold text-theme-sub">{strings.score}: {percentage}% | Best: {bestScore}</p>
              <p className="text-xs font-bold text-emerald-400">
                {percentage >= 80 ? '🌟 ممتااااز! أنقنت محادثات الحياة اليومية والمقابلة!' : '👍 أداء رائع! واصل الاستماع والتمرين!'}
              </p>
            </div>

            <div className="space-y-2">
              <button
                onClick={restartGame}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-rose-600 hover:opacity-95 text-white font-bold rounded-xl flex items-center justify-center space-x-2 space-x-reverse shadow-lg shadow-amber-600/30 text-sm transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>إعادة اللعبة 🎮</span>
              </button>

              <Link
                href="/conversations"
                className={`block w-full py-3 font-bold rounded-xl text-xs transition-colors ${isDark ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'}`}
              >
                مراجعة المحادثات والحوارات 💬
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!currentScenario) return null;

  return (
    <div className="min-h-screen pb-20 bg-theme-main text-theme-main flex flex-col font-cairo">
      <Navbar />

      <main className={`flex-1 max-w-lg mx-auto w-full px-4 py-6 space-y-5 ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
        {/* Header Bar */}
        <div className={`flex items-center justify-between p-3 rounded-2xl border text-xs font-bold ${isDark ? 'bg-slate-800/80 border-slate-700/60' : 'bg-white border-slate-200 shadow-sm'}`}>
          <span className="text-theme-sub">
            {strings.question} {questionCount} {strings.of} {TOTAL_QUESTIONS}
          </span>
          <div className="flex items-center space-x-1 space-x-reverse text-amber-400 bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/20">
            <Flame className="w-4 h-4" />
            <span>Streak: {streak} 🔥</span>
          </div>
          <span className="text-emerald-400">🏆 Best: {bestScore}</span>
        </div>

        {/* Conversation Context Box */}
        <div className={`rounded-2xl p-6 border shadow-xl space-y-4 ${isDark ? 'bg-slate-800/90 border-slate-700/80' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
            <span className="text-xs font-bold text-amber-400 flex items-center space-x-1 space-x-reverse">
              <MessageSquare className="w-4 h-4" />
              <span>{currentScenario.conv.title_ar}</span>
            </span>
            <button
              onClick={() => speakAudio(currentScenario.promptLine.text_ro)}
              className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 transition-all flex items-center space-x-1 space-x-reverse text-xs font-bold"
            >
              <Volume2 className="w-4 h-4" />
              <span>استماع</span>
            </button>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              {currentScenario.promptLine.speaker}:
            </span>
            <p className="text-lg font-black text-theme-main leading-relaxed">
              "{currentScenario.promptLine.text_ro}"
            </p>
            <p className="text-xs font-bold text-amber-400">
              🇸🇦 {currentScenario.promptLine.text_ar}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-700/60 text-xs font-bold text-emerald-400">
            ❓ {appLang === 'ar' ? 'ما هو الرد المناسب والرسمي باللغة الرومانية؟' : 'What is the appropriate Romanian reply?'}
          </div>
        </div>

        {/* Shuffled Options List */}
        <div className="space-y-3">
          {options.map((item, idx) => {
            let btnStyle = isDark 
              ? 'bg-slate-800/90 border-slate-700/80 text-white hover:border-slate-500' 
              : 'bg-white border-slate-200 text-slate-900 hover:border-slate-400 shadow-sm';

            if (selectedOption) {
              if (item.text_ro === currentScenario.correctLine.text_ro) {
                btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-extrabold scale-[1.02] shadow-lg shadow-emerald-500/30';
              } else if (item === selectedOption) {
                btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-400 font-extrabold animate-quiz-shake';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(item)}
                disabled={selectedOption !== null}
                className={`w-full p-4 rounded-2xl border-2 transition-all text-right space-y-1 ${btnStyle}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-bold">{item.speaker}:</span>
                  {selectedOption && item.text_ro === currentScenario.correctLine.text_ro && (
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                  {selectedOption === item && item.text_ro !== currentScenario.correctLine.text_ro && (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  )}
                </div>
                <p className="text-sm font-bold">{item.text_ro}</p>
                <p className="text-[11px] text-slate-400">🇸🇦 {item.text_ar}</p>
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
