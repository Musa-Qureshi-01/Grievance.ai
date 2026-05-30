import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { GlassCard } from '../../components/shared/GlassCard';
import { UserCircle2, Shield, MapPin, BadgeCheck, ClipboardList, Sparkles, Activity, Bell, Lock } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

const assignedWards = [
  { id: 'ward-12', name: 'Ward 12', zone: 'North District', priority: 'High' },
  { id: 'ward-5', name: 'Ward 5', zone: 'CBD', priority: 'Critical' },
];

const activityHistory = [
  { id: 'act-1', title: 'Resolved sanitation escalation', time: '15 mins ago' },
  { id: 'act-2', title: 'AI briefing generated', time: '1 hour ago' },
];

export function OfficerProfileScreen() {
  const { user, signOut } = useAuth();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <UserCircle2 color={colors.primary} size={28} />
        <View style={styles.headerText}>
          <Text style={styles.title}>Officer Profile</Text>
          <Text style={styles.subtitle}>Operational identity and metrics.</Text>
        </View>
      </View>

      <GlassCard style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Shield color={colors.primary} size={28} />
          </View>
          <View style={styles.profileInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{user?.name || 'Officer'}</Text>
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            </View>
            <Text style={styles.roleText}>Field Operations Lead · North Command</Text>
            
            <View style={styles.tagsRow}>
              <View style={styles.tag}>
                <MapPin color={colors.slate400} size={12} />
                <Text style={styles.tagText}>North District</Text>
              </View>
              <View style={styles.tag}>
                <BadgeCheck color={colors.slate400} size={12} />
                <Text style={styles.tagText}>SLA: 94%</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Resolved</Text>
            <Text style={styles.statValue}>128</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Open Cases</Text>
            <Text style={styles.statValue}>14</Text>
          </View>
        </View>
      </GlassCard>

      <GlassCard style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <ClipboardList color={colors.primary} size={16} />
          <Text style={styles.sectionTitle}>Assigned Wards</Text>
        </View>
        <View style={styles.wardsGrid}>
          {assignedWards.map(ward => (
            <View key={ward.id} style={styles.wardCard}>
              <Text style={styles.wardName}>{ward.name}</Text>
              <Text style={styles.wardZone}>{ward.zone}</Text>
              <View style={styles.wardPriority}>
                <Text style={styles.wardPriorityText}>{ward.priority} priority</Text>
              </View>
            </View>
          ))}
        </View>
      </GlassCard>

      <GlassCard style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Sparkles color="#A855F7" size={16} />
          <Text style={styles.sectionTitle}>AI Productivity Score</Text>
        </View>
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>AI Efficiency</Text>
            <Text style={styles.statValue}>88%</Text>
            <View style={styles.barBg}>
              <View style={[styles.barFill, { width: '88%', backgroundColor: colors.primary }]} />
            </View>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>AI Adoption</Text>
            <Text style={styles.statValue}>76%</Text>
            <View style={styles.barBg}>
              <View style={[styles.barFill, { width: '76%', backgroundColor: colors.success }]} />
            </View>
          </View>
        </View>
      </GlassCard>

      <GlassCard style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Activity color={colors.success} size={16} />
          <Text style={styles.sectionTitle}>Activity History</Text>
        </View>
        {activityHistory.map(act => (
          <View key={act.id} style={styles.activityItem}>
            <View style={styles.activityRow}>
              <Text style={styles.activityTitle}>{act.title}</Text>
              <Text style={styles.activityTime}>{act.time}</Text>
            </View>
          </View>
        ))}
      </GlassCard>

      <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
        <Lock color={colors.error} size={18} />
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B1020' },
  content: { padding: 20, paddingTop: 60, paddingBottom: 40, gap: 16 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  headerText: { flex: 1 },
  title: { color: colors.white, fontSize: typography.size.xl, fontWeight: typography.weight.bold },
  subtitle: { color: colors.slate400, fontSize: typography.size.sm },

  profileCard: { padding: 20 },
  profileHeader: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 20 },
  avatar: { width: 64, height: 64, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' },
  profileInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  name: { color: colors.white, fontSize: typography.size.lg, fontWeight: typography.weight.bold },
  verifiedBadge: { backgroundColor: 'rgba(16, 185, 129, 0.1)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  verifiedText: { color: colors.success, fontSize: 10, fontWeight: typography.weight.bold },
  roleText: { color: colors.slate400, fontSize: typography.size.xs, marginBottom: 8 },
  tagsRow: { flexDirection: 'row', gap: 8 },
  tag: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  tagText: { color: colors.slate400, fontSize: 10 },

  statsGrid: { flexDirection: 'row', gap: 12 },
  statBox: { flex: 1, backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: 16 },
  statLabel: { color: colors.slate400, fontSize: typography.size.xs, marginBottom: 4 },
  statValue: { color: colors.white, fontSize: typography.size['2xl'], fontWeight: typography.weight.bold },

  sectionCard: { padding: 20 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  sectionTitle: { color: colors.white, fontSize: typography.size.sm, fontWeight: typography.weight.semibold },
  
  wardsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  wardCard: { flex: 1, minWidth: '45%', backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: 12 },
  wardName: { color: colors.white, fontSize: typography.size.sm, fontWeight: typography.weight.semibold },
  wardZone: { color: colors.slate400, fontSize: typography.size.xs, marginBottom: 8 },
  wardPriority: { alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  wardPriorityText: { color: colors.slate300, fontSize: 10 },

  barBg: { height: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 3, marginTop: 12 },
  barFill: { height: '100%', borderRadius: 3 },

  activityItem: { backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: 16, marginBottom: 12 },
  activityRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  activityTitle: { color: colors.white, fontSize: typography.size.sm, fontWeight: typography.weight.medium, flex: 1 },
  activityTime: { color: colors.slate500, fontSize: typography.size.xs },

  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: 'rgba(244, 63, 94, 0.1)', borderWidth: 1, borderColor: 'rgba(244, 63, 94, 0.2)', padding: 16, borderRadius: 16, marginTop: 8 },
  logoutText: { color: colors.error, fontSize: typography.size.sm, fontWeight: typography.weight.bold },
});
