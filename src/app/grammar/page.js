'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Sparkles, 
  Volume2, 
  Search, 
  CheckCircle, 
  ChevronRight, 
  Trophy, 
  Layers, 
  GraduationCap, 
  Lightbulb, 
  MessageSquare, 
  Play,
  Languages,
  Filter
} from 'lucide-react';
import grammarData from '../../data/romanian_grammar.json';
import Navbar from '../../components/Navbar';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

function GrammarContent() {
  const { theme } = useTheme();
  const { appLang, setAppLang, strings, isRtl } = useLanguage();
  const isDark = theme === 'dark';

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [playingId, setPlayingId] = useState(null);

  // Categories based on core Romanian Grammar Rules
  const categories = [
    { id: 'all', label_ar: '🌐 جميع القواعد (22 درساً)', label_en: '🌐 All 22 Rules', label_ro: '🌐 Toate cele 22 Regulile' },
    { id: 'nouns', label_ar: '🏛️ الأسماء والأجناس (Nouns & Plurals)', label_en: '🏛️ Nouns & Plurals', label_ro: '🏛️ Substantive & Plural' },
    { id: 'articles', label_ar: '📌 أدوات التعريف والربط (Articles & Cases)', label_en: '📌 Articles & Cases', label_ro: '📌 Articole & Cazuri' },
    { id: 'verbs', label_ar: '⚡ الأفعال والأزمنة (Verbs & Tenses)', label_en: '⚡ Verbs & Tenses', label_ro: '⚡ Verbe & Timpuri' },
    { id: 'sentence_structure', label_ar: '🗣️ التراكيب والظروف (Adverbs & Phrases)', label_en: '🗣️ Adverbs & Idioms', label_ro: '🗣️ Adverbe & Expresii' },
  ];

  const speakText = (text, id) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      setPlayingId(id);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ro-RO';
      utterance.rate = 0.85;
      utterance.onend = () => setPlayingId(null);
      utterance.onerror = () => setPlayingId(null);
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      setPlayingId(null);
    }
  };

  const filteredGrammar = grammarData.filter((item) => {
    const matchesCategory = activeCategory === 'all' || 
      item.category === activeCategory ||
      (activeCategory === 'verbs' && (item.topic_ro.includes('Verb') || item.topic_ro.includes('Conjug') || item.topic_ro.includes('Timpul') || item.topic_ro.includes('Modul'))) ||
      (activeCategory === 'nouns' && (item.topic_ro.includes('Substantiv') || item.topic_ro.includes('Plural') || item.topic_ro.includes('Adjectiv') || item.topic_ro.includes('Pronum'))) ||
      (activeCategory === 'articles' && (item.topic_ro.includes('Articol') || item.topic_ro.includes('Prepozi') || item.topic_ro.includes('Cazul'))) ||
      (activeCategory === 'sentence_structure' && (item.topic_ro.includes('Adverb') || item.topic_ro.includes('Numeral') || item.topic_ro.includes('Expresii')));
    
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      item.topic_ro.toLowerCase().includes(q) ||
      (item.topic_ar && item.topic_ar.includes(q)) ||
      (item.topic_en && item.topic_en.toLowerCase().includes(q));
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen pb-28 sm:pb-24 bg-theme-main text-theme-main flex flex-col font-cairo">
      <Navbar />

      <main className={`flex-1 w-full max-w-4xl mx-auto px-4 py-6 space-y-6 animate-fade-in-up ${
        isRtl ? 'lg:mr-72' : 'lg:ml-72'
      } ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
        
        {/* Banner Header */}
        <div className={`rounded-2xl p-6 border shadow-xl space-y-3 text-center ${
          isDark ? 'bg-slate-800/90 border-slate-700/80 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-black bg-amber-500/20 text-amber-400 border border-amber-500/30">
            📚 Gramatica Limbii Române (22 Module Categorisite)
          </span>
          <h1 className="text-2xl sm:text-3xl font-black">
            {strings.grammarTitle}
          </h1>
          <p className="text-xs sm:text-sm text-theme-sub max-w-xl mx-auto leading-relaxed font-medium">
            {strings.grammarSubtitle}
          </p>

          <div className="pt-2 flex flex-wrap gap-2 justify-center">
            <Link
              href="/grammar-quiz"
              className="inline-flex items-center space-x-2 space-x-reverse px-5 py-2.5 bg-gradient-to-r from-amber-500 to-rose-600 text-white font-black rounded-2xl text-xs shadow-lg hover:opacity-95 transition-all"
            >
              <Trophy className="w-4 h-4" />
              <span>{strings.grammarQuizCardTitle || 'جرب لعبة اختبار القواعد 🎮'}</span>
            </Link>
          </div>
        </div>

        {/* Smart Rule-Based Category Tabs & Search */}
        <div className="space-y-3">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={appLang === 'ar' ? 'ابحث في قواعد اللغة (مثال: الجمع، أداة التعريف، a merge...)' : appLang === 'en' ? 'Search grammar rules...' : 'Caută lecții de gramatică...'}
              className={`w-full border rounded-2xl px-4 py-3 text-xs sm:text-sm pl-10 focus:outline-none focus:border-amber-500 font-semibold ${
                isDark ? 'bg-slate-800 border-slate-700/80 text-white placeholder-slate-500' : 'bg-white border-slate-200 text-slate-900 shadow-sm placeholder-slate-400'
              }`}
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          </div>

          {/* Categorized Grammar Rule Tabs */}
          <div className="flex items-center space-x-2 space-x-reverse overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-black whitespace-nowrap shrink-0 transition-all border ${
                  activeCategory === cat.id
                    ? 'bg-gradient-to-r from-amber-500 to-rose-600 text-white border-amber-500 shadow-lg shadow-amber-500/20 scale-105'
                    : isDark ? 'bg-slate-800 text-slate-300 border-slate-700/60 hover:bg-slate-700' : 'bg-white text-slate-700 border-slate-200 shadow-sm hover:bg-slate-100'
                }`}
              >
                {appLang === 'ar' ? cat.label_ar : appLang === 'en' ? cat.label_en : cat.label_ro}
              </button>
            ))}
          </div>
        </div>

        {/* Structured Grammar Modules List */}
        <div className="space-y-6">
          {filteredGrammar.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm font-bold">
              لا توجد نتائج مطابقة للبحث. جرب تغيير كلمة البحث أو الفئة!
            </div>
          ) : (
            filteredGrammar.map((module, index) => (
              <div
                key={module.id || index}
                className={`p-5 sm:p-6 rounded-2xl border space-y-5 shadow-xl animate-fade-in-up transition-all ${
                  isDark ? 'bg-slate-800/90 border-slate-700/80 text-white' : 'bg-white border-slate-200 text-slate-900'
                }`}
              >
                {/* Header Badge & Title */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-700/60 pb-4 gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-black bg-rose-500/20 text-rose-400 border border-rose-500/30">
                        Rule #{index + 1}
                      </span>
                      <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">
                        {module.topic_ro}
                      </span>
                    </div>
                    <h2 className="text-xl font-black text-theme-main pt-1">
                      {appLang === 'ar' ? module.topic_ar : appLang === 'en' ? module.topic_en : module.topic_ro}
                    </h2>
                  </div>

                  <button
                    onClick={() => speakText(module.topic_ro, `topic-${module.id}`)}
                    className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center space-x-1.5 space-x-reverse shrink-0 self-start sm:self-auto shadow-sm ${
                      isDark ? 'bg-slate-900/60 hover:bg-slate-900 text-rose-400 border-slate-700/80' : 'bg-slate-100 hover:bg-slate-200 text-rose-600 border-slate-200'
                    }`}
                  >
                    <Volume2 className="w-4 h-4 text-rose-500" />
                    <span>{strings.playAudio || 'استمع'}</span>
                  </button>
                </div>

                {/* Smart High-Visibility Quick Tip Card */}
                {(module.easy_tip_ar || module.easy_tip_en) && (
                  <div className={`p-4 rounded-xl border-2 text-xs sm:text-sm font-bold flex items-start space-x-3 space-x-reverse shadow-inner ${
                    isDark ? 'bg-gradient-to-r from-amber-500/15 to-rose-500/10 border-amber-500/40 text-amber-200' : 'bg-amber-50 border-amber-300 text-amber-950'
                  }`}>
                    <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5 animate-bounce-subtle" />
                    <div className="space-y-1">
                      <span className="block text-amber-500 font-black text-xs uppercase tracking-wider">
                        💡 {appLang === 'ar' ? 'نصيحة سريعة ومفتاح القاعدة (Quick Tip):' : '💡 Quick Tip:'}
                      </span>
                      <p className="leading-relaxed font-extrabold">
                        {appLang === 'en' ? (module.easy_tip_en || module.easy_tip_ar) : module.easy_tip_ar}
                      </p>
                    </div>
                  </div>
                )}

                {/* Multilingual Explanation Box */}
                <div className={`p-4 rounded-xl border space-y-2 text-xs sm:text-sm leading-relaxed ${
                  isDark ? 'bg-slate-900/80 border-slate-700/80' : 'bg-slate-50 border-slate-200'
                }`}>
                  <span className={`text-[11px] font-black block uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    📖 {appLang === 'ar' ? 'شرح القاعدة والتوضيح:' : appLang === 'en' ? 'Grammar Explanation:' : 'Explicativă:'}
                  </span>
                  
                  {appLang === 'en' ? (
                    <p className="font-bold text-theme-main leading-relaxed">
                      🇬🇧 {module.explanation_en || module.explanation_ar}
                    </p>
                  ) : appLang === 'ro' ? (
                    <p className="font-bold text-theme-main leading-relaxed">
                      🇷🇴 {module.explanation_ro || module.explanation_ar}
                    </p>
                  ) : (
                    <p className="font-bold text-theme-main leading-relaxed">
                      🇸🇦 {module.explanation_ar}
                    </p>
                  )}
                </div>

                {/* High-Contrast Rules & Conjugation Table */}
                {module.rules && module.rules.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-black text-theme-sub flex items-center space-x-1.5 space-x-reverse">
                      <Layers className="w-4 h-4 text-rose-500" />
                      <span>{appLang === 'ar' ? 'جدول الأمثلة والتصريفات:' : 'Examples & Conjugations Table:'}</span>
                    </span>

                    <div className="overflow-x-auto rounded-xl border border-slate-700/60 shadow-sm">
                      <table className="w-full text-xs sm:text-sm text-right">
                        <thead className={`border-b ${isDark ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-slate-200 border-slate-300 text-slate-800'}`}>
                          <tr>
                            <th className="p-3 text-right font-black">الرومانية (Romanian)</th>
                            <th className="p-3 text-right font-black">المعنى والشرح (Translation)</th>
                            <th className="p-3 text-center font-black">نطق 🔊</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/40">
                          {module.rules.map((rule, rIdx) => {
                            const textRo = rule.rule_ro || rule.rule || rule.singular_ro || rule.gender;
                            const textTrans = appLang === 'en' ? (rule.rule_en || rule.explanation_ar || rule.meaning_en) : (rule.rule_ar || rule.explanation_ar || rule.meaning_ar);
                            const isPlaying = playingId === `rule-${module.id}-${rIdx}`;

                            return (
                              <tr key={rIdx} className={isDark ? 'hover:bg-slate-900/50' : 'hover:bg-slate-100/60'}>
                                <td className="p-3 font-black text-rose-500 font-mono text-xs sm:text-sm">{textRo}</td>
                                <td className={`p-3 font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{textTrans}</td>
                                <td className="p-3 text-center">
                                  <button
                                    onClick={() => speakText(textRo, `rule-${module.id}-${rIdx}`)}
                                    className={`p-2 rounded-xl transition-all border ${
                                      isPlaying 
                                        ? 'bg-rose-600 text-white border-rose-600 animate-pulse' 
                                        : isDark ? 'bg-slate-900 border-slate-700 text-rose-400 hover:bg-slate-800' : 'bg-white border-slate-200 text-rose-600 hover:bg-slate-200'
                                    }`}
                                  >
                                    <Volume2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Interactive Spoken Dialogue Card */}
                {module.dialogue_example && (
                  <div className={`p-4 rounded-2xl border space-y-3 ${isDark ? 'bg-slate-900/90 border-slate-700' : 'bg-amber-50/90 border-amber-300'}`}>
                    <div className="flex items-center justify-between border-b border-slate-700/50 pb-2">
                      <span className="text-xs font-black text-rose-500 flex items-center space-x-1.5 space-x-reverse">
                        <MessageSquare className="w-4 h-4" />
                        <span>{appLang === 'ar' ? 'حوار تطبيقي في الحياة اليومية:' : 'Practical Dialogue Example:'}</span>
                      </span>
                      <button
                        onClick={() => {
                          const dlg = module.dialogue_example;
                          if (Array.isArray(dlg)) {
                            const fullText = dlg.map(d => `${d.speaker_ro || d.speaker}: ${d.text_ro}`).join('. ');
                            speakText(fullText, `dialogue-${module.id}`);
                          } else {
                            speakText(`${dlg.speaker_a}: ${dlg.line_a_ro}. ${dlg.speaker_b}: ${dlg.line_b_ro}`, `dialogue-${module.id}`);
                          }
                        }}
                        className="text-xs font-bold text-amber-500 hover:underline flex items-center space-x-1 space-x-reverse bg-amber-500/15 px-2.5 py-1 rounded-xl border border-amber-500/30"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>استمع للحوار كامل 🔊</span>
                      </button>
                    </div>

                    <div className="space-y-3 pt-1">
                      {Array.isArray(module.dialogue_example) ? (
                        module.dialogue_example.map((line, dIdx) => (
                          <div key={dIdx} className={`p-3 rounded-xl border space-y-1 ${
                            isDark ? 'bg-slate-800/80 border-slate-700/60' : 'bg-white border-slate-200 shadow-sm'
                          }`}>
                            <span className="text-[11px] font-bold text-rose-500 block">{line.speaker_ro || line.speaker}</span>
                            <p className={`font-black text-xs sm:text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{line.text_ro}</p>
                            <p className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{appLang === 'en' ? `🇬🇧 ${line.text_en}` : `🇸🇦 ${line.text_ar}`}</p>
                          </div>
                        ))
                      ) : (
                        <>
                          <div className={`p-3 rounded-xl border space-y-1 ${
                            isDark ? 'bg-slate-800/80 border-slate-700/60' : 'bg-white border-slate-200 shadow-sm'
                          }`}>
                            <span className="text-[11px] font-bold text-rose-500 block">{module.dialogue_example.speaker_a}</span>
                            <p className={`font-black text-xs sm:text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{module.dialogue_example.line_a_ro}</p>
                            <p className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>🇸🇦 {module.dialogue_example.line_a_ar}</p>
                          </div>

                          <div className={`p-3 rounded-xl border space-y-1 ${
                            isDark ? 'bg-rose-950/20 border-rose-500/30' : 'bg-rose-50 border-rose-200 shadow-sm'
                          }`}>
                            <span className="text-[11px] font-bold text-emerald-500 block">{module.dialogue_example.speaker_b}</span>
                            <p className={`font-black text-xs sm:text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{module.dialogue_example.line_b_ro}</p>
                            <p className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>🇸🇦 {module.dialogue_example.line_b_ar}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
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
