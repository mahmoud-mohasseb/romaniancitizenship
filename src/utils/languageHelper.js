// UI Interface Localizations for English & Arabic

export const UI_STRINGS = {
  ar: {
    appTitle: 'الجنسية الرومانية',
    appSubtitle: 'دليلك المتكامل لاجتياز الاختبار الشفهي للجنسية الرومانية مع الصور والترجمة',
    studyNow: 'ابدأ المذاكرة المصورة',
    testYourself: 'اختبر نفسك',
    questionsCount: 'سؤال مصور',
    categoriesCount: 'تصنيفات',
    languagesCount: 'لغات (روماني/عربي/إنجليزي)',
    selectLangLabel: 'اختر لغة واجهة التطبيق والترجمة:',
    allCategories: 'جميع التصنيفات',
    constitutionCat: 'الدستور والحكومة',
    historyCat: 'التاريخ والشخصيات',
    geographyCat: 'الجغرافيا والطبيعة',
    cultureCat: 'الثقافة والأدب',
    generalCat: 'معلومات عامة واللغة',
    showAnswer: 'عرض الإجابة والترجمة',
    modelAnswer: 'الإجابة النموذجية بالرومانية والترجمة:',
    prev: 'السابق',
    next: 'التالي',
    zoomImage: 'عرض الصورة بالكامل 🔍',
    close: 'إغلاق',
    question: 'سؤال',
    of: 'من',
    score: 'النتيجة',
    quickQuizTitle: 'اختبار سريع (10 أسئلة)',
    quickQuizDesc: 'اختبار ممارسة عشوائي وسريع',
    examQuizTitle: 'محاكاة الامتحان الرسمي (25 سؤالاً)',
    examQuizDesc: 'اختبار موقوت 20 دقيقة يحاكي اللجنة الرسمية',
    chooseCorrectAns: 'اختر الإجابة الصحيحة بالرومانية:',
    quizFinished: 'انتهى الاختبار!',
    passedExam: 'تهانينا! لقد اجتزت الاختبار بنجاح 🏆',
    failedExam: 'لم تجتز الاختبار، واصل المراجعة والمحاولة!',
    reviewWrong: 'مراجعة الأخطاء والأسئلة غير المحلولة',
    retakeQuiz: 'إعادة الاختبار',
    backHome: 'العودة للرئيسية',
    romanianText: 'الرومانية',
    arabicText: 'العربية',
    englishText: 'الإنجليزي',
  },
  en: {
    appTitle: 'Romanian Citizenship Prep',
    appSubtitle: 'Comprehensive guide for Romanian Citizenship oral interview with photos & translations',
    studyNow: 'Start Illustrated Study',
    testYourself: 'Test Yourself (Quizzes)',
    questionsCount: 'Visual Questions',
    categoriesCount: 'Categories',
    languagesCount: 'Languages (RO/AR/EN)',
    selectLangLabel: 'App & Translation Language:',
    allCategories: 'All Categories',
    constitutionCat: 'Constitution & Law',
    historyCat: 'History & Figures',
    geographyCat: 'Geography & Nature',
    cultureCat: 'Culture & Literature',
    generalCat: 'General & Language',
    showAnswer: 'Show Answer & Translation',
    modelAnswer: 'Model Romanian Answer & Translation:',
    prev: 'Previous',
    next: 'Next',
    zoomImage: 'View Full Entire Image 🔍',
    close: 'Close',
    question: 'Question',
    of: 'of',
    score: 'Score',
    quickQuizTitle: 'Quick Quiz (10 Questions)',
    quickQuizDesc: 'Fast random self-assessment quiz',
    examQuizTitle: 'Official Exam Simulation (25 Qs)',
    examQuizDesc: 'Timed 20-min official citizenship interview exam',
    chooseCorrectAns: 'Select the correct answer in Romanian:',
    quizFinished: 'Quiz Completed!',
    passedExam: 'Congratulations! You Passed the Exam 🏆',
    failedExam: 'You did not pass. Review and try again!',
    reviewWrong: 'Review Incorrect Answers',
    retakeQuiz: 'Retake Quiz',
    backHome: 'Back to Home',
    romanianText: 'Romanian',
    arabicText: 'Arabic',
    englishText: 'English',
  }
};

export function getQuestionText(q, lang = 'ar') {
  if (!q) return '';
  if (lang === 'en') {
    if (q.question_en && q.question_en !== q.question) return q.question_en;
    if (q.question.startsWith('Care este ')) return 'What is ' + q.question.slice(10);
    if (q.question.startsWith('Care sunt ')) return 'What are ' + q.question.slice(10);
    if (q.question.startsWith('Cine a fost ')) return 'Who was ' + q.question.slice(12);
    if (q.question.startsWith('Cine este ')) return 'Who is ' + q.question.slice(10);
    if (q.question.startsWith('Ce știți despre ')) return 'What do you know about ' + q.question.slice(16);
    if (q.question.startsWith('Enumerați ')) return 'List ' + q.question.slice(10);
    return q.question_ar || q.question;
  }
  return q.question_ar || q.question;
}

export function getAnswerText(q, lang = 'ar') {
  if (!q) return '';
  if (lang === 'en') {
    if (q.answer_en && q.answer_en !== q.answer) return q.answer_en;
    return q.answer_ar || q.answer;
  }
  return q.answer_ar || q.answer;
}
