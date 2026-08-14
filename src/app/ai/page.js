'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { 
  Sparkles, 
  Settings, 
  Send, 
  Loader2, 
  Globe, 
  BookOpen, 
  GraduationCap, 
  ExternalLink,
  Cpu,
  Zap,
  CheckCircle2
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { queryWebLlama, initWebLLMEngine } from '../../utils/aiService';

function AIContent() {
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get('q') || '';

  const { theme } = useTheme();
  const { appLang, strings, isRtl } = useLanguage();
  const isDark = theme === 'dark';

  const [inputQuery, setInputQuery] = useState(initialPrompt);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [webLlamaUrl, setWebLlamaUrl] = useState('');
  const [selectedModel, setSelectedModel] = useState('Llama-3.2-1B-Instruct-q4f16_1-MLC');
  const [showConfig, setShowConfig] = useState(false);
  const [isInitializingEngine, setIsInitializingEngine] = useState(false);
  const [engineLoaded, setEngineLoaded] = useState(false);
  const [initProgressText, setInitProgressText] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUrl = localStorage.getItem('webllama_url') || '';
      const savedModel = localStorage.getItem('webllama_model') || 'Llama-3.2-1B-Instruct-q4f16_1-MLC';
      setWebLlamaUrl(savedUrl);
      setSelectedModel(savedModel);
    }

    setMessages([
      {
        id: 1,
        sender: 'ai',
        text: appLang === 'ar' 
          ? 'مرحباً بك! أنا مساعد WebLLM الذكي المخصص لاختبار الجنسية الرومانية 🇷🇴. يعمل المحرك مباشرة داخل المتصفح وجهازك بدون إنترنت بعد التثبيت ⚡ كما يبحث في منهج الـ 469 سؤالاً والإنترنت 🌐!'
          : appLang === 'en'
          ? 'Welcome! I am your WebLLM AI Romanian Citizenship Tutor 🇷🇴. Runs 100% offline inside your browser after app installation ⚡ powered by WebGPU & ANC Curriculum 🌐!'
          : 'Bine ai venit! Sunt asistentul tău WebLLM AI pentru cetățenia română 🇷🇴. Rulează 100% offline direct în browserul tău ⚡!',
        time: 'Just now'
      }
    ]);

    if (initialPrompt) {
      handleSend(initialPrompt);
    }
  }, [appLang]);

  const handleInitWebLLM = async () => {
    setIsInitializingEngine(true);
    setInitProgressText('Loading WebLLM in-browser AI model...');
    const engine = await initWebLLMEngine(selectedModel, (progress) => {
      setInitProgressText(progress.text);
    });
    setIsInitializingEngine(false);
    if (engine) {
      setEngineLoaded(true);
    }
  };

  const saveWebLlamaConfig = (newUrl, newModel) => {
    setWebLlamaUrl(newUrl);
    setSelectedModel(newModel);
    if (typeof window !== 'undefined') {
      localStorage.setItem('webllama_url', newUrl);
      localStorage.setItem('webllama_model', newModel);
    }
  };

  const quickPrompts = appLang === 'ar' ? [
    'ما هو شكل الحكومة في رومانيا؟',
    'تلخيص أهم انجازات ستيفان تشيل ماري',
    'نصائح لاجتياز المقابلة الشفهية مع اللجنة',
    'معلومات عن نهر الدانوب والجغرافيا'
  ] : appLang === 'en' ? [
    'What is the form of government of Romania?',
    'Summarize Stephen the Great accomplishments',
    'Oral citizenship interview tips',
    'Information about the Danube river & geography'
  ] : [
    'Care este forma de guvernământ a României?',
    'Rezumat realizări Ștefan cel Mare',
    'Sfaturi pentru interviul oral de cetățenie',
    'Informații despre fluviul Dunărea'
  ];

  const handleSend = async (textToSend) => {
    const q = textToSend || inputQuery;
    if (!q.trim()) return;

    const userMsg = { 
      id: Date.now(), 
      sender: 'user', 
      text: q, 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };
    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    const result = await queryWebLlama(q, selectedModel, webLlamaUrl, appLang);

    const aiMsg = {
      id: Date.now() + 1,
      sender: 'ai',
      text: result.text,
      source: result.source,
      image: result.image,
      wiki_url: result.wiki_url,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, aiMsg]);
    setLoading(false);
  };

  const getSourceBadge = (source) => {
    switch (source) {
      case 'webllm':
        return (
          <span className="inline-flex items-center space-x-1 space-x-reverse text-emerald-400 font-bold">
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>WebLLM In-Browser WebGPU AI (Offline) ⚡</span>
          </span>
        );
      case 'online_search':
        return (
          <span className="inline-flex items-center space-x-1 space-x-reverse text-blue-400 font-bold">
            <Globe className="w-3.5 h-3.5" />
            <span>بحث حي عبر الإنترنت (Live Wikipedia Search 🌐)</span>
          </span>
        );
      case 'dataset_question':
        return (
          <span className="inline-flex items-center space-x-1 space-x-reverse text-emerald-400 font-bold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>منهج 469 سؤالاً للجنسية ANC</span>
          </span>
        );
      case 'dataset_grammar':
        return (
          <span className="inline-flex items-center space-x-1 space-x-reverse text-amber-400 font-bold">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>دليل قواعد الرومانية 📚</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 space-x-reverse text-rose-400 font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>مساعد WebLLM الذكي المدمج 🤖</span>
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-theme-main text-theme-main flex flex-col font-cairo">
      <Navbar />

      <main className={`flex-1 w-full max-w-4xl mx-auto px-4 py-6 space-y-4 flex flex-col h-[82vh] ${
        isRtl ? 'lg:mr-72' : 'lg:ml-72'
      } ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
        {/* Top Header */}
        <div className={`flex items-center justify-between p-3.5 rounded-2xl border shrink-0 ${isDark ? 'bg-slate-800/80 border-slate-700/60' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="text-center w-full flex items-center justify-between px-2">
            <div className="flex items-center space-x-2 space-x-reverse">
              <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
              <div>
                <h1 className="text-base font-black text-right">
                  {strings.aiCardTitle || (appLang === 'ar' ? 'مساعد WebLLM الذكي للجنسية الرومانية' : 'WebLLM AI Citizenship Tutor')}
                </h1>
                <p className="text-[11px] text-emerald-400 font-bold flex items-center space-x-1 space-x-reverse">
                  <Zap className="w-3 h-3 fill-current" />
                  <span>يعمل 100% داخل المتصفح بدون إنترنت بعد التثبيت ⚡</span>
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 space-x-reverse">
              {!engineLoaded ? (
                <button
                  onClick={handleInitWebLLM}
                  disabled={isInitializingEngine}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-black flex items-center space-x-1 space-x-reverse shadow-md hover:opacity-95 transition-all"
                >
                  {isInitializingEngine ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                  <span>{isInitializingEngine ? 'تحميل المحرك...' : 'تفعيل WebLLM أوفلاين ⚡'}</span>
                </button>
              ) : (
                <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black flex items-center space-x-1 space-x-reverse">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>WebLLM Ready (Offline GPU)</span>
                </span>
              )}

              <button
                onClick={() => setShowConfig(!showConfig)}
                className={`p-2 rounded-xl border text-xs font-bold flex items-center space-x-1 space-x-reverse ${isDark ? 'bg-slate-900 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'}`}
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* In-Browser Progress Alert */}
        {isInitializingEngine && (
          <div className="p-3 rounded-xl bg-slate-900 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center space-x-2 space-x-reverse animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin text-emerald-400 shrink-0" />
            <span className="truncate">{initProgressText || 'Downloading and initializing in-browser WebLLM model...'}</span>
          </div>
        )}

        {/* Optional WebLLM Settings Drawer */}
        {showConfig && (
          <div className={`p-4 rounded-2xl border space-y-3 shrink-0 text-xs ${isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-700 shadow-sm'}`}>
            <p className="font-bold text-emerald-500">⚙️ WebLLM In-Browser & Remote Server Settings:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] text-theme-sub mb-1">WebLLM Model (Wasm / WebGPU):</label>
                <select 
                  value={selectedModel} 
                  onChange={(e) => saveWebLlamaConfig(webLlamaUrl, e.target.value)}
                  className={`w-full border rounded-xl p-2 font-mono ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-100 border-slate-200 text-slate-900'}`}
                >
                  <option value="Llama-3.2-1B-Instruct-q4f16_1-MLC">Llama 3.2 1B Instruct (Fast & Lightweight)</option>
                  <option value="Llama-3.2-3B-Instruct-q4f16_1-MLC">Llama 3.2 3B Instruct (High Accuracy)</option>
                  <option value="SmolLM2-360M-Instruct-q4f16_1-MLC">SmolLM2 360M (Ultra Fast Mobile)</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-theme-sub mb-1">Optional WebLlama Host URL:</label>
                <input 
                  type="text" 
                  value={webLlamaUrl} 
                  onChange={(e) => saveWebLlamaConfig(e.target.value, selectedModel)}
                  className={`w-full border rounded-xl p-2 font-mono ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-100 border-slate-200 text-slate-900'}`}
                  placeholder="Leave empty for Hybrid Offline Engine"
                />
              </div>
            </div>
            <p className="text-[10px] text-slate-400">
              💡 WebLLM runs quantized Llama 3 models directly inside your device browser using WebGPU for total privacy & offline use!
            </p>
          </div>
        )}

        {/* Quick Prompts Strip */}
        <div className="flex items-center space-x-2 space-x-reverse overflow-x-auto pb-1 no-scrollbar shrink-0">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border whitespace-nowrap shrink-0 transition-colors ${
                isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700/80' : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-sm'
              }`}
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat Messages Log */}
        <div className={`flex-1 rounded-2xl border p-4 overflow-y-auto space-y-4 ${isDark ? 'bg-slate-800/60 border-slate-700/60' : 'bg-white border-slate-200 shadow-sm'}`}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[90%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-rose-600 text-white rounded-br-none font-bold'
                    : isDark ? 'bg-slate-900/90 text-slate-100 border border-slate-700/80 rounded-bl-none space-y-2 font-bold' : 'bg-slate-100 text-slate-900 border border-slate-200 rounded-bl-none space-y-2 font-bold'
                }`}
              >
                {msg.sender === 'ai' && (
                  <div className={`text-[10px] mb-1 border-b pb-1 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                    {getSourceBadge(msg.source)}
                  </div>
                )}

                {/* Optional Image thumbnail for live online search or question */}
                {msg.image && (
                  <div className="relative w-full h-44 rounded-xl overflow-hidden my-2 border border-slate-700/60">
                    <Image
                      src={msg.image}
                      alt="AI Search Result Image"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="whitespace-pre-wrap">{msg.text}</div>

                {msg.wiki_url && (
                  <div className="pt-2">
                    <a
                      href={msg.wiki_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 space-x-reverse text-xs text-blue-400 hover:underline font-bold"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>قراءة المقال الكامل على Wikipedia ↗</span>
                    </a>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-theme-sub mt-1 px-1">{msg.time}</span>
            </div>
          ))}

          {loading && (
            <div className={`flex items-center space-x-2 space-x-reverse p-3.5 rounded-2xl border max-w-xs text-xs text-theme-sub ${isDark ? 'bg-slate-900/90 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>
              <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
              <span className="font-bold">جاري المعالجة بواسطة WebLLM والمنهج... ⚡</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className={`flex items-center space-x-2 space-x-reverse p-2 rounded-2xl border shrink-0 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={appLang === 'ar' ? 'اسأل WebLLM الذكي عن أي سؤال في منهج الجنسية أو التاريخ...' : appLang === 'en' ? 'Ask WebLLM AI any question about curriculum...' : 'Întreabă WebLLM AI despre programa de cetățenie...'}
            className={`flex-1 border text-xs sm:text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-rose-500 font-bold ${isDark ? 'bg-slate-900 border-slate-700/80 text-white placeholder-slate-500' : 'bg-slate-100 border-slate-200 text-slate-900 placeholder-slate-400'}`}
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputQuery.trim() || loading}
            className="p-3 bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white font-bold rounded-xl transition-all shadow-md shadow-rose-600/30"
          >
            <Send className="w-5 h-5 rtl:rotate-180" />
          </button>
        </div>
      </main>
    </div>
  );
}

export default function AIPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400 font-bold">Loading WebLLM AI Assistant...</div>}>
      <AIContent />
    </Suspense>
  );
}
