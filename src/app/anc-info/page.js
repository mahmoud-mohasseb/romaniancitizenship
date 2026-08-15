'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  Building2, 
  ShieldCheck, 
  FileCheck, 
  Search, 
  MapPin, 
  ExternalLink, 
  CheckSquare, 
  Square, 
  Trophy, 
  BookOpen, 
  FileText, 
  Sparkles, 
  AlertTriangle, 
  Info, 
  HelpCircle,
  Clock,
  Award,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../components/Navbar';
import AudioPlayerButton from '../../components/AudioPlayerButton';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import ancData from '../../data/anc_citizenship_info.json';

function ANCInfoContent() {
  const searchParams = useSearchParams();

  const { theme } = useTheme();
  const { appLang, strings, isRtl } = useLanguage();
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'eligibility', 'dossier', 'roadmap', 'oath', 'faq'
  const [searchQuery, setSearchQuery] = useState('');
  const [checkedDocs, setCheckedDocs] = useState([]);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    const qParam = searchParams.get('q');
    if (tabParam) setActiveTab(tabParam);
    if (qParam) setSearchQuery(qParam);
  }, [searchParams]);

  const toggleDocCheck = (id) => {
    setCheckedDocs(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const meta = ancData.authority_meta;
  const pathways = ancData.citizenship_pathways;
  const docs = ancData.dossier_requirements;
  const roadmap = ancData.application_roadmap;
  const oath = ancData.official_oath;
  const faqs = ancData.official_faqs;

  const docProgressPct = Math.round((checkedDocs.length / Math.max(docs.length, 1)) * 100);

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
            <span className="px-3.5 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>{meta.name_ro}</span>
            </span>

            <a
              href={meta.official_website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-black text-blue-400 hover:underline flex items-center gap-1 bg-blue-500/10 border border-blue-500/30 px-3 py-1 rounded-full"
            >
              <span>{appLang === 'ar' ? 'الموقع الرسمي ANC 🌐' : 'Official Portal 🌐'}</span>
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            </a>
          </div>

          <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
            {appLang === 'ar' ? 'دليل إجراءات ومتطلبات الجنسية الرومانية الرسمي (ANC) 🏛️' : appLang === 'en' ? 'Official Romanian Citizenship Authority (ANC) Guide 🏛️' : 'Ghidul Oficial al Autorității Naționale pentru Cetățenie (ANC) 🏛️'}
          </h1>
          <p className="text-xs sm:text-sm text-theme-sub font-semibold leading-relaxed">
            {appLang === 'ar' 
              ? 'الشروط القانونية بموجب القانون رقم 21/1991، قائمة مستندات الملف، خطوات التقديم والمتابعة، ونص قسم اليمين الرسمي.' 
              : 'Legal framework under Law No. 21/1991, mandatory dossier document checklists, application roadmaps, and official oath text.'}
          </p>

          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>{appLang === 'ar' ? meta.disclaimer_ar : meta.disclaimer_en}</span>
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
            placeholder={appLang === 'ar' ? 'ابحث في الشروط، المستندات، قسم اليمين، أو المواد (مثال: Cazier، Articolul 8)...' : 'Search requirements, documents, oath, or articles...'}
            className="flex-1 px-3 bg-transparent outline-none text-xs sm:text-sm font-semibold placeholder:text-slate-500"
          />
        </div>

        {/* Section Tabs Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {[
            { id: 'overview', label_ar: '🏛️ نظرة عامة والقانون', label_en: 'Overview & Law' },
            { id: 'eligibility', label_ar: '⚖️ شروط المواد 8، 10، 11', label_en: 'Articles 8, 10, 11' },
            { id: 'dossier', label_ar: '📄 قائمة مستندات الملف', label_en: 'Dossier Checklist' },
            { id: 'roadmap', label_ar: '🛣️ خريطة خطوات التقديم', label_en: 'Application Roadmap' },
            { id: 'oath', label_ar: '📜 قسم الولاء الرسمي', label_en: 'Oath of Allegiance' },
            { id: 'faq', label_ar: '❓ الأسئلة ومتابعة الملف', label_en: 'FAQ & Tracking' }
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

        {/* Tab 1: Overview & Legal Framework */}
        {activeTab === 'overview' && (
          <div className="space-y-4 animate-fade-in-up">
            <div className={`p-5 rounded-3xl border space-y-4 ${isDark ? 'bg-slate-800/90 border-slate-700' : 'bg-white border-slate-200 shadow-lg'}`}>
              <div className="flex items-center gap-3 border-b border-slate-700/60 pb-3">
                <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black">{meta.name_ro}</h3>
                  <p className="text-xs text-theme-sub font-bold">{meta.parent_ministry_ro}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-bold">
                <p className="text-amber-400 flex items-center gap-2">
                  <MapPin className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>المقر الرئيسي الرسمي: {meta.headquarters_address}</span>
                </p>
                <p className="text-slate-300 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>الإطار القانوني: {ancData.legal_framework.primary_law_ro}</span>
                </p>
              </div>

              <div className="pt-2 border-t border-slate-700/50">
                <span className="text-xs font-black text-rose-400 block mb-2">المكاتب الإقليمية المعتمدة لاستلام الملفات:</span>
                <div className="flex flex-wrap gap-2">
                  {meta.territorial_offices.map((office, oIdx) => (
                    <span key={oIdx} className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-xs font-extrabold text-white">
                      🏛️ {office}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Eligibility Articles (Art. 8, 10, 11) */}
        {activeTab === 'eligibility' && (
          <div className="space-y-4 animate-fade-in-up">
            {pathways.map((path) => (
              <div key={path.id} className={`p-5 sm:p-6 rounded-3xl border space-y-3 shadow-lg ${
                isDark ? 'bg-slate-800/90 border-slate-700' : 'bg-white border-slate-200'
              }`}>
                <div className="flex items-center justify-between border-b border-slate-700/60 pb-2">
                  <span className="px-3 py-1 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-black">
                    {path.article_law}
                  </span>
                  <a href={path.source_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline flex items-center gap-1 font-bold">
                    <span>المصدر الرسمي</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <h3 className="text-base font-black">{appLang === 'ar' ? path.title_ar : path.title_ro}</h3>
                <p className="text-xs text-theme-sub font-semibold">{appLang === 'ar' ? path.summary_ar : path.summary_en}</p>

                <div className="pt-2 space-y-1.5">
                  <span className="text-xs font-black text-emerald-400 block">الشروط والمتطلبات الأساسية:</span>
                  <ul className="space-y-1 text-xs font-bold text-slate-300">
                    {(appLang === 'ar' ? path.eligibility_criteria_ar : path.eligibility_criteria_en).map((crit, cIdx) => (
                      <li key={cIdx} className="flex items-start gap-2">
                        <span className="text-emerald-400 font-black">•</span>
                        <span>{crit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Required Dossier Checklist */}
        {activeTab === 'dossier' && (
          <div className="space-y-4 animate-fade-in-up">
            <div className={`p-4 rounded-2xl border flex items-center justify-between shadow-sm ${
              isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200'
            }`}>
              <span className="text-xs font-black text-amber-400">
                مستوى جاهزية وثائق الملف الشخصي: {checkedDocs.length} / {docs.length} ({docProgressPct}%)
              </span>
              <div className="w-36 h-2 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${docProgressPct}%` }} />
              </div>
            </div>

            <div className="space-y-3">
              {docs.map((doc) => {
                const isChecked = checkedDocs.includes(doc.id);
                return (
                  <div
                    key={doc.id}
                    onClick={() => toggleDocCheck(doc.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                      isChecked 
                        ? 'bg-emerald-600/15 border-emerald-500/50 text-white' 
                        : isDark ? 'bg-slate-800/90 border-slate-700/80' : 'bg-white border-slate-200 shadow-sm'
                    }`}
                  >
                    <button className="mt-0.5 text-emerald-400">
                      {isChecked ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5 text-slate-500" />}
                    </button>

                    <div className="space-y-1">
                      <h4 className="text-xs sm:text-sm font-black text-white">{appLang === 'ar' ? doc.name_ar : doc.name_ro}</h4>
                      <p className="text-xs text-theme-sub font-semibold leading-relaxed">{appLang === 'ar' ? doc.details_ar : doc.details_en}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 4: Application Roadmap */}
        {activeTab === 'roadmap' && (
          <div className="space-y-4 animate-fade-in-up">
            {roadmap.map((step) => (
              <div key={step.step_number} className={`p-5 rounded-3xl border space-y-2 relative shadow-md ${
                isDark ? 'bg-slate-800/90 border-slate-700' : 'bg-white border-slate-200'
              }`}>
                <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-black inline-block">
                  الخطوة {step.step_number}
                </span>
                <h3 className="text-sm sm:text-base font-black">{appLang === 'ar' ? step.title_ar : step.title_ro}</h3>
                <p className="text-xs text-theme-sub font-semibold leading-relaxed">{appLang === 'ar' ? step.description_ar : step.title_en}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tab 5: Official Oath of Allegiance */}
        {activeTab === 'oath' && (
          <div className="space-y-4 animate-fade-in-up">
            <div className={`p-6 rounded-3xl border space-y-4 text-center shadow-xl ${
              isDark ? 'bg-slate-800/90 border-slate-700' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                <span className="text-xs font-black text-rose-500 uppercase tracking-wider">
                  📜 {oath.title_ro}
                </span>
                <AudioPlayerButton text={oath.text_ro} lang="ro" label="استمع للنص الصوتي" />
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-rose-500/40 space-y-2">
                <p className="text-sm sm:text-base font-black text-rose-400 leading-relaxed font-latin">
                  "{oath.text_ro}"
                </p>
                <p className="text-xs text-amber-300 font-bold">
                  🇸🇦 {oath.text_ar}
                </p>
                <p className="text-xs text-slate-400 font-mono pt-1">
                  🗣️ النطق الصوتي: {oath.phonetic_guide}
                </p>
              </div>

              <Link
                href="/constitution-writing"
                className="w-full py-3.5 bg-gradient-to-r from-rose-600 via-rose-700 to-amber-600 text-white font-black text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 shadow-xl hover:opacity-95 transition-all"
              >
                <FileText className="w-4 h-4" />
                <span>تدرب على كتابة وصياغة قسم اليمين ✍️</span>
              </Link>
            </div>
          </div>
        )}

        {/* Tab 6: Official FAQs */}
        {activeTab === 'faq' && (
          <div className="space-y-3 animate-fade-in-up">
            {faqs.map((faq, fIdx) => (
              <div key={fIdx} className={`p-4 rounded-2xl border space-y-2 ${
                isDark ? 'bg-slate-800/90 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <h4 className="text-xs sm:text-sm font-black text-amber-400 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 shrink-0" />
                  <span>{appLang === 'ar' ? faq.question_ar : faq.question_ro}</span>
                </h4>
                <p className="text-xs text-theme-sub font-semibold leading-relaxed pt-1 border-t border-slate-700/40">
                  {appLang === 'ar' ? faq.answer_ar : faq.answer_ro}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Navigation Action Footer Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <Link
            href="/quiz"
            className="p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md hover:opacity-95 transition-all"
          >
            <Trophy className="w-4 h-4" />
            <span>اختبر معلوماتك في الأسئلة 🎯</span>
          </Link>

          <Link
            href="/constitution"
            className="p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md hover:opacity-95 transition-all"
          >
            <BookOpen className="w-4 h-4" />
            <span>اقرأ الدستور الروماني 📖</span>
          </Link>

          <Link
            href="/constitution-writing"
            className="p-4 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-600 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md hover:opacity-95 transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>كتابة وصياغة الإجابات ✍️</span>
          </Link>
        </div>
      </main>
    </div>
  );
}

export default function ANCInfoPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400 font-bold">Loading ANC Portal...</div>}>
      <ANCInfoContent />
    </Suspense>
  );
}
