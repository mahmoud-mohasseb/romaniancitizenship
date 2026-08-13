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
  Bookmark
} from 'lucide-react';
import grammarData from '../../data/romanian_grammar.json';
import Navbar from '../../components/Navbar';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

function GrammarContent() {
  const { theme } = useTheme();
  const { appLang, strings, isRtl } = useLanguage();
  const isDark = theme === 'dark';

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [playingId, setPlayingId] = useState(null);

  const categories = [
    { id: 'all', label_ar: 'جميع الدروس (All 22 Modules)', label_en: 'All 22 Modules', label_ro: 'Toate cele 22 de Module' },
    { id: 'nouns', label_ar: '🏛️ الأجناس والأسماء (Nouns)', label_en: '🏛️ Nouns & Genders', label_ro: '🏛️ Substantive' },
    { id: 'articles', label_ar: '📌 أدوات التعريف (Articles)', label_en: '📌 Articles Suffixes', label_ro: '📌 Articole' },
    { id: 'verbs', label_ar: '⚡ تصريف الأفعال (Verbs)', label_en: '⚡ Verb Conjugations', label_ro: '⚡ Verbe' },
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
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      item.topic_ro.toLowerCase().includes(q) ||
      (item.topic_ar && item.topic_ar.includes(q)) ||
      (item.topic_en && item.topic_en.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen pb-28 sm:pb-24 bg-theme-main text-theme-main flex flex-col">
      <Navbar />

      <main className={`flex-1 w-full max-w-4xl mx-auto px-4 py-6 space-y-6 animate-fade-in-up ${
        isRtl ? 'lg:mr-72' : 'lg:ml-72'
      } ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
        
        {/* Banner Title */}
        <div className={`rounded-2xl p-6 border shadow-xl space-y-3 text-center ${
          isDark ? 'bg-slate-800/90 border-slate-700/80' : 'bg-white border-slate-200'
        }`}>
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-black bg-amber-500/20 text-amber-400 border border-amber-500/30">
            📚 Gramatica Limbii Române (22 Module)
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            {strings.grammarTitle}
          </h1>
          <p className="text-xs sm:text-sm text-theme-sub max-w-xl mx-auto leading-relaxed">
            {strings.grammarSubtitle}
          </p>

          <div className="pt-2">
            <Link
              href="/grammar-quiz"
              className="inline-flex items-center space-x-2 space-x-reverse px-5 py-3 bg-gradient-to-r from-amber-500 to-rose-600 text-white font-black rounded-2xl text-xs shadow-lg hover:opacity-95 transition-all"
            >
              <Trophy className="w-4 h-4" />
              <span>{strings.grammarQuizCardTitle || 'جرب لعبة اختبار القواعد والمحادثات 🎮'}</span>
            </Link>
          </div>
        </div>

        {/* Search & Category Filter Section */}
        <div className="space-y-3">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={appLang === 'ar' ? 'ابحث في قواعد اللغة (مثال: الجمع، الفاعل، a merge...)' : appLang === 'en' ? 'Search grammar topics...' : 'Caută lecții de gramatică...'}
              className={`w-full border rounded-2xl px-4 py-3 text-xs sm:text-sm pl-10 focus:outline-none focus:border-amber-500 ${
                isDark ? 'bg-slate-800 border-slate-700/80 text-white placeholder-slate-500' : 'bg-white border-slate-200 text-slate-900 shadow-sm placeholder-slate-400'
              }`}
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          </div>

          <div className="flex items-center space-x-2 space-x-reverse overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all border ${
                  activeCategory === cat.id
                    ? 'bg-amber-500 text-slate-900 border-amber-500 shadow-md font-black animate-quiz-pop'
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
          {filteredGrammar.map((module, index) => (
            <div
              key={module.id || index}
              className={`p-5 sm:p-6 rounded-2xl border space-y-5 shadow-xl animate-fade-in-up transition-all ${
                isDark ? 'bg-slate-800/90 border-slate-700/80' : 'bg-white border-slate-200'
              }`}
            >
              {/* Header Badge & Title */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-700/60 pb-4 gap-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-black bg-rose-500/20 text-rose-400 border border-rose-500/30">
                      Module #{index + 1}
                    </span>
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                      {module.topic_ro}
                    </span>
                  </div>
                  <h2 className="text-xl font-extrabold text-theme-main pt-1">
                    {appLang === 'ar' ? module.topic_ar : appLang === 'en' ? module.topic_en : module.topic_ro}
                  </h2>
                </div>

                <button
                  onClick={() => speakText(module.topic_ro, `topic-${module.id}`)}
                  className="px-3 py-1.5 rounded-xl bg-slate-700/40 hover:bg-slate-700 text-rose-400 border border-slate-600/40 text-xs font-bold flex items-center space-x-1.5 space-x-reverse shrink-0 self-start sm:self-auto"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{strings.playAudio || 'استمع'}</span>
                </button>
              </div>

              {/* High Visibility Quick Tip Box */}
              {module.easy_tip_ar && (
                <div className="p-4 rounded-xl bg-amber-500/10 border-2 border-amber-500/30 text-amber-300 text-xs sm:text-sm font-bold flex items-start space-x-3 space-x-reverse shadow-inner">
                  <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 animate-bounce-subtle" />
                  <div>
                    <span className="block text-amber-400 font-extrabold text-xs uppercase mb-1">
                      💡 {appLang === 'ar' ? 'نصيحة سريعة للفهم (Quick Tip):' : '💡 Quick Tip:'}
                    </span>
                    <p className="leading-relaxed text-amber-200 font-bold">{module.easy_tip_ar}</p>
                  </div>
                </div>
              )}

              {/* Clear Multilingual Explanation Box */}
              <div className={`p-4 rounded-xl border space-y-2 text-xs sm:text-sm leading-relaxed ${
                isDark ? 'bg-slate-900/80 border-slate-700/80' : 'bg-slate-50 border-slate-200'
              }`}>
                <span className="text-[11px] font-extrabold text-slate-400 block uppercase">
                  📖 {appLang === 'ar' ? 'شرح الدرس والتوضيح:' : appLang === 'en' ? 'Lesson Explanation:' : 'Explicativă:'}
                </span>
                <p className="font-semibold text-theme-main leading-relaxed">
                  🇸🇦 {module.explanation_ar}
                </p>
                {module.explanation_en && (
                  <p className="text-xs text-slate-400 pt-1 border-t border-slate-700/40">
                    🇬🇧 {module.explanation_en}
                  </p>
                )}
              </div>

              {/* High-Contrast Rules & Conjugation Table */}
              {module.rules && module.rules.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-extrabold text-theme-sub flex items-center space-x-1.5 space-x-reverse">
                    <Layers className="w-4 h-4 text-rose-500" />
                    <span>{appLang === 'ar' ? 'قواعد وتصريفات وتراكيب الجمل:' : 'Grammar Rules & Conjugations:'}</span>
                  </span>

                  <div className="overflow-x-auto rounded-xl border border-slate-700/60 shadow-sm">
                    <table className="w-full text-xs sm:text-sm text-right">
                      <thead className={`border-b ${isDark ? 'bg-slate-900 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'}`}>
                        <tr>
                          <th className="p-3 text-right font-black">الرومانية (Romanian)</th>
                          <th className="p-3 text-right font-black">المعنى والشرح (Translation)</th>
                          <th className="p-3 text-center font-black">نطق 🔊</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/40">
                        {module.rules.map((rule, rIdx) => {
                          const textRo = rule.rule_ro || rule.rule;
                          const isPlaying = playingId === `rule-${module.id}-${rIdx}`;

                          return (
                            <tr key={rIdx} className={isDark ? 'hover:bg-slate-900/50' : 'hover:bg-slate-50'}>
                              <td className="p-3 font-extrabold text-rose-400 font-mono text-xs sm:text-sm">{textRo}</td>
                              <td className="p-3 font-medium text-slate-300">{rule.explanation_ar}</td>
                              <td className="p-3 text-center">
                                <button
                                  onClick={() => speakText(textRo, `rule-${module.id}-${rIdx}`)}
                                  className={`p-2 rounded-xl transition-all border ${
                                    isPlaying 
                                      ? 'bg-rose-600 text-white border-rose-600 animate-pulse' 
                                      : isDark ? 'bg-slate-900 border-slate-700 text-rose-400 hover:bg-slate-800' : 'bg-white border-slate-200 text-rose-600 hover:bg-slate-100'
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
                <div className={`p-4 rounded-2xl border space-y-3 ${isDark ? 'bg-slate-900/90 border-slate-700' : 'bg-amber-50/70 border-amber-200'}`}>
                  <div className="flex items-center justify-between border-b border-slate-700/50 pb-2">
                    <span className="text-xs font-black text-rose-400 flex items-center space-x-1.5 space-x-reverse">
                      <MessageSquare className="w-4 h-4" />
                      <span>{appLang === 'ar' ? 'حوار تطبيقي في الحياة اليومية:' : 'Practical Dialogue Example:'}</span>
                    </span>
                    <button
                      onClick={() => speakText(`${module.dialogue_example.speaker_a}: ${module.dialogue_example.line_a_ro}. ${module.dialogue_example.speaker_b}: ${module.dialogue_example.line_b_ro}`, `dialogue-${module.id}`)}
                      className="text-xs font-bold text-amber-400 hover:underline flex items-center space-x-1 space-x-reverse bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/20"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>استمع للحوار كامل 🔊</span>
                    </button>
                  </div>

                  <div className="space-y-3 pt-1">
                    <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-1">
                      <span className="text-[11px] font-bold text-rose-400 block">{module.dialogue_example.speaker_a}</span>
                      <p className="font-extrabold text-xs sm:text-sm text-white">{module.dialogue_example.line_a_ro}</p>
                      <p className="text-xs text-slate-300">🇸🇦 {module.dialogue_example.line_a_ar}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-1">
                      <span className="text-[11px] font-bold text-emerald-400 block">{module.dialogue_example.speaker_b}</span>
                      <p className="font-extrabold text-xs sm:text-sm text-white">{module.dialogue_example.line_b_ro}</p>
                      <p className="text-xs text-slate-300">🇸🇦 {module.dialogue_example.line_b_ar}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default function GrammarPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading Grammar Guide...</div>}>
      <GrammarContent />
    </Suspense>
  );
}
