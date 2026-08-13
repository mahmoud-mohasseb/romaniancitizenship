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
  Play 
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
    { id: 'all', label_ar: 'الكل (All Lessons)', label_en: 'All Lessons', label_ro: 'Toate Lecțiile' },
    { id: 'nouns', label_ar: '🏛️ الأجناس والأسماء (Nouns)', label_en: '🏛️ Nouns & Genders', label_ro: '🏛️ Substantive' },
    { id: 'articles', label_ar: '📌 أدوات التعريف (Articles)', label_en: '📌 Articles Suffixes', label_ro: '📌 Articole' },
    { id: 'verbs', label_ar: '⚡ تصريف الأفعال (Verbs)', label_en: '⚡ Verb Conjugations', label_ro: '⚡ Verbe' },
  ];

  const speakText = (text, id) => {
    if (typeof window === 'undefined') return;
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
    <div className="min-h-screen pb-20 bg-theme-main text-theme-main flex flex-col">
      <Navbar />

      <main className={`flex-1 w-full max-w-4xl mx-auto px-4 py-6 space-y-6 ${
        isRtl ? 'lg:mr-72' : 'lg:ml-72'
      } ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
        
        {/* Banner Title */}
        <div className={`rounded-2xl p-6 border shadow-xl space-y-3 text-center ${
          isDark ? 'bg-slate-800/90 border-slate-700/80' : 'bg-white border-slate-200'
        }`}>
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
            📚 قواعد اللغة الرومانية المبسطة (Gramatică Ușoară)
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            شرح القواعد بأسلوب المحادثات اليومية والنطق
          </h1>
          <p className="text-xs sm:text-sm text-theme-sub max-w-xl mx-auto leading-relaxed">
            دليل مبسط جداً لشرح القواعد مع نصائح سريعة وفيديوهات حوارية توضيحية ونطق صوتي لكل مثال!
          </p>

          <div className="pt-2">
            <Link
              href="/grammar-quiz"
              className="inline-flex items-center space-x-2 space-x-reverse px-5 py-3 bg-gradient-to-r from-amber-500 to-rose-600 text-white font-extrabold rounded-2xl text-xs shadow-lg hover:opacity-95 transition-all"
            >
              <Trophy className="w-4 h-4" />
              <span>جرب لعبة اختبار القواعد والمحادثات 🎮</span>
            </Link>
          </div>
        </div>

        {/* Search & Category Filter Section */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-5 h-5 absolute right-3.5 top-3 text-slate-500 rtl:right-3.5 rtl:left-auto ltr:left-3.5 ltr:right-auto" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={appLang === 'ar' ? 'ابحث في قواعد اللغة والمحادثات...' : 'Search grammar & dialogues...'}
              className={`w-full border rounded-2xl py-3 px-11 text-xs sm:text-sm focus:outline-none focus:border-amber-500 ${
                isDark ? 'bg-slate-800/80 border-slate-700/80 text-white placeholder-slate-500' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 shadow-sm'
              }`}
            />
          </div>

          <div className="flex items-center space-x-2 space-x-reverse overflow-x-auto pb-1 no-scrollbar">
            {categories.map((c) => {
              const isActive = activeCategory === c.id;
              const label = appLang === 'ar' ? c.label_ar : appLang === 'en' ? c.label_en : c.label_ro;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveCategory(c.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                    isActive 
                      ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30' 
                      : isDark ? 'bg-slate-800/80 text-slate-400 border border-slate-700/60 hover:text-white' : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900 shadow-sm'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* GRAMMAR LESSON CARDS LIST */}
        <div className="space-y-6">
          {filteredGrammar.map((lesson) => (
            <div 
              key={lesson.id}
              className={`rounded-2xl border shadow-xl overflow-hidden space-y-4 ${
                isDark ? 'bg-slate-800/90 border-slate-700/80' : 'bg-white border-slate-200'
              }`}
            >
              {/* Lesson Header */}
              <div className="p-4 border-b border-slate-700/60 bg-gradient-to-r from-amber-600 via-amber-700 to-rose-700 text-white flex items-center justify-between">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <GraduationCap className="w-6 h-6 text-white shrink-0" />
                  <div>
                    <h2 className="text-base font-black text-white">{lesson.topic_ro}</h2>
                    <p className="text-xs text-amber-100 font-bold">🇸🇦 {lesson.topic_ar}</p>
                  </div>
                </div>

                <button
                  onClick={() => speakText(lesson.topic_ro, lesson.id)}
                  className={`p-2 rounded-xl text-white transition-colors shrink-0 ${
                    playingId === lesson.id ? 'bg-rose-500 animate-pulse' : 'bg-white/20 hover:bg-white/30'
                  }`}
                  title="Listen Pronunciation"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Easy Tip Box */}
              {lesson.easy_tip_ar && (
                <div className="px-5">
                  <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold flex items-center space-x-2 space-x-reverse">
                    <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{lesson.easy_tip_ar}</span>
                  </div>
                </div>
              )}

              {/* Lesson Explanation Box */}
              <div className="px-5 space-y-2 text-xs">
                <div className={`p-3.5 rounded-xl border space-y-1 ${
                  isDark ? 'bg-slate-900/80 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}>
                  <p className="font-bold text-amber-500">🇸🇦 الشرح المبسط بالعربية:</p>
                  <p className="leading-relaxed text-theme-main font-medium">{lesson.explanation_ar}</p>
                  <p className="font-medium text-slate-400 pt-1">🇬🇧 {lesson.explanation_en}</p>
                </div>
              </div>

              {/* Rules & Conjugations Table / Cards */}
              <div className="px-5 space-y-2">
                <p className="text-xs font-black text-theme-main">
                  📌 قواعد وأمثلة الدرس (Grammar Rules & Examples):
                </p>

                <div className="grid grid-cols-1 gap-2.5">
                  {lesson.rules.map((rule, idx) => (
                    <div 
                      key={idx}
                      className={`p-3.5 rounded-xl border text-xs space-y-1.5 transition-all ${
                        isDark ? 'bg-slate-900/90 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between border-b border-slate-700/40 pb-2">
                        <span className="font-black text-amber-400">{rule.gender || rule.pronoun}</span>
                        <button
                          onClick={() => speakText(rule.singular_ro || rule.definite_ro || rule.example_ro || rule.a_fi, `${lesson.id}-rule-${idx}`)}
                          className={`p-1.5 rounded-lg text-amber-400 transition-colors ${
                            playingId === `${lesson.id}-rule-${idx}` ? 'bg-amber-500 text-white animate-pulse' : 'bg-amber-500/20 hover:bg-amber-500/30'
                          }`}
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Rule details */}
                      {rule.singular_ro && (
                        <div className="grid grid-cols-2 gap-2 text-right">
                          <div>
                            <span className="text-slate-400 block text-[10px]">المفرد:</span>
                            <span className="font-bold text-emerald-400">{rule.singular_ro}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px]">الجمع:</span>
                            <span className="font-bold text-rose-400">{rule.plural_ro}</span>
                          </div>
                        </div>
                      )}

                      {rule.indefinite_ro && (
                        <div className="grid grid-cols-2 gap-2 text-right">
                          <div>
                            <span className="text-slate-400 block text-[10px]">نكرة (Indefinite):</span>
                            <span className="font-bold text-blue-400">{rule.indefinite_ro}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px]">معرفة (Definite):</span>
                            <span className="font-bold text-emerald-400">{rule.definite_ro}</span>
                          </div>
                        </div>
                      )}

                      {rule.a_fi && (
                        <div className="grid grid-cols-4 gap-1.5 text-center pt-1 font-bold">
                          <div className="p-1.5 rounded bg-slate-800 text-amber-400">A fi: {rule.a_fi}</div>
                          <div className="p-1.5 rounded bg-slate-800 text-emerald-400">A avea: {rule.a_avea}</div>
                          <div className="p-1.5 rounded bg-slate-800 text-blue-400">Merge: {rule.a_merge}</div>
                          <div className="p-1.5 rounded bg-slate-800 text-purple-400">Vorbi: {rule.a_vorbi}</div>
                        </div>
                      )}

                      {rule.rule_ar && <p className="text-[11px] font-semibold text-rose-400 text-right">🇸🇦 {rule.rule_ar}</p>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Conversational Dialogue Example Section */}
              {lesson.dialogue_example && (
                <div className="px-5 pb-5 space-y-2">
                  <p className="text-xs font-black text-emerald-400 flex items-center space-x-1.5 space-x-reverse">
                    <MessageSquare className="w-4 h-4" />
                    <span>تطبيق القاعدة في حوار واقعي (Conversational Dialogue):</span>
                  </p>

                  <div className={`rounded-xl p-3.5 border space-y-2 text-xs ${
                    isDark ? 'bg-slate-900 border-emerald-500/30' : 'bg-emerald-50/40 border-emerald-200'
                  }`}>
                    {lesson.dialogue_example.map((line, dIdx) => (
                      <div key={dIdx} className="flex items-start justify-between border-b border-slate-700/40 pb-2 last:border-0 last:pb-0">
                        <div className="space-y-0.5 text-right">
                          <span className="text-[10px] font-extrabold text-amber-400">{line.speaker}:</span>
                          <p className="font-bold text-emerald-400">{line.text_ro}</p>
                          <p className="text-[11px] text-rose-400 font-semibold">🇸🇦 {line.text_ar}</p>
                        </div>

                        <button
                          onClick={() => speakText(line.text_ro, `${lesson.id}-diag-${dIdx}`)}
                          className={`p-1.5 rounded-lg text-emerald-400 transition-colors shrink-0 ${
                            playingId === `${lesson.id}-diag-${dIdx}` ? 'bg-emerald-500 text-white animate-pulse' : 'bg-emerald-500/20 hover:bg-emerald-500/30'
                          }`}
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
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
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading Grammar Page...</div>}>
      <GrammarContent />
    </Suspense>
  );
}
