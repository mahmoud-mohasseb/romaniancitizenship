'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, Square, Zap } from 'lucide-react';
import { speakText, stopSpeech } from '../utils/speechHelper';
import { useTheme } from '../context/ThemeContext';

export default function AudioPlayerButton({ text, lang = 'ro', label = 'استمع', className = '' }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1.0); // 0.75, 1.0, 1.25

  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  const handleTogglePlay = () => {
    if (isPlaying) {
      stopSpeech();
      setIsPlaying(false);
    } else {
      speakText(
        text, 
        lang, 
        speed, 
        () => setIsPlaying(true), 
        () => setIsPlaying(false)
      );
    }
  };

  const cycleSpeed = (e) => {
    e.stopPropagation();
    const speeds = [0.75, 1.0, 1.25];
    const nextIdx = (speeds.indexOf(speed) + 1) % speeds.length;
    const newSpeed = speeds[nextIdx];
    setSpeed(newSpeed);

    if (isPlaying) {
      speakText(
        text, 
        lang, 
        newSpeed, 
        () => setIsPlaying(true), 
        () => setIsPlaying(false)
      );
    }
  };

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      {/* Main Audio Toggle Button */}
      <button
        type="button"
        onClick={handleTogglePlay}
        className={`px-3 py-2 rounded-xl border font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all ${
          isPlaying
            ? 'bg-rose-600 text-white border-rose-600 shadow-rose-600/30 animate-pulse'
            : isDark 
            ? 'bg-slate-800 border-slate-700/80 text-rose-400 hover:bg-slate-700 hover:border-rose-500/50' 
            : 'bg-white border-slate-200 text-rose-600 hover:bg-slate-100'
        }`}
        title="استمع للنطق الصوتي النقي"
      >
        {isPlaying ? (
          <Square className="w-4 h-4 text-white shrink-0 animate-spin-slow" />
        ) : (
          <Volume2 className="w-4 h-4 text-rose-500 shrink-0" />
        )}
        <span>{isPlaying ? 'جاري الاستماع...' : label}</span>

        {/* Playing Sound Wave Indicator */}
        {isPlaying && (
          <span className="flex items-center gap-0.5 ml-1">
            <span className="w-1 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1 h-4 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </span>
        )}
      </button>

      {/* Speed Selector Toggle Pill */}
      <button
        type="button"
        onClick={cycleSpeed}
        className={`px-2 py-1.5 rounded-lg border text-[10px] font-black transition-all ${
          speed === 0.75 
            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
            : speed === 1.25
            ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
            : isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
        }`}
        title="تغيير سرعة النطق (0.75x للمبتدئين، 1.0x طبيعي، 1.25x سريع)"
      >
        <span>{speed}x</span>
      </button>
    </div>
  );
}
