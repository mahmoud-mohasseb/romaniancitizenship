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
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Phone, 
  Mail, 
  Globe, 
  UserCheck, 
  Award, 
  X,
  Sparkles,
  Info,
  ChevronUp,
  Layers,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import RomanianMap from '../../components/RomanianMap';
import mapLocationsData from '../../data/romanian_map_locations.json';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

export default function RomanianCitizenshipMapPage() {
  const { theme } = useTheme();
  const { appLang, setAppLang, strings, isRtl } = useLanguage();
  const isDark = theme === 'dark';

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [detailsModalLocation, setDetailsModalLocation] = useState(null);
  const [activeInfoModal, setActiveInfoModal] = useState(null); // 'citizenship' | 'requirements' | 'descent' | 'restoration' | 'institutions' | 'locations'
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

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

  // Handle selecting a location from search dropdown or list
  const handleSelectLocation = (loc) => {
    setSelectedLocation(loc);
    setShowSearchDropdown(false);
  };

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-slate-950 text-slate-100 font-latin select-none">
      
      {/* 1. 100% EDGE-TO-EDGE FULL-SCREEN INTERACTIVE LEAFLET MAP */}
      <div className="fixed inset-0 w-full h-full z-0">
        <RomanianMap 
          locations={filteredLocations}
          selectedLocationId={selectedLocation?.id}
          onSelectLocation={handleSelectLocation}
          onOpenDetailsModal={setDetailsModalLocation}
          appLang={appLang}
          activeCategory={activeCategory}
        />
      </div>

      {/* 2. TOP FLOATING NAVIGATION & SEARCH BAR */}
      <header className="fixed top-0 inset-x-0 z-30 px-3 sm:px-6 py-3 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/80 shadow-2xl flex items-center justify-between gap-3">
        
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-2 shrink-0 group">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-600 via-amber-400 to-blue-600 flex items-center justify-center shadow-lg border border-amber-400/40 group-hover:scale-105 transition-transform">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div className="hidden sm:block text-right">
            <h1 className="text-sm font-black text-white tracking-tight flex items-center gap-1.5">
              <span>{appLang === 'ar' ? 'خريطة الجنسية الرومانية 🗺️' : 'Romanian Citizenship Map 🗺️'}</span>
            </h1>
            <p className="text-[10px] text-amber-400 font-bold">Legea 21/1991 Interactive Map</p>
          </div>
        </Link>

        {/* Floating Integrated Search Input */}
        <div className="relative flex-1 max-w-md mx-2">
          <div className={`relative flex items-center px-3.5 py-2 rounded-2xl border transition-all ${
            showSearchDropdown ? 'bg-slate-900 border-rose-500 shadow-rose-900/30' : 'bg-slate-900/90 border-slate-700/90'
          }`}>
            <Search className="w-4 h-4 text-rose-400 shrink-0" />
            <input 
              type="text"
              value={searchQuery}
              onFocus={() => setShowSearchDropdown(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              placeholder={appLang === 'ar' ? 'ابحث عن مدينة، مقاطعة، أو مكتب ANC (مثل: Cluj, București)...' : 'Search cities, counties, or ANC offices...'}
              className="w-full px-2.5 bg-transparent outline-none text-xs sm:text-sm font-semibold placeholder:text-slate-400 text-white"
            />
            {searchQuery && (
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setShowSearchDropdown(false);
                }} 
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Search Live Dropdown Results */}
          {showSearchDropdown && (
            <div className="absolute top-12 inset-x-0 bg-slate-900/95 backdrop-blur-xl border border-slate-700/90 rounded-2xl shadow-2xl overflow-hidden max-h-64 overflow-y-auto z-50 divide-y divide-slate-800">
              {filteredLocations.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400 font-bold">
                  لم يتم العثور على نتائج تطابق البحث 🔍
                </div>
              ) : (
                filteredLocations.map((loc) => (
                  <button
                    key={loc.id}
                    onClick={() => handleSelectLocation(loc)}
                    className="w-full p-3 text-right hover:bg-rose-900/30 transition-colors flex items-center justify-between gap-2"
                  >
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-black text-white">{appLang === 'ar' ? loc.name_ar : loc.name_ro}</h4>
                      <p className="text-[10px] text-rose-400 font-bold">{appLang === 'ar' ? loc.county_ar : loc.county_ro}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-rose-500/20 text-rose-300 border border-rose-500/30 shrink-0">
                      {appLang === 'ar' ? loc.category_label_ar : loc.category_label_en}
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Language Switcher & Home Navigation */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center bg-slate-900/90 border border-slate-700 rounded-xl p-0.5 text-[11px] font-black">
            <button
              onClick={() => setAppLang('ar')}
              className={`px-2 py-1 rounded-lg transition-all ${appLang === 'ar' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              AR
            </button>
            <button
              onClick={() => setAppLang('ro')}
              className={`px-2 py-1 rounded-lg transition-all ${appLang === 'ro' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              RO
            </button>
            <button
              onClick={() => setAppLang('en')}
              className={`px-2 py-1 rounded-lg transition-all ${appLang === 'en' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              EN
            </button>
          </div>

          <Link
            href="/"
            className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold transition-all shrink-0 hidden sm:flex items-center gap-1"
          >
            <span>{appLang === 'ar' ? 'الرئيسية 🏠' : 'Home 🏠'}</span>
          </Link>
        </div>
      </header>

      {/* 3. TOP FLOATING HORIZONTAL INFORMATION CARDS OVERLAY */}
      <div className="fixed top-16 sm:top-20 inset-x-0 z-20 px-3 sm:px-6 pointer-events-none">
        <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar mobile-touch-scroll py-1.5 pointer-events-auto">
          {[
            {
              id: 'citizenship',
              title_ar: '🇷🇴 الجنسية الرومانية',
              title_en: '🇷🇴 Romanian Citizenship',
              subtitle_ar: 'نظرة عامة على قانون 21/1991',
              subtitle_en: 'Overview & Law 21/1991',
              badgeColor: 'from-rose-600 to-amber-600'
            },
            {
              id: 'requirements',
              title_ar: '📄 الشروط والمستندات',
              title_en: '📄 Requirements & Dossier',
              subtitle_ar: 'قائمة الأوراق والملف المطلوبة',
              subtitle_en: 'Required document checklist',
              badgeColor: 'from-amber-600 to-emerald-600'
            },
            {
              id: 'descent',
              title_ar: '⚖️ الجنسية بالأصول (Art 11)',
              title_en: '⚖️ Citizenship by Descent',
              subtitle_ar: 'استعادة الجنسية عبر الأجداد',
              subtitle_en: 'Restoration through lineage',
              badgeColor: 'from-emerald-600 to-teal-600'
            },
            {
              id: 'restoration',
              title_ar: '🔄 التجنيس بالإقامة (Art 8)',
              title_en: '🔄 Naturalization (Art 8)',
              subtitle_ar: 'شروط الإقامة والزواج',
              subtitle_en: 'Residence & Marriage criteria',
              badgeColor: 'from-blue-600 to-indigo-600'
            },
            {
              id: 'institutions',
              title_ar: '🏛️ مقرات الهيئة ANC',
              title_en: '🏛️ ANC Institutions',
              subtitle_ar: 'وزارة العدل والمقرات الرسمية',
              subtitle_en: 'Ministry of Justice & Offices',
              badgeColor: 'from-purple-600 to-rose-600'
            },
            {
              id: 'locations',
              title_ar: '📍 مواقع المدن والمحافظات',
              title_en: '📍 Romanian Administrative Hubs',
              subtitle_ar: '11 مدينة ومكتب رسمي برومانيا',
              subtitle_en: '11 Official administrative hubs',
              badgeColor: 'from-rose-600 to-amber-500'
            }
          ].map((card) => (
            <button
              key={card.id}
              onClick={() => setActiveInfoModal(card.id)}
              className="group p-3 sm:p-3.5 rounded-2xl bg-slate-900/85 hover:bg-slate-900 border border-slate-700/80 shadow-2xl backdrop-blur-md transition-all hover:scale-105 shrink-0 text-right space-y-0.5 min-w-[170px] sm:min-w-[190px]"
            >
              <h3 className="text-xs font-black text-white group-hover:text-amber-400 transition-colors">
                {appLang === 'ar' ? card.title_ar : card.title_en}
              </h3>
              <p className="text-[10px] text-slate-400 font-bold truncate">
                {appLang === 'ar' ? card.subtitle_ar : card.subtitle_en}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* 4. BOTTOM FLOATING CATEGORY FILTER PILLS BAR */}
      <div className="fixed bottom-4 left-4 z-20 pointer-events-auto">
        <div className="flex items-center gap-2 p-2 rounded-2xl bg-slate-900/90 backdrop-blur-lg border border-slate-700/90 shadow-2xl max-w-[calc(100vw-32px)] overflow-x-auto no-scrollbar mobile-touch-scroll">
          {[
            { id: 'all', label_ar: 'الكل (11)', label_en: 'All (11)' },
            { id: 'citizenship', label_ar: '🏛️ ANC للجنسية', label_en: '🏛️ ANC Hubs' },
            { id: 'passport', label_ar: '🛂 الجوازات والسكان', label_en: '🛂 Passports' },
            { id: 'civil_status', label_ar: '📄 الأحوال المدنية', label_en: '📄 Civil Status' },
            { id: 'immigration', label_ar: '🛃 الهجرة (IGI)', label_en: '🛃 Immigration' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap shrink-0 transition-all border ${
                activeCategory === cat.id
                  ? 'bg-rose-600 text-white border-rose-600 shadow-md'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700/70 hover:bg-slate-700'
              }`}
            >
              {appLang === 'ar' ? cat.label_ar : cat.label_en}
            </button>
          ))}
        </div>
      </div>

      {/* 5. MOBILE BOTTOM SHEET FOR CLICKED LOCATION MARKERS */}
      {selectedLocation && (
        <div className="fixed bottom-0 inset-x-0 z-40 p-4 bg-slate-900/95 backdrop-blur-xl border-t border-slate-700 rounded-t-3xl shadow-2xl space-y-3 animate-slide-up max-h-[80vh] overflow-y-auto font-latin">
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-600 text-white">
              {appLang === 'ar' ? selectedLocation.category_label_ar : selectedLocation.category_label_en}
            </span>
            <button 
              onClick={() => setSelectedLocation(null)}
              className="p-1 rounded-full text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 shadow-md">
              <Image 
                src={selectedLocation.image_url} 
                alt={selectedLocation.name_ro}
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-0.5 text-right flex-1">
              <h3 className="text-sm font-black text-white">{appLang === 'ar' ? selectedLocation.name_ar : selectedLocation.name_ro}</h3>
              <p className="text-[11px] font-black text-rose-400">{appLang === 'ar' ? selectedLocation.county_ar : selectedLocation.county_ro}</p>
              <p className="text-[11px] text-slate-300 font-semibold line-clamp-2 leading-snug">{appLang === 'ar' ? selectedLocation.description_ar : selectedLocation.description_ro}</p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-xs font-bold">
            <span className="text-slate-300 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-blue-400" />
              <span>{selectedLocation.phone}</span>
            </span>

            <button
              onClick={() => setDetailsModalLocation(selectedLocation)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 text-white text-xs font-black shadow-md hover:from-rose-500 hover:to-amber-500 transition-all flex items-center gap-1.5"
            >
              <span>{appLang === 'ar' ? 'عرض التفاصيل الكاملة 🏛️' : 'View Full Details 🏛️'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 6. FLOATING MODALS OVERLAY (CITIZENSHIP, REQUIREMENTS, DESCENT, RESTORATION, INSTITUTIONS, LOCATIONS) */}
      {activeInfoModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in font-latin select-text">
          <div className="w-full max-w-2xl p-6 rounded-3xl bg-slate-900 border border-slate-700 text-white shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-500/20 text-rose-400 border border-rose-500/30">
                Legea Cetățeniei Române 21/1991
              </span>
              <button 
                onClick={() => setActiveInfoModal(null)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content Switcher */}
            {activeInfoModal === 'citizenship' && (
              <div className="space-y-3">
                <h3 className="text-lg font-black text-rose-400">🇷🇴 نظرة عامة على قانون الجنسية الرومانية (Law 21/1991)</h3>
                <p className="text-xs text-slate-300 font-semibold leading-relaxed">
                  يحدد قانون الجنسية الرومانية رقم 21/1991 الشروط القانونية النافذة للحصول على الجنسية أو استعادتها. وتخضع جميع الطلبات لدراسة الهيئة الوطنية للجنسية (ANC) التابعة لوزارة العدل ببوخارست.
                </p>
                <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 space-y-2 text-xs font-bold">
                  <span className="text-amber-400 block font-black">• الطرق الرئيسية للحصول على الجنسية:</span>
                  <ul className="list-disc list-inside space-y-1 text-slate-300">
                    <li>الولادة (Art. 5): لأبناء المواطنين الرومان تلقائياً.</li>
                    <li>استعادة الجنسية بالأصول (Art. 11): للمتحدرين من أصل روماني حتى الدرجة الثالثة.</li>
                    <li>التجنيس بالإقامة (Art. 8): للإقامة القانونية برومانيا لمدة 8 سنوات (أو 5 سنوات للزوج).</li>
                  </ul>
                </div>
              </div>
            )}

            {activeInfoModal === 'requirements' && (
              <div className="space-y-3">
                <h3 className="text-lg font-black text-amber-400">📄 قائمة الأوراق والمستندات المطلوبة (Dosar Completo)</h3>
                <p className="text-xs text-slate-300 font-semibold leading-relaxed">
                  يتطلب تقديم الملف في ANC أوراقاً أصلية مترجمة إلى اللغة الرومانية ومصادق عليها أصولاً لدى مترجم محلف وموثقة بالأبوستيل.
                </p>
                <div className="space-y-2 text-xs font-bold">
                  <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>جواز السفر النافذ مع ترجمة مصدقة وملاحظات الهوية.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>شهادة الميلاد الأصلية وشهادة الزواج (للأبوين والأجداد في حال Art. 11).</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>السجل العدلي (الفيش) من بلد الإقامة ومن رومانيا مؤكد الخلو من السوابق.</span>
                  </div>
                </div>
              </div>
            )}

            {activeInfoModal === 'descent' && (
              <div className="space-y-3">
                <h3 className="text-lg font-black text-emerald-400">⚖️ استعادة الجنسية الرومانية بالأصول (Art. 11)</h3>
                <p className="text-xs text-slate-300 font-semibold leading-relaxed">
                  تمنح المادة 11 من قانون الجنسية للأشخاص أو أحفادهم حتى الدرجة الثالثة الذين أزيلت عنهم الجنسية الرومانية لأسباب غير منسوبة إليهم، الحق في استعادتها مع الاحتفاظ بإقامتهم خارج رومانيا.
                </p>
                <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 space-y-1">
                  <span className="text-emerald-400 font-black block">• درجات القرابة المشمولة:</span>
                  <p>الوالدان (الدرجة 1)، الأجداد (الدرجة 2)، وأجداد الأجداد (الدرجة 3).</p>
                </div>
              </div>
            )}

            {activeInfoModal === 'restoration' && (
              <div className="space-y-3">
                <h3 className="text-lg font-black text-blue-400">🔄 التجنيس عن طريق الإقامة والزواج (Art. 8)</h3>
                <p className="text-xs text-slate-300 font-semibold leading-relaxed">
                  تمنح المادة 8 الجنسية للمقيمين برومانيا إقامة قانونية متواصلة لمدة 8 سنوات، أو 5 سنوات متواصلة في حال الزواج من مواطن أو مواطنة رومانية.
                </p>
                <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 space-y-1">
                  <span className="text-blue-400 font-black block">• المتطلبات الإضافية:</span>
                  <p>إثبات وسائل العيش الكافية، عدم ارتكاب جرائم، وإتقان اللغة الرومانية والدستور.</p>
                </div>
              </div>
            )}

            {activeInfoModal === 'institutions' && (
              <div className="space-y-3">
                <h3 className="text-lg font-black text-purple-400">🏛️ الهيئة الوطنية للجنسية (ANC) والجهات الرسمية</h3>
                <p className="text-xs text-slate-300 font-semibold leading-relaxed">
                  تتبع الهيئة الوطنية للجنسية (ANC) لوزارة العدل الرومانية وتختص بتسلم ودراسة الملفات وإصدار القرارات الرسمية وتنظيم أداء قسم الولاء.
                </p>
                <div className="space-y-2 text-xs font-bold">
                  <div className="p-3 rounded-xl bg-slate-800 border border-slate-700">
                    <span className="text-rose-400 font-black">المقر الرئيسي:</span> Str. Smârdan nr. 3, Sector 3, București.
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800 border border-slate-700">
                    <span className="text-amber-400 font-black">المكاتب الإقليمية:</span> Cluj-Napoca, Iași, Timișoara, Brașov, Suceava.
                  </div>
                </div>
              </div>
            )}

            {activeInfoModal === 'locations' && (
              <div className="space-y-3">
                <h3 className="text-lg font-black text-rose-400">📍 دليل المدن والمراكز الإدارية الـ 11 في رومانيا</h3>
                <p className="text-xs text-slate-300 font-semibold leading-relaxed">
                  استكشف جميع مكاتب ANC، مديريات الجوازات، والأحوال المدنية الموزعة على الخريطة التفاعلية.
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                  {mapLocationsData.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => {
                        setActiveInfoModal(null);
                        handleSelectLocation(l);
                      }}
                      className="p-2.5 rounded-xl bg-slate-800 hover:bg-rose-900/40 text-right border border-slate-700 transition-colors"
                    >
                      <span className="text-white block font-black">{appLang === 'ar' ? l.name_ar : l.name_ro}</span>
                      <span className="text-[10px] text-rose-400">{appLang === 'ar' ? l.county_ar : l.county_ro}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Close Button */}
            <div className="pt-2">
              <button
                onClick={() => setActiveInfoModal(null)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-black shadow-md"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. DEEP DIVE LOCATION DETAILS MODAL */}
      {detailsModalLocation && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in font-latin select-text">
          <div className="w-full max-w-xl p-6 rounded-3xl bg-slate-900 border border-slate-700 text-white shadow-2xl space-y-4 max-h-[88vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-600 text-white">
                {appLang === 'ar' ? detailsModalLocation.category_label_ar : detailsModalLocation.category_label_en}
              </span>
              <button 
                onClick={() => setDetailsModalLocation(null)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
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
              <p className="text-xs text-slate-300 font-semibold leading-relaxed pt-1">{appLang === 'ar' ? detailsModalLocation.description_ar : detailsModalLocation.description_ro}</p>
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
