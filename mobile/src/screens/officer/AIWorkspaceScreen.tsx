import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { BrainCircuit, MessageSquare, Send, Sparkles, AlertTriangle, ChevronRight } from 'lucide-react-native';
import { GlassCard } from '../../components/shared/GlassCard';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

const conversations = [
  { id: 'conv-1', title: 'Ward 12 sanitation escalation', time: '2m ago' },
  { id: 'conv-2', title: 'Traffic signal outage triage', time: '18m ago' },
];

const messages = [
  { id: 'msg-1', role: 'officer', content: 'Summarize Ward 12 sanitation complaints.' },
  { id: 'msg-2', role: 'assistant', content: 'Ward 12 has 6 clustered reports. Risk: contamination. Escalate to rapid response.' },
];

export function AIWorkspaceScreen() {
  const [inputText, setInputText] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <BrainCircuit color={colors.info} size={24} />
          <Text style={styles.title}>AI Copilot</Text>
        </View>
        <Text style={styles.subtitle}>Operational assistant for rapid grievance triage and response.</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        <GlassCard style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Active Context</Text>
          {conversations.map((conv) => (
            <TouchableOpacity key={conv.id} style={styles.convItem}>
              <View style={styles.convIcon}>
                <MessageSquare color={colors.primaryLight} size={16} />
              </View>
              <View style={styles.convDetails}>
                <Text style={styles.convTitle} numberOfLines={1}>{conv.title}</Text>
                <Text style={styles.convTime}>{conv.time}</Text>
              </View>
              <ChevronRight color={colors.slate500} size={16} />
            </TouchableOpacity>
          ))}
        </GlassCard>

        <GlassCard style={styles.sectionCard}>
          <View style={styles.aiInsightsHeader}>
            <Sparkles color="#C084FC" size={16} />
            <Text style={styles.sectionTitle}>Copilot Insights</Text>
          </View>
          
          <View style={[styles.insightCard, styles.insightCritical]}>
            <Text style={styles.insightTitle}>Escalation Prediction</Text>
            <Text style={styles.insightDesc}>82% probability of escalation within 45 mins based on trends.</Text>
          </View>

          <View style={[styles.insightCard, styles.insightNeutral]}>
            <Text style={styles.insightTitle}>Complaint Summarization</Text>
            <Text style={styles.insightDesc}>6 reports, 2 media attachments, 3 verified residents.</Text>
          </View>
        </GlassCard>

        <View style={styles.chatArea}>
          {messages.map((msg) => (
            <View 
              key={msg.id} 
              style={[
                styles.messageBubble, 
                msg.role === 'officer' ? styles.messageOfficer : styles.messageAssistant
              ]}
            >
              <Text style={styles.messageText}>{msg.content}</Text>
            </View>
          ))}
        </View>

      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask copilot..."
          placeholderTextColor={colors.slate500}
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.sendButton}>
          <Send color={colors.white} size={16} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B1020' },
  header: { padding: 20, paddingTop: 60, paddingBottom: 16 },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  title: { color: colors.white, fontSize: typography.size['2xl'], fontWeight: typography.weight.bold },
  subtitle: { color: colors.slate400, fontSize: typography.size.sm },
  
  content: { flex: 1, paddingHorizontal: 20 },
  
  sectionCard: { padding: 16, marginBottom: 16 },
  sectionTitle: { color: colors.white, fontSize: typography.size.base, fontWeight: typography.weight.semibold, marginBottom: 12 },
  
  convItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 12, marginBottom: 8 },
  convIcon: { padding: 8, backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: 8, marginRight: 12 },
  convDetails: { flex: 1 },
  convTitle: { color: colors.white, fontSize: typography.size.sm, fontWeight: typography.weight.medium },
  convTime: { color: colors.slate500, fontSize: typography.size.xs, marginTop: 2 },

  aiInsightsHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  insightCard: { padding: 12, borderRadius: 12, borderWidth: 1, marginBottom: 8 },
  insightCritical: { backgroundColor: 'rgba(244, 63, 94, 0.1)', borderColor: 'rgba(244, 63, 94, 0.2)' },
  insightNeutral: { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' },
  insightTitle: { color: colors.white, fontSize: typography.size.sm, fontWeight: typography.weight.bold, marginBottom: 4 },
  insightDesc: { color: colors.slate300, fontSize: typography.size.xs, lineHeight: 18 },

  chatArea: { gap: 12, marginBottom: 20 },
  messageBubble: { maxWidth: '80%', padding: 12, borderRadius: 16 },
  messageOfficer: { alignSelf: 'flex-end', backgroundColor: colors.primary, borderBottomRightRadius: 4 },
  messageAssistant: { alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.1)', borderBottomLeftRadius: 4 },
  messageText: { color: colors.white, fontSize: typography.size.sm, lineHeight: 20 },

  inputContainer: { flexDirection: 'row', padding: 16, backgroundColor: '#0B1020', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', alignItems: 'center', gap: 12 },
  input: { flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, color: colors.white, fontSize: typography.size.sm },
  sendButton: { backgroundColor: colors.primary, width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
});
