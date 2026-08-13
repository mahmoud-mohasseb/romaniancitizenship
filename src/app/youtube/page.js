'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { 
  Tv, 
  ExternalLink, 
  Search, 
  Users, 
  PlayCircle, 
  Sparkles, 
  Video 
} from 'lucide-react';
import youtubeData from '../../data/youtube_channels.json';
import Navbar from '../../components/Navbar';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

function YoutubeContent() {
  const { theme } = useTheme();
  const { appLang, strings, isRtl } = useLanguage();
  const isDark = theme === 'dark';

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label_ar: 'جميع القنوات والمقاطع', label_en: 'All Channels & Videos', label_ro: 'Toate Canalele & Videoclipurile' },
    { id: 'citizenship_prep', label_ar: '🏛️ مقابلة الجنسية (ANC)', label_en: '🏛️ Citizenship Prep', label_ro: '🏛️ Interviu Cetățenie' },
    { id: 'language_courses', label_ar: '🗣️ دورات تعليم اللغة الرومانية', label_en: '🗣️ Language Courses', label_ro: '🗣️ Cursuri de Limbă' },
    { id: 'culture_history', label_ar: '🇷🇴 التاريخ والثقافة الرومانية', label_en: '🇷🇴 Culture & History', label_ro: '🇷🇴 Cultură & Istorie' },
    { id: 'news_listening', label_ar: '📻 الأخبار والاستماع المكثف', label_en: '📻 News & Listening', label_ro: '📻 Știri & Ascultare' },
  ];

  const filteredChannels = youtubeData.filter((channel) => {
    const matchesCategory = activeCategory === 'all' || channel.category === activeCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      channel.channel_name.toLowerCase().includes(q) ||
      (channel.description_ar && channel.description_ar.includes(q)) ||
      (channel.description_en && channel.description_en.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen pb-20 bg-theme-main text-theme-main flex flex-col">
      <Navbar />

      <main className={`flex-1 w-full max-w-4xl mx-auto px-4 py-6 space-y-6 ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
        {/* Header Title Banner */}
        <div className={`rounded-2xl p-6 border shadow-xl space-y-3 text-center ${isDark ? 'bg-slate-800/90 border-slate-700/80' : 'bg-white border-slate-200'}`}>
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
            📺 {strings.youtubeTitle}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            {strings.youtubeTitle}
          </h1>
          <p className="text-xs sm:text-sm text-theme-sub max-w-xl mx-auto leading-relaxed">
            {strings.youtubeSubtitle}
          </p>
        </div>

        {/* Search & Category Filter Section */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-5 h-5 absolute right-3.5 top-3 text-slate-500 rtl:right-3.5 rtl:left-auto ltr:left-3.5 ltr:right-auto" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={appLang === 'ar' ? 'ابحث في قنوات اليوتيوب والمقاطع...' : 'Search youtube channels & videos...'}
              className={`w-full border rounded-2xl py-3 px-11 text-xs sm:text-sm focus:outline-none focus:border-rose-500 ${
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
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30' 
                      : isDark ? 'bg-slate-800/80 text-slate-400 border border-slate-700/60 hover:text-white' : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900 shadow-sm'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Youtube Channels & Embedded Video Players Grid */}
        <div className="space-y-6">
          {filteredChannels.map((item) => (
            <div 
              key={item.id}
              className={`rounded-2xl border shadow-xl overflow-hidden space-y-4 ${
                isDark ? 'bg-slate-800/90 border-slate-700/80' : 'bg-white border-slate-200'
              }`}
            >
              {/* Channel Header Banner */}
              <div className="flex items-center justify-between p-4 border-b border-slate-700/60 bg-slate-900/90 text-white">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white shrink-0">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white leading-tight">
                      {item.channel_name}
                    </h3>
                    <span className="text-[10px] text-amber-400 font-bold flex items-center space-x-1 space-x-reverse">
                      <Users className="w-3 h-3" />
                      <span>{item.subscribers} Subscribers</span>
                    </span>
                  </div>
                </div>

                <a
                  href={item.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-1.5 px-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs flex items-center space-x-1 space-x-reverse shadow transition-colors"
                >
                  <span>شاهد على يوتيوب</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Embedded YouTube Player */}
              <div className="relative w-full aspect-video bg-black border-b border-slate-700/60">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${item.featured_video_id}?autoplay=0&rel=0`}
                  title={item.channel_name}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Channel Descriptions & Tags */}
              <div className="p-4 space-y-3">
                <div className="space-y-1 text-xs">
                  <p className="text-rose-500 font-bold text-right leading-relaxed">
                    🇸🇦 {item.description_ar}
                  </p>
                  <p className="text-emerald-500 font-medium leading-relaxed">
                    🇬🇧 {item.description_en}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.tags.map((tag, idx) => (
                    <span 
                      key={idx}
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border ${
                        isDark ? 'bg-slate-900 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default function YoutubePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading YouTube Page...</div>}>
      <YoutubeContent />
    </Suspense>
  );
}
