'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw, 
  Send, 
  BookOpen, 
  Sparkles, 
  HelpCircle, 
  ShieldCheck, 
  Trash2,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../components/Navbar';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import constitutionData from '../../data/romanian_constitution_writing.json';
import { getTranslation } from '../../utils/languageHelper';

export default function ConstitutionWritingPage() {
  const { theme } = useTheme();
  const { appLang, strings, isRtl } = useLanguage();
  const isDark = theme === 'dark';

  const [activeMode, setActiveMode] = useState('guided');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [evaluation, setEvaluation] = useState(null);

  const filteredTopics = constitutionData.filter(t => activeMode === 'all' || t.mode === activeMode);
  const currentTopic = filteredTopics[currentIndex] || constitutionData[0];

  useEffect(() => {
    setCurrentIndex(0);
    setUserAnswer('');
    setIsSubmitted(false);
    setEvaluation(null);
  }, [activeMode]);

  const handleTextChange = (e) => {
    setUserAnswer(e.target.value);
  };

  const handleClear = () => {
    setUserAnswer('');
    setIsSubmitted(false);
    setEvaluation(null);
  };

  const handleEvaluate = () => {
    if (!userAnswer.trim()) return;

    const lowerAns = userAnswer.toLowerCase();
    const expected = currentTopic.key_concepts_expected || [];
    
    const matchedConcepts = expected.filter(concept => lowerAns.includes(concept.toLowerCase()));
    const missingConcepts = expected.filter(concept => !lowerAns.includes(concept.toLowerCase()));
    
    const diacritics = ['ă', 'â', 'î', 'ș', 'ț'];
    const usedDiacritics = diacritics.filter(d => lowerAns.includes(d));

    const scorePercentage = Math.round((matchedConcepts.length / Math.max(expected.length, 1)) * 100);

    setEvaluation({
      matchedConcepts,
      missingConcepts,
      usedDiacritics,
      scorePercentage,
      passed: scorePercentage >= 60
    });

    setIsSubmitted(true);
  };

  const wordCount = userAnswer.trim() ? userAnswer.trim().split(/\s+/).length : 0;
  const charCount = userAnswer.length;

  const handleNextTopic = () => {
    if (currentIndex < filteredTopics.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setUserAnswer('');
      setIsSubmitted(false);
      setEvaluation(null);
    }
  };

  const handlePrevTopic = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setUserAnswer('');
      setIsSubmitted(false);
      setEvaluation(null);
    }
  };

  return (
    <div className="min-h-screen pb-28 sm:pb-24 bg-theme-main text-theme-main flex flex-col font-latin">
      <Navbar />

      <main className={`flex-1 w-full max-w-4xl mx-auto px-4 py-6 space-y-6 animate-fade-in-up ${
        isRtl ? 'lg:mr-72' : 'lg:ml-72'
      } ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
        
        {/* Header Title Banner */}
        <div className={`p-6 rounded-3xl border shadow-xl flex flex-col space-y-3 ${
          isDark ? 'bg-slate-800/90 border-slate-700/80' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-500/20 text-rose-400 border border-rose-500/30">
              🇷🇴 Constituția României
            </span>
            <span className="text-xs font-bold text-theme-sub">
              {strings.constitutionWritingTitle || 'اختبار كتابة وتطبيق الدستور الروماني ✍️'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            {strings.constitutionWritingTitle || 'اختبار كتابة وتطبيق الدستور الروماني ✍️'}
          </h1>
          <p className="text-xs sm:text-sm text-theme-sub leading-relaxed">
            {strings.constitutionWritingSubtitle || 'تدرب على كتابة الإجابات وفهم مفاهيم ومواد الدستور الروماني للمقابلة الرسمية'}
          </p>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            <button
              onClick={() => setActiveMode('guided')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${
                activeMode === 'guided'
                  ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-600/30'
                  : isDark ? 'bg-slate-900/60 border-slate-700/60 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>{strings.guidedWriting || 'كتابة موجهة'}</span>
            </button>

            <button
              onClick={() => setActiveMode('questions')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${
                activeMode === 'questions'
                  ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-600/30'
                  : isDark ? 'bg-slate-900/60 border-slate-700/60 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>{strings.constitutionQuestions || 'أسئلة دستورية'}</span>
            </button>

            <button
              onClick={() => setActiveMode('article')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${
                activeMode === 'article'
                  ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-600/30'
                  : isDark ? 'bg-slate-900/60 border-slate-700/60 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>{strings.keyArticlePractice || 'المواد الرئيسية'}</span>
            </button>
          </div>
        </div>

        {/* Topic Card & Official Constitution Reference */}
        <div className={`p-6 rounded-3xl border shadow-xl space-y-4 ${
          isDark ? 'bg-slate-800/90 border-slate-700/80' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between border-b pb-3 border-slate-700/50">
            <span className="text-xs font-bold text-rose-500 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>{getTranslation(currentTopic, 'topic', appLang)}</span>
            </span>
            <span className="text-xs font-bold text-theme-sub">
              {currentIndex + 1} / {filteredTopics.length}
            </span>
          </div>

          {/* Official Romanian Constitution Text Box */}
          <div className={`p-4 rounded-2xl border space-y-2 ${
            isDark ? 'bg-slate-900/90 border-slate-700/80 text-amber-300/90' : 'bg-amber-50/80 border-amber-200 text-amber-900'
          }`}>
            <span className="text-[11px] font-black text-rose-400 block uppercase tracking-wider">
              {strings.officialTextLabel || '📜 النص الدستوري الرسمي (Constituția României):'}
            </span>
            <p className="text-sm font-bold leading-relaxed font-latin italic">
              "{currentTopic.official_text_ro}"
            </p>
          </div>

          {/* Simplified Explanation & Key Vocabulary */}
          <div className="space-y-2">
            <span className="text-[11px] font-black text-emerald-400 block">
              {strings.simplifiedExpLabel || '💡 الشرح المبسط والمفردات:'}
            </span>
            <p className="text-xs sm:text-sm text-theme-sub leading-relaxed font-bold">
              {appLang === 'ar' ? currentTopic.simplified_explanation_ar : currentTopic.simplified_explanation_en}
            </p>

            {currentTopic.vocabulary && (
              <div className="flex flex-wrap gap-2 pt-1">
                {currentTopic.vocabulary.map((vocab, vIdx) => (
                  <span 
                    key={vIdx}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center gap-1"
                  >
                    <span className="font-black">{vocab.ro}</span>
                    <span className="text-[10px] opacity-75">({appLang === 'ar' ? vocab.ar : vocab.en})</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Writing Prompt */}
          <div className="pt-2 border-t border-slate-700/50 space-y-2">
            <span className="text-xs font-black text-rose-500 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>السؤال المطلوب صياغته بكتابتك بالرومانية:</span>
            </span>
            <h3 className="text-base sm:text-lg font-black text-theme-main">
              {getTranslation(currentTopic, 'writing_prompt', appLang)}
            </h3>
          </div>

          {/* Large Writing Textarea Area */}
          <div className="space-y-2 pt-2">
            <div className="relative">
              <textarea
                value={userAnswer}
                onChange={handleTextChange}
                placeholder="Scrieți răspunsul dumneavoastră în limba română aici... (أكتب إجابتك باللغة الرومانية هنا)"
                rows={5}
                className={`w-full p-4 rounded-2xl border font-latin text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all ${
                  isDark ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                }`}
                dir="ltr"
              />
            </div>

            {/* Word & Character Counters */}
            <div className="flex items-center justify-between text-xs text-theme-sub font-bold px-1">
              <div className="flex items-center gap-3">
                <span>{strings.wordCount || 'الكلمات'}: <strong className="text-rose-500">{wordCount}</strong></span>
                <span>{strings.charCount || 'الأحرف'}: <strong className="text-rose-500">{charCount}</strong></span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handleClear}
                  disabled={!userAnswer}
                  className="px-3 py-1.5 rounded-xl border border-slate-700 text-slate-400 hover:text-rose-400 disabled:opacity-30 transition-all flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{strings.clearText || 'مسح'}</span>
                </button>

                <button
                  onClick={handleEvaluate}
                  disabled={!userAnswer.trim()}
                  className="px-4 py-2 bg-gradient-to-r from-rose-600 to-amber-600 hover:opacity-95 text-white font-black rounded-xl text-xs shadow-md disabled:opacity-40 transition-all flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{strings.submitWriting || 'تقديم وتدقيق الإجابة 🚀'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Submission Evaluation Result & Model Suggested Answer */}
        {isSubmitted && evaluation && (
          <div className={`p-6 rounded-3xl border shadow-xl space-y-4 animate-scale-in ${
            evaluation.passed 
              ? isDark ? 'bg-slate-800/90 border-emerald-500/50' : 'bg-emerald-50/90 border-emerald-300'
              : isDark ? 'bg-slate-800/90 border-rose-500/50' : 'bg-rose-50/90 border-rose-300'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 border-slate-700/50">
              <div className="flex items-center gap-2">
                {evaluation.passed ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-rose-400" />
                )}
                <h3 className="text-base font-black">
                  {evaluation.passed ? 'إجابة ممتازة ومطابقة للمفاهيم الرئيسية! 🎉' : 'إجابة تحتاج إلى إضافة بعض المفاهيم الدستورية 💡'}
                </h3>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-black border ${
                evaluation.passed ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
              }`}>
                {evaluation.scorePercentage}% {strings.score || 'النتيجة'}
              </span>
            </div>

            {/* Structured Progression View: Question -> User Answer -> Evaluation -> Suggested Answer */}
            <div className="space-y-3">
              {/* User Answer Display */}
              <div className="p-3.5 rounded-xl bg-black/20 border border-white/10 space-y-1">
                <span className="text-[10px] font-bold text-slate-400">إجابتك المكتوبة (Your Answer):</span>
                <p className="text-sm font-bold font-latin text-white">{userAnswer}</p>
              </div>

              {/* Matched & Missing Concepts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                  <span className="text-[11px] font-bold text-emerald-400 block">{strings.expectedConcepts || 'المفاهيم المطلوبة المكتشفة:'}</span>
                  <div className="flex flex-wrap gap-1">
                    {evaluation.matchedConcepts.length > 0 ? (
                      evaluation.matchedConcepts.map((mc, mIdx) => (
                        <span key={mIdx} className="px-2 py-0.5 rounded text-[11px] font-black bg-emerald-500/20 text-emerald-300">
                          ✓ {mc}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400">لم يتم اكتشاف مفاهيم مطابقة في الإجابة</span>
                    )}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                  <span className="text-[11px] font-bold text-amber-400 block">{strings.missingConcepts || 'مفاهيم يُنصح بإضافتها:'}</span>
                  <div className="flex flex-wrap gap-1">
                    {evaluation.missingConcepts.length > 0 ? (
                      evaluation.missingConcepts.map((mc, mIdx) => (
                        <span key={mIdx} className="px-2 py-0.5 rounded text-[11px] font-black bg-amber-500/20 text-amber-300">
                          + {mc}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-emerald-400 font-bold">رائع! قمت بذكر جميع المفاهيم المطلوبة</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Diacritics Note */}
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-300 flex items-center justify-between">
                <span>{strings.grammarFeedback || 'ملاحظات الحروف الرومانية الخاصّة (Ă, Â, Î, Ș, Ț):'}</span>
                <span>
                  {evaluation.usedDiacritics.length > 0 
                    ? `استخدمت ${evaluation.usedDiacritics.join(', ')} 👍` 
                    : 'ينصح باستخدام الحروف الخاصة (ă, ș, ț) في الإجابات الرسمية'}
                </span>
              </div>

              {/* Suggested Model Official Answer */}
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-2">
                <span className="text-[11px] font-black text-rose-400 block">
                  {strings.suggestedAnswerLabel || '🇷🇴 الإجابة النموذجية المقترحة بالرومانية:'}
                </span>
                <p className="text-sm font-black text-white leading-relaxed font-latin">
                  {currentTopic.suggested_answer_ro}
                </p>
                <p className="text-xs text-theme-sub pt-1 leading-relaxed font-bold">
                  🇸🇦 {appLang === 'ar' ? currentTopic.suggested_answer_ar : currentTopic.suggested_answer_en}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Navigation Pagination */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={handlePrevTopic}
            disabled={currentIndex === 0}
            className={`py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border transition-all disabled:opacity-40 ${
              isDark ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-800 shadow-sm hover:bg-slate-100'
            }`}
          >
            {isRtl ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            <span>{strings.prev || 'السابق'}</span>
          </button>

          <button
            onClick={handleNextTopic}
            disabled={currentIndex === filteredTopics.length - 1}
            className="py-3.5 px-4 bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white font-bold text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-rose-600/30 transition-all"
          >
            <span>{strings.next || 'التالي'}</span>
            {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </main>
    </div>
  );
}
