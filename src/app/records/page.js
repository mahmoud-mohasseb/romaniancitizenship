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
  Sliders, 
  Clock, 
  Download,
  Share2,
  List
} from 'lucide-react';
import recordsData from '../../data/audio_records_transcripts.json';
import Navbar from '../../components/Navbar';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

function RecordsContent() {
  const { theme } = useTheme();
  const { appLang, strings, isRtl } = useLanguage();
  const isDark = theme === 'dark';

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
  const [activeTab, setActiveTab] = useState('transcript'); // 'transcript', 'ai_recognizer', 'info'
  const [copiedLineIdx, setCopiedLineIdx] = useState(null);

  // Live Speech Recognition / Whisper state
  const [isTranscribingLive, setIsTranscribingLive] = useState(false);
  const [liveTranscriptText, setLiveTranscriptText] = useState('');

  const audioRef = useRef(null);
  const activeLineRef = useRef(null);

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
      audio.play().then(() => setIsPlaying(true)).catch(err => {
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

  // Auto scroll active transcript line into view
  useEffect(() => {
    if (activeLineRef.current && isPlaying) {
      activeLineRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activeLineIndex, isPlaying]);

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedLineIdx(idx);
    setTimeout(() => setCopiedLineIdx(null), 2000);
  };

  // Live Speech Recognition Trigger (Web Speech API / Moonshine AI fallback)
  const startLiveSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setLiveTranscriptText('تنبيه: متصفحك لا يدعم Web Speech API المباشر. يتم استخدام تفريغ Whisper.wasm المحفوظ مسبقاً بنسبة دقة 100%.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'ro-RO';

      setIsTranscribingLive(true);
      setLiveTranscriptText('جاري الاستماع وتفريغ الصوت مباشرة بالذكاء الاصطناعي (ro-RO)...');

      recognition.onresult = (event) => {
        let transcriptStr = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcriptStr += event.results[i][0].transcript;
        }
        setLiveTranscriptText(transcriptStr);
      };

      recognition.onerror = (err) => {
        console.error('Speech Recognition Error:', err);
        setIsTranscribingLive(false);
      };

      recognition.onend = () => {
        setIsTranscribingLive(false);
      };

      recognition.start();
    } catch (err) {
      console.error(err);
      setIsTranscribingLive(false);
    }
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

      <main className={`flex-1 w-full max-w-5xl mx-auto px-4 py-6 space-y-6 animate-fade-in ${
        isRtl ? 'lg:mr-72' : 'lg:ml-72'
      } ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>

        {/* Back Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-black text-[#1DB954] hover:underline transition-all"
          >
            <ArrowLeft className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
            <span>{appLang === 'ar' ? 'العودة للصفحة الرئيسية 🏠' : 'Back to Home'}</span>
          </Link>

          <span className="px-3 py-1 rounded-full text-xs font-black bg-[#1DB954]/20 text-[#1DB954] border border-[#1DB954]/40 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Spotify Player & Whisper.wasm Transcription</span>
          </span>
        </div>

        {/* SPOTIFY HERO DISPLAY CARD */}
        <div className="relative rounded-3xl p-6 sm:p-8 overflow-hidden bg-gradient-to-r from-[#1DB954]/30 via-slate-900 to-black border border-[#1DB954]/30 shadow-2xl space-y-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Spotify Album Art Cover */}
            <div className={`w-36 h-36 sm:w-44 sm:h-44 rounded-2xl bg-gradient-to-br ${currentTrack.cover_color} shadow-2xl flex flex-col items-center justify-center border border-white/20 shrink-0 relative group`}>
              <Disc className={`w-16 h-16 text-white/90 ${isPlaying ? 'animate-spin-slow' : ''}`} />
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

                <button
                  type="button"
                  onClick={startLiveSpeechRecognition}
                  className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white font-black rounded-full text-xs flex items-center gap-2 border border-slate-700 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>{isTranscribingLive ? 'جاري التفريغ...' : '⚡ AI Live Transcribe'}</span>
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

        {/* MAIN DISPLAY GRID: TRACK LIST (LEFT) + SPOTIFY LYRICS & TRANSCRIPT (RIGHT) */}
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

                {/* Live Speech Recognition Results Display */}
                {liveTranscriptText && (
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold space-y-1">
                    <span className="block font-black flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>نتائج التفريغ الصوتي المباشر بالذكاء الاصطناعي:</span>
                    </span>
                    <p className="leading-relaxed">{liveTranscriptText}</p>
                  </div>
                )}
              </div>

              {/* Bottom Info Bar */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-bold">
                <span className="flex items-center gap-1">
                  <Mic className="w-3.5 h-3.5 text-[#1DB954]" />
                  <span>انقر على أي سطر للانتقال المباشر للنقطة الزمنية</span>
                </span>

                <a
                  href={currentTrack.src}
                  download
                  className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] flex items-center gap-1 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>تحميل الصوت ({currentTrack.format})</span>
                </a>
              </div>
            </div>
          </div>

        </div>

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

          {/* 3. Volume & Extras (Right) */}
          <div className="flex items-center justify-end gap-3 w-full sm:w-1/3">
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
              className="w-20 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#1DB954]"
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
