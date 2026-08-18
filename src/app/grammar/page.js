'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Sparkles, 
  Volume2, 
  Search, 
  CheckCircle, 
  XCircle,
  ChevronRight, 
  Trophy, 
  Layers, 
  GraduationCap, 
  Lightbulb, 
  MessageSquare, 
  Play,
  HelpCircle,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Download,
  Eye,
  FileText,
  X,
  ExternalLink,
  Library
} from 'lucide-react';
import grammarData from '../../data/romanian_grammar.json';
import grammarQuizData from '../../data/romanian_grammar_quiz.json';
import textbookExamplesData from '../../data/textbook_grammar_examples.json';
import Navbar from '../../components/Navbar';
import AudioPlayerButton from '../../components/AudioPlayerButton';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

function GrammarContent() {
  const { theme } = useTheme();
  const { appLang, strings, isRtl } = useLanguage();
  const isDark = theme === 'dark';

  const [activeLevel, setActiveLevel] = useState('all'); // 'all', 'beginner', 'intermediate', 'advanced'
  const [searchQuery, setSearchQuery] = useState('');
  const [exerciseAnswers, setExerciseAnswers] = useState({});
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [selectedTbCategory, setSelectedTbCategory] = useState('all');

  const filteredGrammar = grammarData.filter((item) => {
    const itemLevel = (item.level || 'beginner').toLowerCase();
    const matchesLevel = activeLevel === 'all' || itemLevel === activeLevel;
    
    const q = searchQuery.toLowerCase().trim();
    const titleRo = (item.title_ro || '').toLowerCase();
    const titleAr = item.title_ar || '';
    const titleEn = (item.title_en || '').toLowerCase();
    
    const matchesSearch = !q || titleRo.includes(q) || titleAr.includes(q) || titleEn.includes(q);
    
    return matchesLevel && matchesSearch;
  });

  // Flatten all textbook examples for filtering
  const allTbExamples = Object.keys(textbookExamplesData).reduce((acc, catKey) => {
    return acc.concat(textbookExamplesData[catKey] || []);
  }, []);

  const filteredTbExamples = allTbExamples.filter((ex) => {
    const matchesCat = selectedTbCategory === 'all' || ex.category === selectedTbCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesQ = !q || ex.ro.toLowerCase().includes(q) || ex.en.toLowerCase().includes(q);
    return matchesCat && matchesQ;
  });

  const handleSelectOption = (moduleId, option) => {
    setExerciseAnswers(prev => ({
      ...prev,
      [moduleId]: option
    }));
  };

  return (
    <div className="min-h-screen pb-28 sm:pb-24 bg-theme-main text-theme-main flex flex-col font-latin">
      <Navbar />

      <main className={`flex-1 w-full max-w-4xl mx-auto px-4 py-6 space-y-6 animate-fade-in-up ${
        isRtl ? 'lg:mr-72' : 'lg:ml-72'
      } ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
        
        {/* Banner Header */}
        <div className={`rounded-3xl p-6 border shadow-xl space-y-3 text-center ${
          isDark ? 'bg-slate-800/90 border-slate-700/80 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-black bg-amber-500/20 text-amber-400 border border-amber-500/30">
            📚 Sistemul Progresiv de Gramatică Română ({grammarData.length} Lecții Consolidate)
          </span>
          <h1 className="text-2xl sm:text-3xl font-black">
            {strings.grammarTitle || 'دليل قواعد اللغة الرومانية والتصريفات الشامل 📚'}
          </h1>
          <p className="text-xs sm:text-sm text-theme-sub max-w-xl mx-auto leading-relaxed font-bold">
            {strings.grammarSubtitle || 'مسار تعلم شامل ومبسط يشرح الأجناس، أدوات التعريف، تصريف الأفعال، وحالات الإعراب لمقابلة الجنسية ANC.'}
          </p>

          <div className="pt-2 flex flex-wrap gap-2 justify-center">
            <Link
              href="/grammar-quiz"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 via-rose-600 to-amber-600 text-white font-black rounded-2xl text-xs shadow-lg hover:opacity-95 transition-all"
            >
              <Trophy className="w-4 h-4" />
              <span>جرب لعبة اختبار القواعد المصورة ({grammarQuizData.length} أسئلة) 🎮</span>
            </Link>
          </div>
        </div>

        {/* DOWNLOADABLE PDF TEXTBOOKS SECTION */}
        <div className={`p-5 rounded-3xl border shadow-xl space-y-4 ${
          isDark ? 'bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 border-amber-500/40 text-white' : 'bg-gradient-to-br from-amber-500/10 via-white to-rose-50 border-amber-300 text-slate-900'
        }`}>
          <div className="flex items-center justify-between border-b border-amber-500/30 pb-3">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                <BookOpen className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-base sm:text-lg font-black">
                  {appLang === 'ar' ? '📚 كتب ومراجع قواعد اللغة الرومانية المعتمدة (PDF للتحميل والقراءة)' : appLang === 'ro' ? '📚 Manuale de Gramatică Română Descărcabile (PDF)' : '📚 Downloadable Official Romanian Grammar PDFs'}
                </h2>
                <p className="text-xs text-theme-sub font-bold">
                  {appLang === 'ar' ? 'تصفح وحمّل المراجع والأمثلة المستخرجة بواسطة مكتبة pdf2json:' : 'Download or view the official reference textbooks used in our grammar modules:'}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Book 1: Routledge Essential Grammar */}
            <div className={`p-4 rounded-2xl border space-y-3 flex flex-col justify-between ${
              isDark ? 'bg-slate-900/80 border-slate-700/80' : 'bg-white border-slate-200 shadow-md'
            }`}>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    Routledge (232 P.)
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">1.0 MB</span>
                </div>
                <h3 className="text-sm font-black text-amber-400">Romanian: An Essential Grammar</h3>
                <p className="text-xs text-theme-sub leading-relaxed">
                  {appLang === 'ar' ? 'تأليف Ramona Gönczöl-Davies. مرجع أكاديمي يشرح الأجناس، أدوات التعريف، الـ 11 تصريف للأفعال، وإعراب الحالات.' : 'By Ramona Gönczöl-Davies. Comprehensive reference covering alphabet, genders, articles, 11 verb conjugations, and cases.'}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-700/50">
                <a
                  href="/downloads/Romanian_An_Essential_Grammar.pdf"
                  download="Romanian_An_Essential_Grammar.pdf"
                  className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{appLang === 'ar' ? 'تحميل PDF 📥' : 'Download PDF 📥'}</span>
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedPdf({ title: 'Romanian: An Essential Grammar', url: '/downloads/Romanian_An_Essential_Grammar.pdf' })}
                  className="py-2 px-3 bg-slate-700/60 hover:bg-slate-700 text-slate-200 font-black rounded-xl text-xs flex items-center gap-1 transition-all"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{appLang === 'ar' ? 'قراءة 👁️' : 'Read 👁️'}</span>
                </button>
              </div>
            </div>

            {/* Book 2: Teach Yourself Romanian */}
            <div className={`p-4 rounded-2xl border space-y-3 flex flex-col justify-between ${
              isDark ? 'bg-slate-900/80 border-slate-700/80' : 'bg-white border-slate-200 shadow-md'
            }`}>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    Teach Yourself (436 P.)
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">17 MB</span>
                </div>
                <h3 className="text-sm font-black text-rose-400">Teach Yourself Romanian</h3>
                <p className="text-xs text-theme-sub leading-relaxed">
                  {appLang === 'ar' ? 'تأليف Murrell & Ștefănescu-Drăgănești. مرجع متكامل يحتوي على 30 وحدة مكثفة للمحادثة والقواعد والتطبيقات.' : 'By Murrell & Ștefănescu-Drăgănești. Complete 30-unit textbook with dialogues, grammar exercises, and key rules.'}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-700/50">
                <a
                  href="/downloads/Romanian_Teach_Yourself.pdf"
                  download="Romanian_Teach_Yourself.pdf"
                  className="flex-1 py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{appLang === 'ar' ? 'تحميل PDF 📥' : 'Download PDF 📥'}</span>
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedPdf({ title: 'Teach Yourself Romanian', url: '/downloads/Romanian_Teach_Yourself.pdf' })}
                  className="py-2 px-3 bg-slate-700/60 hover:bg-slate-700 text-slate-200 font-black rounded-xl text-xs flex items-center gap-1 transition-all"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{appLang === 'ar' ? 'قراءة 👁️' : 'Read 👁️'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* EXTENSIVE TEXTBOOK EXAMPLES LIBRARY (Extracted via pdf2json) */}
        <div className={`p-5 rounded-3xl border shadow-xl space-y-4 ${
          isDark ? 'bg-slate-800/90 border-slate-700/80 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-md'
        }`}>
          <div className="flex items-center justify-between border-b border-slate-700/50 pb-3">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
                <Library className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-base sm:text-lg font-black text-rose-400">
                  {appLang === 'ar' ? `📖 مكتبة الأمثلة المستخرجة من الكتب (${filteredTbExamples.length} مثالاً مقتبساً)` : `📖 Extensive Textbook Examples Library (${filteredTbExamples.length} examples)`}
                </h2>
                <p className="text-xs text-slate-400 font-bold">
                  {appLang === 'ar' ? 'أمثلة وجمل عملية مصنفة ومستخرجة بواسطة pdf2json من مرجع Routledge و Teach Yourself:' : 'Categorized textbook examples extracted via pdf2json:'}
                </p>
              </div>
            </div>
          </div>

          {/* Category Filter Pills for Textbook Examples */}
          <div className="flex flex-wrap gap-1.5 pb-2">
            {[
              { id: 'all', label_ar: 'الكل 🌐', label_en: 'All' },
              { id: 'nouns', label_ar: 'الأسماء 🏷️', label_en: 'Nouns' },
              { id: 'articles', label_ar: 'أدوات التعريف 📌', label_en: 'Articles' },
              { id: 'adjectives', label_ar: 'الصفات 🎨', label_en: 'Adjectives' },
              { id: 'pronouns', label_ar: 'الضمائر 👤', label_en: 'Pronouns' },
              { id: 'verbs', label_ar: 'الأفعال ⚡', label_en: 'Verbs' },
              { id: 'prepositions', label_ar: 'حروف الجر 📍', label_en: 'Prepositions' },
              { id: 'conjunctions', label_ar: 'أدوات الربط 🔗', label_en: 'Conjunctions' },
              { id: 'numerals', label_ar: 'الأرقام 🔢', label_en: 'Numerals' },
              { id: 'socializing', label_ar: 'المحادثات 🤝', label_en: 'Socializing' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedTbCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black border transition-all ${
                  selectedTbCategory === cat.id
                    ? 'bg-amber-500 text-slate-900 border-amber-400 shadow-md scale-105'
                    : isDark ? 'bg-slate-900/60 text-slate-300 border-slate-700/80 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
              >
                <span>{appLang === 'ar' ? cat.label_ar : cat.label_en}</span>
              </button>
            ))}
          </div>

          {/* Textbook Examples Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-1">
            {filteredTbExamples.map((ex, idx) => (
              <div 
                key={ex.id || idx}
                className={`p-3.5 rounded-2xl border space-y-2 flex flex-col justify-between ${
                  isDark ? 'bg-slate-900/60 border-slate-700/60' : 'bg-slate-50 border-slate-200 shadow-sm'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
                      {ex.category}
                    </span>
                    <AudioPlayerButton text={ex.ro} lang="ro" />
                  </div>
                  <p className="text-xs sm:text-sm font-black text-emerald-300 font-latin leading-snug">
                    🇹🇩 {ex.ro}
                  </p>
                  <p className="text-[11px] font-bold text-slate-300 leading-snug">
                    🇬🇧 {ex.en}
                  </p>
                </div>
                <div className="pt-1.5 border-t border-slate-700/40 text-[9px] font-bold text-amber-400/90 flex items-center justify-between">
                  <span>📖 {ex.source}</span>
                  <span className="text-slate-500">pdf2json</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Level Selector & Search */}
        <div className="space-y-3">
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => setActiveLevel('all')}
              className={`py-3 px-2 rounded-2xl text-xs font-black border transition-all flex flex-col items-center gap-1 ${
                activeLevel === 'all'
                  ? 'bg-rose-600 text-white border-rose-600 shadow-md'
                  : isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-white text-slate-700 border-slate-200 shadow-sm'
              }`}
            >
              <span className="text-sm">🌐</span>
              <span>{appLang === 'ar' ? 'الكل' : 'All'}</span>
            </button>

            <button
              onClick={() => setActiveLevel('beginner')}
              className={`py-3 px-2 rounded-2xl text-xs font-black border transition-all flex flex-col items-center gap-1 ${
                activeLevel === 'beginner'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                  : isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-white text-slate-700 border-slate-200 shadow-sm'
              }`}
            >
              <span className="text-sm">🟢</span>
              <span>{appLang === 'ar' ? 'مبتدئ' : 'Beginner'}</span>
            </button>

            <button
              onClick={() => setActiveLevel('intermediate')}
              className={`py-3 px-2 rounded-2xl text-xs font-black border transition-all flex flex-col items-center gap-1 ${
                activeLevel === 'intermediate'
                  ? 'bg-amber-600 text-white border-amber-600 shadow-md'
                  : isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-white text-slate-700 border-slate-200 shadow-sm'
              }`}
            >
              <span className="text-sm">🟡</span>
              <span>{appLang === 'ar' ? 'متوسط' : 'Intermediate'}</span>
            </button>

            <button
              onClick={() => setActiveLevel('advanced')}
              className={`py-3 px-2 rounded-2xl text-xs font-black border transition-all flex flex-col items-center gap-1 ${
                activeLevel === 'advanced'
                  ? 'bg-rose-600 text-white border-rose-600 shadow-md'
                  : isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-white text-slate-700 border-slate-200 shadow-sm'
              }`}
            >
              <span className="text-sm">🔴</span>
              <span>{appLang === 'ar' ? 'متقدم' : 'Advanced'}</span>
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={appLang === 'ar' ? 'ابحث في القواعد والأمثلة (مثال: الجمع، أداة التعريف، a fi...)' : 'Search grammar rules & textbook examples...'}
              className={`w-full border rounded-2xl px-4 py-3 text-xs sm:text-sm pl-10 focus:outline-none focus:border-amber-500 font-bold ${
                isDark ? 'bg-slate-800 border-slate-700/80 text-white placeholder-slate-500' : 'bg-white border-slate-200 text-slate-900 shadow-sm placeholder-slate-400'
              }`}
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          </div>
        </div>

        {/* Structured Grammar Lessons List */}
        <div className="space-y-6">
          {filteredGrammar.length === 0 ? (
            <div className={`p-8 rounded-3xl text-center border space-y-2 ${
              isDark ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-white border-slate-200 text-slate-600'
            }`}>
              <BookOpen className="w-10 h-10 mx-auto text-slate-400 opacity-60" />
              <p className="text-sm font-bold">لم نجد قواعد تطابق البحث.</p>
            </div>
          ) : (
            filteredGrammar.map((module) => {
              const selectedOpt = exerciseAnswers[module.id];
              const tryItObj = module.try_it;
              const isAnswered = selectedOpt !== undefined;

              return (
                <div 
                  key={module.id} 
                  id={module.id}
                  className={`p-6 rounded-3xl border shadow-xl space-y-5 transition-all ${
                    isDark ? 'bg-slate-800/90 border-slate-700/80 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-md'
                  }`}
                >
                  {/* Module Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700/50 pb-3">
                    <div className="space-y-1">
                      <span className="px-3 py-1 rounded-full text-[10px] font-black bg-rose-500/20 text-rose-400 border border-rose-500/30 uppercase tracking-wider">
                        {module.category || 'Grammar'} • {module.level || 'Beginner'}
                      </span>
                      <h2 className="text-lg sm:text-xl font-black text-amber-400">
                        {appLang === 'ar' ? module.title_ar : module.title_ro}
                      </h2>
                      <p className="text-xs text-slate-400 font-bold">{module.title_ro}</p>
                    </div>

                    <AudioPlayerButton text={module.example_ro} lang="ro" label="استمع للأمثلة" />
                  </div>

                  {/* 1. Fundamental Rule */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-black text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Lightbulb className="w-4 h-4 text-amber-400" />
                      <span>{appLang === 'ar' ? 'القاعدة الأساسية الشاملة:' : 'Core Rule:'}</span>
                    </h3>
                    <p className="text-sm leading-relaxed font-bold text-theme-main bg-amber-500/10 p-3.5 rounded-2xl border border-amber-500/20">
                      {appLang === 'ar' ? module.rule_ar : module.rule_en}
                    </p>
                  </div>

                  {/* 2. Examples Box */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span>{appLang === 'ar' ? 'أمثلة عملية نطقية (مستخرجة من المراجع والأمثلة ANC):' : 'Practical Examples:'}</span>
                    </h3>
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                      <p className="text-sm font-black text-emerald-300 font-latin leading-relaxed">
                        🇹🇩 {module.example_ro}
                      </p>
                      <p className="text-xs font-bold text-slate-300 leading-relaxed">
                        {appLang === 'ar' ? module.example_ar : module.example_en}
                      </p>
                    </div>
                  </div>

                  {/* 3. Rules Table */}
                  {module.rules && module.rules.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <h3 className="text-xs font-black text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-blue-400" />
                        <span>{appLang === 'ar' ? 'جدول القواعد والتصريفات بالتفصيل:' : 'Grammar Rules Table:'}</span>
                      </h3>
                      <div className="overflow-x-auto rounded-2xl border border-slate-700/80">
                        <table className="w-full text-xs text-right">
                          <thead className="bg-slate-700/60 text-amber-400 font-black">
                            <tr>
                              <th className="p-3">الصنف / النوع</th>
                              <th className="p-3">المفرد (Singular)</th>
                              <th className="p-3">الجمع (Plural)</th>
                              <th className="p-3">الشرح والتوضيح</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-700/50 font-bold">
                            {module.rules.map((r, rIdx) => (
                              <tr key={rIdx} className="hover:bg-slate-700/30 transition-colors">
                                <td className="p-3 font-black text-amber-300">{r.gender}</td>
                                <td className="p-3 text-emerald-400 dir-ltr text-left font-latin">{r.singular_ro}</td>
                                <td className="p-3 text-rose-400 dir-ltr text-left font-latin">{r.plural_ro}</td>
                                <td className="p-3 text-slate-300">{appLang === 'ar' ? r.rule_ar : r.rule_en}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* 4. Why this rule matters for ANC */}
                  {module.why_rule_ar && (
                    <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/25 space-y-1">
                      <span className="text-[11px] font-black text-blue-400 flex items-center gap-1">
                        <ShieldCheck className="w-4 h-4" />
                        <span>أهمية القاعدة في مقابلة الجنسية ANC 🏛️</span>
                      </span>
                      <p className="text-xs font-bold text-slate-300 leading-relaxed">
                        {appLang === 'ar' ? module.why_rule_ar : module.why_rule_en}
                      </p>
                    </div>
                  )}

                  {/* 5. Try It Interactive Quiz */}
                  {tryItObj && (
                    <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-700/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-400 text-[11px] font-black border border-amber-500/30 flex items-center gap-1.5">
                          <HelpCircle className="w-3.5 h-3.5" />
                          <span>تمرين تفاعلي سريع 🎯</span>
                        </span>
                      </div>

                      <h4 className="text-xs sm:text-sm font-black text-white leading-snug">
                        {appLang === 'ar' ? tryItObj.question_ar : tryItObj.question_en}
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {tryItObj.options.map((opt, optIdx) => {
                          const isSelected = selectedOpt === opt;
                          const isCorrect = opt === tryItObj.correct_answer;

                          let btnStyle = isDark 
                            ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' 
                            : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-100 shadow-sm';

                          if (isAnswered) {
                            if (isCorrect) {
                              btnStyle = 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/30 font-black';
                            } else if (isSelected) {
                              btnStyle = 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-600/30 font-black';
                            } else {
                              btnStyle = isDark ? 'bg-slate-800/40 border-slate-800 text-slate-500 opacity-60' : 'bg-slate-100 border-slate-200 text-slate-400 opacity-60';
                            }
                          }

                          return (
                            <button
                              key={optIdx}
                              disabled={isAnswered}
                              onClick={() => handleSelectOption(module.id, opt)}
                              className={`p-3 rounded-xl border text-xs text-right font-bold transition-all flex items-center justify-between ${btnStyle}`}
                            >
                              <span>{opt}</span>
                              {isAnswered && isCorrect && <CheckCircle className="w-4 h-4 text-white shrink-0" />}
                              {isAnswered && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-white shrink-0" />}
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation Feedback */}
                      {isAnswered && (
                        <div className={`p-3.5 rounded-xl border text-xs font-bold space-y-1 animate-fade-in-up ${
                          selectedOpt === tryItObj.correct_answer
                            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                            : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                        }`}>
                          <span className="block font-black">
                            {selectedOpt === tryItObj.correct_answer ? 'ممتاز! إجابة صحيحة 🎉' : 'حاول مرة أخرى 💡 الإجابة الصحيحة هي: ' + tryItObj.correct_answer}
                          </span>
                          <p className="text-slate-300">
                            {appLang === 'ar' ? tryItObj.explanation_ar : tryItObj.explanation_en}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 6. Common Mistake Card */}
                  {module.common_mistake_ar && (
                    <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-1">
                      <span className="text-[11px] font-black text-rose-400 flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" />
                        <span>خطأ شائع وتصحيحه ⚠️</span>
                      </span>
                      <p className="text-xs font-bold text-slate-300 leading-relaxed">
                        {appLang === 'ar' ? module.common_mistake_ar : module.common_mistake_en}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* PDF PREVIEW MODAL */}
      {selectedPdf && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm p-4 flex items-center justify-center animate-fade-in">
          <div className={`w-full max-w-4xl h-[90vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden ${
            isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="p-4 border-b border-slate-700 flex items-center justify-between bg-slate-800/80">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm sm:text-base font-black">{selectedPdf.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={selectedPdf.url}
                  download
                  className="px-3.5 py-1.5 bg-blue-600 text-white font-black rounded-xl text-xs flex items-center gap-1 shadow-md hover:bg-blue-700"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{appLang === 'ar' ? 'تحميل PDF 📥' : 'Download PDF 📥'}</span>
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedPdf(null)}
                  className="p-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 w-full bg-slate-950">
              <iframe
                src={selectedPdf.url}
                className="w-full h-full border-none"
                title={selectedPdf.title}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function GrammarPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400 font-bold">Loading Grammar Guide...</div>}>
      <GrammarContent />
    </Suspense>
  );
}
