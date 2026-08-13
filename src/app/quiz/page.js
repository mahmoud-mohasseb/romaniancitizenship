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
  Timer 
} from 'lucide-react';
import questions from '../../data/questions_ar.json';
import Navbar from '../../components/Navbar';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { getCategoryMeta, CATEGORIES_LIST } from '../../utils/categories';
import { getQuestionText, getAnswerText } from '../../utils/languageHelper';

function QuizContent() {
  const searchParams = useSearchParams();
  const quizMode = searchParams.get('mode') || 'quick';
  const initialCategory = searchParams.get('category') || 'all';

  const { theme } = useTheme();
  const { appLang, strings, isRtl } = useLanguage();
  const isDark = theme === 'dark';

  const totalQuestionsLimit = quizMode === 'exam' ? 25 : 10;
  const initialTimeSeconds = quizMode === 'exam' ? 20 * 60 : null;

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
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

  const questionPool = selectedCategory === 'all' 
    ? questions 
    : questions.filter(q => q.category === selectedCategory);

  useEffect(() => {
    resetQuiz();
  }, [selectedCategory, quizMode]);

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

    const randomIdx = Math.floor(Math.random() * questionPool.length);
    const correctQ = questionPool[randomIdx];
    
    let wrongOptions = [];
    while (wrongOptions.length < 3) {
      const wrongIdx = Math.floor(Math.random() * questions.length);
      const wrongAns = questions[wrongIdx].answer;
      if (wrongAns && wrongAns !== correctQ.answer && !wrongOptions.includes(wrongAns)) {
        wrongOptions.push(wrongAns);
      }
    }

    let allOptions = [correctQ.answer, ...wrongOptions];
    allOptions.sort(() => Math.random() - 0.5);

    setCurrentQuestion(correctQ);
    setOptions(allOptions);
    setSelectedOption(null);
    setQuestionCount(prev => prev + 1);
  };

  const handleOptionSelect = (option) => {
    if (selectedOption !== null) return;

    setSelectedOption(option);
    const isCorrect = option === currentQuestion.answer;

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
      generateQuestion();
    }, 1200);
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

  const percentage = Math.round((score / totalQuestionsLimit) * 100);
  const isPassed = percentage >= 75;

  if (isFinished) {
    const categoryMeta = getCategoryMeta(selectedCategory);

    return (
      <div className="min-h-screen pb-28 sm:pb-24 bg-theme-main text-theme-main flex flex-col">
        <Navbar />

        <main className={`flex-1 max-w-lg mx-auto w-full px-4 py-8 space-y-6 animate-scale-in ${
          isRtl ? 'lg:mr-72' : 'lg:ml-72'
        } ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
          <div className={`p-6 rounded-2xl border text-center space-y-6 shadow-xl ${isDark ? 'bg-slate-800/90 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center border-4 animate-bounce-subtle ${isPassed ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-rose-500/20 border-rose-500 text-rose-400'}`}>
              <Trophy className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold">
                {isPassed ? strings.passedExam : strings.failedExam}
              </h2>
              <p className="text-xs text-theme-sub">
                {quizMode === 'exam' ? strings.examQuizTitle : strings.quickQuizTitle} - {appLang === 'ar' ? categoryMeta.name_ar : categoryMeta.name_en}
              </p>
            </div>

            <div className={`p-6 rounded-2xl border-2 space-y-2 ${isDark ? 'bg-slate-900/80' : 'bg-slate-50'} ${isPassed ? 'border-emerald-500' : 'border-rose-500'}`}>
              <p className={`text-4xl font-extrabold ${isPassed ? 'text-emerald-400' : 'text-rose-400'}`}>
                {score} / {totalQuestionsLimit}
              </p>
              <p className="text-xs font-semibold text-theme-sub">{strings.score}: {percentage}%</p>
              <p className={`text-xs font-bold ${isPassed ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isPassed ? (appLang === 'ar' ? '✅ ناجح (مستوف لشروط المقابلة الرسمية)' : appLang === 'en' ? '✅ Passed Official Standard' : '✅ Promovat Standard Oficial') : (appLang === 'ar' ? '❌ غير ناجح (الحد الأدنى 75%)' : appLang === 'en' ? '❌ Below Pass Mark (75% Minimum)' : '❌ Nepromovat (Minim 75%)')}
              </p>
            </div>

            {wrongAnswers.length > 0 && (
              <button
                onClick={() => setShowReviewModal(true)}
                className={`w-full py-3 text-amber-500 font-bold rounded-xl border border-amber-500/40 flex items-center justify-center space-x-2 space-x-reverse transition-colors text-xs ${isDark ? 'bg-slate-900 hover:bg-slate-800' : 'bg-amber-50 hover:bg-amber-100'}`}
              >
                <AlertCircle className="w-4 h-4" />
                <span>{strings.reviewWrong} ({wrongAnswers.length})</span>
              </button>
            )}

            <div className="space-y-2">
              <button
                onClick={resetQuiz}
                className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-xl text-xs sm:text-sm shadow-md shadow-rose-600/30 transition-all flex items-center justify-center space-x-2 space-x-reverse"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{strings.retakeQuiz}</span>
              </button>

              <Link
                href="/"
                className={`block w-full py-3 font-bold rounded-xl border text-xs sm:text-sm transition-all text-center ${isDark ? 'bg-slate-900 border-slate-700 hover:bg-slate-800' : 'bg-slate-100 border-slate-200 hover:bg-slate-200'}`}
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

  return (
    <div className="min-h-screen pb-28 sm:pb-24 bg-theme-main text-theme-main flex flex-col">
      <Navbar />

      <main className={`flex-1 max-w-4xl mx-auto w-full px-4 py-6 space-y-4 animate-fade-in-up ${
        isRtl ? 'lg:mr-72' : 'lg:ml-72'
      } ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
        {/* Quiz Top Header Bar */}
        <div className={`flex items-center justify-between p-3 rounded-2xl border ${isDark ? 'bg-slate-800/80 border-slate-700/60' : 'bg-white border-slate-200 shadow-sm'}`}>
          <Link href="/" className="p-2 hover:opacity-75 rounded-xl">
            <X className="w-5 h-5" />
          </Link>

          <div className="text-center">
            <p className="text-sm font-bold">
              {strings.question} {questionCount} {strings.of} {totalQuestionsLimit}
            </p>
            <p className="text-[11px] font-semibold" style={{ color: categoryMeta.color }}>
              {appLang === 'ar' ? categoryMeta.name_ar : appLang === 'en' ? categoryMeta.name_en : categoryMeta.name_ro}
            </p>
          </div>

          {quizMode === 'exam' ? (
            <div className="flex items-center space-x-1.5 space-x-reverse text-xs font-mono font-bold text-rose-500 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-xl">
              <Timer className="w-4 h-4 animate-pulse" />
              <span>{formatTimer(timeLeft)}</span>
            </div>
          ) : (
            <div className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-xl">
              {strings.score}: {score}
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-700/30 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-rose-500 h-full transition-all duration-300 rounded-full"
            style={{ width: `${(questionCount / totalQuestionsLimit) * 100}%` }}
          />
        </div>

        {/* Question Flashcard */}
        <div className={`p-5 rounded-2xl border space-y-4 shadow-xl animate-scale-in ${isDark ? 'bg-slate-800/90 border-slate-700/80' : 'bg-white border-slate-200'}`}>
          {currentQuestion.image && (
            <div className="relative w-full h-44 sm:h-56 rounded-xl overflow-hidden border border-slate-700/60 group cursor-pointer" onClick={() => setImageModalVisible(true)}>
              <img 
                src={currentQuestion.image} 
                alt={currentQuestion.question}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <button 
                onClick={() => setImageModalVisible(true)}
                className="absolute bottom-2 right-2 p-1.5 bg-black/60 backdrop-blur-md text-white rounded-lg text-[10px] font-bold flex items-center space-x-1 space-x-reverse"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>عرض 🔍</span>
              </button>
            </div>
          )}

          <div className="space-y-1">
            <span className="text-[10px] font-bold text-rose-500">🇷🇴 Limba Română:</span>
            <h2 className="text-base sm:text-lg font-extrabold leading-snug">{currentQuestion.question}</h2>
            <p className="text-xs text-theme-sub">🇸🇦 {getQuestionText(currentQuestion, appLang)}</p>
          </div>

          {/* Options Grid */}
          <div className="space-y-2.5 pt-2">
            <p className="text-xs font-semibold text-theme-sub">{strings.chooseCorrectAns}</p>
            {options.map((option, idx) => {
              let btnStyle = isDark 
                ? 'bg-slate-900/90 border-slate-700/80 hover:border-rose-500 text-slate-100' 
                : 'bg-slate-100 border-slate-200 hover:border-rose-500 text-slate-900';

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
                  className={`w-full p-3.5 rounded-xl border text-xs sm:text-sm text-right font-bold transition-all flex items-center justify-between ${btnStyle}`}
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
        </div>
      </main>
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading Quiz Page...</div>}>
      <QuizContent />
    </Suspense>
  );
}
