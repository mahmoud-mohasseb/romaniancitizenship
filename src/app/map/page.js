'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  MapPin, 
  Search, 
  Filter, 
  Building2, 
  ShieldCheck, 
  FileText, 
  BookOpen, 
  ChevronRight, 
  ChevronLeft, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Phone, 
  Mail, 
  Globe, 
  UserCheck, 
  Award, 
  HelpCircle, 
  Layers, 
  X,
  Sparkles,
  Info
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import RomanianMap from '../../components/RomanianMap';
import mapLocationsData from '../../data/romanian_map_locations.json';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

export default function RomanianCitizenshipMapPage() {
  const { theme } = useTheme();
  const { appLang, strings, isRtl } = useLanguage();
  const isDark = theme === 'dark';

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [detailsModalLocation, setDetailsModalLocation] = useState(null);
  const [sidePanelOpen, setSidePanelOpen] = useState(true);
  const [activeTimelineStage, setActiveTimelineStage] = useState(1);

  // Filter locations by category & search query
  const filteredLocations = mapLocationsData.filter((loc) => {
    const matchesCategory = activeCategory === 'all' || loc.category === activeCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || 
      loc.name_ro.toLowerCase().includes(query) ||
      loc.name_en.toLowerCase().includes(query) ||
      loc.name_ar.includes(query) ||
      loc.county_ro.toLowerCase().includes(query) ||
      loc.description_ro.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  // Handle location click from list or search
  const handleSelectLocation = (loc) => {
    setSelectedLocation(loc);
  };

  // Scroll smooth to Map section
  const scrollToMap = () => {
    const mapEl = document.getElementById('interactive-map-section');
    if (mapEl) {
      mapEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Scroll smooth to Requirements section
  const scrollToRequirements = () => {
    const reqEl = document.getElementById('citizenship-requirements-section');
    if (reqEl) {
      reqEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen pb-28 sm:pb-24 bg-theme-main text-theme-main flex flex-col font-latin">
      <Navbar />

      <main className={`flex-1 w-full max-w-7xl mx-auto px-4 py-6 space-y-10 animate-fade-in-up ${
        isRtl ? 'lg:mr-72' : 'lg:ml-72'
      } ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>

        {/* 1. HERO SECTION WITH ROMANIAN TRICOLOR IMPULSE AURA */}
        <section className={`relative rounded-3xl border overflow-hidden p-6 sm:p-10 shadow-2xl ${
          isDark ? 'bg-slate-800/90 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          {/* Background Imagery & Ambient Glow */}
          <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
            <Image 
              src="https://images.unsplash.com/photo-1584646098378-0874589d76b1?q=80&w=1600&auto=format&fit=crop"
              alt="Romanian Scenery Background"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent" />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 space-y-4 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1 rounded-full text-xs font-black bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1.5 shadow-md">
                <MapPin className="w-4 h-4 text-rose-400" />
                <span>{appLang === 'ar' ? 'خريطة الجنسية الرومانية التفاعلية 🇷🇴' : 'Romanian Citizenship Interactive Map 🇷🇴'}</span>
              </span>
              <span className="text-xs font-extrabold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
                Legea 21/1991 Official Data
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              {appLang === 'ar' ? 'استكشف معلومات ومقرات الجنسية الرومانية عبر الخريطة 🗺️' : 'Discover Romanian Citizenship Information & Procedures 🗺️'}
            </h1>
            <p className="text-xs sm:text-base text-theme-sub font-semibold leading-relaxed">
              {appLang === 'ar' 
                ? 'دليل تفاعلي مصور لمقرات الهيئة الوطنية للجنسية (ANC)، مكاتب الجوازات، السجل المدني، وشروط القانون رقم 21/1991 في جميع أنحاء رومانيا.'
                : 'Explore citizenship procedures, dossier submission hubs, passport offices, and official administrative institutions across Romania.'}
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={scrollToMap}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-black text-xs sm:text-sm shadow-xl transition-all flex items-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                <span>{appLang === 'ar' ? 'تصفح الخريطة التفاعلية 📍' : 'Explore the Map 📍'}</span>
              </button>

              <button
                onClick={scrollToRequirements}
                className="px-5 py-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-black text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
              >
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>{appLang === 'ar' ? 'شروط وقوانين الجنسية 📜' : 'Citizenship Requirements 📜'}</span>
              </button>
            </div>
          </div>
        </section>

        {/* 2. SEARCH & CATEGORY FILTER CONTROL BAR */}
        <section id="interactive-map-section" className="space-y-4">
          <div className={`p-4 sm:p-5 rounded-3xl border shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 ${
            isDark ? 'bg-slate-800/90 border-slate-700' : 'bg-white border-slate-200'
          }`}>
            
            {/* Search Input Box */}
            <div className={`relative flex items-center w-full md:w-96 px-3.5 py-2.5 rounded-2xl border ${
              isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-100 border-slate-200'
            }`}>
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={appLang === 'ar' ? 'ابحث عن مدينة، مقاطعة، أو مكتب ANC (مثال: Cluj, București, Art 11)...' : 'Search Romanian city, county, or ANC office...'}
                className="flex-1 px-3 bg-transparent outline-none text-xs sm:text-sm font-semibold placeholder:text-slate-500"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="p-1 text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Filter Horizontal Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 w-full md:w-auto no-scrollbar mobile-touch-scroll">
              {[
                { id: 'all', label_ar: 'الكل (11)', label_en: 'All (11)' },
                { id: 'citizenship', label_ar: '🏛️ مقرات ANC للجنسية', label_en: '🏛️ ANC Citizenship' },
                { id: 'passport', label_ar: '🛂 الجوازات والسكان', label_en: '🛂 Passports & Records' },
                { id: 'civil_status', label_ar: '📄 الأحوال المدنية', label_en: '📄 Civil Status' },
                { id: 'immigration', label_ar: '🛃 الهجرة والإقامة', label_en: '🛃 Immigration (IGI)' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black whitespace-nowrap shrink-0 transition-all border ${
                    activeCategory === cat.id
                      ? 'bg-rose-600 text-white border-rose-600 shadow-md'
                      : isDark ? 'bg-slate-900 text-slate-300 border-slate-700' : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  {appLang === 'ar' ? cat.label_ar : cat.label_en}
                </button>
              ))}
            </div>

          </div>

          {/* 3. MAIN INTERACTIVE MAP & SIDE INFORMATION PANEL */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* Interactive Leaflet Map Component (2 Columns on Large Screens) */}
            <div className="lg:col-span-2 space-y-3">
              <RomanianMap 
                locations={filteredLocations}
                selectedLocationId={selectedLocation?.id}
                onSelectLocation={handleSelectLocation}
                onOpenDetailsModal={setDetailsModalLocation}
                appLang={appLang}
                activeCategory={activeCategory}
              />

              <div className="flex items-center justify-between text-xs font-bold text-theme-sub px-2">
                <span>{appLang === 'ar' ? `تم العثور على ${filteredLocations.length} موقع إداري رسمي` : `Found ${filteredLocations.length} official administrative hubs`}</span>
                <span className="text-amber-400">انقر على العلامة لمعاينة الموقع 📍</span>
              </div>
            </div>

            {/* Collapsible Side Information Panel */}
            <div className={`p-5 rounded-3xl border shadow-xl space-y-4 ${
              isDark ? 'bg-slate-800/90 border-slate-700' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                <h3 className="text-base font-black flex items-center gap-2 text-theme-main">
                  <Building2 className="w-5 h-5 text-rose-500" />
                  <span>{appLang === 'ar' ? 'المقرات والمعلومات الرئيسية' : 'Key Administrative Cards'}</span>
                </h3>

                <button 
                  onClick={() => setSidePanelOpen(!sidePanelOpen)} 
                  className="text-xs text-rose-400 font-bold hover:underline lg:hidden"
                >
                  {sidePanelOpen ? 'إخفاء' : 'إظهار'}
                </button>
              </div>

              {sidePanelOpen && (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 no-scrollbar">
                  {[
                    {
                      id: 'art11',
                      title_ro: 'Redobândirea Cetățeniei (Art. 11)',
                      title_en: 'Reacquisition of Citizenship (Art. 11)',
                      title_ar: 'استعادة الجنسية الرومانية (المادة 11)',
                      icon: ShieldCheck,
                      color: 'text-amber-400',
                      desc_ar: 'المناسبة للمتحدرين من أصول رومانية حتى الدرجة الثالثة (الوالدين، الأجداد). تتطلب تقديم الملف في مقر ANC الرئيسي أو المكتب الإقليمي.'
                    },
                    {
                      id: 'art8',
                      title_ro: 'Cetățenia prin Naturalizare (Art. 8)',
                      title_en: 'Citizenship by Naturalization (Art. 8)',
                      title_ar: 'الجنسية عن طريق التجنيس والإقامة (المادة 8)',
                      icon: UserCheck,
                      color: 'text-blue-400',
                      desc_ar: 'تتطلب الإقامة القانونية في رومانيا لمدة 8 سنوات (أو 5 سنوات في حال الزواج من مواطن روماني)، واجتياز امتحان اللغة والدستور.'
                    },
                    {
                      id: 'dossier_prep',
                      title_ro: 'Depunerea și Verificarea Dosarului ANC',
                      title_en: 'ANC Dossier Filing & Verification',
                      title_ar: 'تقديم وتوثيق الملف في الهيئة الوطنية ANC',
                      icon: FileText,
                      color: 'text-emerald-400',
                      desc_ar: 'يتم حجز موعد مسبق إلكترونياً على موقع e-cetatenie، وتقديم الأوراق الأصلية المترجمة والمصدقة.'
                    },
                    {
                      id: 'oath_cert',
                      title_ro: 'Ședința de Jurământ și Certificatul',
                      title_en: 'Oath Ceremony & Citizenship Certificate',
                      title_ar: 'أداء قسم الولاء واستلام شهادة الجنسية',
                      icon: Award,
                      color: 'text-rose-400',
                      desc_ar: 'بعد صدور القرار الوزاري (Ordin)، يتم أداء قسم الولاء في بوخارست أو القنصليات المعتمدة خلال 6 أشهر.'
                    }
                  ].map((card) => {
                    const CardIcon = card.icon;
                    return (
                      <div 
                        key={card.id} 
                        className={`p-4 rounded-2xl border space-y-2 transition-all hover:scale-[1.01] ${
                          isDark ? 'bg-slate-900/60 border-slate-700/80 hover:bg-slate-900' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <CardIcon className={`w-4 h-4 ${card.color} shrink-0`} />
                          <h4 className="text-xs font-black text-theme-main">{appLang === 'ar' ? card.title_ar : card.title_ro}</h4>
                        </div>
                        <p className="text-[11px] text-theme-sub font-semibold leading-relaxed">{card.desc_ar}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        </section>

        {/* 4. CITIZENSHIP INFORMATION SECTION (LAW 21/1991 LEGAL OVERVIEW) */}
        <section id="citizenship-requirements-section" className="space-y-6 pt-4">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="px-3.5 py-1 rounded-full text-xs font-black bg-rose-500/20 text-rose-400 border border-rose-500/30">
              ⚖️ Legea Cetățeniei Române nr. 21/1991
            </span>
            <h2 className="text-2xl sm:text-3xl font-black">
              {appLang === 'ar' ? 'طرق الحصول على الجنسية الرومانية والشروط الرسمية' : 'Romanian Citizenship Pathways & Legal Requirements'}
            </h2>
            <p className="text-xs sm:text-sm text-theme-sub font-semibold">
              {appLang === 'ar' ? 'ملخص ميسر للمواد القانونية النافذة في قانون الجنسية الرومانية مع توثيق المصادر الرسمية.' : 'Official legal pathways under Law 21/1991 as listed in the Romanian National Administrative Catalogue.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                title_ar: '1. الجنسية بالولادة (Prin Naștere)',
                title_ro: 'Cetățenia prin Naștere (Art. 5)',
                desc_ar: 'يعد مواطناً روماناً بالولادة كل طفل يولد لأب أو أم تحوز الجنسية الرومانية، سواء داخل رومانيا أو خارجها.',
                badge: 'Art. 5 Law 21/1991'
              },
              {
                title_ar: '2. استعادة الجنسية بالأصول (Art. 11)',
                title_ro: 'Redobândirea Cetățeniei (Art. 11)',
                desc_ar: 'تمنح للمواطنين السابقين أو أحفادهم حتى الدرجة 3 الذين فقدوا الجنسية لأسباب غير منسوبة إليهم دون الحاجة للإقامة برومانيا.',
                badge: 'Art. 11 Law 21/1991'
              },
              {
                title_ar: '3. التجنيس بالإقامة (Art. 8)',
                title_ro: 'Acordarea la Cerere (Art. 8)',
                desc_ar: 'تمنح لمن أقام قانونياً برومانيا لمدة 8 سنوات (أو 5 سنوات للزوج/الزوجة لمواطن روماني)، مع إثبات وسائل العيش واللغة.',
                badge: 'Art. 8 Law 21/1991'
              },
              {
                title_ar: '4. الأوراق والمستندات المطلوبة',
                title_ro: 'Documente Necesare la Dosar',
                desc_ar: 'شهادات الميلاد والزواج المترجمة والمصدقة، السجل العدلي (الفيش)، جواز السفر النافذ، والبيانات الشخصية المؤكدة.',
                badge: 'Dosar Completo ANC'
              },
              {
                title_ar: '5. إجراءات التقديم واللجنة',
                title_ro: 'Procedura ANC & Comisia',
                desc_ar: 'تقديم الطلب في مقرات ANC، فحص الملف من لجنة الجنسية، صدور القرار الوزاري (Ordin)، وأداء قسم الولاء.',
                badge: 'Ordin Președinte ANC'
              },
              {
                title_ar: '6. المؤسسات والجهات الرسمية',
                title_ro: 'Instituții Oficiale Implicate',
                desc_ar: 'الهيئة الوطنية للجنسية (ANC)، وزارة العدل، السفارات والقنصليات الرومانية في الخارج، ومديريات الأحوال المدنية والجوازات.',
                badge: 'Ministerul Justiției'
              }
            ].map((item, idx) => (
              <div 
                key={idx} 
                className={`p-6 rounded-3xl border shadow-xl space-y-3 relative overflow-hidden transition-all hover:-translate-y-1 ${
                  isDark ? 'bg-slate-800/90 border-slate-700' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between border-b border-slate-700/60 pb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    {item.badge}
                  </span>
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                </div>
                <h3 className="text-sm font-black text-theme-main">{appLang === 'ar' ? item.title_ar : item.title_ro}</h3>
                <p className="text-xs text-theme-sub font-semibold leading-relaxed">{item.desc_ar}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. INTERACTIVE CITIZENSHIP JOURNEY (6-STAGE ANIMATED TIMELINE) */}
        <section className={`p-6 sm:p-10 rounded-3xl border shadow-2xl space-y-6 ${
          isDark ? 'bg-slate-800/90 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="px-3.5 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-400 border border-amber-500/30">
              🛣️ Roadmap Cetățenie
            </span>
            <h2 className="text-2xl font-black">
              {appLang === 'ar' ? 'خريطة خطوات التقديم للحصول على الجنسية' : 'Interactive Citizenship Journey Timeline'}
            </h2>
            <p className="text-xs text-theme-sub font-semibold">
              المسار الزمني المعتمد المكون من 6 مراحل متتالية من تقديم الملف إلى أداء القسم واستلام شهادة الجنسية.
            </p>
          </div>

          {/* Timeline Stage Switcher */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { stage: 1, title_ar: '1. التحقق من الشروط', title_ro: '1. Eligibilitate' },
              { stage: 2, title_ar: '2. تجهيز وتصديق الملف', title_ro: '2. Acte & Traduceri' },
              { stage: 3, title_ar: '3. حجز وتقديم ANC', title_ro: '3. Depunere Dosar' },
              { stage: 4, title_ar: '4. دراسة الملف واللجنة', title_ro: '4. Comisia ANC' },
              { stage: 5, title_ar: '5. القرار الوزاري (Ordin)', title_ro: '5. Emitere Ordin' },
              { stage: 6, title_ar: '6. القسم والشهادة', title_ro: '6. Jurământ & Pașaport' },
            ].map((step) => (
              <button
                key={step.stage}
                onClick={() => setActiveTimelineStage(step.stage)}
                className={`p-3 rounded-2xl text-xs font-black transition-all border flex flex-col items-center justify-center gap-1.5 ${
                  activeTimelineStage === step.stage
                    ? 'bg-rose-600 text-white border-rose-600 shadow-xl scale-105'
                    : isDark ? 'bg-slate-900/80 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                <span className="w-6 h-6 rounded-full bg-black/20 flex items-center justify-center text-[11px] font-black">
                  {step.stage}
                </span>
                <span className="text-center">{appLang === 'ar' ? step.title_ar : step.title_ro}</span>
              </button>
            ))}
          </div>

          {/* Timeline Detailed Stage Box */}
          <div className={`p-6 rounded-3xl border space-y-3 ${
            isDark ? 'bg-slate-900/90 border-slate-700' : 'bg-slate-50 border-slate-200'
          }`}>
            {activeTimelineStage === 1 && (
              <div className="space-y-2">
                <span className="text-xs font-black text-rose-400 block">المرحلة الأولى: التحقق من استيفاء الشروط القانونية</span>
                <h4 className="text-base font-black">فحص المادة القانونية المناسبة (المادة 8 أو 11 من القانون 21/1991)</h4>
                <p className="text-xs text-theme-sub font-semibold leading-relaxed">
                  تحديد نوع الطلب؛ سواء استعادة جنسية عبر الأجداد (Art. 11) أو التجنيس عبر الإقامة الدائمة والزواج (Art. 8).
                </p>
              </div>
            )}
            {activeTimelineStage === 2 && (
              <div className="space-y-2">
                <span className="text-xs font-black text-amber-400 block">المرحلة الثانية: تجهيز وتصديق ملف المستندات الرسمية</span>
                <h4 className="text-base font-black">ترجمة المستندات ولصق الأبوستيل (Apostille)</h4>
                <p className="text-xs text-theme-sub font-semibold leading-relaxed">
                  ترجمة شهادات الميلاد والزواج والفيش العدلي إلى اللغة الرومانية لدى مترجم محلف ومصادقتها أصولاً.
                </p>
              </div>
            )}
            {activeTimelineStage === 3 && (
              <div className="space-y-2">
                <span className="text-xs font-black text-emerald-400 block">المرحلة الثالثة: حجز الموعد الإلكتروني وتقديم الملف في ANC</span>
                <h4 className="text-base font-black">الحصول على رقم الملف الرسمي (Număr DOSAR)</h4>
                <p className="text-xs text-theme-sub font-semibold leading-relaxed">
                  الحضور شخصياً إلى مقر ANC ببوخارست أو المكاتب الإقليمية، وتسليم الأوراق الأصلية للحصول على إيصال التقديم ورقم Dosar.
                </p>
              </div>
            )}
            {activeTimelineStage === 4 && (
              <div className="space-y-2">
                <span className="text-xs font-black text-blue-400 block">المرحلة الرابعة: دراسة الملف والتحقق من لجنة الجنسية</span>
                <h4 className="text-base font-black">متابعة نشر مواعيد اللجنة عبر موقع ANC الإلكتروني</h4>
                <p className="text-xs text-theme-sub font-semibold leading-relaxed">
                  تقوم لجنة الجنسية (Comisia pentru Cetățenie) بفحص صحة المستندات ومخاطبة السلطات المختصة لإصدار التقارير.
                </p>
              </div>
            )}
            {activeTimelineStage === 5 && (
              <div className="space-y-2">
                <span className="text-xs font-black text-rose-400 block">المرحلة الخامسة: صدور القرار الرئاسي للهيئة (Ordin ANC)</span>
                <h4 className="text-base font-black">نشر اسم المتقدم في القوائم الرسمية (Lista Ordine)</h4>
                <p className="text-xs text-theme-sub font-semibold leading-relaxed">
                  يصدر رئيس الهيئة الوطنية للجنسية قراراً رسمياً بالموافقة، ويتم إبلاغ الشخص عبر الرسائل الرسمية أو القنصلية.
                </p>
              </div>
            )}
            {activeTimelineStage === 6 && (
              <div className="space-y-2">
                <span className="text-xs font-black text-amber-400 block">المرحلة السادسة: أداء قسم الولاء واستلام شهادة الجنسية والجواز</span>
                <h4 className="text-base font-black">أداء قسم الولاء باللغة الرومانية خلال 6 أشهر</h4>
                <p className="text-xs text-theme-sub font-semibold leading-relaxed">
                  حضور مراسم أداء القسم ببوخارست أو السفارة الرومانية، واستلام شهادة الجنسية الرسمية ثم التقديم على جواز السفر والبطاقة.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* 6. LOCATION EXPLORER GRID (11 CITIES & ADMINISTRATIVE HUBS) */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-black">
                {appLang === 'ar' ? 'دليل المراكز الإدارية الرسمية في رومانيا 📍' : 'Find Citizenship & Administrative Locations 📍'}
              </h2>
              <p className="text-xs text-theme-sub font-semibold">
                انقر على أي مدينة للانتقال المباشر على الخريطة ومعاينة المستندات والعناوين الرسمية.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {mapLocationsData.map((loc) => {
              const isSelected = selectedLocation?.id === loc.id;
              return (
                <div 
                  key={loc.id} 
                  className={`p-5 rounded-3xl border shadow-xl space-y-3 transition-all hover:scale-[1.02] cursor-pointer ${
                    isSelected 
                      ? 'bg-rose-950/40 border-rose-500 shadow-rose-950/40' 
                      : isDark ? 'bg-slate-800/90 border-slate-700' : 'bg-white border-slate-200'
                  }`}
                  onClick={() => {
                    handleSelectLocation(loc);
                    scrollToMap();
                  }}
                >
                  <div className="relative h-32 rounded-2xl overflow-hidden shadow-md">
                    <Image 
                      src={loc.image_url}
                      alt={loc.name_ro}
                      fill
                      className="object-cover"
                    />
                    <span className="absolute top-2 right-2 px-3 py-0.5 rounded-full text-[10px] font-black bg-rose-600 text-white shadow-md">
                      {appLang === 'ar' ? loc.category_label_ar : loc.category_label_en}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm font-black text-theme-main">{appLang === 'ar' ? loc.name_ar : loc.name_ro}</h3>
                    <p className="text-[11px] font-extrabold text-rose-400">{appLang === 'ar' ? loc.county_ar : loc.county_ro}</p>
                    <p className="text-xs text-theme-sub font-semibold line-clamp-2 leading-relaxed">{appLang === 'ar' ? loc.description_ar : loc.description_ro}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-700/50 flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-blue-400" />
                      <span>{loc.phone}</span>
                    </span>

                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setDetailsModalLocation(loc);
                      }}
                      className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-white text-[11px] font-black hover:bg-rose-600 hover:border-rose-600 transition-all"
                    >
                      التفاصيل 🏛️
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 7. OFFICIAL DISCLAIMER & TRUST FOOTER */}
        <section className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-xs font-semibold space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-black">
            <Info className="w-5 h-5 shrink-0" />
            <span>إخلاء مسؤولية وتوثيق المصادر الرسمية (Legal Disclaimer):</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            هذا الدليل والموقع الإلكتروني يقدم معلومات إسترشادية عامة ولا يحل محل الاستشارة القانونية الرسمية. معلومات وقوانين الجنسية الرومانية، الرسوم، والمستندات المطلوبة قد تتغير بقرارات وزارية. يُنصح دائماً بالتحقق المباشر من الموقع الرسمي للهيئة الوطنية للجنسية (ANC) وموقع وزارة العدل الرومانية.
          </p>

          <div className="pt-2 border-t border-amber-500/20 flex flex-wrap items-center gap-4 text-xs font-bold text-amber-300">
            <span className="font-black text-white">المصادر الحكومية الرسمية:</span>
            <a href="https://cetatenie.just.ro" target="_blank" rel="noopener noreferrer" className="hover:underline text-rose-400 flex items-center gap-1">
              <span>Autoritatea Națională pentru Cetățenie (ANC)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a href="https://just.ro" target="_blank" rel="noopener noreferrer" className="hover:underline text-rose-400 flex items-center gap-1">
              <span>Ministerul Justiției din România</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a href="https://econsulat.ro" target="_blank" rel="noopener noreferrer" className="hover:underline text-rose-400 flex items-center gap-1">
              <span>Portalul Consular Oficial (eConsulat)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </section>

      </main>

      {/* 8. LOCATION DETAILS DEEP-DIVE POPUP MODAL */}
      {detailsModalLocation && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className={`w-full max-w-xl p-6 rounded-3xl border shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto ${
            isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-600 text-white">
                {appLang === 'ar' ? detailsModalLocation.category_label_ar : detailsModalLocation.category_label_en}
              </span>
              <button 
                onClick={() => setDetailsModalLocation(null)}
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image */}
            <div className="relative h-44 rounded-2xl overflow-hidden shadow-md">
              <Image 
                src={detailsModalLocation.image_url}
                alt={detailsModalLocation.name_ro}
                fill
                className="object-cover"
              />
            </div>

            {/* Modal Titles & Desc */}
            <div className="space-y-1">
              <h3 className="text-lg font-black">{appLang === 'ar' ? detailsModalLocation.name_ar : detailsModalLocation.name_ro}</h3>
              <p className="text-xs font-black text-rose-400">{appLang === 'ar' ? detailsModalLocation.county_ar : detailsModalLocation.county_ro}</p>
              <p className="text-xs text-theme-sub font-semibold leading-relaxed pt-1">{appLang === 'ar' ? detailsModalLocation.description_ar : detailsModalLocation.description_ro}</p>
            </div>

            {/* Modal Services Provided */}
            <div className="space-y-2 pt-2 border-t border-slate-700/60">
              <span className="text-xs font-black text-emerald-400 block">الخدمات والإجراءات المتاحة بالمقر:</span>
              <ul className="space-y-1 text-xs font-bold text-slate-300">
                {(appLang === 'ar' ? detailsModalLocation.services_ar : detailsModalLocation.services_en).map((srv, sIdx) => (
                  <li key={sIdx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{srv}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Modal Contact Info */}
            <div className="pt-2 border-t border-slate-700/60 space-y-1.5 text-xs font-bold text-slate-300">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                <span>العنوان: {appLang === 'ar' ? detailsModalLocation.address_ar : detailsModalLocation.address_ro}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span>الهاتف: {detailsModalLocation.phone}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>البريد: {detailsModalLocation.email}</span>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>ساعات العمل: {detailsModalLocation.opening_hours}</span>
              </p>
            </div>

            {/* Modal Action Links */}
            <div className="pt-3 flex gap-3">
              <a 
                href={detailsModalLocation.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs text-center flex items-center justify-center gap-2 shadow-md"
              >
                <span>الموقع الرسمي للمقر</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => setDetailsModalLocation(null)}
                className="py-2.5 px-4 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
