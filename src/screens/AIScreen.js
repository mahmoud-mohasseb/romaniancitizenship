import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  TextInput, 
  ScrollView, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { queryOllama } from '../utils/aiService';
import { UI_STRINGS } from '../utils/languageHelper';

export default function AIScreen({ route, navigation }) {
  const appLang = route?.params?.appLang || 'ar';
  const strings = UI_STRINGS[appLang];

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: appLang === 'ar' 
        ? 'مرحباً بك! أنا مساعدك الذكي المخصص لاختبار الجنسية الرومانية 🇷🇴. يمكنك سؤالي عن أي سؤال دستوري، تاريخي، جغرافي، أو نصائح للمقابلة الرسمية!'
        : 'Welcome! I am your Romanian Citizenship AI Tutor 🇷🇴. Ask me any question about Romanian history, constitution, geography, or interview prep!',
      time: 'الآن'
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [ollamaUrl, setOllamaUrl] = useState('http://localhost:11434');
  const [ollamaModel, setOllamaModel] = useState('llama3');
  const [showConfig, setShowConfig] = useState(false);

  const quickPrompts = appLang === 'ar' ? [
    'ما هو شكل الحكومة في رومانيا؟',
    'تلخيص أهم انجازات ستيفان تشيل ماري',
    'نصائح لاجتياز المقابلة الشفهية مع اللجنة',
    'معلومات عن نهر الدانوب والجغرافيا'
  ] : [
    'What is the form of government of Romania?',
    'Summarize Stephen the Great accomplishments',
    'Oral citizenship interview tips',
    'Information about the Danube river & geography'
  ];

  const handleSend = async (textToSend) => {
    const q = textToSend || inputQuery;
    if (!q.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: q, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    const result = await queryOllama(q, ollamaModel, ollamaUrl);

    const aiMsg = {
      id: Date.now() + 1,
      sender: 'ai',
      text: result.text,
      source: result.source,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, aiMsg]);
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.topNav}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.navCenter}>
          <Text style={styles.navTitle}>🤖 المساعد الذكي للجنسية (AI Tutor)</Text>
          <Text style={styles.navSubtitle}>يدعم Ollama المحلي والنموذج المدمج</Text>
        </View>
        <TouchableOpacity onPress={() => setShowConfig(!showConfig)} style={styles.configBtn}>
          <Ionicons name="settings-outline" size={22} color="#4ECCA3" />
        </TouchableOpacity>
      </View>

      {/* Ollama Config Bar (Collapsible) */}
      {showConfig && (
        <View style={styles.configCard}>
          <Text style={styles.configTitle}>إعدادات نموذج AI المحلي (Ollama):</Text>
          <View style={styles.configRow}>
            <Text style={styles.configLabel}>رابط Ollama:</Text>
            <TextInput 
              style={styles.configInput} 
              value={ollamaUrl} 
              onChangeText={setOllamaUrl} 
              placeholder="http://localhost:11434"
              placeholderTextColor="#64748B"
            />
          </View>
          <View style={styles.configRow}>
            <Text style={styles.configLabel}>اسم النموذج:</Text>
            <TextInput 
              style={styles.configInput} 
              value={ollamaModel} 
              onChangeText={setOllamaModel} 
              placeholder="llama3 / mistral / qwen"
              placeholderTextColor="#64748B"
            />
          </View>
        </View>
      )}

      {/* Quick Prompts */}
      <View style={styles.promptsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
          {quickPrompts.map((prompt, idx) => (
            <TouchableOpacity 
              key={idx} 
              style={styles.promptChip}
              onPress={() => handleSend(prompt)}
            >
              <Text style={styles.promptChipText}>{prompt}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Messages Scroll Area */}
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.chatScroll} showsVerticalScrollIndicator={false}>
          {messages.map((msg) => (
            <View 
              key={msg.id} 
              style={[
                styles.messageBubble, 
                msg.sender === 'user' ? styles.userBubble : styles.aiBubble
              ]}
            >
              {msg.sender === 'ai' && (
                <View style={styles.aiHeaderRow}>
                  <Ionicons name="sparkles" size={16} color="#E94560" style={{ marginRight: 6 }} />
                  <Text style={styles.aiHeaderTitle}>
                    {msg.source === 'ollama' ? 'Ollama AI (Local)' : 'مساعد الجنسية الذكي المدمج'}
                  </Text>
                </View>
              )}
              <Text style={[styles.messageText, msg.sender === 'user' ? styles.userMessageText : styles.aiMessageText]}>
                {msg.text}
              </Text>
              <Text style={styles.messageTime}>{msg.time}</Text>
            </View>
          ))}

          {loading && (
            <View style={[styles.messageBubble, styles.aiBubble, { flexDirection: 'row', alignItems: 'center' }]}>
              <ActivityIndicator size="small" color="#E94560" style={{ marginRight: 10 }} />
              <Text style={{ color: '#94A3B8', fontSize: 13 }}>جاري التفكير وتوليد الإجابة...</Text>
            </View>
          )}
        </ScrollView>

        {/* Input Bar */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={inputQuery}
            onChangeText={setInputQuery}
            placeholder={appLang === 'ar' ? 'اسأل أي سؤال حول الجنسية أو التاريخ الروماني...' : 'Ask any question about Romanian citizenship or history...'}
            placeholderTextColor="#64748B"
            multiline
          />
          <TouchableOpacity 
            style={[styles.sendBtn, !inputQuery.trim() && styles.sendBtnDisabled]}
            onPress={() => handleSend()}
            disabled={!inputQuery.trim() || loading}
          >
            <Ionicons name="send" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  navCenter: { alignItems: 'center' },
  navTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  navSubtitle: { color: '#94A3B8', fontSize: 11, marginTop: 2 },
  configBtn: { padding: 4 },
  configCard: {
    backgroundColor: '#1E293B',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  configTitle: { color: '#4ECCA3', fontSize: 13, fontWeight: 'bold', marginBottom: 8 },
  configRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  configLabel: { color: '#94A3B8', fontSize: 12, width: 90 },
  configInput: { flex: 1, backgroundColor: '#0F172A', color: '#FFF', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#334155', fontSize: 12 },
  promptsContainer: { backgroundColor: '#1E293B', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#334155' },
  promptChip: { backgroundColor: '#0F172A', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14, borderWidth: 1, borderColor: '#334155' },
  promptChipText: { color: '#94A3B8', fontSize: 12 },
  chatScroll: { padding: 16, paddingBottom: 20, gap: 12 },
  messageBubble: { borderRadius: 16, padding: 14, maxWidth: '88%' },
  userBubble: { backgroundColor: '#E94560', alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  aiBubble: { backgroundColor: '#1E293B', alignSelf: 'flex-start', borderBottomLeftRadius: 4, borderWidth: 1, borderColor: '#334155' },
  aiHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  aiHeaderTitle: { color: '#E94560', fontSize: 11, fontWeight: 'bold' },
  messageText: { fontSize: 15, lineHeight: 22 },
  userMessageText: { color: '#FFFFFF' },
  aiMessageText: { color: '#F1F5F9' },
  messageTime: { fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 4, textAlign: 'right' },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#1E293B',
    borderTopWidth: 1,
    borderTopColor: '#334155',
    gap: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#0F172A',
    color: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: '#334155',
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E94560',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: { opacity: 0.4 },
});
