'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Repeat, 
  Shuffle, 
  Mic, 
  FileText, 
  Search, 
  Copy, 
  Check, 
  Sparkles, 
  Music, 
  Radio, 
  Disc, 
  ArrowLeft, 
  ListMusic, 
  Clock, 
  Download,
  List
} from 'lucide-react';
import recordsData from '../../data/audio_records_transcripts.json';
import Navbar from '../../components/Navbar';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

// Word-by-Word Active Highlighting Engine for Spotify Lyrics
function WordByWordText({ text, lineTime, nextLineTime, currentTime, isActive, activeColorClass = 'bg-[#1DB954] text-black px-2 py-0.5 rounded-xl shadow-[0_0_25px_#1DB954] scale-110 font-black' }) {
  const words = text.split(' ');
  
  if (!isActive) {
    return <span>{text}</span>;
  }

  // Calculate active word index within current line duration
  const lineDuration = Math.max((nextLineTime || (lineTime + 10)) - lineTime, 2);
  const elapsedInLine = Math.max(currentTime - lineTime, 0);
  const progressRatio = Math.min(elapsedInLine / lineDuration, 0.99);
  const activeWordIdx = Math.floor(progressRatio * words.length);

  return (
    <span className="inline-flex flex-wrap gap-1.5 justify-center items-center">
      {words.map((word, wIdx) => {
        const isWordActive = wIdx === activeWordIdx;

        return (
          <span
            key={wIdx}
            className={`transition-all duration-200 inline-block font-latin ${
              isWordActive
                ? activeColorClass
                : wIdx < activeWordIdx 
                ? 'text-[#1DB954] font-bold' 
                : 'text-slate-300 font-semibold'
            }`}
          >
            {word}
          </span>
        );
      })}
    </span>
  );
}

function RecordsContent() {
  const { theme } = useTheme();
  const { appLang, isRtl } = useLanguage();

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [copiedLineIdx, setCopiedLineIdx] = useState(null);

  // Mode: 'spotify_lyrics' (Default Spotify Lyrics View) vs 'split' (Tracklist View)
  const [viewMode, setViewMode] = useState('spotify_lyrics');

  const audioRef = useRef(null);
  const activeLineRef = useRef(null);
  const lyricsContainerRef = useRef(null);

  const currentTrack = recordsData[currentTrackIndex] || recordsData[0];

  // Handle Audio Playback events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration || 0);
    const handleEnded = () => {
      if (isLooping) {
        audio.currentTime = 0;
        audio.play();
      } else {
        handleNextTrack();
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrackIndex, isLooping]);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.error('Audio Play Error:', err);
      });
    }
  };

  const handleSelectTrack = (index) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }, 100);
  };

  const handleNextTrack = () => {
    if (isShuffled) {
      const randomIdx = Math.floor(Math.random() * recordsData.length);
      handleSelectTrack(randomIdx);
    } else {
      const nextIdx = (currentTrackIndex + 1) % recordsData.length;
      handleSelectTrack(nextIdx);
    }
  };

  const handlePrevTrack = () => {
    const prevIdx = (currentTrackIndex - 1 + recordsData.length) % recordsData.length;
    handleSelectTrack(prevIdx);
  };

  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value);
    setCurrentTime(seekTime);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
    }
  };

  const jumpToTimestamp = (sec) => {
    if (audioRef.current) {
      audioRef.current.currentTime = sec;
      setCurrentTime(sec);
      if (!isPlaying) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }
  };

  const formatTime = (secs) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Find active line in transcript based on audio currentTime
  const activeLineIndex = currentTrack.transcript.reduce((accIndex, item, idx) => {
    if (currentTime >= item.time) return idx;
    return accIndex;
  }, 0);

  const activeLine = currentTrack.transcript[activeLineIndex] || currentTrack.transcript[0];
  const nextLine = currentTrack.transcript[activeLineIndex + 1];

  // Auto scroll active transcript line into center view (Spotify Style)
  useEffect(() => {
    if (activeLineRef.current && isPlaying) {
      activeLineRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activeLineIndex, isPlaying]);

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedLineIdx(idx);
    setTimeout(() => setCopiedLineIdx(null), 2000);
  };

  const categories = [
    { id: 'all', label_ar: 'جميع التسجيلات 🎙️', label_en: 'All Records 🎙️' },
    { id: 'Interviu ANC', label_ar: 'المقابلة الرسمية 🏛️', label_en: 'ANC Interview 🏛️' },
    { id: 'Jurământ ANC', label_ar: 'قسم اليمين 📜', label_en: 'Oath Recitation 📜' },
    { id: 'Istorie & Geografie', label_ar: 'التاريخ والجغرافيا 🗺️', label_en: 'History & Geo 🗺️' },
    { id: 'Constituție', label_ar: 'الدستور والقوانين ⚖️', label_en: 'Constitution ⚖️' },
    { id: 'Dialoguri Practice', label_ar: 'حوارات سريعة 🗣️', label_en: 'Dialogues 🗣️' },
  ];

  const filteredTracks = recordsData.filter((track) => {
    const matchesCat = activeCategory === 'all' || track.category === activeCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      track.title_ro.toLowerCase().includes(q) || 
      track.title_ar.includes(q) || 
      track.title_en.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen pb-36 sm:pb-32 bg-[#121212] text-white flex flex-col font-latin selection:bg-[#1DB954] selection:text-black">
      <Navbar />

      {/* Hidden HTML5 Audio Element */}
      <audio
        ref={audioRef}
        src={currentTrack.src}
        preload="auto"
      />

      <main className={`flex-1 w-full max-w-5xl mx-auto px-4 py-6 space-y-5 animate-fade-in ${
        isRtl ? 'lg:mr-72' : 'lg:ml-72'
      } ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>

        {/* Back Navigation & View Switcher */}
        <div className="flex items-center justify-between gap-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-black text-[#1DB954] hover:underline transition-all"
          >
            <ArrowLeft className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
            <span>{appLang === 'ar' ? 'العودة للصفحة الرئيسية 🏠' : 'Back to Home'}</span>
          </Link>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1.5 bg-[#181818] p-1 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => setViewMode('spotify_lyrics')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                viewMode === 'spotify_lyrics'
                  ? 'bg-[#1DB954] text-black shadow-lg shadow-[#1DB954]/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>{appLang === 'ar' ? 'نمط كلمات Spotify 🎤' : 'Spotify Lyrics 🎤'}</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('split')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                viewMode === 'split'
                  ? 'bg-[#1DB954] text-black shadow-lg shadow-[#1DB954]/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>{appLang === 'ar' ? 'قائمة التسجيلات 📋' : 'Tracklist View 📋'}</span>
            </button>
          </div>
        </div>

        {/* SPOTIFY HERO DISPLAY CARD */}
        <div className="relative rounded-3xl p-6 sm:p-7 overflow-hidden bg-gradient-to-r from-[#1DB954]/30 via-slate-900 to-black border border-[#1DB954]/30 shadow-2xl space-y-5">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Spotify Album Art Cover */}
            <div className={`w-32 h-32 sm:w-40 sm:h-40 rounded-2xl bg-gradient-to-br ${currentTrack.cover_color} shadow-2xl flex flex-col items-center justify-center border border-white/20 shrink-0 relative group`}>
              <Disc className={`w-14 h-14 text-white/90 ${isPlaying ? 'animate-spin-slow' : ''}`} />
              <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-black bg-black/60 text-white backdrop-blur-sm border border-white/10">
                {currentTrack.format}
              </span>
            </div>

            {/* Track Info */}
            <div className="space-y-2 text-center md:text-right flex-1">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-black bg-[#1DB954] text-slate-950">
                {currentTrack.category} • Track #{currentTrackIndex + 1} of {recordsData.length}
              </span>

              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black leading-tight text-white font-latin">
                🇹🇩 {currentTrack.title_ro}
              </h1>
              <p className="text-sm sm:text-base font-bold text-amber-400">
                🇸🇦 {currentTrack.title_ar}
              </p>
              <p className="text-xs text-slate-400 font-bold">
                🇬🇧 {currentTrack.title_en}
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="px-6 py-3 bg-[#1DB954] hover:bg-[#1ed760] text-black font-black rounded-full text-xs sm:text-sm shadow-xl shadow-[#1DB954]/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                  <span>{isPlaying ? (appLang === 'ar' ? 'إيقاف مؤقت ⏸️' : 'Pause ⏸️') : (appLang === 'ar' ? 'تشغيل التسجيل 🟢' : 'Play Record 🟢')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CATEGORY TABS & SEARCH */}
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-2 rounded-full text-xs font-black transition-all border ${
                  activeCategory === cat.id
                    ? 'bg-[#1DB954] text-black border-[#1DB954] shadow-lg shadow-[#1DB954]/20 scale-105'
                    : 'bg-[#181818] text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                {appLang === 'ar' ? cat.label_ar : cat.label_en}
              </button>
            ))}
          </div>

          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={appLang === 'ar' ? 'ابحث في التسجيلات والتفريغ الصوتي...' : 'Search recordings and transcripts...'}
              className="w-full bg-[#181818] border border-slate-800 rounded-2xl px-4 py-3 text-xs sm:text-sm pl-10 focus:outline-none focus:border-[#1DB954] text-white placeholder-slate-500 font-bold"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
          </div>
        </div>

        {/* PROMINENT AI TRANSCRIPTION DISPLAY BOX - SHOWN WHILE PLAYING */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1DB954]/25 via-slate-900 to-black border-2 border-[#1DB954] text-white shadow-2xl space-y-3 text-center">
          <div className="flex items-center justify-center gap-2 border-b border-[#1DB954]/30 pb-2">
            <Sparkles className="w-5 h-5 text-[#1DB954] animate-spin-slow" />
            <span className="font-black text-xs sm:text-sm text-[#1DB954] uppercase tracking-wider">
              نتائج التفريغ الصوتي المباشر بالذكاء الاصطناعي (Whisper / Moonshine AI):
            </span>
          </div>

          {/* Active Word-by-Word Spoken Text */}
          <div className="text-xl sm:text-2xl md:text-3xl font-black font-latin text-white leading-relaxed tracking-wide py-2">
            <span className="text-[#1DB954] mr-2">🇹🇩</span>
            <WordByWordText
              text={activeLine ? activeLine.ro : ''}
              lineTime={activeLine ? activeLine.time : 0}
              nextLineTime={nextLine ? nextLine.time : (activeLine ? activeLine.time + 10 : 10)}
              currentTime={currentTime}
              isActive={isPlaying}
            />
          </div>

          {/* Arabic & English Subtitle Pair */}
          {activeLine && (
            <div className="space-y-1 pt-1 border-t border-slate-800/80">
              <p className="text-sm sm:text-base font-bold text-amber-300">
                🇸🇦 {activeLine.ar}
              </p>
              <p className="text-xs font-bold text-slate-400">
                🇬🇧 {activeLine.en}
              </p>
            </div>
          )}
        </div>

        {/* 1:1 SPOTIFY KARAOKE LYRICS FULL VIEW */}
        {viewMode === 'spotify_lyrics' ? (
          <div className="relative rounded-3xl p-6 sm:p-8 overflow-hidden bg-gradient-to-b from-[#1DB954]/15 via-[#121212] to-black border border-[#1DB954]/30 shadow-2xl space-y-4">
            
            {/* Header info bar */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Mic className="w-5 h-5 text-[#1DB954]" />
                <h2 className="text-sm sm:text-base font-black text-[#1DB954]">
                  {appLang === 'ar' ? 'كلمات وتفريغ التسجيل التزامني (Spotify Lyrics)' : 'Synchronized Record Lyrics'}
                </h2>
              </div>

              <span className="text-xs font-bold text-slate-400">
                ⏱️ {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* Karaoke Lyrics Scrolling Box */}
            <div 
              ref={lyricsContainerRef}
              className="space-y-6 max-h-[500px] overflow-y-auto px-2 py-6 custom-scrollbar text-center flex flex-col items-center"
            >
              {currentTrack.transcript.map((line, idx) => {
                const isActive = idx === activeLineIndex;

                let lineStyle = 'opacity-40 text-slate-400 scale-95 hover:opacity-80';
                if (isActive) {
                  lineStyle = 'opacity-100 text-white scale-105 my-4 drop-shadow-[0_0_30px_rgba(29,185,84,0.8)]';
                }

                return (
                  <div
                    key={idx}
                    ref={isActive ? activeLineRef : null}
                    onClick={() => jumpToTimestamp(line.time)}
                    className={`transition-all duration-500 cursor-pointer space-y-2 max-w-2xl px-6 py-4 rounded-3xl ${
                      isActive ? 'bg-[#1DB954]/20 border-2 border-[#1DB954] shadow-2xl' : 'hover:bg-slate-900/40'
                    } ${lineStyle}`}
                  >
                    {/* Timestamp Badge */}
                    <div className="flex items-center justify-center gap-2">
                      <span className={`px-3 py-0.5 rounded-full text-[10px] font-black border ${
                        isActive ? 'bg-[#1DB954] text-black border-[#1DB954]' : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        ⏱️ {formatTime(line.time)}
                      </span>
                    </div>

                    {/* Main Romanian Sentence */}
                    <div className={`font-black leading-relaxed font-latin ${
                      isActive ? 'text-lg sm:text-xl md:text-2xl text-white tracking-wide' : 'text-base text-slate-300'
                    }`}>
                      🇹🇩 {line.ro}
                    </div>

                    {/* Arabic Translation */}
                    <p className={`font-bold leading-snug ${
                      isActive ? 'text-sm sm:text-base text-amber-300' : 'text-xs text-amber-400/70'
                    }`}>
                      🇸🇦 {line.ar}
                    </p>

                    {/* English Translation */}
                    <p className="text-xs font-bold text-slate-400 leading-snug">
                      🇬🇧 {line.en}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* SPLIT MAIN DISPLAY GRID: TRACK LIST (LEFT) + SYNCHRONIZED TRANSCRIPT (RIGHT) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* SPOTIFY TRACK LIST (5 Cols) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-sm font-black text-slate-300 flex items-center gap-2">
                  <ListMusic className="w-4 h-4 text-[#1DB954]" />
                  <span>قائمة التسجيلات الصوتية ({filteredTracks.length})</span>
                </h2>
                <span className="text-[11px] text-slate-500 font-bold">.mpeg / .ogg</span>
              </div>

              <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
                {filteredTracks.map((track) => {
                  const trackOriginalIndex = recordsData.findIndex(t => t.id === track.id);
                  const isSelected = trackOriginalIndex === currentTrackIndex;

                  return (
                    <div
                      key={track.id}
                      onClick={() => handleSelectTrack(trackOriginalIndex)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-[#1DB954]/15 border-[#1DB954] text-white shadow-lg'
                          : 'bg-[#181818] border-slate-800/80 hover:bg-slate-800/60 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${track.cover_color} flex items-center justify-center shrink-0 border border-white/10`}>
                          {isSelected && isPlaying ? (
                            <Volume2 className="w-5 h-5 text-[#1DB954] animate-pulse" />
                          ) : (
                            <Music className="w-5 h-5 text-white/80" />
                          )}
                        </div>

                        <div className="space-y-0.5 truncate">
                          <h3 className={`text-xs font-black truncate font-latin ${isSelected ? 'text-[#1DB954]' : 'text-white'}`}>
                            {track.title_ro}
                          </h3>
                          <p className="text-[11px] font-bold text-amber-400/90 truncate">
                            {track.title_ar}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800">
                          {track.duration}
                        </span>
                        <button
                          type="button"
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                            isSelected ? 'bg-[#1DB954] text-black' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          {isSelected && isPlaying ? (
                            <Pause className="w-4 h-4 fill-current" />
                          ) : (
                            <Play className="w-4 h-4 fill-current ml-0.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SPOTIFY LYRICS & SYNCHRONIZED TRANSCRIPT PANEL (7 Cols) */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#1DB954]" />
                  <h2 className="text-sm font-black text-slate-300">
                    {appLang === 'ar' ? 'التفريغ النصي المباشر للتسجيل (Transcript & Lyrics)' : 'Synchronized Audio Transcript'}
                  </h2>
                </div>
                
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#1DB954]/20 text-[#1DB954] border border-[#1DB954]/30">
                  Whisper.wasm Synced
                </span>
              </div>

              {/* Spotify Lyrics Box */}
              <div className="p-5 sm:p-6 rounded-3xl bg-[#181818] border border-slate-800 shadow-2xl space-y-4 min-h-[500px] flex flex-col justify-between">
                
                {/* Transcript Lines Scroll Area */}
                <div className="space-y-4 max-h-[460px] overflow-y-auto pr-2 custom-scrollbar">
                  {currentTrack.transcript.map((line, idx) => {
                    const isActive = idx === activeLineIndex;

                    return (
                      <div
                        key={idx}
                        ref={isActive ? activeLineRef : null}
                        onClick={() => jumpToTimestamp(line.time)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-1.5 ${
                          isActive
                            ? 'bg-gradient-to-r from-[#1DB954]/25 via-slate-800 to-[#181818] border-[#1DB954] text-white shadow-xl scale-[1.01]'
                            : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/60 text-slate-300 opacity-80 hover:opacity-100'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              jumpToTimestamp(line.time);
                            }}
                            className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black border transition-all flex items-center gap-1 ${
                              isActive ? 'bg-[#1DB954] text-black border-[#1DB954]' : 'bg-slate-800 text-slate-400 border-slate-700'
                            }`}
                          >
                            <Clock className="w-3 h-3" />
                            <span>{formatTime(line.time)}</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(`${line.ro}\n${line.ar}`, idx);
                            }}
                            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 transition-colors"
                            title="Copy text"
                          >
                            {copiedLineIdx === idx ? <Check className="w-3.5 h-3.5 text-[#1DB954]" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>

                        {/* Romanian Text with Spotify Lyrics Font */}
                        <p className={`text-base sm:text-lg lg:text-xl font-black font-latin leading-relaxed tracking-wide ${
                          isActive ? 'text-[#1DB954]' : 'text-white'
                        }`}>
                          🇹🇩 {line.ro}
                        </p>

                        {/* Arabic Translation */}
                        <p className="text-sm sm:text-base font-bold text-amber-300 leading-snug">
                          🇸🇦 {line.ar}
                        </p>

                        {/* English Translation */}
                        <p className="text-xs sm:text-sm font-bold text-slate-400 leading-snug">
                          🇬🇧 {line.en}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Info Bar */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-bold">
                  <span className="flex items-center gap-1">
                    <Mic className="w-3.5 h-3.5 text-[#1DB954]" />
                    <span>انقر على أي سطر للانتقال المباشر للنقطة الزمنية</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => setViewMode('spotify_lyrics')}
                    className="px-3 py-1 rounded-xl bg-[#1DB954] text-black font-black text-[11px] flex items-center gap-1 hover:bg-[#1ed760] transition-colors shadow-md"
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>عرض الكلمات كاملاً 🎤</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* SPOTIFY STICKY BOTTOM AUDIO PLAYER BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#181818]/95 backdrop-blur-md border-t border-slate-800 px-4 py-3 shadow-2xl">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">

          {/* 1. Track Info (Left) */}
          <div className="flex items-center gap-3 w-full sm:w-1/3 min-w-0">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${currentTrack.cover_color} flex items-center justify-center shrink-0 border border-white/20`}>
              <Disc className={`w-6 h-6 text-white ${isPlaying ? 'animate-spin-slow' : ''}`} />
            </div>

            <div className="space-y-0.5 truncate">
              <h4 className="text-xs sm:text-sm font-black text-white font-latin truncate">
                {currentTrack.title_ro}
              </h4>
              <p className="text-[11px] font-bold text-amber-400 truncate">
                {currentTrack.title_ar}
              </p>
            </div>
          </div>

          {/* 2. Playback Controls & Progress Slider (Center) */}
          <div className="flex flex-col items-center gap-1.5 w-full sm:w-1/3">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setIsShuffled(!isShuffled)}
                className={`p-1.5 rounded-lg transition-colors ${isShuffled ? 'text-[#1DB954]' : 'text-slate-400 hover:text-white'}`}
                title="Shuffle"
              >
                <Shuffle className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handlePrevTrack}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white transition-colors"
                title="Previous"
              >
                <SkipBack className="w-5 h-5 fill-current" />
              </button>

              <button
                type="button"
                onClick={togglePlay}
                className="w-10 h-10 rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-black font-black flex items-center justify-center shadow-lg transition-all transform hover:scale-105 active:scale-95"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </button>

              <button
                type="button"
                onClick={handleNextTrack}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white transition-colors"
                title="Next"
              >
                <SkipForward className="w-5 h-5 fill-current" />
              </button>

              <button
                type="button"
                onClick={() => setIsLooping(!isLooping)}
                className={`p-1.5 rounded-lg transition-colors ${isLooping ? 'text-[#1DB954]' : 'text-slate-400 hover:text-white'}`}
                title="Repeat"
              >
                <Repeat className="w-4 h-4" />
              </button>
            </div>

            {/* Time Seek Slider */}
            <div className="flex items-center gap-2 w-full text-[10px] font-bold text-slate-400">
              <span>{formatTime(currentTime)}</span>
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#1DB954]"
              />
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* 3. Volume & Spotify Lyrics Mode Switcher (Right) */}
          <div className="flex items-center justify-end gap-3 w-full sm:w-1/3">
            <button
              type="button"
              onClick={() => setViewMode(viewMode === 'spotify_lyrics' ? 'split' : 'spotify_lyrics')}
              className={`p-2 rounded-xl border text-xs font-black flex items-center gap-1.5 transition-all ${
                viewMode === 'spotify_lyrics' 
                  ? 'bg-[#1DB954] text-black border-[#1DB954] shadow-md' 
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
              title="Toggle Spotify Lyrics Screen"
            >
              <Mic className="w-4 h-4" />
              <span className="hidden sm:inline">Lyrics 🎤</span>
            </button>

            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-[#1DB954]" />}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                setIsMuted(false);
              }}
              className="w-16 sm:w-20 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#1DB954]"
            />
          </div>

        </div>
      </div>
    </div>
  );
}

export default function RecordsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[#1DB954] font-bold">Loading Spotify Audio Hub...</div>}>
      <RecordsContent />
    </Suspense>
  );
}
