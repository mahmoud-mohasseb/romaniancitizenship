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
  const lastHeartbeatTimeRef = useRef(0);

  // 1. SPA Route Change & Page View Tracking (Deduplicated against React StrictMode)
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

  // 2. Periodic 45s Activity Heartbeat & Interaction Throttle
  useEffect(() => {
    const sendHeartbeat = () => {
      if (typeof document !== 'undefined' && document.visibilityState !== 'visible') return;

      const now = Date.now();
      // Throttle heartbeats to minimum 30 seconds interval
      if (now - lastHeartbeatTimeRef.current < 30000) return;
      lastHeartbeatTimeRef.current = now;

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

    // Initial heartbeat after 3s
    const initialTimer = setTimeout(sendHeartbeat, 3000);
    // Periodic heartbeat every 45s
    const heartbeatInterval = setInterval(sendHeartbeat, 45000);

    // Listen to user interaction signals (click, scroll, keydown)
    const handleUserInteraction = () => {
      sendHeartbeat();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('click', handleUserInteraction, { passive: true });
      window.addEventListener('keydown', handleUserInteraction, { passive: true });
      window.addEventListener('scroll', handleUserInteraction, { passive: true });
    }

    return () => {
      clearTimeout(initialTimer);
      clearInterval(heartbeatInterval);
      if (typeof window !== 'undefined') {
        window.removeEventListener('click', handleUserInteraction);
        window.removeEventListener('keydown', handleUserInteraction);
        window.removeEventListener('scroll', handleUserInteraction);
      }
    };
  }, [pathname, appLang]);

  return <>{children}</>;
}
