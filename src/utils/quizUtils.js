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
    }
  } catch (e) {}
}

/**
  * Assigns difficulty level (easy, medium, hard) based on question complexity & keywords
  */
export function getQuestionDifficulty(q) {
  if (!q) return 'easy';
  if (q.difficulty) return q.difficulty;

  const text = (q.question + ' ' + (q.question_ar || '')).toLowerCase();
  
  // Hard keywords: constitutional principles, legal mechanisms, detailed institution interactions
  if (
    text.includes('articolul') || 
    text.includes('دستور') || 
    text.includes('constituț') || 
    text.includes('suveran') || 
    text.includes('separați') || 
    text.includes('atribuți') || 
    text.includes('preveder') || 
    text.includes('juridici') ||
    text.length > 90
  ) {
    return 'hard';
  }

  // Medium keywords: governance, parliament, government, geography details, historical dates
  if (
    text.includes('guvern') || 
    text.includes('parlament') || 
    text.includes('președinte') || 
    text.includes('senat') || 
    text.includes('deputaț') || 
    text.includes('județ') || 
    text.includes('tratat') || 
    text.includes('război') ||
    text.length > 55
  ) {
    return 'medium';
  }

  return 'easy';
}

/**
 * Filters question pool based on selected category and difficulty level
 */
export function getQuestionPoolForLevel(questions, level = 'easy', category = 'all') {
  if (!Array.isArray(questions)) return [];

  let pool = category === 'all' 
    ? questions 
    : questions.filter(q => q.category === category);

  const matched = pool.filter(q => getQuestionDifficulty(q) === level);
  
  // If pool for exact difficulty is small, fallback gracefully to adjacent pool
  if (matched.length >= 5) return matched;
  return pool;
}

/**
 * Generates options with distractor complexity matched to difficulty level
 */
export function generateLevelOptions(correctQ, allQuestions, level = 'easy') {
  if (!correctQ || !Array.isArray(allQuestions)) return [];

  const correctAns = correctQ.answer;
  const sameCategory = allQuestions.filter(
    q => q.category === correctQ.category && q.answer && q.answer !== correctAns
  );
  
  let candidates = sameCategory.length >= 3 ? sameCategory : allQuestions.filter(q => q.answer && q.answer !== correctAns);

  if (level === 'hard') {
    // Pick options with similar word length or vocabulary structure
    candidates = candidates.sort((a, b) => {
      const lenDiffA = Math.abs((a.answer || '').length - correctAns.length);
      const lenDiffB = Math.abs((b.answer || '').length - correctAns.length);
      return lenDiffA - lenDiffB;
    });
  } else if (level === 'medium') {
    candidates = shuffleArray(candidates);
  } else {
    // Easy level: clear and distinct options
    candidates = shuffleArray(candidates);
  }

  const wrongOptions = [];
  for (const item of candidates) {
    if (wrongOptions.length >= 3) break;
    if (item.answer && item.answer !== correctAns && !wrongOptions.includes(item.answer)) {
      wrongOptions.push(item.answer);
    }
  }

  return shuffleArray([correctAns, ...wrongOptions]);
}

/**
 * Generates personalized study recommendations based on test performance
 */
export function generatePersonalizedRecommendations(wrongQuestions = [], score = 0, total = 10) {
  const recs = [];
  const percentage = (score / Math.max(total, 1)) * 100;

  const categoryFailures = wrongQuestions.reduce((acc, q) => {
    const cat = q.category || 'general';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  if (categoryFailures['constitution'] || percentage < 70) {
    recs.push({
      key: 'recConstitutionWriting',
      href: '/constitution-writing',
      title_ar: 'المنهج الدستوري والكتابة ✍️',
      title_en: 'Constitution Writing & Legal Concepts ✍️',
      title_ro: 'Scriere Constituțională și Drept ✍️',
      desc_ar: 'تدرب على كتابة الإجابات ورسخ فهم المواد الدستورية 1-15'
    });
  }

  if (categoryFailures['general'] || categoryFailures['culture']) {
    recs.push({
      key: 'recGrammarBeginner',
      href: '/grammar',
      title_ar: 'قواعد الرومانية للمبتدئين (الأجناس والأدوات) 📚',
      title_en: 'Romanian Grammar — Beginner (Nouns & Articles) 📚',
      title_ro: 'Gramatică Română — Nivel Începător 📚',
      desc_ar: 'راجع الأجناس وأدوات التعريف لبناء الجمل الصحيحة'
    });
  }

  if (categoryFailures['history'] || percentage < 80) {
    recs.push({
      key: 'recGrammarIntermediate',
      href: '/grammar',
      title_ar: 'تصريف الأفعال والزمن الماضي 🟡',
      title_en: 'Verb Conjugations & Past Tense (Intermediate) 🟡',
      title_ro: 'Conjugări și Timpul Trecut (Mediu) 🟡',
      desc_ar: 'احترف تصريف الأفعال للماضي للتعبير عن الأحداث التاريخية'
    });
  }

  return recs;
}
