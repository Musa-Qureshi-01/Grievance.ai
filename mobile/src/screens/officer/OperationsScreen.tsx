import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';
import { complaintService } from '../../services/complaint.service';
import { GlassCard } from '../../components/shared/GlassCard';
import { KpiGrid } from '../../components/dashboard/KpiGrid';
import { AlertTriangle, Clock, CheckCircle2, ShieldCheck, ChevronRight } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { useNavigation } from '@react-navigation/native';

export function OperationsScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<'queue' | 'alerts'>('queue');

  const { data, isLoading } = useQuery({
    queryKey: ['officer', 'complaints'],
    queryFn: () => complaintService.list({ limit: 10 }),
    refetchInterval: 15000,
  });

  const complaints = data?.items ?? [];
  const activeCount = complaints.filter(
    (item: any) => !['RESOLVED', 'CLOSED', 'REJECTED'].includes(item.status)
  ).length;
  const resolvedCount = complaints.filter(
    (item: any) => ['RESOLVED', 'CLOSED'].includes(item.status)
  ).length;

  const kpis = [
    {
      id: 'active',
      label: 'Open Cases',
      value: activeCount,
      intent: 'warning' as const,
      icon: Clock,
    },
    {
      id: 'resolved',
      label: 'Resolved',
      value: resolvedCount,
      intent: 'positive' as const,
      icon: CheckCircle2,
    },
    {
      id: 'sla',
      label: 'SLA Compliance',
      value: '94%',
      intent: 'positive' as const,
      icon: ShieldCheck,
    },
  ];

  const renderComplaintItem = ({ item }: { item: any }) => {
    let statusBg = 'rgba(255,255,255,0.1)';
    let statusColor: string = colors.slate300;

    if (['RESOLVED', 'CLOSED'].includes(item.status)) {
      statusBg = 'rgba(16, 185, 129, 0.2)';
      statusColor = colors.success;
    } else if (item.status === 'REJECTED') {
      statusBg = 'rgba(244, 63, 94, 0.2)';
      statusColor = colors.error;
    } else if (['IN_PROGRESS', 'ASSIGNED'].includes(item.status)) {
      statusBg = 'rgba(56, 189, 248, 0.2)';
      statusColor = colors.info;
    }

    return (
      <TouchableOpacity style={styles.complaintCard}>
        <View style={styles.complaintContent}>
          <View style={styles.complaintHeader}>
            <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
              <Text style={[styles.statusText, { color: statusColor }]}>{item.status}</Text>
            </View>
            <Text style={styles.dateText}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
          <Text style={styles.complaintTitle}>{item.title}</Text>
          <Text style={styles.complaintDescription} numberOfLines={2}>
            {item.description}
          </Text>
        </View>
        <ChevronRight color={colors.slate500} size={20} />
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeTitle}>Operations Center</Text>
        <Text style={styles.welcomeSubtitle}>Command Overview • {user?.name}</Text>
      </View>

      <KpiGrid stats={kpis} />

      <GlassCard style={styles.alertsCard}>
        <View style={styles.alertsHeader}>
          <AlertTriangle color={colors.error} size={16} />
          <Text style={styles.alertsTitle}>Active Alerts</Text>
        </View>
        <View style={styles.alertItemWrapper}>
          <View style={[styles.alertItem, styles.alertCritical]}>
            <Text style={styles.alertCriticalText}>Critical sanitation incident in Ward 12 requires immediate dispatch.</Text>
          </View>
          <View style={[styles.alertItem, styles.alertWarning]}>
            <Text style={styles.alertWarningText}>SLA risk: traffic signal outage nearing breach in Ward 5.</Text>
          </View>
        </View>
      </GlassCard>

      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tabBtn, activeTab === 'queue' && styles.tabBtnActive]}
          onPress={() => setActiveTab('queue')}
        >
          <Text style={[styles.tabBtnText, activeTab === 'queue' && styles.tabBtnTextActive]}>Queue</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabBtn, activeTab === 'alerts' && styles.tabBtnActive]}
          onPress={() => setActiveTab('alerts')}
        >
          <Text style={[styles.tabBtnText, activeTab === 'alerts' && styles.tabBtnTextActive]}>Escalations</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={activeTab === 'queue' ? complaints : []}
          keyExtractor={(item) => item.id}
          renderItem={renderComplaintItem}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {activeTab === 'queue' ? 'No complaints in queue.' : 'No active escalations.'}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B1020' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { padding: 20, paddingTop: 60, paddingBottom: 40 },
  headerContainer: { gap: 24, marginBottom: 16 },
  
  welcomeSection: { marginBottom: 8 },
  welcomeTitle: { color: colors.white, fontSize: typography.size['2xl'], fontWeight: typography.weight.bold, marginBottom: 4 },
  welcomeSubtitle: { color: colors.slate400, fontSize: typography.size.sm },

  alertsCard: { padding: 20 },
  alertsHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  alertsTitle: { color: colors.white, fontSize: typography.size.base, fontWeight: typography.weight.semibold },
  alertItemWrapper: { gap: 12 },
  alertItem: { padding: 12, borderRadius: 12, borderWidth: 1 },
  alertCritical: { backgroundColor: 'rgba(244, 63, 94, 0.1)', borderColor: 'rgba(244, 63, 94, 0.3)' },
  alertCriticalText: { color: colors.error, fontSize: typography.size.sm },
  alertWarning: { backgroundColor: 'rgba(245, 158, 11, 0.1)', borderColor: 'rgba(245, 158, 11, 0.3)' },
  alertWarningText: { color: colors.warning, fontSize: typography.size.sm },

  tabsContainer: { flexDirection: 'row', gap: 12, marginTop: 8 },
  tabBtn: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  tabBtnActive: { backgroundColor: 'rgba(59, 130, 246, 0.2)', borderColor: 'rgba(59, 130, 246, 0.5)' },
  tabBtnText: { color: colors.slate400, fontSize: typography.size.sm, fontWeight: typography.weight.medium },
  tabBtnTextActive: { color: colors.primaryLight },

  complaintCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderRadius: 16, padding: 16, marginBottom: 12 },
  complaintContent: { flex: 1, gap: 8, paddingRight: 12 },
  complaintHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 10, fontWeight: typography.weight.bold },
  dateText: { color: colors.slate500, fontSize: typography.size.xs },
  complaintTitle: { color: colors.white, fontSize: typography.size.base, fontWeight: typography.weight.semibold },
  complaintDescription: { color: colors.slate400, fontSize: typography.size.sm, lineHeight: 20 },
  
  emptyContainer: { padding: 40, alignItems: 'center' },
  emptyText: { color: colors.slate500, fontSize: typography.size.sm },
});
