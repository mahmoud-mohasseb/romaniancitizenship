import questions from '../data/questions_ar.json';
import grammarData from '../data/romanian_grammar.json';
import conversationData from '../data/romanian_conversations.json';

/**
 * Free Online Wikipedia Knowledge Fetcher (REST API + MediaWiki CORS)
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

      // 2. Try MediaWiki API Query
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
 * Senior Software Engineer AI Tutor Knowledge Engine
 * 100% Free, Zero-Latency, Hybrid Online & Offline Capabilities
 */
export async function queryAITutor(prompt, lang = 'ar') {
  const query = (prompt || '').trim();
  if (!query) return { success: false, text: '' };

  const qLower = query.toLowerCase();
  const words = qLower.split(/\s+/).filter(w => w.length > 2);

  // 1. Direct Search in 469 ANC Citizenship Official Questions Dataset
  const matchingQuestions = questions.filter(q => {
    const qRo = (q.question || '').toLowerCase();
    const aRo = (q.answer || '').toLowerCase();
    const qAr = (q.question_ar || '').toLowerCase();
    const aAr = (q.answer_ar || '').toLowerCase();
    const qEn = (q.question_en || '').toLowerCase();
    const aEn = (q.answer_en || '').toLowerCase();

    if (qRo.includes(qLower) || aRo.includes(qLower) || qAr.includes(qLower) || aAr.includes(qLower) || qEn.includes(qLower)) {
      return true;
    }
    return words.length > 0 && words.every(w => qRo.includes(w) || aRo.includes(w) || qAr.includes(w) || aAr.includes(w));
  });

  if (matchingQuestions.length > 0) {
    const top = matchingQuestions[0];
    let formattedText = '';

    if (lang === 'en') {
      formattedText = `🇷🇴 **Official ANC Citizenship Question Match:**\n\n` +
        `**Question (RO):** ${top.question}\n` +
        `**Official Model Answer:** ${top.answer}\n\n` +
        `🇬🇧 **English:** ${top.question_en || top.question}\n` +
        `**Answer:** ${top.answer_en || top.answer}\n\n` +
        `🇸🇦 **Arabic Context:** ${top.question_ar}\n` +
        `**Answer:** ${top.answer_ar}\n\n` +
        `💡 **Exam Tip:** Practice pronouncing the Romanian answer clearly in front of the citizenship committee!`;
    } else if (lang === 'ro') {
      formattedText = `🇷🇴 **Întrebare Oficială ANC Cetățenie:**\n\n` +
        `**Întrebare:** ${top.question}\n` +
        `**Răspuns Model:** ${top.answer}\n\n` +
        `🇸🇦 **Traducere Arabă:** ${top.question_ar} - ${top.answer_ar}\n` +
        `🇬🇧 **Traducere Engleză:** ${top.question_en || top.question}\n\n` +
        `💡 **Sfat Examen:** Răspunsul trebuie rostit clar și cu încredere în fața comisiei ANC.`;
    } else {
      formattedText = `🇷🇴 **إجابة رسمية معتمدة من لجنة الجنسية الرومانية (ANC):**\n\n` +
        `**السؤال بالرومانية:** ${top.question}\n` +
        `**الإجابة النموذجية:** ${top.answer}\n\n` +
        `🇸🇦 **الترجمة والشرح بالعربية:** ${top.question_ar}\n` +
        `**الإجابة:** ${top.answer_ar}\n\n` +
        `🇬🇧 **English:** ${top.question_en || top.question} | ${top.answer_en || top.answer}\n\n` +
        `💡 **نصيحة مهندس الاختبار:** احرص على نطق الإجابة باللغة الرومانية بوضوح وثقة أمام أعضاء اللجنة!`;
    }

    return {
      success: true,
      text: formattedText,
      source: 'dataset_question',
      image: top.image,
      wiki_url: top.wiki_url
    };
  }

  // 2. Search in Romanian Grammar Rules Dataset
  const matchingGrammar = grammarData.filter(g => {
    const tRo = (g.topic_ro || '').toLowerCase();
    const tAr = (g.topic_ar || '').toLowerCase();
    const exp = (g.explanation_ar || '').toLowerCase();
    return tRo.includes(qLower) || tAr.includes(qLower) || exp.includes(qLower) || (words.length > 0 && words.some(w => tRo.includes(w) || tAr.includes(w)));
  });

  if (matchingGrammar.length > 0) {
    const gTop = matchingGrammar[0];
    let formattedText = '';

    if (lang === 'en') {
      formattedText = `📚 **Romanian Grammar Rule Guide:**\n\n` +
        `**Topic:** ${gTop.topic_ro} (${gTop.topic_en || gTop.topic_ro})\n\n` +
        `🇸🇦 **Explanation:** ${gTop.explanation_ar}\n\n` +
        `💡 **Grammar Tip:** ${gTop.easy_tip_ar || 'Pay attention to noun gender and diacritics!'}`;
    } else {
      formattedText = `📚 **دليل قواعد اللغة الرومانية (Romanian Grammar Guide):**\n\n` +
        `**الموضوع بالرومانية:** ${gTop.topic_ro}\n\n` +
        `🇸🇦 **الشرح والتوضيح:** ${gTop.explanation_ar}\n\n` +
        `💡 **مفتاح القاعدة للنطق والمعاملات:** ${gTop.easy_tip_ar || 'انتبه للأجناس والأحرف الخاصة (Ă, Î, Â, Ș, Ț).'}`;
    }

    return {
      success: true,
      text: formattedText,
      source: 'dataset_grammar'
    };
  }

  // 3. Search in Daily Conversations & Oral Interview Simulations
  const matchingConversations = conversationData.filter(c => {
    const titleRo = (c.title_ro || '').toLowerCase();
    const titleAr = (c.title_ar || '').toLowerCase();
    return titleRo.includes(qLower) || titleAr.includes(qLower);
  });

  if (matchingConversations.length > 0) {
    const cTop = matchingConversations[0];
    let formattedText = `🗣️ **حوار ونموذج محاكاة شفهية (Oral Interview Dialogue):**\n\n` +
      `**الموضوع:** ${cTop.title_ro} (${cTop.title_ar})\n\n`;

    if (cTop.dialogue && cTop.dialogue.length > 0) {
      const sample = cTop.dialogue.slice(0, 3);
      sample.forEach(d => {
        formattedText += `🔹 **${d.speaker_ro}:** ${d.text_ro}\n   🇸🇦 ${d.text_ar}\n\n`;
      });
    }

    return {
      success: true,
      text: formattedText,
      source: 'dataset_conversation'
    };
  }

  // 4. Perform Autonomous Free Live Online Search (Wikipedia REST & MediaWiki CORS)
  const onlineResult = await searchOnlineKnowledge(query, lang);
  if (onlineResult) {
    let formattedText = '';
    if (lang === 'en') {
      formattedText = `🌐 **Live Knowledge Search Result:**\n\n` +
        `**Topic:** ${onlineResult.title}\n\n` +
        `${onlineResult.extract}\n\n` +
        `🔗 [Read full article on Wikipedia](${onlineResult.url})`;
    } else {
      formattedText = `🌐 **معلومات شاملة وموثقة (Free Live Online Knowledge Result):**\n\n` +
        `**الموضوع:** ${onlineResult.title}\n\n` +
        `${onlineResult.extract}\n\n` +
        `🔗 [اقرأ التقرير والتفاصيل الكاملة على Wikipedia](${onlineResult.url})`;
    }

    return {
      success: true,
      text: formattedText,
      source: 'online_search',
      image: onlineResult.thumbnail,
      wiki_url: onlineResult.url
    };
  }

  // 5. Intelligent Citizenship Assistant Smart Fallback
  let defaultResponse = '';
  if (lang === 'en') {
    defaultResponse = `🤖 **Smart Romanian Citizenship AI Tutor:**\n\n` +
      `Regarding "${query}": The Romanian Citizenship Exam (ANC) covers:\n` +
      `1. **Romanian Constitution** (Articles 1-148, National Symbols, Anthem, Flag)\n` +
      `2. **Romanian History** (Stephen the Great, Mihai Viteazul, Alexandru Ioan Cuza, 1918 Great Union)\n` +
      `3. **Geography** (Carpathian Mountains, Danube River, Black Sea, Counties & Cities)\n` +
      `4. **Language & Grammar** (Verbs, Nouns, Polite Greetings)\n\n` +
      `💡 *Try asking:* "Who was Stephen the Great?", "Article 1 of Constitution", or "Conjugation of verb a fi".`;
  } else if (lang === 'ro') {
    defaultResponse = `🤖 **Asistent Smart AI Cetățenie:**\n\n` +
      `Cu privire la „${query}”: Examenul de cetățenie română ANC cuprinde:\n` +
      `1. **Constituția României** (Articolele 1-148, Simboluri Naționale, Imn, Drapel)\n` +
      `2. **Istoria României** (Ștefan cel Mare, Mihai Viteazul, Alexandru Ioan Cuza, Marea Unire din 1918)\n` +
      `3. **Geografia** (Carpații, Dunărea, Marea Neagră, Județe și Orașe)\n` +
      `4. **Limba și Gramatica** (Verbe, Substantive, Saluturi de curtoazie)\n\n` +
      `💡 *Încearcă:* „Cine a fost Ștefan cel Mare?”, „Articolul 1 din Constituție”, sau „Fluviul Dunărea”.`;
  } else {
    defaultResponse = `🤖 **مساعد الجنسية الرومانية الذكي المجاني:**\n\n` +
      `بخصوص استفسارك عن "${query}": يركز اختبار الجنسية الرومانية ANC على المحاور الأساسية التالية:\n` +
      `1. **الدستور الروماني** (المواد 1-148، الرموز الوطنية، النشيد الوطني، العلم)\n` +
      `2. **التاريخ الروماني** (ستيفان تشيل ماري، ميهاي فيتيزول، ألكسندرو إيوان كوزا، الاتحاد العظيم 1918)\n` +
      `3. **الجغرافيا** (جبال الكربات، نهر الدانوب، البحر الأسود، المحافظات والمدن)\n` +
      `4. **اللغة والقواعد** (تصريف الأفعال، الأسماء، تحيات اللباقة والتعريف بالنفس)\n\n` +
      `💡 *جرب البحث عن:* "من هو ستيفان تشيل ماري؟"، "المادة 1 من الدستور"، أو "تصريف الفعل a fi".`;
  }

  return {
    success: true,
    text: defaultResponse,
    source: 'ai_tutor'
  };
}

export const queryWebLlama = queryAITutor;
export const queryOllama = queryAITutor;
