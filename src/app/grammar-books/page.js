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
  Library,
  ArrowLeft,
  Bookmark,
  Compass
} from 'lucide-react';
import textbookExamplesData from '../../data/textbook_grammar_examples.json';
import Navbar from '../../components/Navbar';
import AudioPlayerButton from '../../components/AudioPlayerButton';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

function GrammarBooksContent() {
  const { theme } = useTheme();
  const { appLang, strings, isRtl } = useLanguage();
  const isDark = theme === 'dark';

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPdf, setSelectedPdf] = useState(null);

  // Flatten all textbook examples for search and filtering
  const allExamples = Object.keys(textbookExamplesData).reduce((acc, catKey) => {
    return acc.concat(textbookExamplesData[catKey] || []);
  }, []);

  const filteredExamples = allExamples.filter((ex) => {
    const matchesCat = selectedCategory === 'all' || ex.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesQ = !q || 
      ex.ro.toLowerCase().includes(q) || 
      ex.en.toLowerCase().includes(q) ||
      (ex.source && ex.source.toLowerCase().includes(q));
    return matchesCat && matchesQ;
  });

  const categories = [
    { id: 'all', label_ar: `🌐 جميع الموضوعات والأمثلة (${allExamples.length})`, label_en: `🌐 All Topics (${allExamples.length})` },
    { id: 'nouns', label_ar: `🏷️ الأسماء والأجناس (${textbookExamplesData.nouns?.length || 0})`, label_en: `🏷️ Nouns & Genders (${textbookExamplesData.nouns?.length || 0})` },
    { id: 'articles', label_ar: `📌 أدوات التعريف والتنكير (${textbookExamplesData.articles?.length || 0})`, label_en: `📌 Articles (${textbookExamplesData.articles?.length || 0})` },
    { id: 'adjectives', label_ar: `🎨 الصفات والمطابقة (${textbookExamplesData.adjectives?.length || 0})`, label_en: `🎨 Adjectives (${textbookExamplesData.adjectives?.length || 0})` },
    { id: 'pronouns', label_ar: `👤 الضمائر وصيغ الاحترام (${textbookExamplesData.pronouns?.length || 0})`, label_en: `👤 Pronouns (${textbookExamplesData.pronouns?.length || 0})` },
    { id: 'verbs', label_ar: `⚡ الأفعال والأزمنة والمصادر (${textbookExamplesData.verbs?.length || 0})`, label_en: `⚡ Verbs & Moods (${textbookExamplesData.verbs?.length || 0})` },
    { id: 'prepositions', label_ar: `📍 حروف الجر والحالات (${textbookExamplesData.prepositions?.length || 0})`, label_en: `📍 Prepositions (${textbookExamplesData.prepositions?.length || 0})` },
    { id: 'conjunctions', label_ar: `🔗 أدوات الربط والجمل المركبة (${textbookExamplesData.conjunctions?.length || 0})`, label_en: `🔗 Conjunctions (${textbookExamplesData.conjunctions?.length || 0})` },
    { id: 'numerals', label_ar: `🔢 الأرقام والأعداد الترتيبية (${textbookExamplesData.numerals?.length || 0})`, label_en: `🔢 Numerals (${textbookExamplesData.numerals?.length || 0})` },
    { id: 'socializing', label_ar: `🤝 التعبير عن الرأي والتواصل (${textbookExamplesData.socializing?.length || 0})`, label_en: `🤝 Socializing (${textbookExamplesData.socializing?.length || 0})` },
  ];

  // Structured Chapter Reference Guides extracted from Routledge & Teach Yourself
  const chapterGuides = [
    {
      title_ro: 'Capitolu 1: Sunete, Litere și Diftongi',
      title_ar: 'الباب الأول: الأصوات والأحرف والأدغام (Diphthongs & Triphthongs)',
      summary_ar: 'يشرح الأبجدية الرومانية المكونة من 31 حرفاً، والأصوات الخاصة (ă, î, ș, ț, â) والمجموعات الصوتية (ea, oa, ia, ua, iau).',
      examples: [
        { ro: 'Diftongi: țăran (ea), soare (oa), iarbă (ia), ziua (ua).', en: 'Diphthongs: farmer (ea), sun (oa), grass (ia), day (ua).' },
        { ro: 'Triftongi: voiau (iau), doreau (eau).', en: 'Triphthongs: they wanted (iau), they wished (eau).' }
      ]
    },
    {
      title_ro: 'Capitolu 2: Genul și Pluralul Substantivelor',
      title_ar: 'الباب الثاني: أجناس الأسماء وتكوين الجمع (Masculin, Feminin, Neutru)',
      summary_ar: 'تقسم الأسماء إلى 3 أجناس. الجنس المحايد (Neutru) يأخذ un في المفرد و două في الجمع (un scaun - două scaune).',
      examples: [
        { ro: 'Masculin: un om - doi oameni | un bărbat - doi bărbați.', en: 'Masculine: a man - two men | a man - two men.' },
        { ro: 'Feminin: o femeie - două femei | o țară - două țări.', en: 'Feminine: a woman - two women | a country - two countries.' },
        { ro: 'Neutru: un pașaport - două pașapoarte | un drept - două drepturi.', en: 'Neuter: a passport - two passports | a right - two rights.' }
      ]
    },
    {
      title_ro: 'Capitolu 3: Sistemul Complex al Articolelor',
      title_ar: 'الباب الثالث: أدوات التعريف والتنكير والأدوات الإشارية والمالكة',
      summary_ar: 'تشمل أداة التعريف اللاحقة (-ul, -a, -le, -ii)، والأداة المالكة (al, a, ai, ale) والأداة النعتية (cel, cea, cei, cele).',
      examples: [
        { ro: 'Articol Hotărât: omul, fata, pașaportul, băieții, fetele.', en: 'Definite Article: the man, the girl, the passport, the boys, the girls.' },
        { ro: 'Articol Posesiv: steagul al României, o prietenă a mea.', en: 'Possessive Article: flag of Romania, a friend of mine.' },
        { ro: 'Articol Adjectival: cel mai bun cetățean, cea mai frumoasă țară.', en: 'Adjectival Article: the best citizen, the most beautiful country.' }
      ]
    },
    {
      title_ro: 'Capitolu 4: Clasificarea și Acordul Adjectivelor',
      title_ar: 'الباب الرابع: أنواع الصفات ومطابقتها ودرجات التفضيل',
      summary_ar: 'تطابق الصفة الموصوف في الجنس والعدد والحالة. وتقسم إلى 4 نهايات (bun), 3 نهايات (mic), و 2 نهايات (mare, dulce).',
      examples: [
        { ro: '4 Forme: bun (M.Sg), bună (F.Sg), buni (M.Pl), bune (F.Pl).', en: '4 forms adjective: good (M/F sg & pl).' },
        { ro: 'Comparație: mare -> mai mare -> cel mai mare.', en: 'Comparison: big -> bigger -> the biggest.' }
      ]
    },
    {
      title_ro: 'Capitolu 5: Pronumele și Formele de Politețe',
      title_ar: 'الباب الخامس: الضمائر وصيغ الاحترام والتأكيد والإشارة',
      summary_ar: 'تتميز الرومانية بضمائر احترام رسمية مثل Dumneavoastră (أنتم/حضرتكم)، Dânsul (هو المحترم)، و Dânsa (هي المحترمة).',
      examples: [
        { ro: 'Politețe: Dumneavoastră vorbiți limba română.', en: 'You (formal polite) speak the Romanian language.' },
        { ro: 'Pronume Clitice: Văzându-mă, i-am dat dosarul.', en: 'Clitics: Seeing me, I gave him the dossier.' }
      ]
    },
    {
      title_ro: 'Capitolu 7: Verbele și Cele 11 Conjugări (Moduri și Timpuri)',
      title_ar: 'الباب السابع: تصريف الأفعال عبر 11 مجموعة والصيغ غير المصرفة (Gerunziu, Supin)',
      summary_ar: 'يغطي الماضي المركب (am învățat)، الماضي المستمر (eram)، المنصوب (să fie)، الشرط (aș dori)، والـ Gerund (văzându-l) والـ Supine (de făcut).',
      examples: [
        { ro: 'Perfect Compus: Eu am depus jurământul de credință.', en: 'Past Perfect: I took the oath of allegiance.' },
        { ro: 'Subiectiv / Conjunctiv: Doresc ca noi să fim cetățeni responsabili.', en: 'Subjunctive să: I wish that we be responsible citizens.' },
        { ro: 'Gerunziu & Supin: Amintindu-mi-o, am trimis felicitarea. | Am de pregătit acte.', en: 'Gerund & Supine: Remembering her, I sent the card. | I have documents to prepare.' }
      ]
    },
    {
      title_ro: 'Capitolu 9: Prepozițiile și Regimul de Caz (Acuzativ, Genitiv, Dativ)',
      title_ar: 'الباب التاسع: حروف الجر وحالات الإعراب (Accusative, Genitive, Dative)',
      summary_ar: 'تتطلب بعض حروف الجر حالة Dative (conform legii, datorită sprijinului) أو Genitive (în fața comisiei, contra legii).',
      examples: [
        { ro: 'Dativ: Conform legii, dreptul la vot este garantat.', en: 'Dative: According to law, voting right is guaranteed.' },
        { ro: 'Genitiv: În fața președintelui comisiei, am jurat credință.', en: 'Genitive: In front of the commission president, I swore allegiance.' }
      ]
    }
  ];

  return (
    <div className="min-h-screen pb-28 sm:pb-24 bg-theme-main text-theme-main flex flex-col font-latin">
      <Navbar />

      <main className={`flex-1 w-full max-w-4xl mx-auto px-4 py-6 space-y-6 animate-fade-in-up ${
        isRtl ? 'lg:mr-72' : 'lg:ml-72'
      } ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>

        {/* Back Link to Grammar Guide */}
        <div className="flex items-center justify-between">
          <Link
            href="/grammar"
            className="inline-flex items-center gap-2 text-xs font-black text-amber-400 hover:text-amber-300 transition-colors"
          >
            <ArrowLeft className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
            <span>{appLang === 'ar' ? 'العودة إلى دروس القواعد التفاعلية 📖' : 'Back to Grammar Lessons Guide'}</span>
          </Link>

          <Link
            href="/grammar-quiz"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-black hover:bg-amber-500/30 transition-all"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>{appLang === 'ar' ? 'اختبار القواعد 🎮' : 'Grammar Quiz Game'}</span>
          </Link>
        </div>

        {/* Header Banner */}
        <div className={`rounded-3xl p-6 border shadow-xl space-y-3 text-center ${
          isDark ? 'bg-slate-800/90 border-slate-700/80 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-black bg-rose-500/20 text-rose-400 border border-rose-500/30">
            📖 Biblioteca Master de Manuale & Ghiduri Extrase (Routledge & Teach Yourself)
          </span>
          <h1 className="text-2xl sm:text-3xl font-black">
            {appLang === 'ar' ? 'المكتبة الشاملة لكتب ومراجع قواعد اللغة الرومانية والأمثلة المقتبسة 📚' : appLang === 'ro' ? 'Biblioteca Master de Manuale Oficiale & Ghiduri Extrase 📚' : 'Master Romanian Grammar Books & Extracted Examples Library 📚'}
          </h1>
          <p className="text-xs sm:text-sm text-theme-sub max-w-xl mx-auto leading-relaxed font-bold">
            {appLang === 'ar' ? 'تصفح وحمّل المراجع الرسمية المعتمدة الكاملة، واستكشف شروح الأبواب وقواعد التصريف والأمثلة التطبيقية المقتبسة بواسطة pdf2json مع الصوت والترجمة.' : 'Download or read official reference textbooks (Routledge & Teach Yourself) and explore detailed chapter guides & extracted examples with audio.'}
          </p>
        </div>

        {/* OFFICIAL DOWNLOADABLE PDF TEXTBOOKS SECTION */}
        <div className={`p-6 rounded-3xl border shadow-xl space-y-4 ${
          isDark ? 'bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 border-amber-500/40 text-white' : 'bg-gradient-to-br from-amber-500/10 via-white to-rose-50 border-amber-300 text-slate-900'
        }`}>
          <div className="flex items-center justify-between border-b border-amber-500/30 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <BookOpen className="w-6 h-6" />
              </span>
              <div>
                <h2 className="text-base sm:text-lg font-black">
                  {appLang === 'ar' ? '📚 الكتب والمراجع الرسمية القابلة للتحميل والقراءة المباشرة (PDF)' : appLang === 'ro' ? '📚 Manuale Oficiale de Gramatică Descărcabile (PDF)' : '📚 Official Downloadable Romanian Grammar PDFs'}
                </h2>
                <p className="text-xs text-theme-sub font-bold">
                  {appLang === 'ar' ? 'تصفح وحمّل الكتب المعتمدة الكاملة المقتبس منها أمثلة وشروح هذا الدليل:' : 'Download or view the official reference textbooks used across our grammar sections:'}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Book 1: Routledge Essential Grammar */}
            <div className={`p-4 sm:p-5 rounded-2xl border space-y-3 flex flex-col justify-between ${
              isDark ? 'bg-slate-900/90 border-slate-700/80' : 'bg-white border-slate-200 shadow-md'
            }`}>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    Routledge Essential (232 P.)
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">1.0 MB</span>
                </div>
                <h3 className="text-sm sm:text-base font-black text-amber-400">Romanian: An Essential Grammar</h3>
                <p className="text-xs text-theme-sub leading-relaxed font-bold">
                  {appLang === 'ar' ? 'تأليف Ramona Gönczöl-Davies (جامعة لندن). دليل كلاسيكي يشرح الأبجدية، الأجناس، أدوات التعريف، الـ 11 تصريف للأفعال، وإعراب الحالات.' : 'By Ramona Gönczöl-Davies (University of London). Comprehensive reference covering alphabet, genders, articles, 11 verb conjugations, and cases.'}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-700/50">
                <a
                  href="/downloads/Romanian_An_Essential_Grammar.pdf"
                  download="Romanian_An_Essential_Grammar.pdf"
                  className="flex-1 py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{appLang === 'ar' ? 'تحميل الكتاب PDF 📥' : 'Download PDF 📥'}</span>
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedPdf({ title: 'Romanian: An Essential Grammar (Ramona Gönczöl-Davies)', url: '/downloads/Romanian_An_Essential_Grammar.pdf' })}
                  className="py-2.5 px-3 bg-slate-700/60 hover:bg-slate-700 text-slate-200 font-black rounded-xl text-xs flex items-center gap-1 transition-all"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{appLang === 'ar' ? 'قراءة 👁️' : 'Read 👁️'}</span>
                </button>
              </div>
            </div>

            {/* Book 2: Teach Yourself Romanian */}
            <div className={`p-4 sm:p-5 rounded-2xl border space-y-3 flex flex-col justify-between ${
              isDark ? 'bg-slate-900/90 border-slate-700/80' : 'bg-white border-slate-200 shadow-md'
            }`}>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    Teach Yourself (436 P.)
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">17 MB</span>
                </div>
                <h3 className="text-sm sm:text-base font-black text-rose-400">Teach Yourself Romanian</h3>
                <p className="text-xs text-theme-sub leading-relaxed font-bold">
                  {appLang === 'ar' ? 'تأليف G. Murrell & V. Ștefănescu-Drăgănești. مرجع متكامل يحتوي على 30 وحدة تعليمية مكثفة للمحادثة والقواعد وتطبيقات المفردات.' : 'By Murrell & Ștefănescu-Drăgănești. Complete 30-unit textbook with dialogues, grammar exercises, and key rules.'}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-700/50">
                <a
                  href="/downloads/Romanian_Teach_Yourself.pdf"
                  download="Romanian_Teach_Yourself.pdf"
                  className="flex-1 py-2.5 px-3 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{appLang === 'ar' ? 'تحميل الكتاب PDF 📥' : 'Download PDF 📥'}</span>
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedPdf({ title: 'Teach Yourself Romanian (Murrell & Ștefănescu-Drăgănești)', url: '/downloads/Romanian_Teach_Yourself.pdf' })}
                  className="py-2.5 px-3 bg-slate-700/60 hover:bg-slate-700 text-slate-200 font-black rounded-xl text-xs flex items-center gap-1 transition-all"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{appLang === 'ar' ? 'قراءة 👁️' : 'Read 👁️'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CHAPTER-BY-CHAPTER MASTER REFERENCE GUIDES */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-700/50 pb-2">
            <Bookmark className="w-5 h-5 text-amber-400" />
            <h2 className="text-base sm:text-lg font-black text-amber-400">
              {appLang === 'ar' ? '📖 ملخصات وأبواب الكتاب المعتمد (Chapter Summaries & Paradigms)' : '📖 Chapter Reference Summaries & Paradigms'}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {chapterGuides.map((guide, idx) => (
              <div 
                key={idx}
                className={`p-5 rounded-3xl border space-y-3 shadow-lg ${
                  isDark ? 'bg-slate-800/90 border-slate-700/80 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-md'
                }`}
              >
                <div className="space-y-1 border-b border-slate-700/40 pb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase">
                    Capitolul {idx + 1}
                  </span>
                  <h3 className="text-sm sm:text-base font-black text-rose-400">{guide.title_ro}</h3>
                  <p className="text-xs font-bold text-amber-300">{guide.title_ar}</p>
                </div>

                <p className="text-xs leading-relaxed text-slate-300 font-bold bg-slate-900/60 p-3 rounded-2xl border border-slate-700/60">
                  {guide.summary_ar}
                </p>

                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-black text-emerald-400 block">أمثلة تطبيقية من هذا الباب:</span>
                  <div className="space-y-1.5">
                    {guide.examples.map((exItem, exIdx) => (
                      <div key={exIdx} className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold space-y-0.5">
                        <p className="text-emerald-300 font-latin">🇹🇩 {exItem.ro}</p>
                        <p className="text-slate-300">🇬🇧 {exItem.en}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* EXTENSIVE TEXTBOOK EXAMPLES ENGINE (pdf2json Extracted) */}
        <div className={`p-6 rounded-3xl border shadow-xl space-y-4 ${
          isDark ? 'bg-slate-800/90 border-slate-700/80 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-md'
        }`}>
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700/50 pb-3">
            <div className="flex items-center gap-2">
              <span className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Library className="w-6 h-6" />
              </span>
              <div>
                <h2 className="text-base sm:text-lg font-black text-emerald-400">
                  {appLang === 'ar' ? `📖 مكتبة الأمثلة النحوية والتطبيقية المقتبسة (${filteredExamples.length} مثالاً مقتبساً)` : `📖 Extracted Textbook Grammar Examples Library (${filteredExamples.length} items)`}
                </h2>
                <p className="text-xs text-slate-400 font-bold">
                  {appLang === 'ar' ? 'أمثلة وجمل عملية مصنفة حسب الأبواب ومستخرجة بواسطة pdf2json مع الصوت والترجمة:' : 'Categorized grammar examples extracted via pdf2json with audio & translations:'}
                </p>
              </div>
            </div>
          </div>

          {/* Search Input for Textbook Examples */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={appLang === 'ar' ? 'ابحث في مكتبة الأمثلة (مثال: pașaport, Constituția, de făcut...)' : 'Search textbook examples...'}
              className={`w-full border rounded-2xl px-4 py-3 text-xs sm:text-sm pl-10 focus:outline-none focus:border-amber-500 font-bold ${
                isDark ? 'bg-slate-900 border-slate-700/80 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
              }`}
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          </div>

          {/* Category Selector Tabs */}
          <div className="flex flex-wrap gap-2 pb-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-2 rounded-xl text-xs font-black border transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500 text-slate-900 border-amber-400 shadow-md scale-105'
                    : isDark ? 'bg-slate-900/70 text-slate-300 border-slate-700/80 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
              >
                <span>{appLang === 'ar' ? cat.label_ar : cat.label_en}</span>
              </button>
            ))}
          </div>

          {/* Examples Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-1">
            {filteredExamples.length === 0 ? (
              <div className="col-span-2 p-8 text-center text-slate-400 font-bold space-y-2">
                <BookOpen className="w-8 h-8 mx-auto text-slate-500 opacity-60" />
                <p className="text-xs">لم نجد أمثلة تطابق البحث الحالي.</p>
              </div>
            ) : (
              filteredExamples.map((ex, idx) => (
                <div 
                  key={ex.id || idx}
                  className={`p-4 rounded-2xl border space-y-2.5 flex flex-col justify-between transition-all ${
                    isDark ? 'bg-slate-900/80 border-slate-700/80 hover:border-amber-500/40' : 'bg-slate-50 border-slate-200 shadow-sm hover:border-amber-400'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-1">
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
                        {ex.category}
                      </span>
                      <AudioPlayerButton text={ex.ro} lang="ro" label="استمع" />
                    </div>
                    <p className="text-xs sm:text-sm font-black text-emerald-300 font-latin leading-snug">
                      🇹🇩 {ex.ro}
                    </p>
                    <p className="text-xs font-bold text-slate-300 leading-snug">
                      🇬🇧 {ex.en}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-700/50 text-[10px] font-bold text-amber-400 flex items-center justify-between">
                    <span>📖 {ex.source}</span>
                    <span className="text-slate-500">pdf2json</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </main>

      {/* PDF PREVIEW MODAL */}
      {selectedPdf && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm p-4 flex items-center justify-center animate-fade-in">
          <div className={`w-full max-w-4xl h-[90vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden ${
            isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="p-4 border-b border-slate-700 flex items-center justify-between bg-slate-800/90">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-400" />
                <h3 className="text-xs sm:text-sm font-black">{selectedPdf.title}</h3>
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

export default function GrammarBooksPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400 font-bold">Loading Master Grammar Books Library...</div>}>
      <GrammarBooksContent />
    </Suspense>
  );
}
