'use client';

import React, { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';

function getOrCreateAnonymousId() {
  if (typeof window === 'undefined') return 'anon_server';
  let vid = localStorage.getItem('app_anon_vid');
  if (!vid) {
    vid = `v_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem('app_anon_vid', vid);
  }
  return vid;
}

function getOrCreateSessionId() {
  if (typeof window === 'undefined') return 'sess_server';
  let sid = sessionStorage.getItem('app_session_id');
  if (!sid) {
    sid = `s_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    sessionStorage.setItem('app_session_id', sid);
  }
  return sid;
}

function detectDeviceType() {
  if (typeof window === 'undefined') return 'desktop';
  const ua = navigator.userAgent || '';
  if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet';
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated/i.test(ua)) return 'mobile';
  return 'desktop';
}

export default function AnalyticsProvider({ children }) {
  const pathname = usePathname();
  const { appLang } = useLanguage();
  const lastTrackedPathRef = useRef(null);

  // 1. Route Change & Page View Tracking
  useEffect(() => {
    if (!pathname) return;
    if (lastTrackedPathRef.current === pathname) return; // Prevent duplicate SPA tracking
    lastTrackedPathRef.current = pathname;

    const anonymousId = getOrCreateAnonymousId();
    const sessionId = getOrCreateSessionId();
    const device = detectDeviceType();

    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        anonymousId,
        sessionId,
        path: pathname,
        language: appLang || 'ar',
        device,
        referrer: typeof document !== 'undefined' ? document.referrer : ''
      })
    }).catch(() => {});
  }, [pathname, appLang]);

  // 2. Periodic 45s Activity Heartbeat (Active User Tracking)
  useEffect(() => {
    const sendHeartbeat = () => {
      if (typeof document !== 'undefined' && document.visibilityState !== 'visible') return;

      const anonymousId = getOrCreateAnonymousId();
      const sessionId = getOrCreateSessionId();
      const device = detectDeviceType();

      fetch('/api/analytics/heartbeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          anonymousId,
          sessionId,
          path: pathname || '/',
          language: appLang || 'ar',
          device
        })
      }).catch(() => {});
    };

    // Initial heartbeat after 5s
    const initialTimer = setTimeout(sendHeartbeat, 5000);
    // Periodic heartbeat every 45s
    const heartbeatInterval = setInterval(sendHeartbeat, 45000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(heartbeatInterval);
    };
  }, [pathname, appLang]);

  return <>{children}</>;
}
