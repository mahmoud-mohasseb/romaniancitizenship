'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { stopSpeech } from '../utils/speechHelper';

function SpeechCleanupListener() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Stop active speech whenever the pathname or search parameters change (page/screen navigation)
  useEffect(() => {
    stopSpeech();
  }, [pathname, searchParams]);

  // Handle browser back/forward, tab close, window navigation, and pagehide
  useEffect(() => {
    const handleStop = () => {
      stopSpeech();
    };

    window.addEventListener('popstate', handleStop);
    window.addEventListener('pagehide', handleStop);
    window.addEventListener('beforeunload', handleStop);
    window.addEventListener('hashchange', handleStop);

    return () => {
      window.removeEventListener('popstate', handleStop);
      window.removeEventListener('pagehide', handleStop);
      window.removeEventListener('beforeunload', handleStop);
      window.removeEventListener('hashchange', handleStop);
      stopSpeech();
    };
  }, []);

  return null;
}

export default function GlobalSpeechCleanup() {
  return (
    <Suspense fallback={null}>
      <SpeechCleanupListener />
    </Suspense>
  );
}
