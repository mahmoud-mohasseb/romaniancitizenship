'use client';

import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, Share, PlusSquare, Compass, CheckCircle, Info } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

export default function PwaInstallBanner({ inline = false }) {
  const { appLang } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if app is running as standalone PWA
    const checkStandalone = () => {
      const isStandaloneMatch = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
      setIsStandalone(isStandaloneMatch);
    };

    // Check iOS user agent
    const userAgent = window.navigator.userAgent || '';
    const iosDevice = /iphone|ipad|ipod/i.test(userAgent);
    setIsIOS(iosDevice);

    checkStandalone();

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Do not display if already running inside standalone PWA mode or dismissed
  if (isStandalone || dismissed) {
    return null;
  }

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`PWA User Choice Outcome: ${outcome}`);
        setDeferredPrompt(null);
      } catch (err) {
        console.error('PWA Install Error:', err);
        setShowInstructionsModal(true);
      }
    } else {
      // For iOS Safari, Firefox, or browsers without beforeinstallprompt
      setShowInstructionsModal(true);
    }
  };

  return (
    <>
      {/* PWA INSTALL BANNER */}
      <div 
        className={`p-4 rounded-3xl border shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-white transition-all ${
          isDark ? 'bg-gradient-to-r from-rose-900 via-rose-800 to-amber-900 border-rose-500/40' : 'bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 border-rose-400'
        } ${inline ? 'w-full' : 'my-3'}`}
      >
        <div className="flex items-center gap-3 text-right w-full sm:w-auto">
          <div className="w-10 h-10 rounded-2xl bg-black/20 flex items-center justify-center shrink-0 border border-white/20">
            <Smartphone className="w-5 h-5 text-amber-300 animate-bounce-subtle" />
          </div>
          <div className="flex-1">
            <h3 className="text-xs sm:text-sm font-black flex items-center gap-1.5">
              <span>{appLang === 'ar' ? 'تثبيت التطبيق على هافتك 📲' : appLang === 'en' ? 'Install App on Your Phone 📲' : 'Instalează Aplicația pe Telefon 📲'}</span>
              <span className="px-2 py-0.5 rounded-full text-[9px] bg-amber-400 text-slate-900 font-black">PWA</span>
            </h3>
            <p className="text-[11px] text-rose-100 font-bold leading-tight">
              {appLang === 'ar' 
                ? 'يعمل على أيفون وأندرويد وجميع المتصفحات بدون إنترنت!' 
                : appLang === 'en' 
                ? 'Works on Safari iOS, Chrome Android & all browsers offline!' 
                : 'Funcționează pe Safari iOS, Android & toate browserele offline!'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={handleInstallClick}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-white text-rose-700 hover:bg-amber-50 font-black rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95"
          >
            <Download className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{appLang === 'ar' ? 'تثبيت 📲' : appLang === 'en' ? 'Install 📲' : 'Instalează 📲'}</span>
          </button>
          
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="p-2 rounded-xl bg-black/20 hover:bg-black/30 text-rose-100 transition-colors"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* UNIVERSAL INSTALLATION INSTRUCTIONS MODAL */}
      {showInstructionsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm p-4 flex items-center justify-center animate-fade-in">
          <div className={`w-full max-w-md rounded-3xl border shadow-2xl p-6 space-y-5 relative overflow-hidden ${
            isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <button
              type="button"
              onClick={() => setShowInstructionsModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-700/50 pb-3">
              <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-amber-400">
                  {appLang === 'ar' ? 'تعليمات تثبيت التطبيق 📲' : 'How to Install App 📲'}
                </h3>
                <p className="text-xs text-slate-400 font-bold">
                  {isIOS 
                    ? (appLang === 'ar' ? 'خطوات التثبيت على آيفون وآيباد (Safari iOS)' : 'Steps for iPhone & iPad (Safari iOS)')
                    : (appLang === 'ar' ? 'خطوات التثبيت على المتصفح الحالي' : 'Steps for Your Browser')}
                </p>
              </div>
            </div>

            {/* iOS Safari Steps */}
            {isIOS ? (
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-900 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
                  <div className="space-y-0.5">
                    <p className="text-xs font-black text-white flex items-center gap-1.5">
                      <span>اضغط على زر المشاركة 📤 (Share)</span>
                      <Share className="w-4 h-4 text-amber-400" />
                    </p>
                    <p className="text-[11px] text-slate-300 font-bold">
                      موجود في أسفل شاشة متصفح Safari على الآيفون.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-rose-500 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
                  <div className="space-y-0.5">
                    <p className="text-xs font-black text-white flex items-center gap-1.5">
                      <span>اختر "إضافة إلى الشاشة الرئيسية" ➕</span>
                      <PlusSquare className="w-4 h-4 text-rose-400" />
                    </p>
                    <p className="text-[11px] text-slate-300 font-bold">
                      قم بالسحب للأسفل واضغط على (Add to Home Screen / Adaugă pe ecranul principal).
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-500 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
                  <div className="space-y-0.5">
                    <p className="text-xs font-black text-white flex items-center gap-1.5">
                      <span>اضغط على "إضافة" (Add) أعلى اليمين 🎉</span>
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    </p>
                    <p className="text-[11px] text-slate-300 font-bold">
                      سيظهر أيقونة تطبيق الجنسية الرومانية مباشرة على شاشتك الرئيسية!
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* Chrome, Firefox, Edge, Android Steps */
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-900 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
                  <div className="space-y-0.5">
                    <p className="text-xs font-black text-white flex items-center gap-1.5">
                      <span>افتح قائمة المتصفح (⋮ أو ≡)</span>
                    </p>
                    <p className="text-[11px] text-slate-300 font-bold">
                      اضغط على النقاط الثلاث في أعلى أو أسفل المتصفح.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-rose-500 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
                  <div className="space-y-0.5">
                    <p className="text-xs font-black text-white flex items-center gap-1.5">
                      <span>اختر "تثبيت التطبيق" أو "إضافة للشاشة الرئيسية" 📲</span>
                      <Download className="w-4 h-4 text-rose-400" />
                    </p>
                    <p className="text-[11px] text-slate-300 font-bold">
                      (Install App / Add to Home screen / Adaugă pe ecranul principal).
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-500 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
                  <div className="space-y-0.5">
                    <p className="text-xs font-black text-white flex items-center gap-1.5">
                      <span>تأكيد التثبيت 🎉</span>
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    </p>
                    <p className="text-[11px] text-slate-300 font-bold">
                      سيكون التطبيق جاهزاً للاستخدام بدون إنترنت وبسرعة فائقة.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowInstructionsModal(false)}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-900 font-black rounded-2xl text-xs transition-all shadow-md"
            >
              {appLang === 'ar' ? 'تم الفهم 👍' : 'Got it 👍'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
