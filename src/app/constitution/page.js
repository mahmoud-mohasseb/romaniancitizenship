'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  BookOpen, 
  ShieldCheck, 
  Search, 
  Bookmark, 
  CheckCircle2, 
  Sparkles, 
  ExternalLink, 
  Trophy, 
  FileText, 
  Maximize2, 
  X, 
  Lightbulb, 
  HelpCircle,
  Clock,
  Award,
  ChevronRight,
  ChevronLeft,
  Check,
  Building2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../components/Navbar';
import ImageModal from '../../components/ImageModal';
import AudioPlayerButton from '../../components/AudioPlayerButton';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import constitutionDb from '../../data/romanian_constitution.json';

function ConstitutionContent() {
  const searchParams = useSearchParams();

  const { theme } = useTheme();
  const { appLang, strings, isRtl } = useLanguage();
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState('official'); // 'official', 'citizenship_notes', 'scenarios', 'ccr', 'verification'
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarkedArticles, setBookmarkedArticles] = useState([]);
  const [readArticles, setReadArticles] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quizState, setQuizState] = useState({});

  useEffect(() => {
    const articleParam = searchParams.get('article');
    const catParam = searchParams.get('category');
    if (articleParam) setSearchQuery(articleParam);
    if (catParam) setActiveCategory(catParam);
  }, [searchParams]);

  const categories = constitutionDb.constitution.categories;
  const ccrDecisions = constitutionDb.constitution.ccr_decisions || [];
  const verificationMeta = constitutionDb.constitution.verification_meta;

  const toggleBookmark = (artNum) => {
    setBookmarkedArticles(prev => 
      prev.includes(artNum) ? prev.filter(a => a !== artNum) : [...prev, artNum]
    );
  };

  const toggleRead = (artNum) => {
    setReadArticles(prev => 
      prev.includes(artNum) ? prev.filter(a => a !== artNum) : [...prev, artNum]
    );
  };

  const handleScenarioSelect = (artNum, questionIdx, selectedIdx, correctIdx) => {
    setQuizState(prev => ({
      ...prev,
      [`${artNum}_${questionIdx}`]: { selectedIdx, correctIdx, isCorrect: selectedIdx === correctIdx }
    }));
  };

  // Flatten all articles across categories
  const allArticles = categories.flatMap(cat => 
    cat.articles.map(art => ({ 
      ...art, 
      categoryId: cat.id, 
      categoryTitle: cat.title_ro, 
      categoryTitleAr: cat.title_ar, 
      categoryImage: cat.image 
    }))
  );

  const filteredArticles = allArticles.filter(art => {
    const matchesCategory = activeCategory === 'all' || art.categoryId === activeCategory;
    const query = searchQuery.trim().toLowerCase();
    if (!query) return matchesCategory;

    const matchesNum = art.article_number.toString() === query || query.includes(`art ${art.article_number}`) || query.includes(`articolul ${art.article_number}`);
    const matchesText = 
      art.official_text_ro.toLowerCase().includes(query) ||
      (art.official_text_ar && art.official_text_ar.includes(query)) ||
      art.title_ro.toLowerCase().includes(query) ||
      (art.title_ar && art.title_ar.includes(query));

    return matchesCategory && (matchesNum || matchesText);
  });

  const readPercentage = Math.round((readArticles.length / Math.max(allArticles.length, 1)) * 100);

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
              <ShieldCheck className="w-4 h-4" />
              <span>{constitutionDb.constitution.title}</span>
            </span>

            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
              {readArticles.length} / {allArticles.length} {appLang === 'ar' ? 'مواد مقروءة' : 'Articles Read'} ({readPercentage}%)
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
            {appLang === 'ar' ? 'الدليل التفاعلي لدستور رومانيا النافذ (الأبواب I إلى VIII) 📖' : 'Interactive Romanian Constitution Guide (Titles I–VIII) 📖'}
          </h1>
          <p className="text-xs sm:text-sm text-theme-sub font-semibold leading-relaxed">
            {appLang === 'ar' 
              ? 'تصفح النصوص الرسمية للأبواب والمواد الدستورية النافذة، مع شروحات ميسّرة لمقابلة التجنيس، وقرارات المحكمة الدستورية (CCR).' 
              : 'Browse official in-force constitutional text across Titles I–VIII, paired with ANC interview notes and CCR landmark decisions.'}
          </p>

          {/* Reading Progress Bar */}
          <div className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden pt-0.5">
            <div 
              className="h-full bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 transition-all duration-300"
              style={{ width: `${readPercentage}%` }}
            />
          </div>
        </div>

        {/* Global Search Bar */}
        <div className={`relative flex items-center px-3.5 py-2.5 rounded-2xl border ${
          isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={appLang === 'ar' ? 'ابحث برقم المادة أو النص (مثال: المادة 1، البرلمان، 1 Decembrie)...' : 'Search article number or text...'}
            className="flex-1 px-3 bg-transparent outline-none text-xs sm:text-sm font-semibold placeholder:text-slate-500"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="p-1 text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {[
            { id: 'official', label_ar: '📜 المواد الدستورية النافذة', label_en: 'Official Articles In-Force' },
            { id: 'citizenship_notes', label_ar: '💡 ملاحظات مهمة للمقابلة', label_en: 'Citizenship Exam Notes' },
            { id: 'scenarios', label_ar: '🎯 أسئلة وتطبيقات تفاعلية', label_en: 'Interactive Scenarios' },
            { id: 'ccr', label_ar: '🏛️ قرارات المحكمة الدستورية CCR', label_en: 'CCR Rulings' },
            { id: 'verification', label_ar: '📅 توثيق المصدر والحالة', label_en: 'Verified Source Log' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-black whitespace-nowrap shrink-0 transition-all border ${
                activeTab === tab.id
                  ? 'bg-rose-600 text-white border-rose-600 shadow-md'
                  : isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-white text-slate-700 border-slate-200 shadow-sm'
              }`}
            >
              {appLang === 'ar' ? tab.label_ar : tab.label_en}
            </button>
          ))}
        </div>

        {/* Sub-Category Horizontal Filter */}
        {(activeTab === 'official' || activeTab === 'citizenship_notes' || activeTab === 'scenarios') && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all border ${
                activeCategory === 'all'
                  ? 'bg-amber-600 text-white border-amber-600 shadow-md'
                  : isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-white text-slate-700 border-slate-200 shadow-sm'
              }`}
            >
              {appLang === 'ar' ? 'جميع الأبواب' : 'All Titles'}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all border ${
                  activeCategory === cat.id
                    ? 'bg-amber-600 text-white border-amber-600 shadow-md'
                    : isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-white text-slate-700 border-slate-200 shadow-sm'
                }`}
              >
                {appLang === 'ar' ? cat.title_ar : cat.title_ro}
              </button>
            ))}
          </div>
        )}

        {/* Tab 1: Official Articles In-Force */}
        {activeTab === 'official' && (
          <div className="space-y-6 animate-fade-in-up">
            {filteredArticles.map((art) => {
              const isBookmarked = bookmarkedArticles.includes(art.article_number);
              const isRead = readArticles.includes(art.article_number);

              return (
                <motion.div
                  key={art.article_number}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-5 sm:p-6 rounded-3xl border space-y-4 shadow-xl relative overflow-hidden transition-all ${
                    isDark ? 'bg-slate-800/90 border-slate-700/80 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-black">
                        Articolul {art.article_number}
                      </span>
                      <h3 className="text-sm sm:text-base font-black">
                        {art.title_ro} {art.title_ar ? `• ${art.title_ar}` : ''}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleBookmark(art.article_number)}
                        className={`p-2 rounded-xl border transition-all ${
                          isBookmarked 
                            ? 'bg-amber-500 text-slate-950 border-amber-400' 
                            : isDark ? 'bg-slate-900 border-slate-700 text-slate-400 hover:text-amber-400' : 'bg-slate-100 border-slate-200 text-slate-600'
                        }`}
                        title="حفظ المادة للمراجعة 🔖"
                      >
                        <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                      </button>

                      <button
                        onClick={() => toggleRead(art.article_number)}
                        className={`p-2 rounded-xl border transition-all ${
                          isRead 
                            ? 'bg-emerald-600 text-white border-emerald-500' 
                            : isDark ? 'bg-slate-900 border-slate-700 text-slate-400 hover:text-emerald-400' : 'bg-slate-100 border-slate-200 text-slate-600'
                        }`}
                        title="تعليم كمقروءة ✅"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Official Romanian Text */}
                  <div className={`p-4 rounded-2xl border space-y-2 ${
                    isDark ? 'bg-slate-900/90 border-slate-700/80 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}>
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                      <span className="text-[10px] font-black text-rose-500 uppercase tracking-wider block">
                        🇷🇴 Textul Oficial din Constituția României:
                      </span>
                      <AudioPlayerButton text={art.official_text_ro} lang="ro" label="استمع للنص الرسمي" />
                    </div>
                    <p className="text-xs sm:text-sm font-extrabold leading-relaxed text-rose-400">
                      {art.official_text_ro}
                    </p>

                    {art.official_text_ar && (
                      <p className="text-xs sm:text-sm font-bold text-slate-300 pt-1 leading-relaxed border-t border-slate-800/80">
                        🇸🇦 الترجمة الرسمية: {art.official_text_ar}
                      </p>
                    )}
                  </div>

                  {/* Simplified Educational Explanation */}
                  <div className={`p-4 rounded-2xl border-2 space-y-2 ${
                    isDark ? 'bg-amber-500/10 border-amber-500/30 text-amber-200' : 'bg-amber-50 border-amber-300 text-amber-950'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black text-amber-400 flex items-center gap-1.5">
                        <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>{appLang === 'ar' ? 'الشرح والمفهوم التعليمي الميسّر للمقابلة:' : 'Simplified Educational Concept:'}</span>
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-bold leading-relaxed">
                      {appLang === 'ar' ? art.simplified_explanation_ar : art.simplified_explanation_en}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Citizenship Exam Notes */}
        {activeTab === 'citizenship_notes' && (
          <div className="space-y-4 animate-fade-in-up">
            {filteredArticles.map((art) => (
              <div key={art.article_number} className={`p-5 rounded-3xl border space-y-3 shadow-lg ${
                isDark ? 'bg-slate-800/90 border-slate-700' : 'bg-white border-slate-200'
              }`}>
                <div className="flex items-center justify-between border-b border-slate-700/60 pb-2">
                  <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-black">
                    Articolul {art.article_number}
                  </span>
                  <h4 className="text-xs font-black text-slate-300">{art.title_ro}</h4>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 space-y-1">
                  <span className="text-xs font-black flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>أهمية المادة لمقابلة لجنة التجنيس (ANC):</span>
                  </span>
                  <p className="text-xs font-semibold leading-relaxed">{art.why_it_matters_ar}</p>
                </div>

                {art.vocabulary && art.vocabulary.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {art.vocabulary.map((v, vIdx) => (
                      <span key={vIdx} className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-200">
                        🇷🇴 {v.ro} → 🇸🇦 {v.ar}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Interactive Practice & Scenarios */}
        {activeTab === 'scenarios' && (
          <div className="space-y-4 animate-fade-in-up">
            {filteredArticles.filter(art => art.practice_questions && art.practice_questions.length > 0).map((art) => (
              <div key={art.article_number} className={`p-5 sm:p-6 rounded-3xl border space-y-4 shadow-xl ${
                isDark ? 'bg-slate-800/90 border-slate-700' : 'bg-white border-slate-200'
              }`}>
                <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-black">
                  تطبيق تفاعلي للمادة {art.article_number} ({art.title_ro})
                </span>

                {art.practice_questions.map((q, qIdx) => {
                  const stateKey = `${art.article_number}_${qIdx}`;
                  const currentQuizState = quizState[stateKey];

                  return (
                    <div key={qIdx} className="space-y-3 pt-2">
                      <h4 className="text-xs sm:text-sm font-black text-white">{q.question_ar}</h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = currentQuizState?.selectedIdx === optIdx;
                          const isCorrectOpt = optIdx === q.correctIndex;
                          let btnClass = isDark ? 'bg-slate-900 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-800';

                          if (currentQuizState) {
                            if (isCorrectOpt) btnClass = 'bg-emerald-600 text-white border-emerald-500 font-black';
                            else if (isSelected) btnClass = 'bg-rose-600 text-white border-rose-500 font-black';
                          }

                          return (
                            <button
                              key={optIdx}
                              onClick={() => handleScenarioSelect(art.article_number, qIdx, optIdx, q.correctIndex)}
                              className={`p-3 rounded-2xl border text-xs text-right font-bold transition-all ${btnClass}`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      {currentQuizState && (
                        <p className="text-xs font-bold text-emerald-400 pt-1">
                          💡 {q.explanation_ar}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Constitutional Court (CCR) Rulings */}
        {activeTab === 'ccr' && (
          <div className="space-y-4 animate-fade-in-up">
            {ccrDecisions.map((ccr) => (
              <div key={ccr.id} className={`p-5 rounded-3xl border space-y-2 shadow-lg ${
                isDark ? 'bg-slate-800/90 border-slate-700' : 'bg-white border-slate-200'
              }`}>
                <div className="flex items-center justify-between border-b border-slate-700/60 pb-2">
                  <span className="px-3 py-1 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs font-black">
                    🏛️ Curtea Constituțională (CCR)
                  </span>
                  <span className="text-xs font-bold text-slate-400">{ccr.date}</span>
                </div>

                <h3 className="text-sm sm:text-base font-black">{ccr.title_ro}</h3>
                <p className="text-xs text-theme-sub font-semibold leading-relaxed">{ccr.summary_ar}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tab 5: Verified Source Log */}
        {activeTab === 'verification' && (
          <div className="space-y-4 animate-fade-in-up">
            <div className={`p-5 rounded-3xl border space-y-3 ${isDark ? 'bg-slate-800/90 border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-2">
                <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-black">
                  {verificationMeta.status}
                </span>
                <span className="text-xs font-bold text-slate-400">آخر تدقيق: {verificationMeta.last_verified}</span>
              </div>

              <p className="text-xs text-slate-300 font-bold leading-relaxed">{verificationMeta.legal_notice_ar}</p>
              <p className="text-xs text-rose-400 font-mono">المصدر الرسمي: {verificationMeta.official_source}</p>
            </div>
          </div>
        )}

        {/* Action Buttons Footer */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Link
            href="/quiz?category=constitution"
            className="py-3.5 px-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md hover:opacity-95 transition-all"
          >
            <Trophy className="w-4 h-4" />
            <span>اختبر معلوماتك الدستورية 🎯</span>
          </Link>

          <Link
            href="/constitution-writing"
            className="py-3.5 px-3 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-600 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md hover:opacity-95 transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>تدرب على صياغة الإجابات ✍️</span>
          </Link>
        </div>
      </main>

      <ImageModal 
        isOpen={selectedImage !== null}
        onClose={() => setSelectedImage(null)}
        imageUrl={selectedImage}
        title="Constituția României"
      />
    </div>
  );
}

export default function ConstitutionPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400 font-bold">Loading Constitution Portal...</div>}>
      <ConstitutionContent />
    </Suspense>
  );
}
