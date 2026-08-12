import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar, 
  ScrollView,
  Modal,
  Image 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import questions from '../data/questions_ar.json';
import { CATEGORIES_LIST } from '../utils/categories';
import { UI_STRINGS } from '../utils/languageHelper';

export default function HomeScreen({ navigation }) {
  const [appLang, setAppLang] = useState('ar'); // 'ar' or 'en'
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [downloadMarket, setDownloadMarket] = useState('pwa'); // 'appstore', 'googleplay', 'pwa'
  
  const strings = UI_STRINGS[appLang];

  const categoryCounts = CATEGORIES_LIST.reduce((acc, cat) => {
    if (cat.id === 'all') {
      acc[cat.id] = questions.length;
    } else {
      acc[cat.id] = questions.filter(q => q.category === cat.id).length;
    }
    return acc;
  }, {});

  const handleCategoryPress = (categoryId) => {
    navigation.navigate('Study', { initialCategory: categoryId, appLang });
  };

  const openDownloadModal = (market) => {
    setDownloadMarket(market);
    setShowInstallModal(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header App Logo & Title */}
        <View style={styles.header}>
          <Image 
            source={require('../../assets/icon.png')} 
            style={styles.headerAppLogo} 
            resizeMode="contain" 
          />

          <Text style={styles.title}>{strings.appTitle}</Text>
          <Text style={styles.subtitle}>{strings.appSubtitle}</Text>

          {/* Global Language Selector */}
          <View style={styles.langSelectorContainer}>
            <Text style={styles.langSelectorLabel}>{strings.selectLangLabel}</Text>
            <View style={styles.langButtonsRow}>
              <TouchableOpacity
                style={[styles.langChip, appLang === 'ar' && styles.langChipActive]}
                onPress={() => setAppLang('ar')}
              >
                <Text style={[styles.langChipText, appLang === 'ar' && styles.langChipTextActive]}>
                  🇸🇦 العربية
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.langChip, appLang === 'en' && styles.langChipActive]}
                onPress={() => setAppLang('en')}
              >
                <Text style={[styles.langChipText, appLang === 'en' && styles.langChipTextActive]}>
                  🇬🇧 English
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Marketplace App Downloads Section */}
        <View style={styles.marketplaceSection}>
          <Text style={styles.marketplaceTitle}>
            {appLang === 'ar' ? '📲 حمل التطبيق على جهازك المحمول' : '📲 Download App on Mobile Stores'}
          </Text>

          <View style={styles.marketplaceBadgesRow}>
            {/* Apple App Store Badge */}
            <TouchableOpacity 
              style={styles.marketBadgeBtn}
              onPress={() => openDownloadModal('appstore')}
              activeOpacity={0.85}
            >
              <Ionicons name="logo-apple" size={26} color="#FFFFFF" />
              <View style={styles.marketBadgeTextCol}>
                <Text style={styles.marketSubText}>Download on the</Text>
                <Text style={styles.marketMainText}>App Store</Text>
              </View>
            </TouchableOpacity>

            {/* Google Play Store Badge */}
            <TouchableOpacity 
              style={[styles.marketBadgeBtn, { backgroundColor: '#1E293B' }]}
              onPress={() => openDownloadModal('googleplay')}
              activeOpacity={0.85}
            >
              <Ionicons name="logo-google-playstore" size={24} color="#4ECCA3" />
              <View style={styles.marketBadgeTextCol}>
                <Text style={styles.marketSubText}>GET IT ON</Text>
                <Text style={styles.marketMainText}>Google Play</Text>
              </View>
            </TouchableOpacity>

            {/* Web PWA Direct Install Badge */}
            <TouchableOpacity 
              style={[styles.marketBadgeBtn, styles.pwaBadgeBtn]}
              onPress={() => openDownloadModal('pwa')}
              activeOpacity={0.85}
            >
              <Ionicons name="phone-portrait-outline" size={24} color="#FFD700" />
              <View style={styles.marketBadgeTextCol}>
                <Text style={styles.marketSubText}>DIRECT PWA</Text>
                <Text style={styles.marketMainText}>Install App</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Summary */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Ionicons name="images-outline" size={24} color="#E94560" />
            <Text style={styles.statNumber}>{questions.length}</Text>
            <Text style={styles.statLabel}>{strings.questionsCount}</Text>
          </View>
          
          <View style={styles.statBox}>
            <Ionicons name="grid-outline" size={24} color="#4ECCA3" />
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>{strings.categoriesCount}</Text>
          </View>

          <View style={styles.statBox}>
            <Ionicons name="sparkles-outline" size={24} color="#FFB800" />
            <Text style={styles.statNumber}>AI</Text>
            <Text style={styles.statLabel}>مساعد ذكي + Ollama</Text>
          </View>
        </View>

        {/* AI Tutor Assistant Banner */}
        <TouchableOpacity 
          style={styles.aiTutorBanner}
          onPress={() => navigation.navigate('AI', { appLang })}
          activeOpacity={0.88}
        >
          <View style={styles.bannerTextCol}>
            <View style={styles.aiTagBadge}>
              <Text style={styles.aiTagBadgeText}>🤖 AI Model + Ollama Support</Text>
            </View>
            <Text style={styles.aiBannerTitle}>
              {appLang === 'ar' ? 'المساعد الذكي للأسئلة المفتوحة' : 'AI Romanian Citizenship Tutor'}
            </Text>
            <Text style={styles.bannerSubtitle}>
              {appLang === 'ar' ? 'اسأل أي سؤال إضافي وتحدث مع الذكاء الاصطناعي' : 'Ask custom questions & practice oral responses with AI'}
            </Text>
          </View>
          <Ionicons name="sparkles" size={32} color="#FFD700" />
        </TouchableOpacity>

        {/* Primary Action Study Banner */}
        <TouchableOpacity 
          style={styles.primaryStudyBanner}
          onPress={() => navigation.navigate('Study', { initialCategory: 'all', appLang })}
          activeOpacity={0.88}
        >
          <View style={styles.bannerTextCol}>
            <Text style={styles.bannerTitle}>{strings.studyNow}</Text>
            <Text style={styles.bannerSubtitle}>
              {appLang === 'ar' ? 'تصفح الأسئلة مع صور ويكيبيديا الواضحة والروابط المعرفية' : 'Browse questions with clear Wikipedia photos & article references'}
            </Text>
          </View>
          <Ionicons name="book" size={32} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Quiz Options Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{strings.testYourself} 🏆</Text>
        </View>

        <View style={styles.quizModesGrid}>
          <TouchableOpacity
            style={[styles.quizModeCard, { borderColor: '#E94560' }]}
            onPress={() => navigation.navigate('Quiz', { quizMode: 'quick', initialCategory: 'all', appLang })}
            activeOpacity={0.85}
          >
            <View style={[styles.quizIconBadge, { backgroundColor: 'rgba(233, 69, 96, 0.15)' }]}>
              <Ionicons name="flash-outline" size={26} color="#E94560" />
            </View>
            <View style={styles.quizCardContent}>
              <Text style={styles.quizModeTitle}>{strings.quickQuizTitle}</Text>
              <Text style={styles.quizModeDesc}>{strings.quickQuizDesc}</Text>
            </View>
            <Ionicons name={appLang === 'ar' ? "chevron-back" : "chevron-forward"} size={20} color="#E94560" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quizModeCard, { borderColor: '#4ECCA3' }]}
            onPress={() => navigation.navigate('Quiz', { quizMode: 'exam', initialCategory: 'all', appLang })}
            activeOpacity={0.85}
          >
            <View style={[styles.quizIconBadge, { backgroundColor: 'rgba(78, 204, 163, 0.15)' }]}>
              <Ionicons name="stopwatch-outline" size={26} color="#4ECCA3" />
            </View>
            <View style={styles.quizCardContent}>
              <Text style={styles.quizModeTitle}>{strings.examQuizTitle}</Text>
              <Text style={styles.quizModeDesc}>{strings.examQuizDesc}</Text>
            </View>
            <Ionicons name={appLang === 'ar' ? "chevron-back" : "chevron-forward"} size={20} color="#4ECCA3" />
          </TouchableOpacity>
        </View>

        {/* Categories Section */}
        <View style={[styles.sectionHeader, { marginTop: 24 }]}>
          <Text style={styles.sectionTitle}>{strings.categoriesCount}</Text>
        </View>

        <View style={styles.categoriesGrid}>
          {CATEGORIES_LIST.filter(c => c.id !== 'all').map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.categoryCard, { borderColor: cat.color }]}
              onPress={() => handleCategoryPress(cat.id)}
              activeOpacity={0.85}
            >
              <View style={[styles.categoryIconCircle, { backgroundColor: cat.color + '20' }]}>
                <Ionicons name={cat.icon} size={26} color={cat.color} />
              </View>
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryTitleAr}>{appLang === 'ar' ? cat.name_ar : cat.name_en}</Text>
                <Text style={styles.categoryTitleEn}>{cat.name_ro}</Text>
                <Text style={[styles.categoryCountBadge, { color: cat.color }]}>
                  {categoryCounts[cat.id]} {strings.questionsCount}
                </Text>
              </View>
              <Ionicons name={appLang === 'ar' ? "chevron-back" : "chevron-forward"} size={20} color="#94A3B8" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Download Modal with Store Guidance */}
      <Modal
        visible={showInstallModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowInstallModal(false)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center' }}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>
                {downloadMarket === 'appstore' ? '🍏 Apple App Store Download' : downloadMarket === 'googleplay' ? '🤖 Google Play Store Download' : '📱 Direct PWA Mobile Installation'}
              </Text>
              <TouchableOpacity onPress={() => setShowInstallModal(false)}>
                <Ionicons name="close-circle" size={30} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <Image source={require('../../assets/icon.png')} style={styles.modalAppLogo} />
            <Text style={styles.modalAppName}>Cetățenia Română Prep</Text>

            {downloadMarket === 'appstore' && (
              <View style={styles.stepBox}>
                <Text style={styles.stepTitle}>🍏 Apple iOS Setup:</Text>
                <Text style={styles.stepText}>1. Open in Safari on your iPhone/iPad.</Text>
                <Text style={styles.stepText}>2. Tap the Share button 📤.</Text>
                <Text style={styles.stepText}>3. Select "Add to Home Screen" for instant native app access with the logo!</Text>
              </View>
            )}

            {downloadMarket === 'googleplay' && (
              <View style={styles.stepBox}>
                <Text style={styles.stepTitle}>🤖 Android Play Store Setup:</Text>
                <Text style={styles.stepText}>1. Open in Chrome on your Android device.</Text>
                <Text style={styles.stepText}>2. Tap Menu ≡ and select "Install App" or "Add to Home Screen".</Text>
                <Text style={styles.stepText}>3. Enjoy the full offline-capable mobile app experience!</Text>
              </View>
            )}

            {downloadMarket === 'pwa' && (
              <View style={styles.stepBox}>
                <Text style={styles.stepTitle}>📱 Universal PWA Mobile Download:</Text>
                <Text style={styles.stepText}>• iOS Safari: Share 📤 -> Add to Home Screen</Text>
                <Text style={styles.stepText}>• Android Chrome: Options ≡ -> Install App</Text>
                <Text style={styles.stepText}>• Web Browser: Click install prompt on address bar.</Text>
              </View>
            )}

            <TouchableOpacity 
              style={styles.closeModalBtn} 
              onPress={() => setShowInstallModal(false)}
            >
              <Text style={styles.closeModalBtnText}>Done (تم)</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  scrollContent: { padding: 20, paddingBottom: 40 },
  header: { alignItems: 'center', marginTop: 4, marginBottom: 16 },
  headerAppLogo: { width: 84, height: 84, borderRadius: 20, marginBottom: 12 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 6, textAlign: 'center' },
  subtitle: { fontSize: 13, color: '#94A3B8', textAlign: 'center', lineHeight: 20 },
  langSelectorContainer: {
    width: '100%',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  langSelectorLabel: { color: '#94A3B8', fontSize: 12, textAlign: 'center', marginBottom: 8, fontWeight: '600' },
  langButtonsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  langChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  langChipActive: { backgroundColor: '#E94560', borderColor: '#E94560' },
  langChipText: { color: '#94A3B8', fontSize: 13, fontWeight: 'bold' },
  langChipTextActive: { color: '#FFFFFF' },
  marketplaceSection: { marginBottom: 20 },
  marketplaceTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  marketplaceBadgesRow: { flexDirection: 'row', gap: 8, justifyContent: 'space-between' },
  marketBadgeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000000',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    justifyContent: 'center',
  },
  pwaBadgeBtn: { backgroundColor: '#1E293B', borderColor: '#FFD700' },
  marketBadgeTextCol: { marginLeft: 6, alignItems: 'flex-start' },
  marketSubText: { color: '#94A3B8', fontSize: 8, fontWeight: '600', textTransform: 'uppercase' },
  marketMainText: { color: '#FFFFFF', fontSize: 11, fontWeight: 'bold' },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16, gap: 10 },
  statBox: {
    flex: 1,
    backgroundColor: '#1E293B',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  statNumber: { fontSize: 19, fontWeight: 'bold', color: '#FFFFFF', marginTop: 4 },
  statLabel: { fontSize: 11, color: '#94A3B8', textAlign: 'center', marginTop: 2 },
  aiTutorBanner: {
    backgroundColor: '#1E293B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  aiTagBadge: { backgroundColor: 'rgba(255, 215, 0, 0.15)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, alignSelf: 'flex-start', marginBottom: 4 },
  aiTagBadgeText: { color: '#FFD700', fontSize: 11, fontWeight: 'bold' },
  aiBannerTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', marginBottom: 2 },
  primaryStudyBanner: {
    backgroundColor: '#E94560',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 20,
    marginBottom: 24,
    elevation: 8,
  },
  bannerTextCol: { flex: 1, paddingRight: 12 },
  bannerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  bannerSubtitle: { color: 'rgba(255, 255, 255, 0.9)', fontSize: 12, lineHeight: 18 },
  sectionHeader: { marginBottom: 12 },
  sectionTitle: { fontSize: 19, fontWeight: 'bold', color: '#FFFFFF' },
  quizModesGrid: { gap: 10, marginBottom: 10 },
  quizModeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 5,
    borderWidth: 1,
    borderColor: '#334155',
  },
  quizIconBadge: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  quizCardContent: { flex: 1 },
  quizModeTitle: { fontSize: 15, fontWeight: 'bold', color: '#FFF' },
  quizModeDesc: { fontSize: 11, color: '#94A3B8', marginTop: 2 },
  categoriesGrid: { gap: 10 },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    padding: 14,
    borderRadius: 16,
    borderLeftWidth: 5,
    borderWidth: 1,
    borderColor: '#334155',
  },
  categoryIconCircle: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  categoryInfo: { flex: 1 },
  categoryTitleAr: { fontSize: 15, fontWeight: 'bold', color: '#FFFFFF' },
  categoryTitleEn: { fontSize: 11, color: '#94A3B8' },
  categoryCountBadge: { fontSize: 11, fontWeight: '600', marginTop: 2 },
  modalCard: { backgroundColor: '#1E293B', margin: 20, borderRadius: 20, padding: 20, alignItems: 'center' },
  modalHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 16 },
  modalTitle: { color: '#FFF', fontSize: 15, fontWeight: 'bold' },
  modalAppLogo: { width: 70, height: 70, borderRadius: 16, marginBottom: 8 },
  modalAppName: { color: '#4ECCA3', fontSize: 16, fontWeight: 'bold', marginBottom: 16 },
  stepBox: { backgroundColor: '#0F172A', padding: 14, borderRadius: 12, width: '100%', borderWidth: 1, borderColor: '#334155' },
  stepTitle: { color: '#FFB800', fontSize: 14, fontWeight: 'bold', marginBottom: 6 },
  stepText: { color: '#F1F5F9', fontSize: 12, lineHeight: 18, marginBottom: 4 },
  closeModalBtn: { backgroundColor: '#E94560', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 12, marginTop: 20 },
  closeModalBtnText: { color: '#FFF', fontSize: 15, fontWeight: 'bold' },
});
