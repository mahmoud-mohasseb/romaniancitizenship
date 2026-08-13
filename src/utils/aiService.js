import questions from '../data/questions_ar.json';
import grammarData from '../data/romanian_grammar.json';
import conversationData from '../data/romanian_conversations.json';

const DEFAULT_OLLAMA_URL = 'http://localhost:11434';
const DEFAULT_MODEL = 'llama3';

/**
 * Online Wikipedia Search Fetcher
 */
export async function searchOnlineKnowledge(topic, lang = 'ar') {
  try {
    const searchLang = lang === 'ro' ? 'ro' : 'en';
    const response = await fetch(`https://${searchLang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`);
    if (response.ok) {
      const data = await response.json();
      if (data && data.extract) {
        return {
          title: data.title,
          extract: data.extract,
          url: data.content_urls?.desktop?.page || '',
          thumbnail: data.thumbnail?.source || ''
        };
      }
    }
  } catch (e) {
    console.log('Online Wikipedia search error:', e);
  }
  return null;
}

/**
 * Main Hybrid AI Query Function
 */
export async function queryOllama(prompt, model = DEFAULT_MODEL, ollamaUrl = DEFAULT_OLLAMA_URL, lang = 'ar') {
  const query = (prompt || '').trim();
  if (!query) return { success: false, text: '' };

  // 1. Try Local Ollama Server (if reachable and configured by user)
  if (ollamaUrl && !ollamaUrl.includes('localhost')) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const response = await fetch(`${ollamaUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          model: model || DEFAULT_MODEL,
          prompt: `You are an expert Romanian Citizenship Exam Tutor. Help the student with their question about Romanian history, constitution, geography, culture, language, or citizenship interview: ${query}`,
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
      console.log('Ollama custom URL unreachable, trying Hybrid Knowledge + Online Search');
    }
  }

  // 2. Search local citizenship datasets (469 Questions + Grammar + Conversations)
  const qLower = query.toLowerCase();

  // Search in 469 Citizenship Questions
  const matchingQuestions = questions.filter(q => 
    q.question.toLowerCase().includes(qLower) ||
    (q.question_ar && q.question_ar.includes(qLower)) ||
    (q.question_en && q.question_en.toLowerCase().includes(qLower)) ||
    q.answer.toLowerCase().includes(qLower) ||
    (q.answer_ar && q.answer_ar.includes(qLower))
  );

  // Search in Grammar Modules
  const matchingGrammar = grammarData.filter(g =>
    g.topic_ro.toLowerCase().includes(qLower) ||
    (g.topic_ar && g.topic_ar.includes(qLower)) ||
    (g.topic_en && g.topic_en.toLowerCase().includes(qLower)) ||
    (g.explanation_ar && g.explanation_ar.includes(qLower))
  );

  // Search in Conversations
  const matchingConversations = conversationData.filter(c =>
    c.title_ro.toLowerCase().includes(qLower) ||
    (c.title_ar && c.title_ar.includes(qLower)) ||
    (c.category_ar && c.category_ar.includes(qLower))
  );

  if (matchingQuestions.length > 0) {
    const top = matchingQuestions[0];
    let text = '';
    if (lang === 'en') {
      text = `🇷🇴 **Official Citizenship Exam Question Match:**\n\n` +
        `**Question (RO):** ${top.question}\n` +
        `**Model Answer:** ${top.answer}\n\n` +
        `🇬🇧 **English:** ${top.question_en || top.question}\n` +
        `**Answer:** ${top.answer_en || top.answer}\n\n` +
        `🇸🇦 **Arabic:** ${top.question_ar}\n` +
        `**Answer:** ${top.answer_ar}`;
    } else if (lang === 'ro') {
      text = `🇷🇴 **Întrebare Oficială ANC Cetățenie:**\n\n` +
        `**Întrebare:** ${top.question}\n` +
        `**Răspuns Model:** ${top.answer}\n\n` +
        `🇸🇦 **Traducere Arabă:** ${top.question_ar}\n` +
        `🇬🇧 **Traducere Engleză:** ${top.question_en || top.question}`;
    } else {
      text = `🇷🇴 **إجابة نموذجية من منهج الجنسية الرسمي (ANC):**\n\n` +
        `**السؤال بالرومانية:** ${top.question}\n` +
        `**الإجابة النموذجية:** ${top.answer}\n\n` +
        `🇸🇦 **الترجمة العربية:** ${top.question_ar}\n` +
        `**الإجابة بالعربية:** ${top.answer_ar}\n\n` +
        `🇬🇧 **English:** ${top.question_en || top.question}\n` +
        `**Answer:** ${top.answer_en || top.answer}`;
    }

    return {
      success: true,
      text: text,
      source: 'dataset_question',
      image: top.image,
      wiki_url: top.wiki_url
    };
  }

  if (matchingGrammar.length > 0) {
    const gTop = matchingGrammar[0];
    let text = `📚 **درس قواعد ذو صلة / Grammar Topic Match:**\n\n` +
      `**الموضوع:** ${gTop.topic_ro}\n` +
      `🇸🇦 **الشرح:** ${gTop.explanation_ar}\n\n` +
      `💡 **نصيحة سريعة:** ${gTop.easy_tip_ar}`;

    return {
      success: true,
      text: text,
      source: 'dataset_grammar'
    };
  }

  // 3. Perform Live Online Wikipedia Search for unmatched topics!
  const onlineResult = await searchOnlineKnowledge(query, lang);
  if (onlineResult) {
    let text = `🌐 **نتائج البحث الحي عبر الإنترنت / Online Live Search Result:**\n\n` +
      `**الموضوع:** ${onlineResult.title}\n\n` +
      `${onlineResult.extract}\n\n` +
      `🔗 [اقرأ المزيد على Wikipedia](${onlineResult.url})`;

    return {
      success: true,
      text: text,
      source: 'online_search',
      image: onlineResult.thumbnail,
      wiki_url: onlineResult.url
    };
  }

  // 4. Default AI Citizenship Response
  if (lang === 'en') {
    return {
      success: true,
      text: `🤖 **AI Citizenship Tutor:**\n\n` +
        `I am ready to answer any questions about Romanian Citizenship, History, Constitution, Geography, and Language Grammar!\n\n` +
        `💡 Try asking: "Who was Stephen the Great?", "Form of government in Romania", or "What is the capital of Romania?".`,
      source: 'ai_tutor'
    };
  } else if (lang === 'ro') {
    return {
      success: true,
      text: `🤖 **Asistent AI Cetățenie:**\n\n` +
        `Sunt pregătit să răspund la orice întrebare despre cetățenia română, istorie, constituție, geografie și gramatică!\n\n` +
        `💡 Încearcă: „Cine a fost Ștefan cel Mare?”, „Forma de guvernământ”, sau „Fluviul Dunărea”.`,
      source: 'ai_tutor'
    };
  }

  return {
    success: true,
    text: `🤖 **المساعد الذكي للجنسية الرومانية:**\n\n` +
      `أنا مستعد لإجابتك عن أي سؤال يتعلق بالجنسية الرومانية، الدستور، التاريخ، الجغرافيا، أو قواعد اللغة!\n\n` +
      `💡 جرب البحث عن: "من هو ستيفان تشيل ماري؟"، "شكل الحكومة في رومانيا"، أو "معلومات عن نهر الدانوب".`,
    source: 'ai_tutor'
  };
}
