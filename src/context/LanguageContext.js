'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UI_STRINGS } from '../utils/languageHelper';

const LanguageContext = createContext({
  appLang: 'ar',
  setAppLang: () => {},
  strings: UI_STRINGS.ar,
  isRtl: true,
});

export function LanguageProvider({ children }) {
  const [appLang, setAppLangState] = useState('ar');

  useEffect(() => {
    const savedLang = localStorage.getItem('appLang');
    if (savedLang && (savedLang === 'ar' || savedLang === 'en' || savedLang === 'ro')) {
      setAppLangState(savedLang);
    }
  }, []);

  const setAppLang = (lang) => {
    if (lang === 'ar' || lang === 'en' || lang === 'ro') {
      setAppLangState(lang);
      localStorage.setItem('appLang', lang);
    }
  };

  const strings = UI_STRINGS[appLang] || UI_STRINGS.ar;
  const isRtl = appLang === 'ar';

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
      document.documentElement.lang = appLang;
    }
  }, [appLang, isRtl]);

  return (
    <LanguageContext.Provider value={{ appLang, setAppLang, strings, isRtl }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
