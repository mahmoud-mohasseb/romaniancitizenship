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
  Award,
  ChevronLeft,
  ChevronRight,
  Lightbulb
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
import { recordQuestionAnswered } from '../../utils/analyticsCounter';

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

  // Exact 25 Questions per difficulty level test session
  const totalQuestionsLimit = 25;
  const initialTimeSeconds = quizMode === 'exam' ? 25 * 60 : null;

  const [sessionQuestions, setSessionQuestions] = useState([]);
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

  const loadQuestionAtIndex = (index, pool) => {
    const qList = pool || sessionQuestions;
    if (index >= totalQuestionsLimit || index >= qList.length) {
      finishQuiz();
      return;
    }

    const currentQ = qList[index];
    const levelOpts = generateLevelOptions(currentQ, questions, difficultyLevel);

    setCurrentQuestion(currentQ);
    setOptions(levelOpts);
    setSelectedOption(null);
    setQuestionCount(index + 1);
  };

  const handleOptionSelect = (option) => {
    if (selectedOption !== null) return;

    setSelectedOption(option);
    recordQuestionAnswered();
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
      if (questionCount >= totalQuestionsLimit || questionCount >= sessionQuestions.length) {
        finishQuiz();
      } else {
        loadQuestionAtIndex(questionCount, sessionQuestions);
      }
    }, 1800);
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

    const pool = getQuestionPoolForLevel(questions, difficultyLevel, selectedCategory);
    const shuffledPool = shuffleArray(pool.length >= totalQuestionsLimit ? pool : questions);
    const selected25 = shuffledPool.slice(0, totalQuestionsLimit);
    setSessionQuestions(selected25);

    if (selected25.length > 0) {
      loadQuestionAtIndex(0, selected25);
    }
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
                <span>🏆 EXAM PASSED CERTIFIED! 🎉</span>
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
                {difficultyLevel === 'hard' ? strings.level3Hard : difficultyLevel === 'medium' ? strings.level2Medium : strings.level1Easy} (25 Questions)
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
                {score} / 25
              </p>
              <p className="text-xs font-bold text-theme-sub">{strings.score}: {percentage}% (Pass Mark: {passThreshold}%)</p>
            </div>

            {/* Personalized Recommendations Section */}
            {recommendations.length > 0 && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-right space-y-2.5">
                <span className="text-xs font-black text-rose-400 block">
                  {strings.learningRecommendations || 'توصيات المذاكرة والمراجعة بناءً على أدائك:'}
                </span>
                <div className="space-y-2">
                  {recommendations.map((rec, rIdx) => (
                    <Link
                      key={rIdx}
                      href={rec.href}
                      className="p-3 rounded-xl bg-slate-900/80 border border-rose-500/20 flex items-center justify-between text-xs font-bold text-white hover:border-rose-500 transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>{rec.title_ar}</span>
                      </div>
                      {isRtl ? <ChevronLeft className="w-4 h-4 text-rose-400" /> : <ChevronRight className="w-4 h-4 text-rose-400" />}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Wrong Answers Review Drawer Toggle */}
            {wrongAnswers.length > 0 && (
              <button
                onClick={() => setShowReviewModal(true)}
                className="w-full py-3 px-4 rounded-2xl border border-rose-500/40 text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition-all flex items-center justify-center gap-2"
              >
                <AlertCircle className="w-4 h-4" />
                <span>مراجعة الأسئلة الخاطئة ({wrongAnswers.length} أسئلة)</span>
              </button>
            )}

            <button
              onClick={resetQuiz}
              className="w-full py-3.5 bg-gradient-to-r from-rose-600 via-rose-700 to-amber-600 hover:opacity-95 text-white font-extrabold rounded-2xl flex items-center justify-center space-x-2 space-x-reverse shadow-xl text-sm transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{strings.retryQuiz || 'إعادة الاختبار (25 سؤالاً جديداً)'}</span>
            </button>
          </div>
        </main>

        {/* Incorrect Questions Review Modal */}
        {showReviewModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className={`max-w-2xl w-full max-h-[85vh] rounded-3xl p-6 border shadow-2xl overflow-y-auto space-y-4 ${
              isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}>
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <h3 className="text-base font-black text-rose-500">مراجعة الإجابات الخاطئة ({wrongAnswers.length})</h3>
                <button onClick={() => setShowReviewModal(false)} className="p-2 rounded-xl border border-slate-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {wrongAnswers.map((item, wIdx) => (
                  <div key={wIdx} className="p-4 rounded-2xl border border-slate-700/60 bg-slate-800/40 space-y-2 text-right">
                    <p className="text-xs font-bold text-white font-latin">{item.question.question}</p>
                    <p className="text-xs font-bold text-amber-300">🇸🇦 {getQuestionText(item.question, appLang)}</p>
                    <div className="pt-1 space-y-1 text-xs font-bold">
                      <p className="text-rose-400">إجابتك: {item.userAnswer}</p>
                      <p className="text-emerald-400">الإجابة الصحيحة: {item.correctAnswer}</p>
                    </div>
                    {(item.question.explanation_ar || item.question.explanation_en) && (
                      <div className="pt-2 border-t border-slate-700/40 space-y-2">
                        <p className="text-[11px] text-slate-300 leading-relaxed font-semibold">
                          💡 {appLang === 'ar' ? item.question.explanation_ar : item.question.explanation_en}
                        </p>
                        {item.question.category === 'constitution' && (
                          <Link
                            href="/constitution"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold hover:bg-emerald-600/30 transition-all"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>اقرأ مواد الدستور ذات الصلة 📖</span>
                          </Link>
                        )}
                      </div>
                    )}
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

  const isFlagged = flaggedIds.includes(currentQuestion.id);
  const imageSrc = currentQuestion.image || currentQuestion.image_url;

  return (
    <div className="min-h-screen pb-28 sm:pb-24 bg-theme-main text-theme-main flex flex-col font-latin">
      <Navbar />

      <main className={`flex-1 w-full max-w-4xl mx-auto px-4 py-6 space-y-5 animate-fade-in-up ${
        isRtl ? 'lg:mr-72' : 'lg:ml-72'
      } ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
        
        {/* Difficulty Level Selector Tabs (Easy 🟢, Medium 🟡, Hard 🔴) */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setDifficultyLevel('easy')}
            className={`py-2.5 px-2 rounded-2xl text-xs font-black border transition-all flex items-center justify-center gap-1.5 ${
              difficultyLevel === 'easy'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/30'
                : isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-white text-slate-700 border-slate-200'
            }`}
          >
            <span>🟢</span>
            <span>{strings.level1Easy || 'سهل (25)'}</span>
          </button>

          <button
            onClick={() => setDifficultyLevel('medium')}
            className={`py-2.5 px-2 rounded-2xl text-xs font-black border transition-all flex items-center justify-center gap-1.5 ${
              difficultyLevel === 'medium'
                ? 'bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-600/30'
                : isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-white text-slate-700 border-slate-200'
            }`}
          >
            <span>🟡</span>
            <span>{strings.level2Medium || 'متوسط (25)'}</span>
          </button>

          <button
            onClick={() => setDifficultyLevel('hard')}
            className={`py-2.5 px-2 rounded-2xl text-xs font-black border transition-all flex items-center justify-center gap-1.5 ${
              difficultyLevel === 'hard'
                ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-600/30'
                : isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-white text-slate-700 border-slate-200'
            }`}
          >
            <span>🔴</span>
            <span>{strings.level3Hard || 'صعب (25)'}</span>
          </button>
        </div>

        {/* Top Control Bar: Progress Indicator & Flag */}
        <div className={`p-4 rounded-2xl border flex items-center justify-between shadow-sm ${
          isDark ? 'bg-slate-800/80 border-slate-700/60' : 'bg-white border-slate-200'
        }`}>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-md bg-rose-500/15 text-rose-500 border border-rose-500/20">
                {strings.question} {questionCount} / 25
              </span>
              <span className="text-xs font-black text-emerald-400">
                {score} {strings.correctBadge || 'صحيحة'}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-48 sm:w-64 h-2 bg-slate-700/50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 transition-all duration-300"
                style={{ width: `${(questionCount / 25) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleFlag(currentQuestion.id)}
              className={`p-2.5 rounded-xl border transition-all ${
                isFlagged 
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold' 
                  : isDark ? 'bg-slate-900 border-slate-700 text-slate-400 hover:text-amber-400' : 'bg-slate-100 border-slate-200 text-slate-600'
              }`}
              title="علم السؤال للمراجعة 🚩"
            >
              <Flag className={`w-4 h-4 ${isFlagged ? 'fill-current' : ''}`} />
            </button>

            {quizMode === 'exam' && (
              <div className="px-3 py-2 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-400 font-mono font-bold text-xs flex items-center gap-1.5">
                <Timer className="w-4 h-4 animate-pulse" />
                <span>{formatTimer(timeLeft)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Main Question Flashcard */}
        <div className={`p-5 sm:p-6 rounded-3xl border space-y-4 shadow-xl animate-scale-in ${
          isDark ? 'bg-slate-800/90 border-slate-700/80 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}>
          {imageSrc && (
            <div 
              className="relative w-full h-48 sm:h-64 rounded-2xl overflow-hidden border-2 border-slate-700/60 bg-slate-950 cursor-pointer shadow-lg group"
              onClick={() => setImageModalVisible(true)}
            >
              <img 
                src={imageSrc} 
                alt={currentQuestion.question}
                onError={(e) => {
                  e.currentTarget.src = '/icon.png';
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}

          <div className="space-y-1.5 border-b border-slate-700/60 pb-3">
            <span className="text-[10px] font-bold text-rose-500">🇷🇴 Întrebarea #{currentQuestion.id}:</span>
            <h2 className="text-base sm:text-lg font-black leading-snug">{currentQuestion.question}</h2>
            <p className="text-xs text-theme-sub font-bold pt-1">
              🇸🇦 {getQuestionText(currentQuestion, appLang)}
            </p>
          </div>

          {/* Plausible Distractor Options List */}
          <div className="space-y-2.5 pt-1">
            {options.map((option, idx) => {
              const optionLabels = ['A', 'B', 'C', 'D'];
              const isSelected = selectedOption === option;
              const isCorrectOpt = option === currentQuestion.answer;
              let btnStyle = isDark 
                ? 'bg-slate-900/90 border-slate-700 hover:border-amber-500 text-slate-200' 
                : 'bg-slate-50 border-slate-200 hover:border-amber-500 text-slate-800 shadow-sm';

              if (selectedOption !== null) {
                if (isCorrectOpt) {
                  btnStyle = 'bg-emerald-600 text-white border-emerald-600 font-black scale-[1.01] shadow-lg shadow-emerald-600/30';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-600 text-white border-rose-600 font-black';
                }
              }

              return (
                <motion.button
                  key={idx}
                  whileHover={{ scale: selectedOption === null ? 1.01 : 1 }}
                  whileTap={{ scale: selectedOption === null ? 0.98 : 1 }}
                  disabled={selectedOption !== null}
                  onClick={() => handleOptionSelect(option)}
                  className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between text-right font-bold text-xs sm:text-sm ${btnStyle}`}
                >
                  <span className="w-6 h-6 rounded-lg bg-black/20 text-white border border-white/20 flex items-center justify-center font-mono text-xs shrink-0">
                    {optionLabels[idx]}
                  </span>
                  <span className="flex-1 px-3 leading-relaxed font-bold">{option}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Explanation Banner on Option Selection */}
          {selectedOption !== null && (currentQuestion.explanation_ar || currentQuestion.explanation_en) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-2xl border-2 text-xs font-bold space-y-1 shadow-inner ${
                selectedOption === currentQuestion.answer
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
              }`}
            >
              <span className="flex items-center gap-1.5 font-black text-amber-400">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{selectedOption === currentQuestion.answer ? 'إجابة صحيحة! التوضيح 💡' : 'الإجابة الصحيحة هي: ' + currentQuestion.answer}</span>
              </span>
              <p className="text-slate-300 leading-relaxed font-semibold">
                {appLang === 'ar' ? currentQuestion.explanation_ar : (currentQuestion.explanation_en || currentQuestion.explanation_ar)}
              </p>
            </motion.div>
          )}
        </div>
      </main>

      <ImageModal 
        isOpen={imageModalVisible}
        onClose={() => setImageModalVisible(false)}
        imageUrl={imageSrc}
        title={currentQuestion?.question}
        caption={getQuestionText(currentQuestion, appLang)}
      />
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400 font-bold">Loading Citizenship Quiz...</div>}>
      <QuizContent />
    </Suspense>
  );
}
