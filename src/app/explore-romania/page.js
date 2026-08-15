'use client';

import React, { useState } from 'react';
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
  Compass,
  Landmark,
  TreePine,
  History,
  Camera,
  Layers,
  ChevronRight
} from 'lucide-react';
import RomaniaExploreMap from '../../components/RomaniaExploreMap';
import exploreCitiesData from '../../data/romanian_explore_data.json';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

export default function ExploreRomaniaPage() {
  const { theme } = useTheme();
  const { appLang, setAppLang, strings, isRtl } = useLanguage();
  const isDark = theme === 'dark';

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all');
  const [selectedCity, setSelectedCity] = useState(exploreCitiesData[0]); // Default to Brașov
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [activeCardModal, setActiveCardModal] = useState(null); // 'history' | 'geography' | 'landmarks' | 'culture' | 'nature' | 'places' | 'full_city'
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // Filter cities & places
  const filteredCities = exploreCitiesData.filter((city) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      city.name_ro.toLowerCase().includes(query) ||
      city.name_en.toLowerCase().includes(query) ||
      city.name_ar.includes(query) ||
      city.county_ro.toLowerCase().includes(query) ||
      city.intro_ro.toLowerCase().includes(query)
    );
  });

  const handleSelectCity = (city) => {
    setSelectedCity(city);
    setSelectedPlace(null);
    setShowSearchDropdown(false);
  };

  const handleSelectPlace = (place, city) => {
    setSelectedCity(city);
    setSelectedPlace(place);
    setShowSearchDropdown(false);
  };

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-slate-950 text-slate-100 font-latin select-none">
      
      {/* 1. 100% EDGE-TO-EDGE FULL-SCREEN INTERACTIVE ROMANIA EXPLORE MAP */}
      <div className="fixed inset-0 w-full h-full z-0">
        <RomaniaExploreMap 
          citiesData={filteredCities}
          selectedCityId={selectedCity?.id}
          selectedPlaceId={selectedPlace?.id}
          onSelectCity={handleSelectCity}
          onSelectPlace={handleSelectPlace}
          appLang={appLang}
          activeCategoryFilter={activeCategoryFilter}
        />
      </div>

      {/* 2. TOP FLOATING NAVIGATION & INTEGRATED SEARCH HEADER */}
      <header className="fixed top-0 inset-x-0 z-30 px-3 sm:px-6 py-3 bg-slate-900/85 backdrop-blur-md border-b border-slate-700/80 shadow-2xl flex items-center justify-between gap-3">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0 group">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-600 via-amber-400 to-blue-600 flex items-center justify-center shadow-lg border border-amber-400/40 group-hover:scale-105 transition-transform">
            <Compass className="w-5 h-5 text-white animate-spin-slow" />
          </div>
          <div className="hidden sm:block text-right">
            <h1 className="text-sm font-black text-white tracking-tight flex items-center gap-1.5">
              <span>{appLang === 'ar' ? 'أطلس استكشاف رومانيا 🗺️' : 'Explore Romania Digital Atlas 🗺️'}</span>
            </h1>
            <p className="text-[10px] text-amber-400 font-bold">History, Geography & Cultural Heritage</p>
          </div>
        </Link>

        {/* Search Input Box */}
        <div className="relative flex-1 max-w-md mx-2">
          <div className={`relative flex items-center px-3.5 py-2 rounded-2xl border transition-all ${
            showSearchDropdown ? 'bg-slate-900 border-amber-400 shadow-amber-900/30' : 'bg-slate-900/90 border-slate-700/90'
          }`}>
            <Search className="w-4 h-4 text-amber-400 shrink-0" />
            <input 
              type="text"
              value={searchQuery}
              onFocus={() => setShowSearchDropdown(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              placeholder={appLang === 'ar' ? 'ابحث عن أي مدينة، قلعة، متحف، أو معلماً (مثل: Brașov, Peleș)...' : 'Search Romanian city, castle, museum, or landmark...'}
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

          {/* Live Search Suggestions Dropdown */}
          {showSearchDropdown && (
            <div className="absolute top-12 inset-x-0 bg-slate-900/95 backdrop-blur-xl border border-slate-700/90 rounded-2xl shadow-2xl overflow-hidden max-h-64 overflow-y-auto z-50 divide-y divide-slate-800">
              {filteredCities.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400 font-bold">
                  لم يتم العثور على نتائج تطابق البحث 🔍
                </div>
              ) : (
                filteredCities.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => handleSelectCity(city)}
                    className="w-full p-3 text-right hover:bg-rose-900/30 transition-colors flex items-center justify-between gap-2"
                  >
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-black text-white">{appLang === 'ar' ? city.name_ar : city.name_ro}</h4>
                      <p className="text-[10px] text-amber-400 font-bold">{appLang === 'ar' ? city.county_ar : city.county_ro}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                      {city.places?.length || 0} المعالم
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Language Selector & Quick Home Link */}
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

      {/* 3. TOP FLOATING CAROUSEL OF CITY INFORMATION CARDS OVERLAY */}
      <div className="fixed top-16 sm:top-20 inset-x-0 z-20 px-3 sm:px-6 pointer-events-none">
        <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar mobile-touch-scroll py-1.5 pointer-events-auto">
          
          {/* Active Selected City Main Pill Card */}
          <div className="p-3 rounded-2xl bg-gradient-to-r from-rose-600 via-amber-600 to-rose-700 text-white border border-rose-400/40 shadow-2xl shrink-0 flex items-center gap-2 min-w-[200px]">
            <div className="w-9 h-9 rounded-xl overflow-hidden relative shrink-0 border border-white/40 shadow-sm">
              <Image src={selectedCity.image_url} alt={selectedCity.name_ro} fill className="object-cover" />
            </div>
            <div className="text-right truncate">
              <span className="text-[10px] font-black text-amber-200 block uppercase">المدينة المحددة حالياً:</span>
              <h3 className="text-xs font-black truncate">{appLang === 'ar' ? selectedCity.name_ar : selectedCity.name_ro}</h3>
            </div>
          </div>

          {/* Dynamic Category Cards */}
          {[
            {
              id: 'history',
              title_ar: '🏛️ التاريخ والقبائل',
              title_en: '🏛️ History & Eras',
              subtitle_ar: 'التطور التاريخي والحقب',
              subtitle_en: 'Historical timeline & origins'
            },
            {
              id: 'geography',
              title_ar: '🗺️ الجغرافيا والتضاريس',
              title_en: '🗺️ Geography & Relief',
              subtitle_ar: 'الجبال والأنهار والارتفاع',
              subtitle_en: 'Mountains, rivers & elevation'
            },
            {
              id: 'landmarks',
              title_ar: '🏰 القلاع والمعالم',
              title_en: '🏰 Castles & Monuments',
              subtitle_ar: 'الحصون والمباني التاريخية',
              subtitle_en: 'Fortresses & historic buildings'
            },
            {
              id: 'culture',
              title_ar: '🎨 الثقافة والتراث',
              title_en: '🎨 Culture & Traditions',
              subtitle_ar: 'الفولكلور والمهرجانات',
              subtitle_en: 'Folklore & annual festivals'
            },
            {
              id: 'nature',
              title_ar: '🌲 الطبيعة والمتنزهات',
              title_en: '🌲 Nature & Parks',
              subtitle_ar: 'المحميات الطبيعية والجبال',
              subtitle_en: 'Nature reserves & peaks'
            },
            {
              id: 'places',
              title_ar: '📸 قائمة المعالم المتاحة',
              title_en: '📸 Places to Explore',
              subtitle_ar: `تصفح ${selectedCity.places?.length || 0} موقعاً تفصيلياً`,
              subtitle_en: `Browse ${selectedCity.places?.length || 0} locations`
            }
          ].map((card) => (
            <button
              key={card.id}
              onClick={() => setActiveCardModal(card.id)}
              className="group p-3 sm:p-3.5 rounded-2xl bg-slate-900/85 hover:bg-slate-900 border border-slate-700/80 shadow-2xl backdrop-blur-md transition-all hover:scale-105 shrink-0 text-right space-y-0.5 min-w-[160px] sm:min-w-[185px]"
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

      {/* 4. BOTTOM FLOATING CATEGORY FILTER BAR */}
      <div className="fixed bottom-4 left-4 z-20 pointer-events-auto">
        <div className="flex items-center gap-2 p-2 rounded-2xl bg-slate-900/90 backdrop-blur-lg border border-slate-700/90 shadow-2xl max-w-[calc(100vw-32px)] overflow-x-auto no-scrollbar mobile-touch-scroll">
          {[
            { id: 'all', label_ar: 'جميع المعالم', label_en: 'All Places' },
            { id: 'castle', label_ar: '🏰 القلاع والحصون', label_en: '🏰 Castles' },
            { id: 'museum', label_ar: '🏛️ المتاحف', label_en: '🏛️ Museums' },
            { id: 'church', label_ar: '⛪ الكنائس والأديرة', label_en: '⛪ Churches' },
            { id: 'nature', label_ar: '🌲 الطبيعة والجبال', label_en: '🌲 Nature' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap shrink-0 transition-all border ${
                activeCategoryFilter === cat.id
                  ? 'bg-rose-600 text-white border-rose-600 shadow-md'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700/70 hover:bg-slate-700'
              }`}
            >
              {appLang === 'ar' ? cat.label_ar : cat.label_en}
            </button>
          ))}
        </div>
      </div>

      {/* 5. MOBILE BOTTOM SHEET POPUP FOR CLICKED GRANULAR PLACES */}
      {selectedPlace && (
        <div className="fixed bottom-0 inset-x-0 z-40 p-4 bg-slate-900/95 backdrop-blur-xl border-t border-slate-700 rounded-t-3xl shadow-2xl space-y-3 animate-slide-up max-h-[80vh] overflow-y-auto font-latin">
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-600 text-white">
              {appLang === 'ar' ? selectedPlace.category_label_ar : selectedPlace.category_label_en}
            </span>
            <button 
              onClick={() => setSelectedPlace(null)}
              className="p-1 rounded-full text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 shadow-md">
              <Image 
                src={selectedPlace.image_url} 
                alt={selectedPlace.name_ro}
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-0.5 text-right flex-1">
              <h3 className="text-sm font-black text-white">{appLang === 'ar' ? selectedPlace.name_ar : selectedPlace.name_ro}</h3>
              <p className="text-[11px] font-extrabold text-amber-400">{selectedPlace.period}</p>
              <p className="text-[11px] text-slate-300 font-semibold line-clamp-2 leading-snug">{appLang === 'ar' ? selectedPlace.desc_ar : selectedPlace.desc_ro}</p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-xs font-bold">
            <span className="text-slate-400">تابع لمدينة {appLang === 'ar' ? selectedCity.name_ar : selectedCity.name_ro}</span>
            <button
              onClick={() => {
                setActiveCardModal('places');
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 text-white text-xs font-black shadow-md flex items-center gap-1.5"
            >
              <span>{appLang === 'ar' ? 'عرض القصة والتاريخ الكامل 📖' : 'View Full Story 📖'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 6. FLOATING MODALS OVERLAY (HISTORY, GEOGRAPHY, LANDMARKS, CULTURE, NATURE, PLACES) */}
      {activeCardModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in font-latin select-text">
          <div className="w-full max-w-3xl p-6 rounded-3xl bg-slate-900 border border-slate-700 text-white shadow-2xl space-y-5 max-h-[88vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  {selectedCity.county_ro}
                </span>
                <h3 className="text-base font-black text-white">{appLang === 'ar' ? selectedCity.name_ar : selectedCity.name_ro}</h3>
              </div>
              <button 
                onClick={() => setActiveCardModal(null)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content Switcher */}
            {activeCardModal === 'history' && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-rose-400">🏛️ التطور التاريخي لمدينة {appLang === 'ar' ? selectedCity.name_ar : selectedCity.name_ro}</h3>
                  <p className="text-xs text-slate-300 font-semibold leading-relaxed">{appLang === 'ar' ? selectedCity.history_summary_ar : selectedCity.history_summary_ro}</p>
                </div>

                {/* Historical 3-Era Timeline */}
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-black text-amber-400 block">التسلسل الزمني للحقب التاريخية (Timeline):</span>
                  {(selectedCity.history_timeline || []).map((t, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-800 border border-slate-700 space-y-1">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-600 text-white">
                        {t.era}
                      </span>
                      <h4 className="text-xs font-black text-white pt-1">{appLang === 'ar' ? t.title_ar : t.title_ro}</h4>
                      <p className="text-xs text-slate-300 font-semibold leading-relaxed">{appLang === 'ar' ? t.desc_ar : t.desc_ro}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeCardModal === 'geography' && (
              <div className="space-y-4">
                <h3 className="text-lg font-black text-amber-400">🗺️ الجغرافيا والتضاريس الطبيعية</h3>
                <p className="text-xs text-slate-300 font-semibold leading-relaxed">{appLang === 'ar' ? selectedCity.geography_ar || selectedCity.geography_ro : selectedCity.geography_en}</p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-bold pt-2">
                  <div className="p-3 rounded-2xl bg-slate-800 border border-slate-700 space-y-0.5">
                    <span className="text-rose-400 block font-black">الارتفاع عن سطح البحر:</span>
                    <span className="text-white">{selectedCity.elevation}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-800 border border-slate-700 space-y-0.5">
                    <span className="text-blue-400 block font-black">الأنهار الرئيسية:</span>
                    <span className="text-white">{selectedCity.rivers}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-800 border border-slate-700 space-y-0.5">
                    <span className="text-amber-400 block font-black">السلاسل الجبلية:</span>
                    <span className="text-white">{selectedCity.mountains}</span>
                  </div>
                </div>
              </div>
            )}

            {activeCardModal === 'landmarks' && (
              <div className="space-y-4">
                <h3 className="text-lg font-black text-emerald-400">🏰 القلاع والمعالم التاريخية</h3>
                <p className="text-xs text-slate-300 font-semibold leading-relaxed">{appLang === 'ar' ? selectedCity.landmarks_summary_ar || selectedCity.landmarks_summary_ro : selectedCity.landmarks_summary_en}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {(selectedCity.places || []).map((p) => (
                    <div key={p.id} className="p-3 rounded-2xl bg-slate-800 border border-slate-700 space-y-1">
                      <h4 className="text-xs font-black text-white">{appLang === 'ar' ? p.name_ar : p.name_ro}</h4>
                      <p className="text-[10px] text-amber-400 font-bold">{p.period}</p>
                      <p className="text-[11px] text-slate-300 font-semibold line-clamp-2">{appLang === 'ar' ? p.desc_ar : p.desc_ro}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeCardModal === 'culture' && (
              <div className="space-y-4">
                <h3 className="text-lg font-black text-purple-400">🎨 الثقافة والتراث المحلي</h3>
                <p className="text-xs text-slate-300 font-semibold leading-relaxed">{appLang === 'ar' ? selectedCity.culture_ar || selectedCity.culture_ro : selectedCity.culture_en}</p>
              </div>
            )}

            {activeCardModal === 'nature' && (
              <div className="space-y-4">
                <h3 className="text-lg font-black text-emerald-400">🌲 المحميات الطبيعية والمنتجعات</h3>
                <p className="text-xs text-slate-300 font-semibold leading-relaxed">{appLang === 'ar' ? selectedCity.nature_summary_ar || selectedCity.nature_summary_ro : selectedCity.nature_summary_en}</p>
              </div>
            )}

            {activeCardModal === 'places' && (
              <div className="space-y-4">
                <h3 className="text-lg font-black text-rose-400">📸 قائمة جميع المعالم في {appLang === 'ar' ? selectedCity.name_ar : selectedCity.name_ro}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(selectedCity.places || []).map((p) => (
                    <div key={p.id} className="p-4 rounded-2xl bg-slate-800 border border-slate-700 space-y-2">
                      <div className="relative h-28 rounded-xl overflow-hidden shadow-md">
                        <Image src={p.image_url} alt={p.name_ro} fill className="object-cover" />
                      </div>
                      <h4 className="text-xs font-black text-white">{appLang === 'ar' ? p.name_ar : p.name_ro}</h4>
                      <p className="text-[10px] text-amber-400 font-bold">{p.period}</p>
                      <p className="text-xs text-slate-300 font-semibold leading-relaxed">{appLang === 'ar' ? p.desc_ar : p.desc_ro}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Footer Close Button */}
            <div className="pt-2">
              <button
                onClick={() => setActiveCardModal(null)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-black shadow-md"
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
