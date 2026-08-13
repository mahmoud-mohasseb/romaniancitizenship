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
  Video, 
  CheckCircle, 
  XCircle, 
  Volume2, 
  BookOpen, 
  HelpCircle,
  ListVideo,
  Play
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
  
  // Track active channel & playing mode (playlist vs single video)
  const [activeChannel, setActiveChannel] = useState(youtubeData[0]);
  const [selectedVideo, setSelectedVideo] = useState(youtubeData[0].videos[0]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  // Quiz State
  const [userQuizAnswer, setUserQuizAnswer] = useState(null);
  const [quizScore, setQuizScore] = useState(0);

  const categories = [
    { id: 'all', label_ar: 'جميع القنوات وقوائم التشغيل (All Playlists & Videos)', label_en: 'All Playlists & Videos', label_ro: 'Toate Playlist-urile & Videoclipurile' },
    { id: 'language_courses', label_ar: '🗣️ دورات لغة رومانية (Courses)', label_en: '🗣️ Language Courses', label_ro: '🗣️ Cursuri de Limbă' },
    { id: 'citizenship_prep', label_ar: '🏛️ تحضير مقابلة الجنسية (ANC)', label_en: '🏛️ Citizenship Prep', label_ro: '🏛️ Interviu Cetățenie' },
    { id: 'culture_history', label_ar: '🇷🇴 ثقافة وتاريخ (Culture)', label_en: '🇷🇴 Culture & History', label_ro: '🇷🇴 Cultură & Istorie' },
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

  const playSoundEffect = (type) => {
    if (typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'correct') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.setValueAtTime(110, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      }
    } catch (e) {}
  };

  const handleVideoSelect = (channel, video) => {
    setActiveChannel(channel);
    setSelectedVideo(video);
    setSelectedPlaylist(null);
    setUserQuizAnswer(null);
  };

  const handlePlaylistSelect = (channel, playlist) => {
    setActiveChannel(channel);
    setSelectedPlaylist(playlist);
    // Default to first video of channel for transcript quiz
    setSelectedVideo(channel.videos[0]);
    setUserQuizAnswer(null);
  };

  const handleQuizAnswer = (option) => {
    if (userQuizAnswer) return;
    setUserQuizAnswer(option);
    if (option === selectedVideo.quiz.answer) {
      playSoundEffect('correct');
      setQuizScore(prev => prev + 1);
    } else {
      playSoundEffect('wrong');
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-theme-main text-theme-main flex flex-col">
      <Navbar />

      <main className={`flex-1 w-full max-w-4xl mx-auto px-4 py-6 space-y-6 ${
        isRtl ? 'lg:mr-72' : 'lg:ml-72'
      } ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
        {/* Header Title Banner */}
        <div className={`rounded-2xl p-6 border shadow-xl space-y-3 text-center ${isDark ? 'bg-slate-800/90 border-slate-700/80' : 'bg-white border-slate-200'}`}>
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
            📺 {strings.youtubeTitle} & Playlists
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            {strings.youtubeTitle}
          </h1>
          <p className="text-xs sm:text-sm text-theme-sub max-w-xl mx-auto leading-relaxed">
            شاهد مقاطع الفيديو وقوائم التشغيل الرسمية المباشرة (Playlists) للقنوات التعليمية الممتازة واختبر فهمك مع أسئلة الفيديو التفاعلية!
          </p>
        </div>

        {/* ACTIVE MEDIA EMBEDDED PLAYER (PLAYLIST OR SINGLE VIDEO) */}
        {activeChannel && (
          <div className={`rounded-2xl border shadow-2xl overflow-hidden space-y-4 ${
            isDark ? 'bg-slate-900 border-rose-500/50' : 'bg-white border-rose-200 shadow-xl'
          }`}>
            {/* Embedded YouTube Player */}
            <div className="relative w-full aspect-video bg-black border-b border-slate-700/60">
              {selectedPlaylist ? (
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/videoseries?list=${selectedPlaylist.playlist_id}&autoplay=1`}
                  title={selectedPlaylist.title_ro}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : selectedVideo ? (
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${selectedVideo.video_id}?autoplay=1&rel=0`}
                  title={selectedVideo.title_ro}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : null}
            </div>

            {/* Video / Playlist Meta Header */}
            <div className="p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700/60 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider flex items-center space-x-1 space-x-reverse">
                    <Tv className="w-3.5 h-3.5" />
                    <span>{activeChannel.channel_name} ({activeChannel.subscribers})</span>
                  </span>
                  <h2 className="text-lg font-black text-theme-main mt-0.5">
                    {selectedPlaylist ? selectedPlaylist.title_ro : selectedVideo ? selectedVideo.title_ro : ''}
                  </h2>
                  <p className="text-xs text-rose-400 font-bold">
                    🇸🇦 {selectedPlaylist ? selectedPlaylist.title_ar : selectedVideo ? selectedVideo.title_ar : ''}
                  </p>
                </div>

                <div className="flex items-center space-x-2 space-x-reverse">
                  {activeChannel.playlists_url && (
                    <a
                      href={activeChannel.playlists_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs flex items-center space-x-1 space-x-reverse shadow transition-colors"
                    >
                      <ListVideo className="w-4 h-4" />
                      <span>قوائم التشغيل 📺</span>
                    </a>
                  )}

                  <a
                    href={activeChannel.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs flex items-center space-x-1 space-x-reverse shadow transition-colors"
                  >
                    <span>زيارة القناة</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Transcript & Translation Box */}
              {selectedVideo && (
                <div className={`rounded-xl p-4 border space-y-2 text-xs ${
                  isDark ? 'bg-slate-800/90 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}>
                  <div className="flex items-center space-x-1.5 space-x-reverse text-rose-500 font-bold">
                    <BookOpen className="w-4 h-4" />
                    <span>نص الدرس والترجمة (Video Transcript & Translation):</span>
                  </div>

                  <p className="text-base font-bold text-emerald-400 leading-relaxed">
                    "{selectedVideo.transcript_ro}"
                  </p>
                  <p className="text-xs font-bold text-rose-400 text-right">
                    🇸🇦 {selectedVideo.transcript_ar}
                  </p>
                  <p className="text-xs text-slate-400">
                    🇬🇧 {selectedVideo.transcript_en}
                  </p>
                </div>
              )}

              {/* VIDEO TRANSCRIPT QUIZ CARD */}
              {selectedVideo && selectedVideo.quiz && (
                <div className={`rounded-xl p-4 border-2 space-y-3 ${
                  isDark ? 'bg-slate-800/90 border-amber-500/50' : 'bg-amber-50/50 border-amber-300'
                }`}>
                  <div className="flex items-center justify-between border-b border-amber-500/30 pb-2">
                    <span className="text-xs font-black text-amber-500 flex items-center space-x-1.5 space-x-reverse">
                      <HelpCircle className="w-4 h-4" />
                      <span>اختبار فهم الدرس للفيديو (Video Transcript Quiz 🎮)</span>
                    </span>

                    <span className="text-xs font-bold text-emerald-400">
                      Score: {quizScore} 🏆
                    </span>
                  </div>

                  <p className="text-sm font-bold leading-relaxed text-theme-main">
                    🇸🇦 {selectedVideo.quiz.question_ar}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedVideo.quiz.options.map((option, idx) => {
                      let btnStyle = isDark 
                        ? 'bg-slate-900 border-slate-700 text-slate-200 hover:border-amber-400' 
                        : 'bg-white border-slate-200 text-slate-900 hover:border-amber-400 shadow-sm';

                      if (userQuizAnswer) {
                        if (option === selectedVideo.quiz.answer) {
                          btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-black';
                        } else if (option === userQuizAnswer) {
                          btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-400 font-black';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => handleQuizAnswer(option)}
                          disabled={userQuizAnswer !== null}
                          className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-between text-right ${btnStyle}`}
                        >
                          <span>{option}</span>
                          {userQuizAnswer && option === selectedVideo.quiz.answer && (
                            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                          )}
                          {userQuizAnswer === option && option !== selectedVideo.quiz.answer && (
                            <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Search & Category Filter Section */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-5 h-5 absolute right-3.5 top-3 text-slate-500 rtl:right-3.5 rtl:left-auto ltr:left-3.5 ltr:right-auto" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={appLang === 'ar' ? 'ابحث في قنوات اليوتيوب وقوائم التشغيل...' : 'Search youtube channels & playlists...'}
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

        {/* CHANNELS, PLAYLISTS & VIDEOS DIRECTORY */}
        <div className="space-y-6">
          {filteredChannels.map((channel) => (
            <div 
              key={channel.id}
              className={`rounded-2xl border shadow-xl overflow-hidden space-y-4 ${
                isDark ? 'bg-slate-800/90 border-slate-700/80' : 'bg-white border-slate-200'
              }`}
            >
              {/* Channel Header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-700/60 bg-slate-900/90 text-white">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white shrink-0">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white leading-tight">
                      {channel.channel_name}
                    </h3>
                    <span className="text-[10px] text-amber-400 font-bold flex items-center space-x-1 space-x-reverse">
                      <Users className="w-3 h-3" />
                      <span>{channel.subscribers} Subscribers</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 space-x-reverse">
                  {channel.playlists_url && (
                    <a
                      href={channel.playlists_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-1.5 px-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs flex items-center space-x-1 space-x-reverse shadow transition-colors"
                    >
                      <ListVideo className="w-3.5 h-3.5" />
                      <span>Playlists 📺</span>
                    </a>
                  )}

                  <a
                    href={channel.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-1.5 px-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs flex items-center space-x-1 space-x-reverse shadow transition-colors"
                  >
                    <span>Channel Link</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Channel Description */}
              <div className="px-5 space-y-1 text-xs">
                <p className="text-rose-500 font-bold text-right leading-relaxed">
                  🇸🇦 {channel.description_ar}
                </p>
                <p className="text-emerald-500 font-medium leading-relaxed">
                  🇬🇧 {channel.description_en}
                </p>
              </div>

              {/* Playlists Selector Section */}
              {channel.playlists && channel.playlists.length > 0 && (
                <div className="px-5 space-y-2">
                  <p className="text-xs font-black text-amber-400 flex items-center space-x-1.5 space-x-reverse">
                    <ListVideo className="w-4 h-4" />
                    <span>قوائم التشغيل المتاحة لـ ({channel.channel_name}):</span>
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {channel.playlists.map((pl) => {
                      const isPlSelected = selectedPlaylist && selectedPlaylist.id === pl.id;
                      return (
                        <button
                          key={pl.id}
                          onClick={() => handlePlaylistSelect(channel, pl)}
                          className={`p-3 rounded-xl border text-right transition-all flex items-center justify-between ${
                            isPlSelected 
                              ? 'bg-amber-600 text-white border-amber-600 shadow' 
                              : isDark ? 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800' : 'bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200'
                          }`}
                        >
                          <div className="flex items-center space-x-2 space-x-reverse truncate">
                            <ListVideo className="w-4 h-4 text-amber-300 shrink-0" />
                            <span className="text-xs font-bold truncate">{pl.title_ar}</span>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/30 text-white shrink-0">تشغيل 📺</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Channel Specific Video Lessons */}
              <div className="px-5 pb-5 space-y-2">
                <p className="text-xs font-black text-theme-main block">
                  🎬 دروس ومقاطع الفيديو من قناة ({channel.channel_name}):
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {channel.videos.map((vid) => {
                    const isSelected = selectedVideo && selectedVideo.id === vid.id && !selectedPlaylist;
                    return (
                      <button
                        key={vid.id}
                        onClick={() => handleVideoSelect(channel, vid)}
                        className={`p-3.5 rounded-2xl border text-right transition-all flex items-center justify-between space-x-2 space-x-reverse ${
                          isSelected 
                            ? 'bg-rose-600 text-white border-rose-600 shadow-lg shadow-rose-600/30' 
                            : isDark ? 'bg-slate-900/90 border-slate-700 text-slate-200 hover:bg-slate-800' : 'bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5 space-x-reverse overflow-hidden">
                          <div className={`p-2 rounded-xl shrink-0 ${isSelected ? 'bg-white/20 text-white' : 'bg-red-600 text-white'}`}>
                            <PlayCircle className="w-4 h-4" />
                          </div>
                          <div className="truncate">
                            <p className="text-xs font-bold truncate leading-tight">{vid.title_ro}</p>
                            <p className={`text-[10px] truncate ${isSelected ? 'text-rose-100' : 'text-slate-400'}`}>🇸🇦 {vid.title_ar}</p>
                          </div>
                        </div>

                        {isSelected && <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-white text-rose-600 shrink-0">يعمل ⚡</span>}
                      </button>
                    );
                  })}
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
