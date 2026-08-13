'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  Sparkles, 
  Settings, 
  Send, 
  User, 
  Bot, 
  Loader2 
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import { queryOllama } from '../../utils/aiService';
import { UI_STRINGS } from '../../utils/languageHelper';

function AIContent() {
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get('q') || '';
  const initialLang = searchParams.get('lang') || 'ar';

  const [appLang, setAppLang] = useState(initialLang);
  const strings = UI_STRINGS[appLang] || UI_STRINGS.ar;
  const isRtl = appLang === 'ar';

  const [inputQuery, setInputQuery] = useState(initialPrompt);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: appLang === 'ar' 
        ? 'مرحباً بك! أنا مساعدك الذكي المخصص لاختبار الجنسية الرومانية 🇷🇴. يمكنك سؤالي عن أي سؤال دستوري، تاريخي، جغرافي، أو نصائح للمقابلة الرسمية!'
        : appLang === 'en'
        ? 'Welcome! I am your Romanian Citizenship AI Tutor 🇷🇴. Ask me any question about Romanian history, constitution, geography, or interview prep!'
        : 'Bine ai venit! Sunt asistentul tău AI pentru cetățenia română 🇷🇴. Întreabă-mă orice despre istorie, constituție, geografie sau sfaturi pentru interviu!',
      time: 'Just now'
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [ollamaUrl, setOllamaUrl] = useState('http://localhost:11434');
  const [ollamaModel, setOllamaModel] = useState('llama3');
  const [showConfig, setShowConfig] = useState(false);

  useEffect(() => {
    if (initialPrompt) {
      handleSend(initialPrompt);
    }
  }, []);

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

    const result = await queryOllama(q, ollamaModel, ollamaUrl);

    const aiMsg = {
      id: Date.now() + 1,
      sender: 'ai',
      text: result.text,
      source: result.source,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, aiMsg]);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col">
      <Navbar appLang={appLang} setAppLang={setAppLang} />

      <main className={`flex-1 w-full max-w-4xl mx-auto px-4 py-6 space-y-4 flex flex-col h-[85vh] ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
        {/* Top Header */}
        <div className="flex items-center justify-between bg-slate-800/80 backdrop-blur-md p-3 rounded-2xl border border-slate-700/60 shrink-0">
          <div className="text-center w-full flex items-center justify-between px-2">
            <div className="flex items-center space-x-1.5 space-x-reverse">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h1 className="text-base font-bold text-white">
                {appLang === 'ar' ? 'المساعد الذكي للجنسية' : appLang === 'en' ? 'AI Citizenship Tutor' : 'Asistent AI Cetățenie'}
              </h1>
            </div>
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="p-2 bg-slate-900 text-emerald-400 rounded-xl border border-slate-700 hover:text-white text-xs font-bold flex items-center space-x-1 space-x-reverse"
            >
              <Settings className="w-4 h-4" />
              <span>Ollama Settings</span>
            </button>
          </div>
        </div>

        {/* Ollama Settings Drawer */}
        {showConfig && (
          <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 space-y-3 shrink-0 text-xs text-slate-300">
            <p className="font-bold text-emerald-400">⚙️ Ollama Local AI Server Settings:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Ollama URL:</label>
                <input 
                  type="text" 
                  value={ollamaUrl} 
                  onChange={(e) => setOllamaUrl(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white font-mono"
                  placeholder="http://localhost:11434"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Model Name:</label>
                <input 
                  type="text" 
                  value={ollamaModel} 
                  onChange={(e) => setOllamaModel(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white font-mono"
                  placeholder="llama3 / mistral / qwen"
                />
              </div>
            </div>
          </div>
        )}

        {/* Quick Prompts Strip */}
        <div className="flex items-center space-x-2 space-x-reverse overflow-x-auto pb-1 no-scrollbar shrink-0">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 whitespace-nowrap shrink-0 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat Messages Log */}
        <div className="flex-1 bg-slate-800/60 rounded-2xl border border-slate-700/60 p-4 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-rose-600 text-white rounded-br-none'
                    : 'bg-slate-900/90 text-slate-100 border border-slate-700/80 rounded-bl-none space-y-2'
                }`}
              >
                {msg.sender === 'ai' && (
                  <div className="flex items-center space-x-1.5 space-x-reverse text-[10px] font-bold text-rose-400 mb-1 border-b border-slate-800 pb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{msg.source === 'ollama' ? 'Ollama AI (Local Server)' : 'مساعد الجنسية الذكي المدمج'}</span>
                  </div>
                )}
                <div className="whitespace-pre-wrap">{msg.text}</div>
              </div>
              <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.time}</span>
            </div>
          ))}

          {loading && (
            <div className="flex items-center space-x-2 space-x-reverse bg-slate-900/90 p-3 rounded-2xl border border-slate-700 max-w-xs text-xs text-slate-400">
              <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
              <span>جاري التفكير وتوليد الإجابة...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="flex items-center space-x-2 space-x-reverse bg-slate-800 p-2 rounded-2xl border border-slate-700 shrink-0">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={appLang === 'ar' ? 'اسأل أي سؤال حول الجنسية أو التاريخ الروماني...' : appLang === 'en' ? 'Ask any question about Romanian citizenship...' : 'Întreabă orice despre cetățenia română...'}
            className="flex-1 bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:border-rose-500"
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
