import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dashboardService } from '../../services/dashboard.service';
import { User, Mail, Phone, MapPin, ShieldCheck, CheckCircle2, Clock, Activity, Lock } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { GlassCard } from '../../components/shared/GlassCard';
import Toast from 'react-native-toast-message';
import { useAuth } from '../../contexts/AuthContext';

export function CitizenProfileScreen() {
  const queryClient = useQueryClient();
  const [phone, setPhone] = useState('');
  const { signOut } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ['citizen', 'profile'],
    queryFn: dashboardService.citizenProfile,
  });

  const user = data?.user ?? {};
  const stats = data?.stats ?? {};
  const timeline = data?.timeline ?? [];
  const points = stats.points ?? 0;
  const accuracy = stats.accuracy ?? 0;
  const totalReports = stats.totalReports ?? 0;

  useEffect(() => {
    setPhone(user.phone || '');
  }, [user.phone]);

  const updateProfileMutation = useMutation({
    mutationFn: dashboardService.updateCitizenProfile,
    onSuccess: (updatedUser: any) => {
      setPhone(updatedUser.phone || '');
      queryClient.setQueryData(['citizen', 'profile'], (oldData: any) => ({
        ...(oldData || {}),
        user: {
          ...(oldData?.user || {}),
          ...updatedUser,
        },
      }));
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'WhatsApp number saved',
      });
    },
    onError: () => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update phone number',
      });
    }
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Citizen Profile</Text>
        <Text style={styles.subtitle}>Manage your identity verifications and view your complete civic history.</Text>
      </View>

      <GlassCard style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <User color={colors.slate400} size={40} />
          </View>
          <View style={styles.badge}>
            <ShieldCheck color={colors.white} size={12} />
          </View>
        </View>
        <Text style={styles.name}>{user.name || 'Citizen'}</Text>
        <Text style={styles.levelText}>Level {stats.level ?? 1} Contributor</Text>
        
        <View style={styles.activeTag}>
          <CheckCircle2 color={colors.success} size={14} />
          <Text style={styles.activeTagText}>Account Active</Text>
        </View>

        <View style={styles.rankContainer}>
          <Text style={styles.rankText}>Rank {stats.rank ? `#${stats.rank}` : 'Pending'}</Text>
        </View>
      </GlassCard>

      <GlassCard style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Contact Info</Text>
        <View style={styles.infoRow}>
          <Mail color={colors.slate400} size={16} />
          <Text style={styles.infoText}>{user.email || 'Not available'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Phone color={colors.slate400} size={16} />
          <Text style={styles.infoText}>{user.phone || 'Phone not added'}</Text>
        </View>
        <View style={styles.infoRow}>
          <MapPin color={colors.slate400} size={16} />
          <Text style={styles.infoText}>{user.address || 'Address not added'}</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.formLabel}>WhatsApp Phone</Text>
          <TextInput
            style={styles.input}
            placeholder="+91XXXXXXXXXX"
            placeholderTextColor={colors.slate500}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <TouchableOpacity 
            style={[styles.saveButton, updateProfileMutation.isPending && styles.saveButtonDisabled]}
            onPress={() => updateProfileMutation.mutate({ phone })}
            disabled={updateProfileMutation.isPending}
          >
            <Text style={styles.saveButtonText}>
              {updateProfileMutation.isPending ? 'Saving...' : 'Save WhatsApp Number'}
            </Text>
          </TouchableOpacity>
        </View>
      </GlassCard>

      <GlassCard style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Civic Trust Score</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{points}</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{accuracy}%</Text>
            <Text style={styles.statLabel}>Accuracy</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totalReports}</Text>
            <Text style={styles.statLabel}>Reports</Text>
          </View>
        </View>
      </GlassCard>

      <GlassCard style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Activity Timeline</Text>
        {timeline.length === 0 ? (
          <Text style={styles.emptyText}>Your activity timeline will appear after your first report.</Text>
        ) : (
          timeline.map((item: any, index: number) => (
            <View key={item.id} style={styles.timelineItem}>
              <View style={[styles.timelineIcon, { backgroundColor: item.status === 'Resolved' ? colors.success : colors.primaryLight }]}>
                {item.status === 'Resolved' ? (
                  <CheckCircle2 color={colors.white} size={14} />
                ) : (
                  <Clock color={colors.white} size={14} />
                )}
              </View>
              <View style={styles.timelineContent}>
                <View style={styles.timelineHeader}>
                  <Text style={styles.timelineStatus}>{item.status}</Text>
                  <Text style={styles.timelineDate}>{new Date(item.time).toLocaleDateString()}</Text>
                </View>
                <Text style={styles.timelineTitle}>{item.title}</Text>
              </View>
            </View>
          ))
        )}
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
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0B1020' },
  header: { marginBottom: 8 },
  title: { color: colors.white, fontSize: typography.size['3xl'], fontWeight: typography.weight.bold, marginBottom: 8 },
  subtitle: { color: colors.slate400, fontSize: typography.size.sm, lineHeight: 20 },
  
  profileCard: { alignItems: 'center', padding: 24 },
  avatarContainer: { position: 'relative', marginBottom: 16 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 2, borderColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: colors.success, padding: 4, borderRadius: 12, borderWidth: 2, borderColor: '#0B1020' },
  name: { color: colors.white, fontSize: typography.size.xl, fontWeight: typography.weight.bold, marginBottom: 4 },
  levelText: { color: colors.slate400, fontSize: typography.size.sm, marginBottom: 12 },
  activeTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(16, 185, 129, 0.1)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, gap: 6, marginBottom: 16 },
  activeTagText: { color: colors.success, fontSize: typography.size.xs, fontWeight: typography.weight.semibold },
  rankContainer: { width: '100%', paddingVertical: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', alignItems: 'center', marginTop: 8 },
  rankText: { color: colors.white, fontSize: typography.size.sm, fontWeight: typography.weight.medium },

  sectionCard: { padding: 20 },
  sectionTitle: { color: colors.white, fontSize: typography.size.lg, fontWeight: typography.weight.semibold, marginBottom: 16 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  infoText: { color: colors.slate300, fontSize: typography.size.sm },
  
  formContainer: { marginTop: 24, paddingTop: 20, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' },
  formLabel: { color: colors.slate400, fontSize: typography.size.xs, fontWeight: typography.weight.semibold, marginBottom: 8, textTransform: 'uppercase' },
  input: { backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 12, color: colors.white, paddingHorizontal: 16, paddingVertical: 12, fontSize: typography.size.sm, marginBottom: 12 },
  saveButton: { backgroundColor: colors.primary, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  saveButtonDisabled: { opacity: 0.7 },
  saveButtonText: { color: colors.white, fontSize: typography.size.sm, fontWeight: typography.weight.semibold },

  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  statItem: { alignItems: 'center', flex: 1 },
  statValue: { color: colors.white, fontSize: typography.size['2xl'], fontWeight: typography.weight.bold, marginBottom: 4 },
  statLabel: { color: colors.slate400, fontSize: typography.size.xs },

  emptyText: { color: colors.slate500, fontSize: typography.size.sm },
  timelineItem: { flexDirection: 'row', gap: 16, marginBottom: 20 },
  timelineIcon: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  timelineContent: { flex: 1, backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: 12 },
  timelineHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  timelineStatus: { color: colors.white, fontSize: typography.size.sm, fontWeight: typography.weight.semibold },
  timelineDate: { color: colors.slate400, fontSize: typography.size.xs },
  timelineTitle: { color: colors.slate300, fontSize: typography.size.xs },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: 'rgba(244, 63, 94, 0.1)', borderWidth: 1, borderColor: 'rgba(244, 63, 94, 0.2)', padding: 16, borderRadius: 16, marginTop: 8 },
  logoutText: { color: colors.error, fontSize: typography.size.sm, fontWeight: typography.weight.bold },
});
