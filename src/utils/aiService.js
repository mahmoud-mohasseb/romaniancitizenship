import questions from '../data/questions_ar.json';

const DEFAULT_OLLAMA_URL = 'http://localhost:11434';
const DEFAULT_MODEL = 'llama3';

export async function queryOllama(prompt, model = DEFAULT_MODEL, ollamaUrl = DEFAULT_OLLAMA_URL) {
  try {
    const response = await fetch(`${ollamaUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: model,
        prompt: `You are an expert Romanian Citizenship Exam Tutor. Help the student with their question about Romanian history, constitution, geography, culture, language, or citizenship interview: ${prompt}`,
        stream: false,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return { success: true, text: data.response, source: 'ollama' };
    }
  } catch (error) {
    console.log('Ollama local server not reachable, falling back to embedded AI Assistant:', error);
  }

  // Fallback to embedded AI Knowledge Assistant
  return getEmbeddedAIResponse(prompt);
}

export function getEmbeddedAIResponse(userPrompt) {
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
    return {
      success: true,
      text: `🇷🇴 **سؤال ذو صلة من منهج الجنسية الرسمي / Related Question:**\n\n` +
            `**الرومانية:** ${top.question}\n` +
            `**الإجابة النموذجية:** ${top.answer}\n\n` +
            `🇸🇦 **بالعربية:** ${top.question_ar}\n` +
            `**الإجابة:** ${top.answer_ar}\n\n` +
            `🇬🇧 **English:** ${top.question_en || top.question}\n` +
            `**Answer:** ${top.answer_en || top.answer}`,
      source: 'embedded_ai',
      questionItem: top
    };
  }

  // General Romanian Citizenship Guidance Response
  if (query.includes('دليل') || query.includes('نصيح') || query.includes('مقابل') || query.includes('interview') || query.includes('tip')) {
    return {
      success: true,
      text: `🇷🇴 **نصائح لاجتياز مقابلة الجنسية الرومانية الشفهية (ANC):**\n\n` +
            `1. **الهدوء والنطق الواضح:** احرص على نطق الإجابة باللغة الرومانية السليمة والواضحة.\n` +
            `2. **مراجعة المواد الرئيسية:** ركز على الدستور (شكل الحكومة، الرئيس، البرلمان)، الرموز الوطنية (الدراجل والاسم واليمين)، وأهم الشخصيات التاريخية (مثل ستيفان تشيل ماري وميهاي إمينيسكو).\n` +
            `3. **اليمين القانوني (Jurământul):** احفظ نص اليمين القانوني بدقة قبل دخول اللجنة.\n\n` +
            `💡 يمكنك كتابة اسم أي موضوع أو شخصية في المحادثة للبحث المباشر!`,
      source: 'embedded_ai'
    };
  }

  return {
    success: true,
    text: `🤖 **المساعد الذكي لاختبار الجنسية الرومانية:**\n\n` +
          `سؤالك: "${userPrompt}"\n\n` +
          `يمكنك السؤال عن أي موضوع تاريخي، جغرافي، أو دستوري روماني (مثل: شكل الحكومة، الدستور، ستيفان تشيل ماري، نهر الدانوب، إيون كرينجا، العاصمة، إلخ).\n\n` +
          `💡 للربط مع نموذج AI محلي (مثل Ollama)، تأكد من تشغيل Ollama على جهازك (http://localhost:11434)!`,
    source: 'embedded_ai'
  };
}
