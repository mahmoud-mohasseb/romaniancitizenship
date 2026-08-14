import confetti from 'canvas-confetti';

/**
 * Robust Fisher-Yates shuffle algorithm for 100% unbiased option randomization
 */
export function shuffleArray(array) {
  if (!Array.isArray(array)) return [];
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Triggers full-screen celebratory confetti bursts for high scores & achievements
 */
export function triggerConfetti() {
  if (typeof window === 'undefined') return;

  try {
    // Cannon Left
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6, x: 0.15 },
      colors: ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899']
    });

    // Cannon Right
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6, x: 0.85 },
      colors: ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899']
    });

    // Golden Fireworks Center
    setTimeout(() => {
      confetti({
        particleCount: 110,
        spread: 100,
        origin: { y: 0.4, x: 0.5 },
        colors: ['#FBBF24', '#F59E0B', '#D97706', '#EF4444', '#34D399']
      });
    }, 200);
  } catch (e) {
    console.log('Confetti playback warning:', e);
  }
}

/**
 * Plays a fanfare victory chime using Web Audio API
 */
export function playVictorySound() {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    // Sequence: C5 -> E5 -> G5 -> C6
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);

      const startTime = ctx.currentTime + index * 0.12;
      gain.gain.setValueAtTime(0.25, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

      osc.start(startTime);
      osc.stop(startTime + 0.35);
    });
  } catch (e) {}
}

/**
 * Plays sound feedback for option selection
 */
export function playOptionFeedbackSound(isCorrect) {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (isCorrect) {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, ctx.currentTime);
      osc.frequency.setValueAtTime(110, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    }
  } catch (e) {}
}
