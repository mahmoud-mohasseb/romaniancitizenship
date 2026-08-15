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
  ChevronRight,
  ChevronLeft
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

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarkedArticles, setBookmarkedArticles] = useState([]);
  const [readArticles, setReadArticles] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [viewMode, setViewMode] = useState('both'); // 'both', 'official', 'simplified'

  useEffect(() => {
    const articleParam = searchParams.get('article');
    const catParam = searchParams.get('category');
    if (articleParam) setSearchQuery(articleParam);
    if (catParam) setActiveCategory(catParam);
  }, [searchParams]);

  const categories = constitutionDb.constitution.categories;

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

  // Flatten all articles across categories
  const allArticles = categories.flatMap(cat => 
    cat.articles.map(art => ({ ...art, categoryId: cat.id, categoryTitle: cat.title_ro, categoryTitleAr: cat.title_ar, categoryImage: cat.image }))
  );

  const filteredArticles = allArticles.filter(art => {
    const matchesCategory = activeCategory === 'all' || art.categoryId === activeCategory;
    const query = searchQuery.trim().toLowerCase();
    if (!query) return matchesCategory;

    const matchesNum = art.article_number.toString() === query || query.includes(`art ${art.article_number}`) || query.includes(`articolul ${art.article_number}`);
    const matchesText = 
      art.official_text_ro.toLowerCase().includes(query) ||
      (art.official_text_ar && art.official_text_ar.includes(query)) ||
      (art.official_text_en && art.official_text_en.toLowerCase().includes(query)) ||
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
        <div className={`p-6 rounded-3xl border shadow-xl flex flex-col space-y-3 ${
          isDark ? 'bg-slate-800/90 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="px-3.5 py-1 rounded-full text-xs font-black bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>🇷🇴 Constituția României</span>
            </span>

            <span className="text-xs font-bold text-emerald-400">
              {readArticles.length} / {allArticles.length} {appLang === 'ar' ? 'مواد مقروءة' : 'Articles Read'} ({readPercentage}%)
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
            {appLang === 'ar' ? 'الدليل التفاعلي الكامل لدستور رومانيا 📖' : appLang === 'en' ? 'Interactive Romanian Constitution Guide 📖' : 'Ghidul Interactiv al Constituției României 📖'}
          </h1>
          <p className="text-xs sm:text-sm text-theme-sub font-semibold leading-relaxed">
            {appLang === 'ar' 
              ? 'تصفح النصوص الرسمية للأبواب والمواد الدستورية، مع شروحات تعليمية مبسطة وملاحظات التركيز لاختبار الحصول على الجنسية.' 
              : 'Browse official constitutional texts paired with simplified educational notes and citizenship exam importance points.'}
          </p>

          {/* Reading Progress Bar */}
          <div className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden pt-0.5">
            <div 
              className="h-full bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 transition-all duration-300"
              style={{ width: `${readPercentage}%` }}
            />
          </div>
        </div>

        {/* Search Bar & View Mode Toggles */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search Input */}
          <div className={`relative flex-1 w-full flex items-center px-3.5 py-2.5 rounded-2xl border ${
            isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={appLang === 'ar' ? 'ابحث برقم المادة أو النص (مثال: المادة 1، البرلمان)...' : 'Search by article number or text...'}
              className="flex-1 px-3 bg-transparent outline-none text-xs sm:text-sm font-semibold placeholder:text-slate-500"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="p-1 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* View Mode Filters */}
          <div className="flex items-center gap-1 shrink-0 w-full sm:w-auto">
            <button
              onClick={() => setViewMode('both')}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                viewMode === 'both' ? 'bg-rose-600 text-white border-rose-600' : isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-white text-slate-700 border-slate-200'
              }`}
            >
              {appLang === 'ar' ? 'النص والشرح 📖' : 'Text & Explanation'}
            </button>
            <button
              onClick={() => setViewMode('official')}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                viewMode === 'official' ? 'bg-rose-600 text-white border-rose-600' : isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-white text-slate-700 border-slate-200'
              }`}
            >
              {appLang === 'ar' ? 'النص الرسمي فقط 🇷🇴' : 'Official Text Only'}
            </button>
          </div>
        </div>

        {/* Category Horizontal Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all border ${
              activeCategory === 'all'
                ? 'bg-rose-600 text-white border-rose-600 shadow-md'
                : isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-white text-slate-700 border-slate-200 shadow-sm'
            }`}
          >
            {appLang === 'ar' ? 'جميع المواد الدستورية' : 'All Titles'}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all border ${
                activeCategory === cat.id
                  ? 'bg-rose-600 text-white border-rose-600 shadow-md'
                  : isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-white text-slate-700 border-slate-200 shadow-sm'
              }`}
            >
              {appLang === 'ar' ? cat.title_ar : cat.title_ro}
            </button>
          ))}
        </div>

        {/* Article Cards Grid List */}
        <div className="space-y-6">
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
                {/* Article Card Header */}
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

                {/* Category Image Banner Preview */}
                {art.categoryImage && (
                  <div 
                    className="relative w-full h-44 sm:h-56 rounded-2xl overflow-hidden border border-slate-700/60 bg-slate-950 cursor-pointer shadow-md group"
                    onClick={() => setSelectedImage(art.categoryImage)}
                  >
                    <img 
                      src={art.categoryImage} 
                      alt={art.title_ro}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                      <span className="text-xs font-black text-white flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>{art.categoryTitleAr || art.categoryTitle}</span>
                      </span>
                    </div>
                  </div>
                )}

                {/* Official Text Box */}
                {(viewMode === 'both' || viewMode === 'official') && (
                  <div className={`p-4 rounded-2xl border space-y-2 ${
                    isDark ? 'bg-slate-900/90 border-slate-700/80 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}>
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                      <span className="text-[10px] font-black text-rose-500 uppercase tracking-wider block">
                        🇷🇴 Textul Oficial din Constituția României:
                      </span>
                      <AudioPlayerButton 
                        text={art.official_text_ro}
                        lang="ro"
                        label="استمع للنص الرسمي"
                      />
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
                )}

                {/* Simplified Educational Explanation Card */}
                {(viewMode === 'both' || viewMode === 'simplified') && (art.simplified_explanation_ar || art.simplified_explanation_en) && (
                  <div className={`p-4 rounded-2xl border-2 space-y-2 ${
                    isDark ? 'bg-amber-500/10 border-amber-500/30 text-amber-200' : 'bg-amber-50 border-amber-300 text-amber-950'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black text-amber-400 flex items-center gap-1.5">
                        <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>{appLang === 'ar' ? 'الشرح والمفهوم التعليمي الميسّر للمقابلة:' : 'Simplified Educational Concept for ANC Interview:'}</span>
                      </span>
                      <AudioPlayerButton 
                        text={appLang === 'ar' ? art.simplified_explanation_ar : art.simplified_explanation_en}
                        lang={appLang === 'ar' ? 'ar' : 'en'}
                        label="استمع للشرح"
                      />
                    </div>
                    <p className="text-xs sm:text-sm font-bold leading-relaxed">
                      {appLang === 'ar' ? art.simplified_explanation_ar : art.simplified_explanation_en}
                    </p>

                    {/* Important Note for Citizenship Exam */}
                    {art.why_it_matters_ar && (
                      <p className="text-xs text-amber-300 font-extrabold pt-1 border-t border-amber-500/20">
                        💡 {appLang === 'ar' ? art.why_it_matters_ar : art.why_it_matters_en}
                      </p>
                    )}
                  </div>
                )}

                {/* Vocabulary Tags */}
                {art.vocabulary && art.vocabulary.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {art.vocabulary.map((vocab, vIdx) => (
                      <span key={vIdx} className="px-2.5 py-1 rounded-xl bg-slate-900/80 border border-slate-700 text-[11px] font-bold text-slate-300">
                        🇷🇴 {vocab.ro} → 🇸🇦 {vocab.ar}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action Buttons: Practice Quiz & Practice Writing */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Link
                    href={`/quiz?category=constitution`}
                    className="py-3 px-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                  >
                    <Trophy className="w-4 h-4 shrink-0" />
                    <span>{appLang === 'ar' ? 'اختبر معلوماتك الدستورية 🎯' : 'Practice Quiz 🎯'}</span>
                  </Link>

                  <Link
                    href={`/constitution-writing?article=${art.article_number}`}
                    className="py-3 px-3 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-700 to-amber-600 hover:opacity-95 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                  >
                    <FileText className="w-4 h-4 shrink-0" />
                    <span>{appLang === 'ar' ? 'تدرب على كتابة المادة ✍️' : 'Practice Writing ✍️'}</span>
                  </Link>
                </div>
              </motion.div>
            );
          })}
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
    <Suspense fallback={<div className="p-8 text-center text-slate-400 font-bold">Loading Constitution Reader...</div>}>
      <ConstitutionContent />
    </Suspense>
  );
}
