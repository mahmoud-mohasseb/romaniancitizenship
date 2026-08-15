// Centralized Native Text-To-Speech (TTS) Engine for Romanian, English, and Arabic

let currentUtterance = null;
let voiceCache = {
  ro: null,
  en: null,
  ar: null
};

// Expand common Romanian legal, historical, and daily abbreviations for fluid natural reading
export function normalizeRomanianForSpeech(text) {
  if (!text) return '';

  let cleaned = text
    .replace(/\bArt\.\s*(\d+)/gi, 'Articolul $1')
    .replace(/\bal\.\s*\((\d+)\)/gi, 'alineatul $1')
    .replace(/\bnr\./gi, 'numărul')
    .replace(/\b1\s+Dec\./gi, 'întâi Decembrie')
    .replace(/\b1\s+Decembrie\b/gi, 'întâi Decembrie')
    .replace(/\bkm\b/gi, 'kilometri')
    .replace(/\bm\b/gi, 'metri')
    .replace(/\bUE\b/g, 'Uniunea Europeană')
    .replace(/\bNATO\b/g, 'Nato')
    .replace(/\bANC\b/g, 'Autoritatea Națională pentru Cetățenie');

  // Insert micro-pauses after commas and colons for natural sentence cadence
  cleaned = cleaned.replace(/,/g, ', ');
  return cleaned;
}

// Select the highest-quality native voice available in browser
export function getNativeVoice(lang = 'ro') {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;

  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;

  if (lang === 'ro' || lang === 'ro-RO') {
    if (voiceCache.ro) return voiceCache.ro;
    const roVoice = voices.find(v => v.lang.startsWith('ro') && (v.name.includes('Carmen') || v.name.includes('Alina') || v.name.includes('Andrei') || v.name.includes('Google') || v.name.includes('Natural'))) ||
                    voices.find(v => v.lang.startsWith('ro'));
    voiceCache.ro = roVoice || null;
    return roVoice;
  }

  if (lang === 'en' || lang === 'en-US' || lang === 'en-GB') {
    if (voiceCache.en) return voiceCache.en;
    const enVoice = voices.find(v => (v.lang.startsWith('en-US') || v.lang.startsWith('en-GB')) && (v.name.includes('Samantha') || v.name.includes('Daniel') || v.name.includes('Google') || v.name.includes('Natural'))) ||
                    voices.find(v => v.lang.startsWith('en'));
    voiceCache.en = enVoice || null;
    return enVoice;
  }

  if (lang === 'ar' || lang === 'ar-SA' || lang === 'ar-EG') {
    if (voiceCache.ar) return voiceCache.ar;
    const arVoice = voices.find(v => v.lang.startsWith('ar') && (v.name.includes('Maged') || v.name.includes('Tarik') || v.name.includes('Laila') || v.name.includes('Google') || v.name.includes('Natural'))) ||
                    voices.find(v => v.lang.startsWith('ar'));
    voiceCache.ar = arVoice || null;
    return arVoice;
  }

  return null;
}

/**
  * Centralized speech player
  * @param {string} text Text to pronounce
  * @param {string} lang 'ro' | 'en' | 'ar'
  * @param {number} rate Speed multiplier: 0.75 (Learning), 1.0 (Native), 1.25 (Fast)
  * @param {function} onStart Callback on play start
  * @param {function} onEnd Callback on play finish/stop
  */
export function speakText(text, lang = 'ro', rate = 1.0, onStart = null, onEnd = null) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  // Stop previous active audio to prevent overlapping speech
  stopSpeech();

  const rawText = lang === 'ro' ? normalizeRomanianForSpeech(text) : text;
  const utterance = new SpeechSynthesisUtterance(rawText);

  // Set language tag
  utterance.lang = lang === 'ro' ? 'ro-RO' : lang === 'en' ? 'en-US' : 'ar-SA';
  utterance.rate = rate;
  utterance.pitch = 1.0;

  // Attach native voice if available
  const nativeVoice = getNativeVoice(lang);
  if (nativeVoice) {
    utterance.voice = nativeVoice;
  }

  utterance.onstart = () => {
    currentUtterance = utterance;
    if (onStart) onStart();
  };

  utterance.onend = () => {
    currentUtterance = null;
    if (onEnd) onEnd();
  };

  utterance.onerror = () => {
    currentUtterance = null;
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
}

// Immediately stop current audio
export function stopSpeech() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  currentUtterance = null;
}

// Pre-warm browser voices list
if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    getNativeVoice('ro');
    getNativeVoice('en');
    getNativeVoice('ar');
  };
}
