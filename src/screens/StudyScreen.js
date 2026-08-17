import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView, 
  Image, 
  Dimensions,
  ActivityIndicator,
  Modal,
  Linking 
} from 'react-native';
import * as Speech from 'expo-speech';
import { Ionicons } from '@expo/vector-icons';
import questions from '../data/questions_ar.json';
import { CATEGORIES_LIST, getCategoryMeta } from '../utils/categories';
import { getQuestionText, getAnswerText, UI_STRINGS } from '../utils/languageHelper';

const { width, height } = Dimensions.get('window');

export default function StudyScreen({ route, navigation }) {
  const initialCat = route?.params?.initialCategory || 'all';
  const initialAppLang = route?.params?.appLang || 'ar';

  const [activeCategory, setActiveCategory] = useState(initialCat);
  const [appLang, setAppLang] = useState(initialAppLang); // 'ar' or 'en'
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const strings = UI_STRINGS[appLang];

  const filteredQuestions = activeCategory === 'all' 
    ? questions 
    : questions.filter(q => q.category === activeCategory);

  const currentQ = filteredQuestions[currentIndex] || { 
    id: 1,
    question: "Loading...", 
    answer: "", 
    question_ar: "", 
    answer_ar: "",
    question_en: "",
    answer_en: "",
    category: "general",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Flag_of_Romania.svg/1280px-Flag_of_Romania.svg.png",
    wiki_url: "https://en.wikipedia.org/wiki/Romania"
  };

  const categoryMeta = getCategoryMeta(currentQ.category || activeCategory);

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  useEffect(() => {
    setCurrentIndex(0);
    setShowAnswer(false);
    Speech.stop();
    setIsSpeaking(false);
  }, [activeCategory]);

  const handleNext = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowAnswer(false);
      Speech.stop();
      setIsSpeaking(false);
      setImageLoading(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setShowAnswer(false);
      Speech.stop();
      setIsSpeaking(false);
      setImageLoading(true);
    }
  };

  const speakText = (text) => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    Speech.speak(text, {
      language: 'ro-RO',
      rate: 0.85,
      pitch: 1.0,
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const openWikiUrl = (url) => {
    const wiki = url || currentQ.wiki_url || 'https://en.wikipedia.org/wiki/Romania';
    Linking.openURL(wiki).catch(err => console.log("Couldn't load Wikipedia link", err));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top App Header */}
      <View style={styles.topNav}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>{strings.studyNow}</Text>
        <TouchableOpacity 
          style={styles.langToggleHeaderBtn}
          onPress={() => setAppLang(appLang === 'ar' ? 'en' : 'ar')}
        >
          <Text style={styles.langToggleHeaderBtnText}>
            {appLang === 'ar' ? '🇬🇧 English' : '🇸🇦 العربية'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Category Filter Bar */}
      <View style={styles.categoriesBarContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {CATEGORIES_LIST.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryFilterChip,
                  isActive && { backgroundColor: cat.color, borderColor: cat.color }
                ]}
                onPress={() => setActiveCategory(cat.id)}
              >
                <Ionicons 
                  name={cat.icon} 
                  size={16} 
                  color={isActive ? '#FFFFFF' : '#94A3B8'} 
                  style={{ marginRight: 6 }} 
                />
                <Text style={[styles.categoryFilterText, isActive && styles.categoryFilterTextActive]}>
                  {appLang === 'ar' ? cat.name_ar : cat.name_en}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Progress Counter */}
      <View style={styles.progressContainer}>
        <View style={styles.progressTextRow}>
          <Text style={styles.progressCategoryLabel}>
            {appLang === 'ar' ? categoryMeta.name_ar : categoryMeta.name_en}
          </Text>
          <Text style={styles.progressText}>
            {strings.question} {currentIndex + 1} {strings.of} {filteredQuestions.length}
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${((currentIndex + 1) / Math.max(filteredQuestions.length, 1)) * 100}%`,
                backgroundColor: categoryMeta.color
              }
            ]} 
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          {/* Framed Entire Wikipedia Image View (resizeMode: contain) */}
          <TouchableOpacity 
            style={styles.framedImageContainer} 
            activeOpacity={0.9}
            onPress={() => setModalVisible(true)}
          >
            <View style={styles.imageBackgroundWrapper}>
              <Image 
                source={{ uri: currentQ.image }} 
                style={styles.entireQuestionImage} 
                resizeMode="contain"
                onLoadEnd={() => setImageLoading(false)}
              />
            </View>

            {imageLoading && (
              <View style={styles.imageLoader}>
                <ActivityIndicator size="small" color="#E94560" />
              </View>
            )}

            <View style={[styles.categoryBadge, { backgroundColor: categoryMeta.color }]}>
              <Ionicons name={categoryMeta.icon} size={14} color="#FFF" style={{ marginRight: 4 }} />
              <Text style={styles.categoryBadgeText}>
                {appLang === 'ar' ? categoryMeta.name_ar : categoryMeta.name_en}
              </Text>
            </View>

            <View style={styles.zoomHintBtn}>
              <Ionicons name="expand" size={14} color="#FFF" style={{ marginRight: 4 }} />
              <Text style={styles.zoomHintText}>{strings.zoomImage}</Text>
            </View>

            <View style={styles.idBadge}>
              <Text style={styles.idBadgeText}>#{currentQ.id}</Text>
            </View>
          </TouchableOpacity>

          {/* External Action Toolbar: Wikipedia Link & AI Tutor */}
          <View style={styles.cardActionToolbar}>
            <TouchableOpacity 
              style={styles.wikiLinkBtn}
              onPress={() => openWikiUrl(currentQ.wiki_url)}
            >
              <Ionicons name="logo-wikipedia" size={16} color="#FFF" style={{ marginRight: 6 }} />
              <Text style={styles.wikiLinkBtnText}>
                {appLang === 'ar' ? 'اقرأ المقال الكامل على ويكيبيديا ℹ️' : 'Read Article on Wikipedia ℹ️'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.aiTutorBtn}
              onPress={() => navigation.navigate('AI', { appLang, initialPrompt: currentQ.question })}
            >
              <Ionicons name="sparkles" size={16} color="#FFD700" style={{ marginRight: 4 }} />
              <Text style={styles.aiTutorBtnText}>اسأل AI</Text>
            </TouchableOpacity>
          </View>

          {/* Question Text in Romanian, Arabic, & English */}
          <View style={styles.questionSection}>
            <View style={styles.roHeaderView}>
              <TouchableOpacity 
                style={styles.speakerBtn}
                onPress={() => speakText(currentQ.question)}
              >
                <Ionicons 
                  name={isSpeaking ? "stop-circle" : "volume-high"} 
                  size={26} 
                  color="#E94560" 
                />
              </TouchableOpacity>
              <Text style={styles.roText}>{currentQ.question}</Text>
            </View>

            <View style={styles.divider} />

            {/* Arabic Translation */}
            <View style={styles.translationBlock}>
              <Text style={styles.transLangTag}>🇸🇦 {strings.arabicText}:</Text>
              <Text style={styles.arText}>{currentQ.question_ar}</Text>
            </View>

            {/* English Translation */}
            <View style={[styles.translationBlock, { marginTop: 10 }]}>
              <Text style={[styles.transLangTag, { color: '#4ECCA3' }]}>🇬🇧 {strings.englishText}:</Text>
              <Text style={styles.enText}>{getQuestionText(currentQ, 'en')}</Text>
            </View>
          </View>

          {/* Reveal Answer Section */}
          {!showAnswer ? (
            <TouchableOpacity 
              style={styles.showAnswerBtn}
              onPress={() => setShowAnswer(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="eye-outline" size={24} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.showAnswerText}>{strings.showAnswer}</Text>
            </TouchableOpacity>
          ) : (
            <View style={[styles.questionSection, styles.answerSection]}>
              <Text style={styles.answerSectionHeader}>{strings.modelAnswer}</Text>
              
              <View style={styles.roHeaderView}>
                <TouchableOpacity 
                  style={[styles.speakerBtn, { backgroundColor: 'rgba(78, 204, 163, 0.15)' }]}
                  onPress={() => speakText(currentQ.answer)}
                >
                  <Ionicons 
                    name={isSpeaking ? "stop-circle" : "volume-high"} 
                    size={26} 
                    color="#4ECCA3" 
                  />
                </TouchableOpacity>
                <Text style={[styles.roText, { color: '#4ECCA3' }]}>
                  {currentQ.answer}
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.translationBlock}>
                <Text style={styles.transLangTag}>🇸🇦 {strings.arabicText}:</Text>
                <Text style={[styles.arText, { color: '#4ECCA3' }]}>
                  {currentQ.answer_ar}
                </Text>
              </View>

              <View style={[styles.translationBlock, { marginTop: 10 }]}>
                <Text style={[styles.transLangTag, { color: '#4ECCA3' }]}>🇬🇧 {strings.englishText}:</Text>
                <Text style={[styles.enText, { color: '#4ECCA3' }]}>
                  {getAnswerText(currentQ, 'en')}
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Navigation Footer */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.navBtn, currentIndex === 0 && styles.navBtnDisabled]}
          onPress={handlePrev}
          disabled={currentIndex === 0}
        >
          <Ionicons name={appLang === 'ar' ? "chevron-forward" : "chevron-back"} size={22} color={currentIndex === 0 ? "#555" : "#FFF"} />
          <Text style={[styles.navText, currentIndex === 0 && styles.navTextDisabled]}>{strings.prev}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.navBtn, currentIndex === filteredQuestions.length - 1 && styles.navBtnDisabled]}
          onPress={handleNext}
          disabled={currentIndex === filteredQuestions.length - 1}
        >
          <Text style={[styles.navText, currentIndex === filteredQuestions.length - 1 && styles.navTextDisabled]}>{strings.next}</Text>
          <Ionicons name={appLang === 'ar' ? "chevron-back" : "chevron-forward"} size={22} color={currentIndex === filteredQuestions.length - 1 ? "#555" : "#FFF"} />
        </TouchableOpacity>
      </View>

      {/* Fullscreen Image Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setModalVisible(false)}>
            <Ionicons name="close-circle" size={38} color="#FFF" />
          </TouchableOpacity>
          <Image 
            source={{ uri: currentQ.image }} 
            style={styles.modalFullImage} 
            resizeMode="contain" 
          />
          <View style={styles.modalCaption}>
            <Text style={styles.modalCaptionText}>
              {strings.question} #{currentQ.id} - {appLang === 'ar' ? categoryMeta.name_ar : categoryMeta.name_en}
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1E293B',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  backBtn: { padding: 4 },
  navTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  langToggleHeaderBtn: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  langToggleHeaderBtnText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  categoriesBarContainer: { backgroundColor: '#1E293B', borderBottomWidth: 1, borderBottomColor: '#334155' },
  categoriesScroll: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  categoryFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
  },
  categoryFilterText: { color: '#94A3B8', fontSize: 13, fontWeight: '600' },
  categoryFilterTextActive: { color: '#FFFFFF', fontWeight: 'bold' },
  progressContainer: { paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#1E293B' },
  progressTextRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressCategoryLabel: { color: '#E94560', fontSize: 12, fontWeight: 'bold' },
  progressText: { color: '#94A3B8', fontSize: 12, fontWeight: 'bold' },
  progressBar: { height: 6, backgroundColor: '#334155', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%' },
  scrollContent: { padding: 16, paddingBottom: 24 },
  card: { backgroundColor: '#1E293B', borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: '#334155' },
  framedImageContainer: {
    height: 230,
    width: '100%',
    position: 'relative',
    backgroundColor: '#020617',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageBackgroundWrapper: {
    width: '100%',
    height: '100%',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  entireQuestionImage: { width: '100%', height: '100%' },
  imageLoader: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(15, 23, 42, 0.7)' },
  categoryBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  categoryBadgeText: { color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' },
  zoomHintBtn: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  zoomHintText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  idBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  idBadgeText: { color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' },
  cardActionToolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#0F172A',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    gap: 8,
  },
  wikiLinkBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E293B',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  wikiLinkBtnText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  aiTutorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  aiTutorBtnText: { color: '#FFD700', fontSize: 12, fontWeight: 'bold' },
  questionSection: { padding: 20 },
  answerSection: { borderTopWidth: 2, borderTopColor: '#334155' },
  answerSectionHeader: { color: '#4ECCA3', fontSize: 13, fontWeight: 'bold', marginBottom: 12 },
  roHeaderView: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  speakerBtn: { marginRight: 12, padding: 8, backgroundColor: 'rgba(233, 69, 96, 0.15)', borderRadius: 12 },
  roText: { flex: 1, fontSize: 19, color: '#FFFFFF', fontWeight: '600', lineHeight: 26 },
  divider: { height: 1, backgroundColor: '#334155', marginVertical: 12 },
  translationBlock: { marginTop: 4 },
  transLangTag: { fontSize: 11, color: '#E94560', fontWeight: 'bold', marginBottom: 4 },
  arText: { fontSize: 20, color: '#E94560', textAlign: 'right', fontWeight: 'bold', lineHeight: 30 },
  enText: { fontSize: 16, color: '#FFFFFF', fontWeight: '500', lineHeight: 24 },
  showAnswerBtn: { backgroundColor: '#E94560', flexDirection: 'row', margin: 20, padding: 16, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  showAnswerText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, backgroundColor: '#1E293B', borderTopWidth: 1, borderTopColor: '#334155' },
  navBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#334155', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12 },
  navBtnDisabled: { backgroundColor: '#0F172A', opacity: 0.5 },
  navText: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold', marginHorizontal: 6 },
  navTextDisabled: { color: '#555555' },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'center', alignItems: 'center' },
  modalCloseBtn: { position: 'absolute', top: 40, right: 20, zIndex: 10 },
  modalFullImage: { width: width * 0.95, height: height * 0.75 },
  modalCaption: { marginTop: 16, backgroundColor: '#1E293B', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 },
  modalCaptionText: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
});
