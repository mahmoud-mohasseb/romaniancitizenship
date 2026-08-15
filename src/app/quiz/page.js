'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  RotateCcw, 
  Trophy, 
  XCircle, 
  CheckCircle, 
  ExternalLink, 
  Sparkles, 
  AlertCircle, 
  Maximize2, 
  X, 
  Timer,
  PartyPopper,
  Flag,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import questions from '../../data/questions_ar.json';
import Navbar from '../../components/Navbar';
import ImageModal from '../../components/ImageModal';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { getCategoryMeta, CATEGORIES_LIST } from '../../utils/categories';
import { getQuestionText, getAnswerText } from '../../utils/languageHelper';
import { 
  shuffleArray, 
  triggerConfetti, 
  playVictorySound, 
  playOptionFeedbackSound,
  getQuestionPoolForLevel,
  generateLevelOptions,
  generatePersonalizedRecommendations
} from '../../utils/quizUtils';

function QuizContent() {
  const searchParams = useSearchParams();

  const { theme } = useTheme();
  const { appLang, strings, isRtl } = useLanguage();
  const isDark = theme === 'dark';

  const [quizMode, setQuizMode] = useState('quick');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [difficultyLevel, setDifficultyLevel] = useState('easy'); // 'easy', 'medium', 'hard'

  const [flaggedIds, setFlaggedIds] = useState([]);

  useEffect(() => {
    const mode = searchParams.get('mode');
    const cat = searchParams.get('category');
    const diff = searchParams.get('difficulty');
    if (mode) setQuizMode(mode);
    if (cat) setSelectedCategory(cat);
    if (diff && (diff === 'easy' || diff === 'medium' || diff === 'hard')) {
      setDifficultyLevel(diff);
    }
  }, [searchParams]);

  const totalQuestionsLimit = quizMode === 'exam' ? 25 : 10;
  const initialTimeSeconds = quizMode === 'exam' ? 20 * 60 : null;

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(initialTimeSeconds);
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const timerRef = useRef(null);

  const questionPool = getQuestionPoolForLevel(questions, difficultyLevel, selectedCategory);

  useEffect(() => {
    resetQuiz();
  }, [selectedCategory, quizMode, difficultyLevel]);

  useEffect(() => {
    if (quizMode === 'exam' && !isFinished && timeLeft !== null) {
      if (timeLeft <= 0) {
        setIsFinished(true);
        return;
      }
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft, isFinished, quizMode]);

  const generateQuestion = () => {
    if (questionCount >= totalQuestionsLimit || questionPool.length === 0) {
      setIsFinished(true);
      return;
    }

    const availablePool = questionPool.length > 0 ? questionPool : questions;
    const randomIdx = Math.floor(Math.random() * availablePool.length);
    const correctQ = availablePool[randomIdx];
    
    const levelOptions = generateLevelOptions(correctQ, questions, difficultyLevel);

    setCurrentQuestion(correctQ);
    setOptions(levelOptions);
    setSelectedOption(null);
    setQuestionCount(prev => prev + 1);
  };

  const handleOptionSelect = (option) => {
    if (selectedOption !== null) return;

    setSelectedOption(option);
    const isCorrect = option === currentQuestion.answer;
    playOptionFeedbackSound(isCorrect);

    if (isCorrect) {
      setScore(prev => prev + 1);
    } else {
      setWrongAnswers(prev => [...prev, {
        question: currentQuestion,
        userAnswer: option,
        correctAnswer: currentQuestion.answer
      }]);
    }

    setTimeout(() => {
      if (questionCount >= totalQuestionsLimit) {
        finishQuiz();
      } else {
        generateQuestion();
      }
    }, 1400);
  };

  const toggleFlag = (id) => {
    setFlaggedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const finishQuiz = () => {
    setIsFinished(true);
    const pct = Math.round((score / totalQuestionsLimit) * 100);

    const saved = parseInt(localStorage.getItem('anc_quiz_best') || '0', 10);
    if (score > saved) {
      localStorage.setItem('anc_quiz_best', score.toString());
    }

    if (pct >= 75) {
      triggerConfetti();
      playVictorySound();
    }
  };

  const resetQuiz = () => {
    setScore(0);
    setQuestionCount(0);
    setIsFinished(false);
    setWrongAnswers([]);
    setTimeLeft(initialTimeSeconds);
    setShowReviewModal(false);
    generateQuestion();
  };

  const formatTimer = (seconds) => {
    if (seconds === null) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const percentage = Math.round((score / Math.max(totalQuestionsLimit, 1)) * 100);
  const passThreshold = difficultyLevel === 'hard' ? 80 : difficultyLevel === 'medium' ? 70 : 60;
  const isPassed = percentage >= passThreshold;
  const recommendations = generatePersonalizedRecommendations(wrongAnswers.map(w => w.question), score, totalQuestionsLimit);

  if (isFinished) {
    const categoryMeta = getCategoryMeta(selectedCategory);

    return (
      <div className="min-h-screen pb-28 sm:pb-24 bg-theme-main text-theme-main flex flex-col font-latin">
        <Navbar />

        <main className={`flex-1 max-w-xl mx-auto w-full px-4 py-8 space-y-6 animate-scale-in ${
          isRtl ? 'lg:mr-72' : 'lg:ml-72'
        } ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
          <div className={`p-6 rounded-3xl border text-center space-y-6 shadow-xl relative overflow-hidden ${
            isDark ? 'bg-slate-800/90 border-slate-700' : 'bg-white border-slate-200'
          }`}>
            {isPassed && (
              <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-rose-600 text-white text-xs font-black py-1.5 px-6 rounded-full inline-flex items-center space-x-2 space-x-reverse shadow-lg animate-bounce-subtle">
                <PartyPopper className="w-4 h-4" />
                <span>🏆 TEST PASSED CERTIFIED! 🎉</span>
              </div>
            )}

            <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center border-4 shadow-2xl animate-pulse-glow ${
              isPassed ? 'bg-gradient-to-tr from-emerald-500 to-teal-500 border-emerald-300 text-white' : 'bg-rose-500/20 border-rose-500 text-rose-400'
            }`}>
              <Trophy className="w-12 h-12 animate-bounce-subtle" />
            </div>

            <div className="space-y-1">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-black border ${
                difficultyLevel === 'hard' 
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' 
                  : difficultyLevel === 'medium'
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
              }`}>
                {difficultyLevel === 'hard' ? strings.level3Hard : difficultyLevel === 'medium' ? strings.level2Medium : strings.level1Easy}
              </span>
              <h2 className="text-2xl font-extrabold pt-1">
                {isPassed ? strings.passedExam : strings.failedExam}
              </h2>
              <p className="text-xs text-theme-sub font-bold">
                {quizMode === 'exam' ? strings.examQuizTitle : strings.quickQuizTitle} - {appLang === 'ar' ? categoryMeta.name_ar : categoryMeta.name_en}
              </p>
            </div>

            <div className={`p-6 rounded-2xl border-2 space-y-2 ${isDark ? 'bg-slate-900/80' : 'bg-slate-50'} ${isPassed ? 'border-emerald-500' : 'border-rose-500'}`}>
              <p className={`text-4xl font-extrabold ${isPassed ? 'text-emerald-400' : 'text-rose-400'}`}>
                {score} / {totalQuestionsLimit}
              </p>
              <p className="text-xs font-bold text-theme-sub">{strings.score}: {percentage}% (Pass Mark: {passThreshold}%)</p>
            </div>

            {/* Personalized Recommendations Section */}
            {recommendations.length > 0 && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-left space-y-2.5 text-right">
                <span className="text-xs font-black text-rose-400 block">
                  {strings.learningRecommendations || 'توصيات المذاكرة والمراجعة بناءً على أدائك:'}
                </span>
                <div className="space-y-2">
                  {recommendations.map((rec, rIdx) => (
                    <Link
                      key={rIdx}
                      href={rec.href}
                      className="p-3 rounded-xl bg-black/20 border border-white/10 hover:border-rose-400 transition-all flex items-center justify-between group"
                    >
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-white group-hover:text-rose-400 transition-colors">
                          {appLang === 'ar' ? rec.title_ar : rec.title_en}
                        </h4>
                        <p className="text-[10px] text-slate-400">{rec.desc_ar}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-rose-400 shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {wrongAnswers.length > 0 && (
              <button
                onClick={() => setShowReviewModal(true)}
                className={`w-full py-3 text-amber-500 font-extrabold rounded-xl border border-amber-500/40 flex items-center justify-center space-x-2 space-x-reverse transition-colors text-xs ${
                  isDark ? 'bg-slate-900 hover:bg-slate-800' : 'bg-amber-50 hover:bg-amber-100'
                }`}
              >
                <AlertCircle className="w-4 h-4" />
                <span>{strings.reviewWrong} ({wrongAnswers.length})</span>
              </button>
            )}

            <div className="space-y-2">
              <button
                onClick={resetQuiz}
                className="w-full py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-xl text-xs sm:text-sm shadow-md shadow-rose-600/30 transition-all flex items-center justify-center space-x-2 space-x-reverse"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{strings.retakeQuiz}</span>
              </button>

              <Link
                href="/"
                className={`block w-full py-3.5 font-bold rounded-xl border text-xs sm:text-sm transition-all text-center ${
                  isDark ? 'bg-slate-900 border-slate-700 hover:bg-slate-800 text-white' : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-900'
                }`}
              >
                {strings.backHome}
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!currentQuestion) return null;

  const categoryMeta = getCategoryMeta(currentQuestion.category);
  const isFlagged = flaggedIds.includes(currentQuestion.id);

  return (
    <div className="min-h-screen pb-28 sm:pb-24 bg-theme-main text-theme-main flex flex-col font-latin">
      <Navbar />

      <main className={`flex-1 max-w-4xl mx-auto w-full px-4 py-6 space-y-4 animate-fade-in-up ${
        isRtl ? 'lg:mr-72' : 'lg:ml-72'
      } ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
        
        {/* 3 Difficulty Level Selector Tabs */}
        <div className={`p-3 rounded-2xl border flex items-center justify-between gap-2 ${
          isDark ? 'bg-slate-800/80 border-slate-700/60' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <button
            onClick={() => setDifficultyLevel('easy')}
            className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition-all border text-center ${
              difficultyLevel === 'easy'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/30'
                : isDark ? 'bg-slate-900/60 text-slate-400 border-slate-700/50' : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            {strings.level1Easy || 'المستوى 1 — سهل 🟢'}
          </button>

          <button
            onClick={() => setDifficultyLevel('medium')}
            className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition-all border text-center ${
              difficultyLevel === 'medium'
                ? 'bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-600/30'
                : isDark ? 'bg-slate-900/60 text-slate-400 border-slate-700/50' : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            {strings.level2Medium || 'المستوى 2 — متوسط 🟡'}
          </button>

          <button
            onClick={() => setDifficultyLevel('hard')}
            className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition-all border text-center ${
              difficultyLevel === 'hard'
                ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-600/30'
                : isDark ? 'bg-slate-900/60 text-slate-400 border-slate-700/50' : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            {strings.level3Hard || 'المستوى 3 — صعب 🔴'}
          </button>
        </div>

        {/* Quiz Top Header Bar */}
        <div className={`flex items-center justify-between p-3.5 rounded-2xl border ${
          isDark ? 'bg-slate-800/80 border-slate-700/60' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <Link href="/" className="p-2 hover:opacity-75 rounded-xl">
            <X className="w-5 h-5" />
          </Link>

          <div className="text-center">
            <p className="text-sm font-extrabold">
              {strings.question} {questionCount} {strings.of} {totalQuestionsLimit}
            </p>
            <p className="text-[11px] font-bold" style={{ color: categoryMeta.color }}>
              {appLang === 'ar' ? categoryMeta.name_ar : appLang === 'en' ? categoryMeta.name_en : categoryMeta.name_ro}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleFlag(currentQuestion.id)}
              className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1 transition-all ${
                isFlagged 
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' 
                  : isDark ? 'bg-slate-900 border-slate-700 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
              }`}
              title={strings.flagQuestion || 'علامة مراجعة 🚩'}
            >
              <Flag className={`w-4 h-4 ${isFlagged ? 'fill-current text-amber-400' : ''}`} />
            </button>

            {quizMode === 'exam' ? (
              <div className="flex items-center space-x-1.5 space-x-reverse text-xs font-mono font-black text-rose-500 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-xl">
                <Timer className="w-4 h-4 animate-pulse" />
                <span>{formatTimer(timeLeft)}</span>
              </div>
            ) : (
              <div className="text-xs font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-xl">
                {strings.score}: {score}
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-700/30 h-2.5 rounded-full overflow-hidden">
          <div 
            className="bg-gradient-to-r from-rose-600 to-amber-500 h-full transition-all duration-300 rounded-full animate-shimmer"
            style={{ width: `${(questionCount / totalQuestionsLimit) * 100}%` }}
          />
        </div>

        {/* Question Flashcard */}
        <div className={`p-5 rounded-3xl border space-y-4 shadow-xl animate-scale-in ${
          isDark ? 'bg-slate-800/90 border-slate-700/80 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}>
          {currentQuestion.image && (
            <div className="relative w-full h-48 sm:h-64 rounded-2xl overflow-hidden border-2 border-slate-700/60 bg-slate-950 group cursor-pointer shadow-md" onClick={() => setImageModalVisible(true)}>
              <img 
                src={currentQuestion.image} 
                alt={currentQuestion.question}
                onError={(e) => { e.currentTarget.src = '/icon.png'; }}
                className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
              />
              <button 
                onClick={() => setImageModalVisible(true)}
                className="absolute bottom-2.5 right-2.5 p-2 bg-black/70 backdrop-blur-md text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 space-x-reverse border border-white/20 shadow-md"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>{strings.zoomImage || 'تكبير الصورة 🔍'}</span>
              </button>
            </div>
          )}

          <div className="space-y-1 border-b border-slate-700/60 pb-3">
            <span className="text-[10px] font-bold text-rose-500">🇷🇴 Limba Română:</span>
            <h2 className="text-base sm:text-lg font-black leading-snug">{currentQuestion.question}</h2>
            <p className="text-xs text-theme-sub font-bold pt-1">🇸🇦 {getQuestionText(currentQuestion, appLang)}</p>
          </div>

          {/* Options Grid */}
          <div className="space-y-2.5 pt-1">
            <p className="text-xs font-bold text-theme-sub">{strings.chooseCorrectAns}</p>
            {options.map((option, idx) => {
              let btnStyle = isDark 
                ? 'bg-slate-900/90 border-slate-700/80 hover:border-rose-500 text-slate-100' 
                : 'bg-slate-50 border-slate-200 hover:border-rose-500 text-slate-900';

              if (selectedOption !== null) {
                if (option === currentQuestion.answer) {
                  btnStyle = 'bg-emerald-600 text-white border-emerald-600 animate-quiz-pop font-black';
                } else if (option === selectedOption) {
                  btnStyle = 'bg-rose-600 text-white border-rose-600 animate-quiz-shake font-black';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={selectedOption !== null}
                  onClick={() => handleOptionSelect(option)}
                  className={`w-full p-3.5 rounded-2xl border text-xs sm:text-sm text-right font-bold transition-all flex items-center justify-between ${btnStyle}`}
                >
                  <span className="leading-snug">{option}</span>
                  {selectedOption !== null && (
                    option === currentQuestion.answer ? (
                      <CheckCircle className="w-5 h-5 text-white shrink-0" />
                    ) : option === selectedOption ? (
                      <XCircle className="w-5 h-5 text-white shrink-0" />
                    ) : null
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Banner After Selection */}
          {selectedOption !== null && (
            <div className={`p-4 rounded-2xl border text-xs font-bold space-y-1 animate-fade-in-up ${
              selectedOption === currentQuestion.answer 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}>
              <span className="block font-black">
                {selectedOption === currentQuestion.answer ? 'إجابة صحيحة! 🎉' : 'الإجابة النموذجية:'}
              </span>
              <p className="text-white font-latin">{currentQuestion.answer}</p>
              <p className="text-slate-300 text-[11px]">🇸🇦 {getAnswerText(currentQuestion, appLang)}</p>
            </div>
          )}
        </div>
      </main>

      {/* Universal Fullscreen Image Review Modal */}
      <ImageModal 
        isOpen={imageModalVisible}
        onClose={() => setImageModalVisible(false)}
        imageUrl={currentQuestion?.image}
        title={currentQuestion?.question}
        caption={getQuestionText(currentQuestion, appLang)}
      />
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400 font-bold">Loading Quiz Page...</div>}>
      <QuizContent />
    </Suspense>
  );
}
