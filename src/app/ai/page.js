'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Globe, 
  BookOpen, 
  Volume2, 
  Copy, 
  Check, 
  RotateCcw, 
  GraduationCap,
  MessageSquare,
  Compass,
  ExternalLink,
  ShieldCheck,
  Zap
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { queryAITutor } from '../../utils/aiService';

function AIContent() {
  const { theme } = useTheme();
  const { appLang, strings, isRtl } = useLanguage();
  const isDark = theme === 'dark';

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [playingIdx, setPlayingIdx] = useState(null);

  const samplePrompts = {
    ar: [
      "من هو ستيفان تشيل ماري (Ștefan cel Mare)؟",
      "ما هي المادة الأولى من الدستور الروماني؟",
      "كيف أصرف فعل الملكية a avea في المضارع؟",
      "ما هي عاصمة رومانيا وأهم المدن؟",
      "كيف أطلب الفاتورة في المطعم بالرومانية؟"
    ],
    en: [
      "Who was Stephen the Great (Ștefan cel Mare)?",
      "What is Article 1 of the Romanian Constitution?",
      "How to conjugate verb 'a avea' in present tense?",
      "What is the capital of Romania and key rivers?",
      "How to introduce myself in the citizenship interview?"
    ],
    ro: [
      "Cine a fost Ștefan cel Mare?",
      "Ce spune Articolul 1 din Constituția României?",
      "Cum se conjugă verbul «a avea» la prezent?",
      "Care este capitala României și fluviul Dunărea?",
      "Cum mă prezint în fața Comisiei de Cetățenie?"
    ]
  };

  const getInitialWelcomeMsg = () => {
    if (appLang === 'en') {
      return `Hello! I am your **Free AI Romanian Citizenship Tutor** 🤖\n\nI am built to help you master the **469 Official ANC Questions**, Romanian Constitution (Articles 1-148), History, Geography, and Grammar.\n\n💡 *Ask me anything about Romania, or click one of the quick topics below!*`;
    } else if (appLang === 'ro') {
      return `Bună ziua! Sunt **Asistentul tău AI pentru Cetățenia Română** 🤖\n\nSunt pregătit să te ajut cu cele **469 de Întrebări Oficiale ANC**, Constituția României, Istoria, Geografia și Gramatica.\n\n💡 *Adresează-mi orice întrebare despre România sau alege o temă rapidă de mai jos!*`;
    }
    return `مرحباً بك! أنا **المساعد الذكي المجاني للجنسية الرومانية** 🤖\n\nأنا هنا لمساعدتك في الإجابة على **أسئلة لجنة الجنسية 469 ANC**، مواد الدستور الروماني (1-148)، التاريخ، الجغرافيا، وقواعد اللغة.\n\n💡 *اكتب أي سؤال باللغة العربية أو الرومانية، أو اختر أحدا المواضيع السريعة أدناه!*`;
  };

  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: getInitialWelcomeMsg(),
      source: 'ai_tutor',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages(prev => [...prev, {
      sender: 'user',
      text: query,
      time: userTime
    }]);

    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await queryAITutor(query, appLang);
      const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setMessages(prev => [...prev, {
        sender: 'bot',
        text: res.text,
        source: res.source,
        image: res.image,
        wiki_url: res.wiki_url,
        time: botTime
      }]);
    } catch (err) {
      console.error('AI Query Error:', err);
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: appLang === 'ar' ? 'حدث خطأ أثناء معالجة السؤال. يرجى المحاولة مرة أخرى.' : 'Error processing query. Please try again.',
        source: 'ai_tutor',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setLoading(false);
    }
  };

  const speakAudio = (text, idx) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    if (playingIdx === idx) {
      setPlayingIdx(null);
      return;
    }
    const cleanText = text.replace(/[*_#`[\]()]/g, ' ');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'ro-RO';
    utterance.rate = 0.85;
    utterance.onend = () => setPlayingIdx(null);
    utterance.onerror = () => setPlayingIdx(null);
    setPlayingIdx(idx);
    window.speechSynthesis.speak(utterance);
  };

  const copyToClipboard = (text, idx) => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return;
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const getSourceBadge = (source) => {
    switch (source) {
      case 'dataset_question':
        return (
          <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
            <BookOpen className="w-3.5 h-3.5 shrink-0" />
            <span>469 ANC Questions 📚</span>
          </span>
        );
      case 'dataset_grammar':
        return (
          <span className="inline-flex items-center gap-1 text-amber-400 font-bold">
            <GraduationCap className="w-3.5 h-3.5 shrink-0" />
            <span>Romanian Grammar Guide 📖</span>
          </span>
        );
      case 'dataset_conversation':
        return (
          <span className="inline-flex items-center gap-1 text-rose-400 font-bold">
            <MessageSquare className="w-3.5 h-3.5 shrink-0" />
            <span>Interview Dialogue 🗣️</span>
          </span>
        );
      case 'online_search':
        return (
          <span className="inline-flex items-center gap-1 text-blue-400 font-bold">
            <Globe className="w-3.5 h-3.5 shrink-0" />
            <span>Live Knowledge Search 🌐</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-rose-400 font-bold">
            <Bot className="w-3.5 h-3.5 shrink-0" />
            <span>AI Citizenship Assistant 🤖</span>
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-theme-main text-theme-main flex flex-col font-cairo">
      <Navbar />

      <main className={`flex-1 w-full max-w-4xl mx-auto px-4 py-6 space-y-4 flex flex-col h-[84vh] ${
        isRtl ? 'lg:mr-72' : 'lg:ml-72'
      } ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
        
        {/* Header Bar */}
        <div className={`flex items-center justify-between p-4 rounded-2xl border shrink-0 ${
          isDark ? 'bg-slate-800/90 border-slate-700/80' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 via-amber-500 to-rose-600 text-white flex items-center justify-center border border-amber-300 shadow-md animate-pulse-glow shrink-0">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-base font-black leading-tight">
                {appLang === 'ar' ? 'المساعد الذكي للجنسية الرومانية 🤖' : appLang === 'en' ? 'Smart AI Citizenship Tutor 🤖' : 'Asistent AI Cetățenie Română 🤖'}
              </h1>
              <p className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                <Zap className="w-3 h-3 fill-current shrink-0" />
                <span>100% Free & Unlimited Access • Works Online & Offline ⚡</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setMessages([{ sender: 'bot', text: getInitialWelcomeMsg(), source: 'ai_tutor', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }])}
            className="p-2 rounded-xl border border-slate-700 text-slate-400 hover:text-rose-500 hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs font-bold shrink-0"
            title="Reset Chat"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">محادثة جديدة</span>
          </button>
        </div>

        {/* Quick Question Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar shrink-0">
          {(samplePrompts[appLang] || samplePrompts.ar).map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border shrink-0 ${
                isDark 
                  ? 'bg-slate-800/90 text-slate-300 border-slate-700/80 hover:border-rose-500 hover:text-white' 
                  : 'bg-white text-slate-700 border-slate-200 hover:border-rose-500 hover:text-rose-600 shadow-sm'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Chat Messages Feed Area */}
        <div className={`flex-1 overflow-y-auto p-4 rounded-3xl border space-y-4 shadow-inner ${
          isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} animate-fade-in-up`}
            >
              <div className={`flex items-start gap-2.5 max-w-[90%] sm:max-w-[82%] ${
                msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border text-xs font-black shadow ${
                  msg.sender === 'user'
                    ? 'bg-rose-600 text-white border-rose-500'
                    : 'bg-gradient-to-tr from-amber-500 to-rose-600 text-white border-amber-400'
                }`}>
                  {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className={`rounded-2xl p-4 border space-y-3 shadow-md ${
                  msg.sender === 'user'
                    ? 'bg-rose-600 text-white border-rose-500'
                    : isDark ? 'bg-slate-800 border-slate-700/80 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
                }`}>
                  {/* Source Badge if Bot */}
                  {msg.sender === 'bot' && (
                    <div className="flex items-center justify-between text-[11px] border-b border-slate-700/50 pb-2">
                      {getSourceBadge(msg.source)}
                      <span className="text-slate-400 font-mono text-[10px]">{msg.time}</span>
                    </div>
                  )}

                  {/* Message Content */}
                  <div className="text-xs sm:text-sm font-semibold leading-relaxed whitespace-pre-line dir-auto">
                    {msg.text}
                  </div>

                  {/* Optional Image Thumbnail */}
                  {msg.image && (
                    <div className="relative w-full h-44 rounded-xl overflow-hidden border border-slate-700">
                      <img src={msg.image} alt="Reference thumbnail" className="w-full h-full object-cover" />
                    </div>
                  )}

                  {/* Action Bar for Bot Messages */}
                  {msg.sender === 'bot' && (
                    <div className="flex items-center justify-between border-t border-slate-700/50 pt-2 text-xs">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => speakAudio(msg.text, idx)}
                          className={`px-2.5 py-1 rounded-lg border flex items-center gap-1 text-[11px] font-bold transition-all ${
                            playingIdx === idx 
                              ? 'bg-amber-500 text-slate-950 border-amber-400 animate-pulse' 
                              : isDark ? 'bg-slate-900 border-slate-700 hover:border-amber-400 text-amber-400' : 'bg-slate-100 border-slate-200 text-amber-600'
                          }`}
                        >
                          <Volume2 className="w-3.5 h-3.5 shrink-0" />
                          <span>{playingIdx === idx ? 'جاري الاستماع...' : 'استماع 🔊'}</span>
                        </button>

                        <button
                          onClick={() => copyToClipboard(msg.text, idx)}
                          className={`px-2.5 py-1 rounded-lg border flex items-center gap-1 text-[11px] font-bold transition-all ${
                            copiedIdx === idx
                              ? 'bg-emerald-600 text-white border-emerald-500'
                              : isDark ? 'bg-slate-900 border-slate-700 hover:border-slate-500 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                          }`}
                        >
                          {copiedIdx === idx ? <Check className="w-3.5 h-3.5 shrink-0 text-white" /> : <Copy className="w-3.5 h-3.5 shrink-0" />}
                          <span>{copiedIdx === idx ? 'تم النسخ!' : 'نسخ النص'}</span>
                        </button>
                      </div>

                      {msg.wiki_url && (
                        <a
                          href={msg.wiki_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-blue-400 hover:underline flex items-center gap-1 font-bold"
                        >
                          <span>Wikipedia</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3 p-3.5 rounded-2xl border max-w-xs bg-slate-800/90 border-slate-700 text-slate-300 animate-pulse">
              <Bot className="w-5 h-5 text-amber-400 animate-spin shrink-0" />
              <span className="text-xs font-bold">جاري البحث والمعالجة الذكية... ⚡</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className={`flex items-center gap-2 p-2 rounded-2xl border shrink-0 ${
            isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-lg'
          }`}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={appLang === 'ar' ? 'اسأل المساعد الذكي أي سؤال عن الجنسية الرومانية...' : appLang === 'en' ? 'Ask any question about Romanian Citizenship...' : 'Adresează o întrebare despre cetățenia română...'}
            className="flex-1 px-4 py-3 rounded-xl bg-transparent outline-none text-xs sm:text-sm font-semibold placeholder:text-slate-500"
          />

          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-3 bg-gradient-to-r from-rose-600 via-rose-700 to-amber-600 hover:opacity-95 disabled:opacity-50 text-white rounded-xl shadow-lg transition-all shrink-0 flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </main>
    </div>
  );
}

export default function AIPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400 font-bold">Loading AI Tutor...</div>}>
      <AIContent />
    </Suspense>
  );
}
