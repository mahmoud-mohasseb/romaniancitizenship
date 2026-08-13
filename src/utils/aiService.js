import questions from '../data/questions_ar.json';

const DEFAULT_OLLAMA_URL = 'http://localhost:11434';
const DEFAULT_MODEL = 'llama3';

export async function queryOllama(prompt, model = DEFAULT_MODEL, ollamaUrl = DEFAULT_OLLAMA_URL, lang = 'ar') {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(`${ollamaUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        model: model || DEFAULT_MODEL,
        prompt: `You are an expert Romanian Citizenship Exam Tutor. Help the student with their question about Romanian history, constitution, geography, culture, language, or citizenship interview: ${prompt}`,
        stream: false,
      }),
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data && data.response) {
        return { success: true, text: data.response, source: 'ollama' };
      }
    }
  } catch (error) {
    console.log('Ollama local server not reachable in PWA/Web mode, falling back to embedded AI Assistant:', error);
  }

  // Fallback to embedded AI Knowledge Assistant with 3-language support
  return getEmbeddedAIResponse(prompt, lang);
}

export function getEmbeddedAIResponse(userPrompt, lang = 'ar') {
  const query = (userPrompt || '').toLowerCase();
  
  // Search matching question in 469 questions dataset
  const matches = questions.filter(q => 
    q.question.toLowerCase().includes(query) ||
    (q.question_ar && q.question_ar.includes(query)) ||
    (q.question_en && q.question_en.toLowerCase().includes(query)) ||
    q.answer.toLowerCase().includes(query) ||
    (q.answer_ar && q.answer_ar.includes(query))
  );

  if (matches.length > 0) {
    const top = matches[0];
    let responseText = '';

    if (lang === 'en') {
      responseText = `🇷🇴 **Related Official Citizenship Exam Question:**\n\n` +
        `**Romanian Question:** ${top.question}\n` +
        `**Model Answer:** ${top.answer}\n\n` +
        `🇬🇧 **English Translation:** ${top.question_en || top.question}\n` +
        `**Answer:** ${top.answer_en || top.answer}\n\n` +
        `🇸🇦 **Arabic:** ${top.question_ar}\n` +
        `**Answer:** ${top.answer_ar}`;
    } else if (lang === 'ro') {
      responseText = `🇷🇴 **Întrebare Oficială din Programa de Cetățenie:**\n\n` +
        `**Întrebare în Limba Română:** ${top.question}\n` +
        `**Răspuns Model:** ${top.answer}\n\n` +
        `🇸🇦 **Traducere Arabă:** ${top.question_ar}\n` +
        `🇬🇧 **Traducere Engleză:** ${top.question_en || top.question}`;
    } else {
      responseText = `🇷🇴 **سؤال ذو صلة من منهج الجنسية الرسمي / Related Question:**\n\n` +
        `**الرومانية:** ${top.question}\n` +
        `**الإجابة النموذجية:** ${top.answer}\n\n` +
        `🇸🇦 **بالعربية:** ${top.question_ar}\n` +
        `**الإجابة:** ${top.answer_ar}\n\n` +
        `🇬🇧 **English:** ${top.question_en || top.question}\n` +
        `**Answer:** ${top.answer_en || top.answer}`;
    }

    return {
      success: true,
      text: responseText,
      source: 'embedded_ai',
      questionItem: top
    };
  }

  // General Romanian Citizenship Guidance Response
  if (query.includes('دليل') || query.includes('نصيح') || query.includes('مقابل') || query.includes('interview') || query.includes('tip') || query.includes('sfat')) {
    if (lang === 'en') {
      return {
        success: true,
        text: `🇷🇴 **Tips for Passing the Romanian Citizenship Oral Interview (ANC):**\n\n` +
              `1. **Clear Pronunciation:** Speak clearly and confidently in Romanian.\n` +
              `2. **Core Subjects:** Review Constitution (form of government, President, Parliament), national symbols (flag, emblem, anthem), and historic heroes (Stephen the Great, Mihai Eminescu).\n` +
              `3. **Oath of Allegiance:** Memorize the text of the legal oath before entering the committee.\n\n` +
              `💡 Type any historical figure or topic to search immediately!`,
        source: 'embedded_ai'
      };
    } else if (lang === 'ro') {
      return {
        success: true,
        text: `🇷🇴 **Sfaturi pentru Promovarea Interviului Oral de Cetățenie (ANC):**\n\n` +
              `1. **Pronunție clară:** Răspunde cu calm și claritate în limba română.\n` +
              `2. **Revizuire materie:** Concentrează-te pe Constituție (forma de guvernământ, Președinte, Parlament), simbolurile naționale și marii domnitori.\n` +
              `3. **Jurământul de credință:** Învață textul jurământului înainte de comisie.\n\n` +
              `💡 Scrie numele oricărui subiect pentru a căuta instant!`,
        source: 'embedded_ai'
      };
    } else {
      return {
        success: true,
        text: `🇷🇴 **نصائح لاجتياز مقابلة الجنسية الرومانية الشفهية (ANC):**\n\n` +
              `1. **الهدوء والنطق الواضح:** احرص على نطق الإجابة باللغة الرومانية السليمة والواضحة.\n` +
              `2. **مراجعة المواد الرئيسية:** ركز على الدستور (شكل الحكومة، الرئيس، البرلمان)، الرموز الوطنية (العلم واليمين)، وأهم الشخصيات التاريخية (مثل ستيفان تشيل ماري).\n` +
              `3. **اليمين القانوني (Jurământul):** احفظ نص اليمين القانوني بدقة قبل دخول اللجنة.\n\n` +
              `💡 يمكنك كتابة اسم أي موضوع أو شخصية في المحادثة للبحث المباشر!`,
        source: 'embedded_ai'
      };
    }
  }

  // Default response
  if (lang === 'en') {
    return {
      success: true,
      text: `🤖 **AI Romanian Citizenship Tutor:**\n\n` +
            `Your query: "${userPrompt}"\n\n` +
            `You can ask about any topic regarding Romanian history, constitution, geography, or culture (e.g. form of government, Stephen the Great, Danube river, capital, etc.).\n\n` +
            `💡 To connect to your local Ollama AI model, make sure Ollama is running on your machine (http://localhost:11434) or set custom host in Settings!`,
      source: 'embedded_ai'
    };
  } else if (lang === 'ro') {
    return {
      success: true,
      text: `🤖 **Asistent AI Cetățenia Română:**\n\n` +
            `Întrebarea ta: "${userPrompt}"\n\n` +
            `Poți întreba despre orice subiect din istoria, constituția sau geografia României (ex: forma de guvernământ, Ștefan cel Mare, fluviul Dunărea, capitala, etc.).\n\n` +
            `💡 Pentru a conecta modelul local Ollama, asigură-te că Ollama rulează (http://localhost:11434) sau configurează adresa în Setări!`,
      source: 'embedded_ai'
    };
  }

  return {
    success: true,
    text: `🤖 **المساعد الذكي لاختبار الجنسية الرومانية:**\n\n` +
          `سؤالك: "${userPrompt}"\n\n` +
          `يمكنك السؤال عن أي موضوع تاريخي، جغرافي، أو دستوري روماني (مثل: شكل الحكومة، الدستور، ستيفان تشيل ماري، نهر الدانوب، العاصمة، إلخ).\n\n` +
          `💡 للربط مع نموذج AI محلي (مثل Ollama)، تأكد من تشغيل Ollama على جهازك (http://localhost:11434) أو تعديل العنوان من الإعدادات!`,
    source: 'embedded_ai'
  };
}
