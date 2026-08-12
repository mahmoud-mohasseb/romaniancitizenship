import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView, 
  Image,
  Dimensions,
  Modal,
  Linking 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import questions from '../data/questions_ar.json';
import { getCategoryMeta, CATEGORIES_LIST } from '../utils/categories';
import { getQuestionText, getAnswerText, UI_STRINGS } from '../utils/languageHelper';

const { width, height } = Dimensions.get('window');

export default function QuizScreen({ route, navigation }) {
  const quizMode = route?.params?.quizMode || 'quick'; // 'quick' (10 Qs) or 'exam' (25 Qs, timed)
  const initialCategory = route?.params?.initialCategory || 'all';
  const initialAppLang = route?.params?.appLang || 'ar';

  const [appLang, setAppLang] = useState(initialAppLang);
  const strings = UI_STRINGS[appLang];

  const totalQuestionsLimit = quizMode === 'exam' ? 25 : 10;
  const initialTimeSeconds = quizMode === 'exam' ? 20 * 60 : null; // 20 minutes

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(initialTimeSeconds);
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const timerRef = useRef(null);

  const questionPool = selectedCategory === 'all' 
    ? questions 
    : questions.filter(q => q.category === selectedCategory);

  useEffect(() => {
    resetQuiz();
  }, [selectedCategory, quizMode]);

  useEffect(() => {
    if (quizMode === 'exam' && !isFinished && timeLeft !== null) {
      if (timeLeft <= 0) {
        setIsFinished(true);
        return;
      }
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft, isFinished, quizMode]);

  const generateQuestion = () => {
    if (questionCount >= totalQuestionsLimit || questionPool.length === 0) {
      setIsFinished(true);
      return;
    }

    const randomIdx = Math.floor(Math.random() * questionPool.length);
    const correctQ = questionPool[randomIdx];
    
    let wrongOptions = [];
    while (wrongOptions.length < 3) {
      const wrongIdx = Math.floor(Math.random() * questions.length);
      const wrongAns = questions[wrongIdx].answer;
      if (wrongAns && wrongAns !== correctQ.answer && !wrongOptions.includes(wrongAns)) {
        wrongOptions.push(wrongAns);
      }
    }

    let allOptions = [correctQ.answer, ...wrongOptions];
    allOptions.sort(() => Math.random() - 0.5);

    setCurrentQuestion(correctQ);
    setOptions(allOptions);
    setSelectedOption(null);
    setQuestionCount(prev => prev + 1);
  };

  const handleSelect = (option) => {
    if (selectedOption) return;
    
    setSelectedOption(option);
    if (option === currentQuestion.answer) {
      setScore(prev => prev + 1);
    } else {
      setWrongAnswers(prev => [...prev, { question: currentQuestion, userSelected: option }]);
    }

    setTimeout(() => {
      generateQuestion();
    }, 1400);
  };

  const resetQuiz = () => {
    setScore(0);
    setQuestionCount(0);
    setIsFinished(false);
    setWrongAnswers([]);
    setTimeLeft(initialTimeSeconds);
    setShowReviewModal(false);
    generateQuestion();
  };

  const formatTimer = (seconds) => {
    if (seconds === null) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const openWikiUrl = (url) => {
    const wiki = url || currentQuestion?.wiki_url || 'https://en.wikipedia.org/wiki/Romania';
    Linking.openURL(wiki).catch(err => console.log("Couldn't open Wikipedia link", err));
  };

  const percentage = Math.round((score / totalQuestionsLimit) * 100);
  const isPassed = percentage >= 75;

  if (isFinished) {
    const categoryMeta = getCategoryMeta(selectedCategory);

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.resultScroll}>
          <View style={styles.resultContainer}>
            <View style={[styles.trophyCircle, { backgroundColor: isPassed ? 'rgba(78, 204, 163, 0.15)' : 'rgba(233, 69, 96, 0.15)' }]}>
              <Ionicons 
                name={isPassed ? "trophy" : "close-circle-outline"} 
                size={70} 
                color={isPassed ? "#FFD700" : "#E94560"} 
              />
            </View>

            <Text style={styles.resultTitle}>
              {isPassed ? strings.passedExam : strings.failedExam}
            </Text>
            
            <Text style={styles.categoryResultTag}>
              {quizMode === 'exam' ? strings.examQuizTitle : strings.quickQuizTitle} - {appLang === 'ar' ? categoryMeta.name_ar : categoryMeta.name_en}
            </Text>
            
            <View style={[styles.scoreBox, { borderColor: isPassed ? '#4ECCA3' : '#E94560' }]}>
              <Text style={[styles.scoreText, { color: isPassed ? '#4ECCA3' : '#E94560' }]}>
                {score} / {totalQuestionsLimit}
              </Text>
              <Text style={styles.scorePercentage}>{strings.score}: {percentage}%</Text>
              <Text style={[styles.passBadgeText, { color: isPassed ? '#4ECCA3' : '#E94560' }]}>
                {isPassed ? (appLang === 'ar' ? '✅ ناجح (مستوف لشروط المقابلة الرسمية)' : '✅ Passed Official Standard') : (appLang === 'ar' ? '❌ غير ناجح (الحد الأدنى 75%)' : '❌ Below Pass Mark (75% Minimum)')}
              </Text>
            </View>

            {wrongAnswers.length > 0 && (
              <TouchableOpacity 
                style={styles.reviewBtn} 
                onPress={() => setShowReviewModal(true)}
              >
                <Ionicons name="alert-circle-outline" size={20} color="#FFB800" style={{ marginRight: 8 }} />
                <Text style={styles.reviewBtnText}>{strings.reviewWrong} ({wrongAnswers.length})</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.btnPrimary} onPress={resetQuiz}>
              <Ionicons name="refresh-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
              <Text style={styles.btnText}>{strings.retakeQuiz}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnSecondary} onPress={() => navigation.goBack()}>
              <Text style={styles.btnSecondaryText}>{strings.backHome}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Modal to Review Missed Questions */}
        <Modal
          visible={showReviewModal}
          animationType="slide"
          onRequestClose={() => setShowReviewModal(false)}
        >
          <SafeAreaView style={{ flex: 1, backgroundColor: '#0F172A' }}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderTitle}>{strings.reviewWrong}</Text>
              <TouchableOpacity onPress={() => setShowReviewModal(false)}>
                <Ionicons name="close" size={28} color="#FFF" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ padding: 16 }}>
              {wrongAnswers.map((item, idx) => (
                <View key={idx} style={styles.wrongReviewCard}>
                  <Text style={styles.wrongNumBadge}>{strings.question} #{item.question.id}</Text>
                  <Text style={styles.wrongRoQ}>{item.question.question}</Text>
                  <Text style={styles.wrongArQ}>🇸🇦 {item.question.question_ar}</Text>
                  <Text style={styles.wrongEnQ}>🇬🇧 {getQuestionText(item.question, 'en')}</Text>
                  
                  <TouchableOpacity 
                    style={styles.wrongWikiBtn}
                    onPress={() => openWikiUrl(item.question.wiki_url)}
                  >
                    <Ionicons name="logo-wikipedia" size={14} color="#FFF" style={{ marginRight: 4 }} />
                    <Text style={styles.wrongWikiBtnText}>مقال ويكيبيديا ℹ️</Text>
                  </TouchableOpacity>

                  <View style={styles.divider} />
                  
                  <Text style={styles.userWrongAnsLabel}>Your Choice: {item.userSelected}</Text>
                  <Text style={styles.correctAnsLabel}>Correct RO: {item.question.answer}</Text>
                  <Text style={styles.correctArAnsLabel}>🇸🇦 {item.question.answer_ar}</Text>
                  <Text style={styles.correctEnAnsLabel}>🇬🇧 {getAnswerText(item.question, 'en')}</Text>
                </View>
              ))}
            </ScrollView>
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    );
  }

  if (!currentQuestion) return null;

  const categoryMeta = getCategoryMeta(currentQuestion.category || selectedCategory);

  return (
    <SafeAreaView style={styles.container}>
      {/* Quiz Top Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="close" size={26} color="#FFF" />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>
            {strings.question} {questionCount} {strings.of} {totalQuestionsLimit}
          </Text>
          <Text style={[styles.categoryHeaderSubtitle, { color: categoryMeta.color }]}>
            {appLang === 'ar' ? categoryMeta.name_ar : categoryMeta.name_en}
          </Text>
        </View>

        {quizMode === 'exam' ? (
          <View style={styles.timerBadge}>
            <Ionicons name="time-outline" size={14} color="#FFF" style={{ marginRight: 4 }} />
            <Text style={styles.timerBadgeText}>{formatTimer(timeLeft)}</Text>
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.langToggleHeaderBtn}
            onPress={() => setAppLang(appLang === 'ar' ? 'en' : 'ar')}
          >
            <Text style={styles.langToggleHeaderBtnText}>
              {appLang === 'ar' ? 'EN' : 'AR'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Category Picker Bar */}
      <View style={styles.categoryPickerStrip}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
          {CATEGORIES_LIST.map((cat) => {
            const isSel = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.catChip, isSel && { backgroundColor: cat.color, borderColor: cat.color }]}
                onPress={() => setSelectedCategory(cat.id)}
              >
                <Text style={[styles.catChipText, isSel && { color: '#FFF', fontWeight: 'bold' }]}>
                  {appLang === 'ar' ? cat.name_ar : cat.name_en}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Question Card with Framed Wikipedia Image (resizeMode: contain) */}
        <View style={styles.questionCard}>
          <TouchableOpacity 
            style={styles.quizImageContainer} 
            activeOpacity={0.9}
            onPress={() => setImageModalVisible(true)}
          >
            <View style={styles.quizImageWrapper}>
              <Image 
                source={{ uri: currentQuestion.image }} 
                style={styles.entireQuizImage} 
                resizeMode="contain" 
              />
            </View>
            <View style={[styles.quizCategoryTag, { backgroundColor: categoryMeta.color }]}>
              <Text style={styles.quizCategoryTagText}>
                {appLang === 'ar' ? categoryMeta.name_ar : categoryMeta.name_en}
              </Text>
            </View>
            <View style={styles.zoomHintBtn}>
              <Ionicons name="expand" size={12} color="#FFF" style={{ marginRight: 4 }} />
              <Text style={styles.zoomHintText}>{strings.zoomImage}</Text>
            </View>
          </TouchableOpacity>

          {/* Wikipedia Link & AI Assistant Bar */}
          <View style={styles.quizToolbar}>
            <TouchableOpacity 
              style={styles.wikiLinkBtn}
              onPress={() => openWikiUrl(currentQuestion.wiki_url)}
            >
              <Ionicons name="logo-wikipedia" size={14} color="#FFF" style={{ marginRight: 4 }} />
              <Text style={styles.wikiLinkBtnText}>ويكيبيديا ℹ️</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.aiTutorBtn}
              onPress={() => navigation.navigate('AI', { appLang, initialPrompt: currentQuestion.question })}
            >
              <Ionicons name="sparkles" size={14} color="#FFD700" style={{ marginRight: 4 }} />
              <Text style={styles.aiTutorBtnText}>اسأل AI</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.questionContent}>
            <Text style={styles.roQuestion}>{currentQuestion.question}</Text>
            <View style={styles.divider} />
            
            {/* Arabic Question Translation */}
            <View style={{ marginBottom: 6 }}>
              <Text style={styles.transTag}>🇸🇦 Arabic:</Text>
              <Text style={styles.arQuestion}>{currentQuestion.question_ar}</Text>
            </View>

            {/* English Question Translation */}
            <View style={{ marginTop: 6 }}>
              <Text style={[styles.transTag, { color: '#4ECCA3' }]}>🇬🇧 English:</Text>
              <Text style={styles.enQuestion}>{getQuestionText(currentQuestion, 'en')}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.instructionText}>{strings.chooseCorrectAns}</Text>

        {options.map((option, index) => {
          let bgColor = '#1E293B';
          let borderColor = '#334155';
          let textColor = '#FFFFFF';
          
          if (selectedOption) {
            if (option === currentQuestion.answer) {
              bgColor = 'rgba(78, 204, 163, 0.25)';
              borderColor = '#4ECCA3';
              textColor = '#4ECCA3';
            } else if (option === selectedOption) {
              bgColor = 'rgba(233, 69, 96, 0.25)';
              borderColor = '#E94560';
              textColor = '#E94560';
            }
          }

          return (
            <TouchableOpacity
              key={index}
              style={[styles.optionBtn, { backgroundColor: bgColor, borderColor }]}
              onPress={() => handleSelect(option)}
              disabled={selectedOption !== null}
              activeOpacity={0.8}
            >
              <Text style={[styles.optionText, { color: textColor }]}>{option}</Text>
              
              {selectedOption && option === currentQuestion.answer && (
                <Ionicons name="checkmark-circle" size={24} color="#4ECCA3" style={styles.iconPos} />
              )}
              {selectedOption === option && option !== currentQuestion.answer && (
                <Ionicons name="close-circle" size={24} color="#E94560" style={styles.iconPos} />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Fullscreen Image Modal */}
      <Modal
        visible={imageModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setImageModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setImageModalVisible(false)}>
            <Ionicons name="close-circle" size={38} color="#FFF" />
          </TouchableOpacity>
          <Image 
            source={{ uri: currentQuestion.image }} 
            style={styles.modalFullImage} 
            resizeMode="contain" 
          />
          <View style={styles.modalCaption}>
            <Text style={styles.modalCaptionText}>
              {strings.question} #{currentQuestion.id} - {appLang === 'ar' ? categoryMeta.name_ar : categoryMeta.name_en}
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1E293B',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  backBtn: { padding: 4 },
  headerCenter: { alignItems: 'center' },
  headerTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  categoryHeaderSubtitle: { fontSize: 12, fontWeight: '600', marginTop: 2 },
  langToggleHeaderBtn: { backgroundColor: '#0F172A', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, borderWidth: 1, borderColor: '#334155' },
  langToggleHeaderBtnText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  scoreBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E94560', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6 },
  timerBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#4ECCA3', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 6 },
  timerBadgeText: { color: '#FFF', fontWeight: 'bold', fontSize: 13 },
  categoryPickerStrip: { backgroundColor: '#1E293B', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#334155' },
  catChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14, backgroundColor: '#0F172A', borderWidth: 1, borderColor: '#334155' },
  catChipText: { color: '#94A3B8', fontSize: 12 },
  content: { padding: 16, paddingBottom: 30 },
  questionCard: { backgroundColor: '#1E293B', borderRadius: 20, overflow: 'hidden', marginBottom: 20, borderWidth: 1, borderColor: '#334155' },
  quizImageContainer: { height: 200, width: '100%', position: 'relative', backgroundColor: '#020617', justifyContent: 'center', alignItems: 'center' },
  quizImageWrapper: { width: '100%', height: '100%', padding: 10 },
  entireQuizImage: { width: '100%', height: '100%' },
  quizCategoryTag: { position: 'absolute', top: 10, right: 10, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  quizCategoryTagText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  zoomHintBtn: { position: 'absolute', bottom: 10, left: 10, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.75)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  zoomHintText: { color: '#FFF', fontSize: 11 },
  quizToolbar: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 8, backgroundColor: '#0F172A', borderBottomWidth: 1, borderBottomColor: '#334155', gap: 8 },
  wikiLinkBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1E293B', paddingVertical: 6, borderRadius: 10, borderWidth: 1, borderColor: '#334155' },
  wikiLinkBtnText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  aiTutorBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 215, 0, 0.15)', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 10, borderWidth: 1, borderColor: '#FFD700' },
  aiTutorBtnText: { color: '#FFD700', fontSize: 11, fontWeight: 'bold' },
  questionContent: { padding: 20 },
  roQuestion: { fontSize: 18, color: '#FFF', fontWeight: '600', lineHeight: 26 },
  divider: { height: 1, backgroundColor: '#334155', marginVertical: 12 },
  transTag: { fontSize: 11, color: '#E94560', fontWeight: 'bold', marginBottom: 2 },
  arQuestion: { fontSize: 19, color: '#E94560', textAlign: 'right', fontWeight: 'bold', lineHeight: 28 },
  enQuestion: { fontSize: 15, color: '#FFFFFF', fontWeight: '500', lineHeight: 22 },
  instructionText: { color: '#94A3B8', marginBottom: 12, fontSize: 14, fontWeight: '500' },
  optionBtn: { borderWidth: 2, borderRadius: 16, padding: 16, marginBottom: 10, justifyContent: 'center' },
  optionText: { fontSize: 16, textAlign: 'center', fontWeight: '500' },
  iconPos: { position: 'absolute', right: 16 },
  resultScroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  resultContainer: { alignItems: 'center' },
  trophyCircle: { width: 110, height: 110, borderRadius: 55, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  resultTitle: { fontSize: 22, color: '#FFF', fontWeight: 'bold', marginBottom: 6, textAlign: 'center' },
  categoryResultTag: { color: '#94A3B8', fontSize: 13, marginBottom: 20, textAlign: 'center' },
  scoreBox: { alignItems: 'center', backgroundColor: '#1E293B', paddingVertical: 20, paddingHorizontal: 30, borderRadius: 20, marginBottom: 20, borderWidth: 2, width: '100%' },
  scoreText: { fontSize: 38, fontWeight: 'bold' },
  scorePercentage: { color: '#94A3B8', fontSize: 14, marginTop: 4 },
  passBadgeText: { fontSize: 13, fontWeight: 'bold', marginTop: 10, textAlign: 'center' },
  reviewBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B', paddingVertical: 14, paddingHorizontal: 20, borderRadius: 14, marginBottom: 16, borderWidth: 1, borderColor: '#FFB800', width: '100%', justifyContent: 'center' },
  reviewBtnText: { color: '#FFB800', fontSize: 15, fontWeight: 'bold' },
  btnPrimary: { backgroundColor: '#E94560', flexDirection: 'row', width: '100%', padding: 18, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  btnText: { color: '#FFF', fontSize: 17, fontWeight: 'bold' },
  btnSecondary: { width: '100%', padding: 18, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#334155' },
  btnSecondaryText: { color: '#94A3B8', fontSize: 17, fontWeight: 'bold' },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'center', alignItems: 'center' },
  modalCloseBtn: { position: 'absolute', top: 40, right: 20, zIndex: 10 },
  modalFullImage: { width: width * 0.95, height: height * 0.75 },
  modalCaption: { marginTop: 16, backgroundColor: '#1E293B', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 },
  modalCaptionText: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: '#1E293B', borderBottomWidth: 1, borderBottomColor: '#334155' },
  modalHeaderTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  wrongReviewCard: { backgroundColor: '#1E293B', borderRadius: 16, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: '#334155' },
  wrongNumBadge: { color: '#E94560', fontSize: 12, fontWeight: 'bold', marginBottom: 4 },
  wrongRoQ: { color: '#FFF', fontSize: 16, fontWeight: '600', marginBottom: 4 },
  wrongArQ: { color: '#94A3B8', fontSize: 14, marginBottom: 2 },
  wrongEnQ: { color: '#4ECCA3', fontSize: 14, marginBottom: 8 },
  wrongWikiBtn: { backgroundColor: '#0F172A', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 8, alignSelf: 'flex-start', marginBottom: 8, flexDirection: 'row', alignItems: 'center' },
  wrongWikiBtnText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  userWrongAnsLabel: { color: '#E94560', fontSize: 14, fontWeight: 'bold', marginBottom: 4 },
  correctAnsLabel: { color: '#4ECCA3', fontSize: 15, fontWeight: 'bold' },
  correctArAnsLabel: { color: '#4ECCA3', fontSize: 13, marginTop: 2 },
  correctEnAnsLabel: { color: '#4ECCA3', fontSize: 13, marginTop: 2 },
});
