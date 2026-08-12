'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  ArrowRight, 
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
  Star 
} from 'lucide-react';
import questions from '../../data/questions_ar.json';
import { getCategoryMeta, CATEGORIES_LIST } from '../../utils/categories';
import { getQuestionText, getAnswerText, UI_STRINGS } from '../../utils/languageHelper';

function QuizContent() {
  const searchParams = useSearchParams();
  const quizMode = searchParams.get('mode') || 'quick';
  const initialCategory = searchParams.get('category') || 'all';
  const initialLang = searchParams.get('lang') || 'ar';

  const [appLang, setAppLang] = useState(initialLang);
  const strings = UI_STRINGS[appLang];
  const isRtl = appLang === 'ar';

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

  const handleSelect = (option) => {
    if (selectedOption) return;
    
    setSelectedOption(option);
    if (option === currentQuestion.answer) {
      setScore(prev => prev + 1);
    } else {
      setWrongAnswers(prev => [...prev, { question: currentQuestion, userSelected: option }]);
    }

    setTimeout(() => {
      generateQuestion();
    }, 1400);
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
      <div className={`space-y-6 ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="bg-slate-800/90 rounded-2xl p-6 border border-slate-700/80 shadow-xl text-center space-y-6 max-w-lg mx-auto">
          <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center ${isPassed ? 'bg-emerald-500/20 text-yellow-400' : 'bg-rose-500/20 text-rose-500'}`}>
            {isPassed ? <Trophy className="w-12 h-12" /> : <XCircle className="w-12 h-12" />}
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-white">
              {isPassed ? strings.passedExam : strings.failedExam}
            </h2>
            <p className="text-xs text-slate-400">
              {quizMode === 'exam' ? strings.examQuizTitle : strings.quickQuizTitle} - {appLang === 'ar' ? categoryMeta.name_ar : categoryMeta.name_en}
            </p>
          </div>

          <div className={`p-6 rounded-2xl border-2 bg-slate-900/80 ${isPassed ? 'border-emerald-500' : 'border-rose-500'} space-y-2`}>
            <p className={`text-4xl font-extrabold ${isPassed ? 'text-emerald-400' : 'text-rose-400'}`}>
              {score} / {totalQuestionsLimit}
            </p>
            <p className="text-xs text-slate-400 font-semibold">{strings.score}: {percentage}%</p>
            <p className={`text-xs font-bold ${isPassed ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isPassed ? (appLang === 'ar' ? '✅ ناجح (مستوف لشروط المقابلة الرسمية)' : '✅ Passed Official Standard') : (appLang === 'ar' ? '❌ غير ناجح (الحد الأدنى 75%)' : '❌ Below Pass Mark (75% Minimum)')}
            </p>
          </div>

          {wrongAnswers.length > 0 && (
            <button
              onClick={() => setShowReviewModal(true)}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold rounded-xl border border-amber-500/40 flex items-center justify-center space-x-2 space-x-reverse transition-colors text-xs"
            >
              <AlertCircle className="w-4 h-4" />
              <span>{strings.reviewWrong} ({wrongAnswers.length})</span>
            </button>
          )}

          <div className="space-y-2">
            <button
              onClick={resetQuiz}
              className="w-full py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl flex items-center justify-center space-x-2 space-x-reverse shadow-lg shadow-rose-600/30 transition-all text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{strings.retakeQuiz}</span>
            </button>

            <Link
              href="/"
              className="block w-full py-3.5 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white font-bold rounded-xl text-sm transition-all"
            >
              {strings.backHome}
            </Link>
          </div>
        </div>

        {/* Missed Questions Review Modal */}
        {showReviewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <div className="bg-slate-800 rounded-2xl border border-slate-700 max-w-xl w-full max-h-[85vh] flex flex-col overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-slate-700">
                <h3 className="text-base font-bold text-white">{strings.reviewWrong}</h3>
                <button onClick={() => setShowReviewModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-4 overflow-y-auto space-y-4 flex-1">
                {wrongAnswers.map((item, idx) => (
                  <div key={idx} className="bg-slate-900/90 rounded-xl p-4 border border-slate-700 space-y-2 text-xs">
                    <span className="text-rose-400 font-bold block">{strings.question} #{item.question.id}</span>
                    <p className="text-white font-semibold">{item.question.question}</p>
                    <p className="text-rose-400 font-bold text-right">🇸🇦 {item.question.question_ar}</p>
                    <p className="text-emerald-400 font-medium">🇬🇧 {getQuestionText(item.question, 'en')}</p>

                    <div className="h-px bg-slate-800 w-full my-2" />

                    <p className="text-rose-400 font-bold">Your Choice: {item.userSelected}</p>
                    <p className="text-emerald-400 font-bold">Correct RO: {item.question.answer}</p>
                    <p className="text-emerald-400">🇸🇦 {item.question.answer_ar}</p>
                    <p className="text-emerald-400">🇬🇧 {getAnswerText(item.question, 'en')}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (!currentQuestion) return null;

  const categoryMeta = getCategoryMeta(currentQuestion.category || selectedCategory);

  return (
    <div className={`space-y-4 ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Quiz Top Header */}
      <div className="flex items-center justify-between bg-slate-800/80 backdrop-blur-md p-3 rounded-2xl border border-slate-700/60">
        <Link href="/" className="p-2 hover:bg-slate-700/50 rounded-xl text-slate-300">
          <X className="w-5 h-5" />
        </Link>

        <div className="text-center">
          <p className="text-sm font-bold text-white">
            {strings.question} {questionCount} {strings.of} {totalQuestionsLimit}
          </p>
          <p className="text-[11px] font-semibold" style={{ color: categoryMeta.color }}>
            {appLang === 'ar' ? categoryMeta.name_ar : categoryMeta.name_en}
          </p>
        </div>

        {quizMode === 'exam' ? (
          <div className="flex items-center space-x-1.5 space-x-reverse px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-xl text-xs font-bold border border-emerald-500/30">
            <Timer className="w-4 h-4" />
            <span>{formatTimer(timeLeft)}</span>
          </div>
        ) : (
          <button
            onClick={() => setAppLang(appLang === 'ar' ? 'en' : 'ar')}
            className="px-2.5 py-1 bg-slate-900 text-xs font-bold rounded-xl text-slate-300 border border-slate-700"
          >
            {appLang === 'ar' ? 'EN' : 'AR'}
          </button>
        )}
      </div>

      {/* Category Picker Strip */}
      <div className="flex items-center space-x-2 space-x-reverse overflow-x-auto pb-1 no-scrollbar">
        {CATEGORIES_LIST.map((cat) => {
          const isSel = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                isSel 
                  ? 'text-white shadow-md' 
                  : 'bg-slate-800/80 text-slate-400 border border-slate-700/60 hover:text-white'
              }`}
              style={isSel ? { backgroundColor: cat.color } : {}}
            >
              {appLang === 'ar' ? cat.name_ar : cat.name_en}
            </button>
          );
        })}
      </div>

      {/* Main Question Card with Framed Image */}
      <div className="bg-slate-800/90 rounded-2xl border border-slate-700/80 overflow-hidden shadow-xl space-y-3">
        <div 
          onClick={() => setImageModalVisible(true)}
          className="relative w-full h-52 bg-slate-950 flex items-center justify-center p-3 cursor-pointer group border-b border-slate-700/60"
        >
          <img 
            src={currentQuestion.image} 
            alt={currentQuestion.question}
            className="max-h-full max-w-full object-contain transition-transform group-hover:scale-105"
          />

          <span 
            className="absolute top-3 right-3 text-xs font-bold text-white px-3 py-1 rounded-lg shadow"
            style={{ backgroundColor: categoryMeta.color }}
          >
            {appLang === 'ar' ? categoryMeta.name_ar : categoryMeta.name_en}
          </span>

          <button className="absolute bottom-3 left-3 bg-black/75 text-white px-2 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1 space-x-reverse backdrop-blur-sm">
            <Maximize2 className="w-3.5 h-3.5" />
            <span>{strings.zoomImage}</span>
          </button>
        </div>

        {/* Links Bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-slate-700/60 text-xs font-bold gap-2">
          <a
            href={currentQuestion.wiki_url || 'https://en.wikipedia.org/wiki/Romania'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center space-x-1.5 space-x-reverse py-1.5 bg-slate-800 hover:bg-slate-700/80 rounded-lg text-slate-200 border border-slate-700/80"
          >
            <ExternalLink className="w-3.5 h-3.5 text-rose-400" />
            <span>ويكيبيديا ℹ️</span>
          </a>

          <Link
            href={`/ai?lang=${appLang}&q=${encodeURIComponent(currentQuestion.question)}`}
            className="flex items-center space-x-1 space-x-reverse py-1.5 px-3 bg-amber-500/15 hover:bg-amber-500/25 rounded-lg text-amber-400 border border-amber-500/40 shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>اسأل AI</span>
          </Link>
        </div>

        {/* Text */}
        <div className="p-4 space-y-3">
          <h2 className="text-lg font-semibold text-white leading-relaxed">
            {currentQuestion.question}
          </h2>

          <div className="h-px bg-slate-700/80 w-full" />

          <div className="space-y-2">
            <div>
              <span className="text-[10px] font-bold text-rose-400 block mb-0.5">🇸🇦 Arabic:</span>
              <p className="text-base font-bold text-rose-400 text-right leading-relaxed">
                {currentQuestion.question_ar}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-emerald-400 block mb-0.5">🇬🇧 English:</span>
              <p className="text-xs font-medium text-slate-200 leading-relaxed">
                {getQuestionText(currentQuestion, 'en')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs font-medium text-slate-400">{strings.chooseCorrectAns}</p>

      {/* Multiple Choice Options */}
      <div className="space-y-2.5">
        {options.map((option, index) => {
          let bgClass = 'bg-slate-800/90 border-slate-700/80 text-white hover:border-slate-500';

          if (selectedOption) {
            if (option === currentQuestion.answer) {
              bgClass = 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold';
            } else if (option === selectedOption) {
              bgClass = 'bg-rose-500/20 border-rose-500 text-rose-400 font-bold';
            }
          }

          return (
            <button
              key={index}
              onClick={() => handleSelect(option)}
              disabled={selectedOption !== null}
              className={`w-full p-4 rounded-2xl border-2 text-center text-sm font-semibold transition-all flex items-center justify-between ${bgClass}`}
            >
              <span className="w-full text-center">{option}</span>

              {selectedOption && option === currentQuestion.answer && (
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
              )}
              {selectedOption === option && option !== currentQuestion.answer && (
                <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Fullscreen Image Modal */}
      {imageModalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95">
          <button 
            onClick={() => setImageModalVisible(false)}
            className="absolute top-6 right-6 p-2 text-white bg-slate-800/80 hover:bg-slate-700 rounded-full"
          >
            <X className="w-8 h-8" />
          </button>
          <img 
            src={currentQuestion.image} 
            alt={currentQuestion.question}
            className="max-h-[80vh] max-w-[95vw] object-contain rounded-xl"
          />
        </div>
      )}
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
