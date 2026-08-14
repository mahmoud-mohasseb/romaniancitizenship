import questions from '../data/questions_ar.json';
import grammarData from '../data/romanian_grammar.json';
import conversationData from '../data/romanian_conversations.json';

const DEFAULT_MODEL = 'Llama-3.2-1B-Instruct-q4f16_1-MLC';

let webLlmEngine = null;
let isInitializing = false;

/**
 * Auto Initialize WebLLM Client-Side In-Browser Engine (@mlc-ai/web-llm)
 */
export async function initWebLLMEngine(selectedModel = DEFAULT_MODEL, onProgress) {
  if (typeof window === 'undefined' || webLlmEngine || isInitializing) return webLlmEngine;
  
  try {
    isInitializing = true;
    const { CreateMLCEngine } = await import('@mlc-ai/web-llm');
    webLlmEngine = await CreateMLCEngine(selectedModel, {
      initProgressCallback: (progress) => {
        if (onProgress) onProgress(progress);
      }
    });
    isInitializing = false;
    return webLlmEngine;
  } catch (error) {
    isInitializing = false;
    console.log('[WebLLM Engine] Fallback to Autonomous Knowledge Engine:', error);
    return null;
  }
}

/**
 * Autonomous Online Wikipedia Knowledge Fetcher (Works in Installed PWA & Standalone Apps)
 */
export async function searchOnlineKnowledge(topic, lang = 'ar') {
  if (!topic) return null;

  try {
    const searchLangs = lang === 'ro' ? ['ro', 'en'] : ['en', 'ro'];

    for (const searchLang of searchLangs) {
      // 1. Try REST API Summary
      try {
        const response = await fetch(`https://${searchLang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.extract) {
            return {
              title: data.title,
              extract: data.extract,
              url: data.content_urls?.desktop?.page || `https://${searchLang}.wikipedia.org/wiki/${encodeURIComponent(topic)}`,
              thumbnail: data.thumbnail?.source || ''
            };
          }
        }
      } catch (e) {
        console.log(`REST API summary attempt failed for ${searchLang}:`, e);
      }

      // 2. Try MediaWiki API Query (Works everywhere with origin=*)
      try {
        const mwUrl = `https://${searchLang}.wikipedia.org/w/api.php?action=query&prop=extracts|pageimages&exintro=1&explaintext=1&piprop=thumbnail&pithumbsize=600&titles=${encodeURIComponent(topic)}&format=json&origin=*`;
        const mwRes = await fetch(mwUrl);
        if (mwRes.ok) {
          const mwData = await mwRes.json();
          const pages = mwData?.query?.pages;
          if (pages) {
            const pageKey = Object.keys(pages)[0];
            const page = pages[pageKey];
            if (page && page.extract && page.pageid > 0) {
              return {
                title: page.title,
                extract: page.extract,
                url: `https://${searchLang}.wikipedia.org/wiki/${encodeURIComponent(page.title)}`,
                thumbnail: page.thumbnail?.source || ''
              };
            }
          }
        }
      } catch (e) {
        console.log(`MediaWiki query attempt failed for ${searchLang}:`, e);
      }
    }
  } catch (e) {
    console.log('Online search exception:', e);
  }
  return null;
}

/**
 * Autonomous Smart AI Query Function (No WebLlama Server Required)
 */
export async function queryWebLlama(prompt, model = DEFAULT_MODEL, webLlamaUrl = '', lang = 'ar') {
  const query = (prompt || '').trim();
  if (!query) return { success: false, text: '' };

  // 1. Try In-Browser WebLLM Engine if loaded
  if (webLlmEngine) {
    try {
      const reply = await webLlmEngine.chat.completions.create({
        messages: [
          { role: 'system', content: 'You are an expert Romanian Citizenship Exam Tutor. Provide a concise, clear, and encouraging answer.' },
          { role: 'user', content: query }
        ]
      });
      const replyText = reply.choices[0]?.message?.content;
      if (replyText) {
        return { success: true, text: replyText, source: 'webllm' };
      }
    } catch (e) {
      console.log('[WebLLM Execution] Fallback to Autonomous Knowledge Engine');
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
      text = `🇷🇴 **Official ANC Citizenship Question Match:**\n\n` +
        `**Question (RO):** ${top.question}\n` +
        `**Official Model Answer:** ${top.answer}\n\n` +
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
    let text = `📚 **شرح من دليل قواعد الرومانية (Romanian Grammar):**\n\n` +
      `**الموضوع:** ${gTop.topic_ro}\n` +
      `🇸🇦 **الشرح بالتفصيل:** ${gTop.explanation_ar}\n\n` +
      `💡 **مفتاح القاعدة:** ${gTop.easy_tip_ar}`;

    return {
      success: true,
      text: text,
      source: 'dataset_grammar'
    };
  }

  // 3. Perform Autonomous Live Online Search
  const onlineResult = await searchOnlineKnowledge(query, lang);
  if (onlineResult) {
    let text = `🌐 **معلومات شاملة وموثقة (Online Smart Knowledge Result):**\n\n` +
      `**الموضوع:** ${onlineResult.title}\n\n` +
      `${onlineResult.extract}\n\n` +
      `🔗 [اقرأ التقرير الكامل على Wikipedia](${onlineResult.url})`;

    return {
      success: true,
      text: text,
      source: 'online_search',
      image: onlineResult.thumbnail,
      wiki_url: onlineResult.url
    };
  }

  // 4. Autonomous Smart Fallback Response
  if (lang === 'en') {
    return {
      success: true,
      text: `🤖 **Smart Citizenship Tutor:**\n\n` +
        `Regarding "${query}": The Romanian Citizenship oral interview focuses on Romanian History, Constitution (Article 1-148), Geography, and Language.\n\n` +
        `💡 Try asking: "Who was Stephen the Great?", "Form of government in Romania", or "What is the capital of Romania?".`,
      source: 'ai_tutor'
    };
  } else if (lang === 'ro') {
    return {
      success: true,
      text: `🤖 **Asistent Smart AI Cetățenie:**\n\n` +
        `Cu privire la „${query}”: Examenul de cetățenie română se bazează pe istorie, constituție (articolele 1-148), geografie și limba română.\n\n` +
        `💡 Încearcă: „Cine a fost Ștefan cel Mare?”, „Forma de guvernământ”, sau „Fluviul Dunărea”.`,
      source: 'ai_tutor'
    };
  }

  return {
    success: true,
    text: `🤖 **مساعد الجنسية الذكي المدمج:**\n\n` +
      `بخصوص "${query}": يركز اختبار الجنسية الرومانية ANC على التاريخ الروماني، الدستور (المواد 1-148)، الجغرافيا، وقواعد اللغة الرومانية.\n\n` +
      `💡 جرب البحث عن: "من هو ستيفان تشيل ماري؟"، "شكل الحكومة في رومانيا"، أو "معلومات عن نهر الدانوب".`,
    source: 'ai_tutor'
  };
}

export const queryOllama = queryWebLlama;
