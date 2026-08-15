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
  ChevronRight,
  Users,
  Lightbulb,
  BookMarked
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [activeCardModal, setActiveCardModal] = useState(null); // 'history' | 'geography' | 'landmarks' | 'culture' | 'sources' | 'places' | 'facts'
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // Helper variables for basic_info
  const cityName = appLang === 'ar' ? selectedCity.basic_info?.name_ar || selectedCity.name_ar : appLang === 'en' ? selectedCity.basic_info?.name_en || selectedCity.name_en : selectedCity.basic_info?.name_ro || selectedCity.name_ro;
  const countyName = appLang === 'ar' ? selectedCity.basic_info?.county_ar || selectedCity.county_ar : selectedCity.basic_info?.county_ro || selectedCity.county_ro;
  const heroImgUrl = selectedCity.hero_image?.url || selectedCity.image_url;

  // Filter cities & places
  const filteredCities = exploreCitiesData.filter((city) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    const nameRo = city.basic_info?.name_ro || city.name_ro || '';
    const nameEn = city.basic_info?.name_en || city.name_en || '';
    const nameAr = city.basic_info?.name_ar || city.name_ar || '';
    const countyRo = city.basic_info?.county_ro || city.county_ro || '';
    return (
      nameRo.toLowerCase().includes(query) ||
      nameEn.toLowerCase().includes(query) ||
      nameAr.includes(query) ||
      countyRo.toLowerCase().includes(query)
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
            <p className="text-[10px] text-amber-400 font-bold">Wikipedia & Wikimedia Source-Backed Atlas</p>
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
                filteredCities.map((city) => {
                  const cName = appLang === 'ar' ? city.basic_info?.name_ar || city.name_ar : city.basic_info?.name_ro || city.name_ro;
                  const cCounty = appLang === 'ar' ? city.basic_info?.county_ar || city.county_ar : city.basic_info?.county_ro || city.county_ro;
                  return (
                    <button
                      key={city.id}
                      onClick={() => handleSelectCity(city)}
                      className="w-full p-3 text-right hover:bg-rose-900/30 transition-colors flex items-center justify-between gap-2"
                    >
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-black text-white">{cName}</h4>
                        <p className="text-[10px] text-amber-400 font-bold">{cCounty}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                        {city.landmarks?.length || 0} المعالم
                      </span>
                    </button>
                  );
                })
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

      {/* 3. ANIMATED 3D GLASSMORPHISM TOP CARDS CAROUSEL OVERLAY */}
      <div className="fixed top-16 sm:top-20 inset-x-0 z-20 px-3 sm:px-6 pointer-events-none">
        <motion.div 
          key={selectedCity.id}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, staggerChildren: 0.1 }}
          className="flex items-center gap-3 overflow-x-auto no-scrollbar mobile-touch-scroll py-2 pointer-events-auto"
        >
          
          {/* Active Selected City Main Banner Card */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-600 via-amber-600 to-rose-700 text-white border-2 border-amber-400/60 shadow-2xl shrink-0 flex items-center gap-3 min-w-[210px] relative overflow-hidden group">
            <div className="w-10 h-10 rounded-xl overflow-hidden relative shrink-0 border border-white/50 shadow-md">
              <Image src={heroImgUrl} alt={cityName} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="text-right truncate z-10">
              <span className="text-[9px] font-black text-amber-200 block uppercase tracking-wider">المدينة المحددة:</span>
              <h3 className="text-xs font-black truncate">{cityName}</h3>
              <p className="text-[10px] text-amber-100 font-bold truncate">{countyName}</p>
            </div>
            {/* Animated Active Glow Accent */}
            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/20 rounded-full blur-xl animate-pulse" />
          </div>

          {/* Dynamic Interactive Category Cards */}
          {[
            {
              id: 'history',
              icon: History,
              title_ar: '🏛️ التاريخ والقبائل',
              title_en: '🏛️ History & Eras',
              subtitle_ar: 'الحقب من الداكية حتى اليوم',
              subtitle_en: 'Historical timeline & origins',
              color: 'from-amber-500 to-rose-600'
            },
            {
              id: 'geography',
              icon: Compass,
              title_ar: '🗺️ الجغرافيا والتضاريس',
              title_en: '🗺️ Geography & Relief',
              subtitle_ar: `${selectedCity.geography?.mountains || 'الجبال والأنهار'}`,
              subtitle_en: 'Mountains, rivers & elevation',
              color: 'from-emerald-500 to-teal-600'
            },
            {
              id: 'landmarks',
              icon: Landmark,
              title_ar: '🏰 القلاع والمعالم',
              title_en: '🏰 Castles & Monuments',
              subtitle_ar: `${selectedCity.landmarks?.length || 0} موقعاً بارزاً`,
              subtitle_en: 'Fortresses & historic buildings',
              color: 'from-purple-500 to-indigo-600'
            },
            {
              id: 'culture',
              icon: Sparkles,
              title_ar: '🎨 الثقافة والعمارة',
              title_en: '🎨 Culture & Architecture',
              subtitle_ar: 'التراث والمهرجانات',
              subtitle_en: 'Folklore & annual festivals',
              color: 'from-rose-500 to-amber-600'
            },
            {
              id: 'facts',
              icon: Lightbulb,
              title_ar: '💡 حقائق ومشاهير',
              title_en: '💡 Facts & Famous People',
              subtitle_ar: 'معلومات وشخصيات بارزة',
              subtitle_en: 'Trivia & notable figures',
              color: 'from-amber-600 to-yellow-500'
            },
            {
              id: 'sources',
              icon: BookMarked,
              title_ar: '📚 المصادر والمراجع',
              title_en: '📚 Sources & Attribution',
              subtitle_ar: 'Wikipedia & Commons Links',
              subtitle_en: 'Verified open databases',
              color: 'from-blue-600 to-cyan-600'
            }
          ].map((card) => (
            <button
              key={card.id}
              onClick={() => {
                setActiveCardModal(card.id);
                // Synchronize active category filter for map
                if (card.id === 'landmarks') setActiveCategoryFilter('castle');
                else if (card.id === 'history') setActiveCategoryFilter('all');
              }}
              className="group p-3 sm:p-3.5 rounded-2xl bg-slate-900/85 hover:bg-slate-900 border border-slate-700/80 shadow-2xl backdrop-blur-md transition-all hover:scale-105 hover:-translate-y-1 shrink-0 text-right space-y-0.5 min-w-[165px] sm:min-w-[190px] relative overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-1 mb-1">
                <span className="text-xs font-black text-white group-hover:text-amber-400 transition-colors">
                  {appLang === 'ar' ? card.title_ar : card.title_en}
                </span>
                <span className="p-1 rounded-lg bg-slate-800 text-amber-400 group-hover:bg-amber-400 group-hover:text-slate-900 transition-colors">
                  <card.icon className="w-3.5 h-3.5" />
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-bold truncate">
                {appLang === 'ar' ? card.subtitle_ar : card.subtitle_en}
              </p>
              {/* Subtle Card Border Highlight */}
              <div className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400/40 to-transparent group-hover:via-amber-400 transition-all" />
            </button>
          ))}

        </motion.div>
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
            <span className="text-slate-400">تابع لمدينة {cityName}</span>
            <button
              onClick={() => {
                setActiveCardModal('landmarks');
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 text-white text-xs font-black shadow-md flex items-center gap-1.5"
            >
              <span>{appLang === 'ar' ? 'عرض القصة والتاريخ الكامل 📖' : 'View Full Story 📖'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 6. FLOATING SOURCE-BACKED MODALS OVERLAY */}
      {activeCardModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in font-latin select-text">
          <div className="w-full max-w-3xl p-6 rounded-3xl bg-slate-900 border border-slate-700 text-white shadow-2xl space-y-5 max-h-[88vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  {selectedCity.basic_info?.historical_region || selectedCity.county_ro}
                </span>
                <h3 className="text-base font-black text-white">{cityName}</h3>
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
                  <h3 className="text-lg font-black text-rose-400">🏛️ التطور التاريخي لمدينة {cityName}</h3>
                  <p className="text-xs text-slate-300 font-semibold leading-relaxed">
                    {appLang === 'ar' ? selectedCity.history?.summary_ar || selectedCity.history_summary_ar : selectedCity.history?.summary_ro || selectedCity.history_summary_ro}
                  </p>
                </div>

                {/* Historical Eras Timeline */}
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-black text-amber-400 block">التسلسل الزمني للحقب التاريخية (Historical Eras):</span>
                  {(selectedCity.history?.eras || selectedCity.history_timeline || []).map((t, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-800 border border-slate-700 space-y-1">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-600 text-white">
                        {t.era_name || t.era}
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
                <p className="text-xs text-slate-300 font-semibold leading-relaxed">
                  {appLang === 'ar' ? selectedCity.geography?.location_ar || selectedCity.geography_ar : selectedCity.geography?.location_ro || selectedCity.geography_ro}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-bold pt-2">
                  <div className="p-3 rounded-2xl bg-slate-800 border border-slate-700 space-y-0.5">
                    <span className="text-rose-400 block font-black">الارتفاع عن سطح البحر:</span>
                    <span className="text-white">{selectedCity.basic_info?.elevation || selectedCity.elevation}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-800 border border-slate-700 space-y-0.5">
                    <span className="text-blue-400 block font-black">الأنهار الرئيسية:</span>
                    <span className="text-white">{selectedCity.geography?.rivers || selectedCity.rivers}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-800 border border-slate-700 space-y-0.5">
                    <span className="text-amber-400 block font-black">السلاسل الجبلية:</span>
                    <span className="text-white">{selectedCity.geography?.mountains || selectedCity.mountains}</span>
                  </div>
                </div>
              </div>
            )}

            {activeCardModal === 'landmarks' && (
              <div className="space-y-4">
                <h3 className="text-lg font-black text-emerald-400">🏰 القلاع والمعالم التاريخية</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {(selectedCity.landmarks || selectedCity.places || []).map((p) => (
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
                <h3 className="text-lg font-black text-purple-400">🎨 الثقافة والتراث والعمارة</h3>
                <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 space-y-2 text-xs font-bold">
                  <span className="text-amber-400 block font-black">• التراث والمهرجانات:</span>
                  <p className="text-slate-300">{appLang === 'ar' ? selectedCity.culture?.traditions_ar || selectedCity.culture_ar : selectedCity.culture?.traditions_ro || selectedCity.culture_ro}</p>
                  <span className="text-rose-400 block font-black pt-2">• الأنماط المعمارية:</span>
                  <p className="text-slate-300">{selectedCity.culture?.architecture_ro || 'Gotic, Baroc, Neoclasic, Art Nouveau'}</p>
                </div>
              </div>
            )}

            {activeCardModal === 'facts' && (
              <div className="space-y-4">
                <h3 className="text-lg font-black text-yellow-400">💡 حقائق ممتازة وشخصيات تاريخية</h3>
                
                {/* Famous People */}
                <div className="space-y-2">
                  <span className="text-xs font-black text-amber-400 flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    <span>أبرز الشخصيات المرتبطة بالمدينة:</span>
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {(selectedCity.famous_people || []).map((person, i) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-800 border border-slate-700">
                        <span className="text-white font-black block">{person.name}</span>
                        <span className="text-[10px] text-slate-400 font-bold">{appLang === 'ar' ? person.role_en : person.role_ro}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Interesting Facts */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-black text-amber-400 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-yellow-400" />
                    <span>هل تعلم؟ (Interesting Facts):</span>
                  </span>
                  <div className="space-y-2 text-xs font-bold">
                    {(selectedCity.interesting_facts || []).map((fact, i) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-800 border border-slate-700 flex items-start gap-2 text-slate-200">
                        <span className="text-amber-400 font-black">•</span>
                        <span>{fact}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeCardModal === 'sources' && (
              <div className="space-y-4 font-latin">
                <h3 className="text-lg font-black text-cyan-400">📚 المصادر والمراجع الموثوقة (Data Sources & Attribution)</h3>
                <p className="text-xs text-slate-300 font-semibold leading-relaxed">
                  تم توثيق وتدقيق بيانات ومعالم ورسومات مدينة {cityName} بالاعتماد على موسوعة ويكيبيديا ومستودع ويكيميديا كومنز والبيانات الحكومية المفتوحة.
                </p>

                <div className="space-y-2.5 pt-1">
                  {(selectedCity.sources || []).map((src, i) => (
                    <div key={i} className="p-3.5 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-between gap-3 text-xs">
                      <div className="space-y-0.5">
                        <span className="text-white font-black block">{src.source_name}</span>
                        <span className="text-[10px] text-cyan-400 font-bold">نوع المصدر: {src.source_type}</span>
                      </div>
                      <a 
                        href={src.source_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-[11px] shrink-0 flex items-center gap-1 shadow-md"
                      >
                        <span>فتح المصدر</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
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
