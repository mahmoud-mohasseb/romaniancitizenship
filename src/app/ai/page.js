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
  ExternalLink 
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { queryOllama } from '../../utils/aiService';

function AIContent() {
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get('q') || '';

  const { theme } = useTheme();
  const { appLang, strings, isRtl } = useLanguage();
  const isDark = theme === 'dark';

  const [inputQuery, setInputQuery] = useState(initialPrompt);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ollamaUrl, setOllamaUrl] = useState('');
  const [ollamaModel, setOllamaModel] = useState('llama3');
  const [showConfig, setShowConfig] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUrl = localStorage.getItem('ollama_url') || '';
      const savedModel = localStorage.getItem('ollama_model') || 'llama3';
      setOllamaUrl(savedUrl);
      setOllamaModel(savedModel);
    }

    setMessages([
      {
        id: 1,
        sender: 'ai',
        text: appLang === 'ar' 
          ? 'مرحباً بك! أنا مساعدك الذكي المخصص لاختبار الجنسية الرومانية 🇷🇴. يبحث محرك الذكاء الاصطناعي في منهج الـ 469 سؤالاً وقواعد اللغة كما يمكنه إجراء بحث حي عبر الإنترنت 🌐 إجابة أي سؤال لديك!'
          : appLang === 'en'
          ? 'Welcome! I am your Romanian Citizenship AI Tutor 🇷🇴. Powered by ANC Curriculum & Live Online Search 🌐 to answer any questions about Romanian history, constitution, or geography!'
          : 'Bine ai venit! Sunt asistentul tău AI pentru cetățenia română 🇷🇴. Caut în programa oficială de 469 întrebări și pot efectua căutări live pe internet 🌐!',
        time: 'Just now'
      }
    ]);

    if (initialPrompt) {
      handleSend(initialPrompt);
    }
  }, [appLang]);

  const saveOllamaConfig = (newUrl, newModel) => {
    setOllamaUrl(newUrl);
    setOllamaModel(newModel);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ollama_url', newUrl);
      localStorage.setItem('ollama_model', newModel);
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

    const result = await queryOllama(q, ollamaModel, ollamaUrl, appLang);

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
      case 'ollama':
        return (
          <span className="inline-flex items-center space-x-1 space-x-reverse text-rose-400 font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ollama Local Model ({ollamaModel})</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 space-x-reverse text-rose-400 font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>مساعد الجنسية الذكي المدمج 🤖</span>
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-theme-main text-theme-main flex flex-col">
      <Navbar />

      <main className={`flex-1 w-full max-w-4xl mx-auto px-4 py-6 space-y-4 flex flex-col h-[82vh] ${
        isRtl ? 'lg:mr-72' : 'lg:ml-72'
      } ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
        {/* Top Header */}
        <div className={`flex items-center justify-between p-3.5 rounded-2xl border shrink-0 ${isDark ? 'bg-slate-800/80 border-slate-700/60' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="text-center w-full flex items-center justify-between px-2">
            <div className="flex items-center space-x-2 space-x-reverse">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <div>
                <h1 className="text-base font-extrabold text-right">
                  {strings.aiCardTitle || (appLang === 'ar' ? 'المساعد الذكي للجنسية الرومانية' : 'AI Citizenship Tutor')}
                </h1>
                <p className="text-[11px] text-emerald-400 font-bold flex items-center space-x-1 space-x-reverse">
                  <Globe className="w-3 h-3" />
                  <span>مدعوم بالبحث الحي على الإنترنت ومنهج 469 سؤالاً 🌐</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowConfig(!showConfig)}
              className={`p-2 rounded-xl border text-xs font-bold flex items-center space-x-1 space-x-reverse ${isDark ? 'bg-slate-900 border-slate-700 text-emerald-400' : 'bg-slate-100 border-slate-200 text-emerald-600'}`}
            >
              <Settings className="w-4 h-4" />
              <span>Ollama Settings</span>
            </button>
          </div>
        </div>

        {/* Optional Ollama Remote Endpoint Settings Drawer */}
        {showConfig && (
          <div className={`p-4 rounded-2xl border space-y-3 shrink-0 text-xs ${isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-700 shadow-sm'}`}>
            <p className="font-bold text-emerald-500">⚙️ Optional Ollama Remote/Local Server Settings:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] text-theme-sub mb-1">Ollama Host URL (e.g., http://192.168.1.10:11434):</label>
                <input 
                  type="text" 
                  value={ollamaUrl} 
                  onChange={(e) => saveOllamaConfig(e.target.value, ollamaModel)}
                  className={`w-full border rounded-xl p-2 font-mono ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-100 border-slate-200 text-slate-900'}`}
                  placeholder="Leave empty for Hybrid Search Engine"
                />
              </div>
              <div>
                <label className="block text-[11px] text-theme-sub mb-1">Model Name:</label>
                <input 
                  type="text" 
                  value={ollamaModel} 
                  onChange={(e) => saveOllamaConfig(ollamaUrl, e.target.value)}
                  className={`w-full border rounded-xl p-2 font-mono ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-100 border-slate-200 text-slate-900'}`}
                  placeholder="llama3 / mistral / qwen"
                />
              </div>
            </div>
            <p className="text-[10px] text-slate-400">
              💡 Hybrid Search mode automatically searches 469 ANC questions, grammar, and performs live Wikipedia searches if Ollama is empty!
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
                    ? 'bg-rose-600 text-white rounded-br-none'
                    : isDark ? 'bg-slate-900/90 text-slate-100 border border-slate-700/80 rounded-bl-none space-y-2' : 'bg-slate-100 text-slate-900 border border-slate-200 rounded-bl-none space-y-2'
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
              <span className="font-bold">جاري البحث المباشر في المنهج والانترنت... 🌐</span>
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
            placeholder={appLang === 'ar' ? 'ابحث في منهج الجنسية أو جغرافياً أو تاريخياً...' : appLang === 'en' ? 'Search citizenship curriculum or history live...' : 'Caută în programa de cetățenie sau istorie...'}
            className={`flex-1 border text-xs sm:text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-rose-500 ${isDark ? 'bg-slate-900 border-slate-700/80 text-white placeholder-slate-500' : 'bg-slate-100 border-slate-200 text-slate-900 placeholder-slate-400'}`}
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
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading AI Assistant Page...</div>}>
      <AIContent />
    </Suspense>
  );
}
