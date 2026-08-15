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
  ShieldCheck
} from 'lucide-react';
import grammarData from '../../data/romanian_grammar.json';
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
            📚 Sistemul Progresiv de Gramatică Română (10 Lecții Consolidate)
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
              <span>جرب لعبة اختبار القواعد المصورة (25 سؤالاً) 🎮</span>
            </Link>
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
              placeholder={appLang === 'ar' ? 'ابحث في القواعد (مثال: الجمع، أداة التعريف، a fi...)' : 'Search grammar rules...'}
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
            <div className="text-center py-10 text-slate-400 text-sm font-bold">
              لا توجد نتائج مطابقة لبحثك في هذا المستوى. جرب تغيير كلمة البحث!
            </div>
          ) : (
            filteredGrammar.map((module, index) => {
              const tryItObj = module.try_it;
              const selectedOpt = exerciseAnswers[module.id];
              const isAnswered = selectedOpt !== undefined;

              return (
                <div
                  key={module.id || index}
                  className={`p-5 sm:p-6 rounded-3xl border space-y-5 shadow-xl transition-all ${
                    isDark ? 'bg-slate-800/90 border-slate-700/80 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                >
                  {/* Lesson Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-700/60 pb-4 gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md text-[11px] font-black bg-rose-500/20 text-rose-400 border border-rose-500/30">
                          {module.level || 'Grammar'}
                        </span>
                        <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
                          {module.category}
                        </span>
                      </div>
                      <h2 className="text-lg sm:text-xl font-black text-theme-main pt-1">
                        {appLang === 'ar' ? module.title_ar : appLang === 'en' ? module.title_en : module.title_ro}
                      </h2>
                    </div>

                    <AudioPlayerButton text={module.rule_ro || module.title_ro} lang="ro" label="استمع بالرومانية" />
                  </div>

                  {/* 1. Rule Explanation */}
                  <div className={`p-4 rounded-2xl border space-y-2 ${
                    isDark ? 'bg-slate-900/90 border-slate-700/80' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <span className="text-[11px] font-black text-rose-400 block uppercase tracking-wider">
                      📜 القاعدة الأساسية والشرح المفصل:
                    </span>
                    <p className="text-xs sm:text-sm font-extrabold leading-relaxed text-rose-400 font-latin">
                      🇷🇴 {module.rule_ro}
                    </p>
                    <p className="text-xs sm:text-sm font-bold leading-relaxed text-theme-sub">
                      🇸🇦 {appLang === 'ar' ? module.rule_ar : module.rule_en}
                    </p>
                  </div>

                  {/* 2. Example Sentence Card */}
                  {module.example_ro && (
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black text-amber-400 block uppercase tracking-wider">
                          💬 أمثلة توضيحية بالجمل التطبيقية:
                        </span>
                        <AudioPlayerButton text={module.example_ro} lang="ro" label="استمع للمثال" />
                      </div>
                      <p className="text-sm font-black font-latin text-white">{module.example_ro}</p>
                      <p className="text-xs font-bold text-amber-300">🇸🇦 {module.example_ar}</p>
                      {module.example_en && <p className="text-xs font-bold text-slate-400">🇬🇧 {module.example_en}</p>}
                    </div>
                  )}

                  {/* 3. Why it matters for ANC Citizenship Interview */}
                  {module.why_rule_ar && (
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
                      <span className="text-[11px] font-black text-emerald-400 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4" />
                        <span>أهمية هذه القاعدة لمقابلة لجنة التجنيس (ANC):</span>
                      </span>
                      <p className="text-xs font-bold text-slate-200 leading-relaxed">
                        {appLang === 'ar' ? module.why_rule_ar : module.why_rule_en}
                      </p>
                    </div>
                  )}

                  {/* 4. Conjugation / Rule Table */}
                  {module.rules && module.rules.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-xs font-black text-theme-sub flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-rose-500" />
                        <span>جدول القواعد والتصريفات:</span>
                      </span>

                      <div className="overflow-x-auto rounded-2xl border border-slate-700/60 shadow-sm">
                        <table className="w-full text-xs sm:text-sm text-right">
                          <thead className={`border-b ${isDark ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-slate-200 border-slate-300 text-slate-800'}`}>
                            <tr>
                              <th className="p-3 text-right font-black">الرومانية (Romanian)</th>
                              <th className="p-3 text-right font-black">الشرح والترجمة</th>
                              <th className="p-3 text-center font-black">نطق 🔊</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-700/40">
                            {module.rules.map((rule, rIdx) => {
                              const textRo = rule.singular_ro || rule.rule_ro || rule.gender;
                              const textTrans = appLang === 'en' ? (rule.rule_en || rule.plural_ro) : (rule.rule_ar || rule.plural_ro);

                              return (
                                <tr key={rIdx} className={isDark ? 'hover:bg-slate-900/50' : 'hover:bg-slate-100/60'}>
                                  <td className="p-3 font-black text-rose-500 font-latin text-xs sm:text-sm">{textRo}</td>
                                  <td className={`p-3 font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{textTrans}</td>
                                  <td className="p-3 text-center">
                                    <AudioPlayerButton text={textRo} lang="ro" label="استمع" />
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* 5. Interactive Exercise "Try It Yourself" */}
                  {tryItObj && (
                    <div className={`p-5 rounded-2xl border space-y-3 ${
                      isDark ? 'bg-slate-900/90 border-slate-700' : 'bg-indigo-50/90 border-indigo-200'
                    }`}>
                      <div className="flex items-center justify-between border-b border-slate-700/50 pb-2">
                        <span className="text-xs font-black text-indigo-400 flex items-center gap-1.5">
                          <HelpCircle className="w-4 h-4" />
                          <span>اختبر فهمك للقاعدة ✍️</span>
                        </span>
                      </div>

                      <h4 className="text-sm font-black text-theme-main">
                        {appLang === 'ar' ? tryItObj.question_ar : tryItObj.question_en || tryItObj.question_ro}
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {tryItObj.options.map((opt, oIdx) => {
                          const isSelected = selectedOpt === opt;
                          const isCorrectOpt = opt === tryItObj.correct_answer;
                          let btnStyle = isDark 
                            ? 'bg-slate-800 border-slate-700 text-white hover:border-indigo-400' 
                            : 'bg-white border-slate-200 text-slate-900 hover:border-indigo-400 shadow-sm';

                          if (isAnswered) {
                            if (isCorrectOpt) {
                              btnStyle = 'bg-emerald-600 text-white border-emerald-600 font-black';
                            } else if (isSelected) {
                              btnStyle = 'bg-rose-600 text-white border-rose-600 font-black';
                            }
                          }

                          return (
                            <button
                              key={oIdx}
                              onClick={() => handleSelectOption(module.id, opt)}
                              className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${btnStyle}`}
                            >
                              {opt}
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
