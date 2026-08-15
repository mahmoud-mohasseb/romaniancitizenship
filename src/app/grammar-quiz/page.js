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
  Shuffle,
  PartyPopper,
  Star,
  Zap,
  Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import grammarQuizData from '../../data/romanian_grammar_quiz.json';
import Navbar from '../../components/Navbar';
import ImageModal from '../../components/ImageModal';
import AudioPlayerButton from '../../components/AudioPlayerButton';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { shuffleArray, triggerConfetti, playVictorySound, playOptionFeedbackSound } from '../../utils/quizUtils';

function GrammarQuizContent() {
  const { theme } = useTheme();
  const { appLang, strings, isRtl } = useLanguage();
  const isDark = theme === 'dark';

  const [activeTechnique, setActiveTechnique] = useState('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [showXpPopup, setShowXpPopup] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const techniques = [
    { id: 'all', label_ar: `🌐 جميع القواعد (${grammarQuizData.length} درساً)`, label_en: `🌐 All ${grammarQuizData.length} Lessons`, label_ro: `🌐 Toate ${grammarQuizData.length} Lecțiile` },
    { id: 'multiple_choice', label_ar: '🎯 اختيارات متعددة', label_en: '🎯 Multiple Choice', label_ro: '🎯 Opțiuni Multiple' },
    { id: 'fill_in_blank', label_ar: '✍️ إكمال الفراغ', label_en: '✍️ Fill in the Blank', label_ro: '✍️ Completează Spațiul' },
  ];

  const filteredQuestions = grammarQuizData.filter(q => 
    activeTechnique === 'all' || q.type === activeTechnique
  );

  const currentQuestion = filteredQuestions[currentIndex] || filteredQuestions[0];

  useEffect(() => {
    const saved = localStorage.getItem('grammar_quiz_best');
    if (saved) setBestScore(parseInt(saved, 10));
    loadQuestion(0);
  }, [activeTechnique]);

  const loadQuestion = (index) => {
    if (index >= filteredQuestions.length) {
      finishGame(score);
      return;
    }
    const q = filteredQuestions[index];
    if (q && q.options) {
      setShuffledOptions(shuffleArray(q.options));
    }
    setSelectedOption(null);
    setIsAnswered(false);
  };

  const finishGame = (finalScore) => {
    setQuizFinished(true);
    const saved = parseInt(localStorage.getItem('grammar_quiz_best') || '0', 10);
    const isNewBest = finalScore > saved;
    setIsNewHighScore(isNewBest);

    if (isNewBest) {
      setBestScore(finalScore);
      localStorage.setItem('grammar_quiz_best', finalScore.toString());
    }

    if (isNewBest || finalScore >= Math.ceil(filteredQuestions.length * 0.7)) {
      triggerConfetti();
      playVictorySound();
    }
  };

  const handleOptionSelect = (option) => {
    if (isAnswered) return;

    setSelectedOption(option);
    setIsAnswered(true);

    const isCorrect = option === currentQuestion.correct_answer;
    playOptionFeedbackSound(isCorrect);

    if (isCorrect) {
      const newScore = score + 1;
      const newStreak = streak + 1;
      setScore(newScore);
      setStreak(newStreak);
      setShowXpPopup(true);
      setTimeout(() => setShowXpPopup(false), 1200);

      if (newStreak % 5 === 0) {
        triggerConfetti();
      }
    } else {
      setStreak(0);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 >= filteredQuestions.length) {
      finishGame(score);
    } else {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      loadQuestion(nextIdx);
    }
  };

  const handleRestartQuiz = () => {
    setScore(0);
    setStreak(0);
    setCurrentIndex(0);
    setQuizFinished(false);
    setIsNewHighScore(false);
    loadQuestion(0);
  };

  const progressPct = Math.round(((currentIndex + 1) / Math.max(filteredQuestions.length, 1)) * 100);

  return (
    <div className="min-h-screen pb-28 sm:pb-24 bg-theme-main text-theme-main flex flex-col font-latin">
      <Navbar />

      <main className={`flex-1 w-full max-w-4xl mx-auto px-4 py-6 space-y-6 animate-fade-in-up ${
        isRtl ? 'lg:mr-72' : 'lg:ml-72'
      } ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
        
        {/* Header Title Banner */}
        <div className={`p-6 rounded-3xl border shadow-xl flex flex-col space-y-3 relative overflow-hidden ${
          isDark ? 'bg-slate-800/90 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="px-3.5 py-1 rounded-full text-xs font-black bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-rose-400" />
              <span>{appLang === 'ar' ? 'لعبة تحدي قواعد اللغة الرومانية 🎮' : 'Romanian Grammar Quiz Challenge 🎮'}</span>
            </span>

            <div className="flex items-center gap-3">
              {streak > 1 && (
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs font-black flex items-center gap-1 animate-pulse">
                  <Flame className="w-4 h-4 fill-current text-amber-400" />
                  <span>{streak} 🔥 {appLang === 'ar' ? 'سلسلة إجابات' : 'Streak'}</span>
                </span>
              )}
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
                🏆 {appLang === 'ar' ? 'النقاط:' : 'Score:'} {score} / {filteredQuestions.length}
              </span>
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
            {appLang === 'ar' ? 'اختبار قواعد الرومانية التفاعلي المصور 📚' : 'Interactive Illustrated Grammar Quiz 📚'}
          </h1>
          <p className="text-xs sm:text-sm text-theme-sub font-semibold leading-relaxed">
            {appLang === 'ar' 
              ? 'اختبر مهاراتك في تصريف الأفعال، الأجناس، أدوات التعريف، وأساسيات القواعد لمقابلة الجنسية.' 
              : 'Test your skills in verb conjugations, noun genders, articles, and grammar rules for ANC.'}
          </p>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden pt-0.5">
            <div 
              className="h-full bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Technique Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {techniques.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTechnique(t.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-black whitespace-nowrap shrink-0 transition-all border ${
                activeTechnique === t.id
                  ? 'bg-rose-600 text-white border-rose-600 shadow-md'
                  : isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-white text-slate-700 border-slate-200 shadow-sm'
              }`}
            >
              {appLang === 'ar' ? t.label_ar : t.label_en}
            </button>
          ))}
        </div>

        {/* Main Quiz Game Interface */}
        {!quizFinished && currentQuestion && (
          <div className="space-y-4">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`p-6 rounded-3xl border shadow-xl space-y-4 relative ${
                isDark ? 'bg-slate-800/90 border-slate-700' : 'bg-white border-slate-200'
              }`}
            >
              {/* Question Image Preview */}
              {currentQuestion.image && (
                <div 
                  className="relative w-full h-48 sm:h-64 rounded-2xl overflow-hidden border-2 border-slate-700/60 bg-slate-950 cursor-pointer group shadow-lg"
                  onClick={() => setSelectedImage(currentQuestion.image)}
                >
                  <img 
                    src={currentQuestion.image} 
                    alt={currentQuestion.question_ro}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button 
                    onClick={() => setSelectedImage(currentQuestion.image)}
                    className="absolute bottom-3 right-3 p-2 bg-black/70 backdrop-blur-md text-white rounded-xl text-xs font-bold flex items-center gap-1.5 border border-white/30"
                  >
                    <Maximize2 className="w-4 h-4" />
                    <span>تكبير الصورة 🔍</span>
                  </button>
                </div>
              )}

              {/* Question Header & Audio Player */}
              <div className="space-y-2 border-b border-slate-700/60 pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-rose-500 uppercase tracking-wider">
                    السؤال {currentIndex + 1} من {filteredQuestions.length}:
                  </span>
                  <AudioPlayerButton text={currentQuestion.question_ro} lang="ro" label="استمع للسؤال" />
                </div>

                <h2 className="text-lg sm:text-xl font-black leading-snug">{currentQuestion.question_ro}</h2>
                <p className="text-xs sm:text-sm text-theme-sub font-bold">
                  🇸🇦 {currentQuestion.question_ar}
                </p>
              </div>

              {/* Shuffled Answer Choice Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {shuffledOptions.map((opt, oIdx) => {
                  const isSelected = selectedOption === opt;
                  const isCorrectOpt = opt === currentQuestion.correct_answer;

                  let btnStyle = isDark ? 'bg-slate-900 border-slate-700 text-white hover:bg-slate-800' : 'bg-slate-50 border-slate-200 text-slate-900 hover:bg-slate-100';

                  if (isAnswered) {
                    if (isCorrectOpt) {
                      btnStyle = 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-600/30 font-black animate-pulse';
                    } else if (isSelected) {
                      btnStyle = 'bg-rose-600 text-white border-rose-500 shadow-rose-600/30 font-black';
                    }
                  }

                  return (
                    <motion.button
                      key={oIdx}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => handleOptionSelect(opt)}
                      disabled={isAnswered}
                      className={`p-4 rounded-2xl border text-sm sm:text-base font-black transition-all flex items-center justify-between shadow-sm min-h-[48px] ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {isAnswered && isCorrectOpt && <CheckCircle className="w-5 h-5 text-white shrink-0" />}
                      {isAnswered && isSelected && !isCorrectOpt && <XCircle className="w-5 h-5 text-white shrink-0" />}
                    </motion.button>
                  );
                })}
              </div>

              {/* Explanation Card on Answer */}
              {isAnswered && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-2xl border-2 space-y-2 ${
                    selectedOption === currentQuestion.correct_answer 
                      ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300' 
                      : 'bg-rose-500/15 border-rose-500/50 text-rose-300'
                  }`}
                >
                  <span className="text-xs font-black block">
                    {selectedOption === currentQuestion.correct_answer ? '🎉 إجابة ممتازة وصحيحة!' : '❌ إجابة غير دقيقة!'}
                  </span>
                  <p className="text-xs sm:text-sm font-semibold leading-relaxed">
                    {currentQuestion.explanation_ar}
                  </p>

                  <button
                    onClick={handleNextQuestion}
                    className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-xl text-xs shadow-md transition-all mt-2"
                  >
                    السؤال التالي ➡️
                  </button>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}

        {/* Completion Celebration Card */}
        {quizFinished && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-8 rounded-3xl border shadow-2xl text-center space-y-4 ${
              isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
            }`}
          >
            <PartyPopper className="w-16 h-16 text-amber-400 mx-auto animate-bounce" />
            <h2 className="text-2xl font-black">أحسنت! أكملت تحدي القواعد 🎉</h2>
            <p className="text-sm font-extrabold text-emerald-400">
              نتيجتك النهائية: {score} من أصل {filteredQuestions.length} إجابة صحيحة!
            </p>

            <button
              onClick={handleRestartQuiz}
              className="px-6 py-3.5 bg-rose-600 text-white font-black rounded-2xl shadow-xl hover:bg-rose-500 transition-all text-sm inline-flex items-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>إعادة التحدي الآن 🔄</span>
            </button>
          </motion.div>
        )}
      </main>

      <ImageModal 
        isOpen={selectedImage !== null}
        onClose={() => setSelectedImage(null)}
        imageUrl={selectedImage}
        title="Romanian Grammar Challenge"
      />
    </div>
  );
}

export default function GrammarQuizPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400 font-bold">Loading Grammar Quiz...</div>}>
      <GrammarQuizContent />
    </Suspense>
  );
}
