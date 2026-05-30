import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';
import { complaintService } from '../../services/complaint.service';
import { KpiGrid } from '../../components/dashboard/KpiGrid';
import { AlertCircle, CheckCircle2, Trophy, Search, ChevronRight, Plus } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

type CitizenTabParamList = {
  Overview: undefined;
  Submit: undefined;
  Profile: undefined;
};

type NavigationProp = BottomTabNavigationProp<CitizenTabParamList, 'Overview'>;

export function CitizenOverviewScreen() {
  const { user } = useAuth();
  const navigation = useNavigation<NavigationProp>();
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['complaints', 'mine', searchTerm],
    queryFn: () => complaintService.list({ page: 1, limit: 20, search: searchTerm || undefined }),
    refetchInterval: 15000,
  });

  const complaints = data?.items ?? [];
  const activeCount = complaints.filter(
    (item: any) => !['RESOLVED', 'CLOSED', 'REJECTED'].includes(item.status)
  ).length;
  const resolvedCount = complaints.filter(
    (item: any) => ['RESOLVED', 'CLOSED'].includes(item.status)
  ).length;

  const stats = [
    {
      id: 'active',
      label: 'Active Issues',
      value: activeCount,
      intent: 'warning' as const,
      icon: AlertCircle,
    },
    {
      id: 'resolved',
      label: 'Resolved',
      value: resolvedCount,
      intent: 'positive' as const,
      icon: CheckCircle2,
    },
    {
      id: 'rank',
      label: 'Community Rank',
      value: data?.pagination?.total ? `#${data.pagination.total}` : 'Pending',
      intent: 'neutral' as const,
      icon: Trophy,
    },
  ];

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.welcomeSection}>
        <View style={{ flex: 1 }}>
          <Text style={styles.welcomeTitle}>Welcome back, {user?.name || 'Citizen'}</Text>
          <Text style={styles.welcomeSubtitle}>Track your community reports and civic requests.</Text>
        </View>
        <TouchableOpacity 
          style={styles.newReportButton}
          onPress={() => navigation.navigate('Submit')}
        >
          <Plus color={colors.slate900} size={16} />
          <Text style={styles.newReportButtonText}>New Report</Text>
        </TouchableOpacity>
      </View>

      <KpiGrid stats={stats} />

      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Your Reports</Text>
        <View style={styles.searchContainer}>
          <Search color={colors.slate400} size={16} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search reports..."
            placeholderTextColor={colors.slate500}
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>
      </View>
    </View>
  );

  const renderItem = ({ item }: { item: any }) => {
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

  return (
    <View style={styles.container}>
      {isLoading && !data ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={complaints}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No reports found.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1020',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 20,
    paddingTop: 60, // For status bar
    paddingBottom: 40,
  },
  headerContainer: {
    gap: 24,
    marginBottom: 24,
  },
  welcomeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
  },
  welcomeTitle: {
    color: colors.white,
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    marginBottom: 4,
  },
  welcomeSubtitle: {
    color: colors.slate400,
    fontSize: typography.size.sm,
  },
  newReportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  newReportButtonText: {
    color: colors.slate900,
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
  },
  listHeader: {
    gap: 12,
  },
  listTitle: {
    color: colors.white,
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: colors.white,
    fontSize: typography.size.sm,
  },
  complaintCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  complaintContent: {
    flex: 1,
    gap: 8,
    paddingRight: 12,
  },
  complaintHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: typography.weight.bold,
  },
  dateText: {
    color: colors.slate500,
    fontSize: typography.size.xs,
  },
  complaintTitle: {
    color: colors.white,
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
  },
  complaintDescription: {
    color: colors.slate400,
    fontSize: typography.size.sm,
    lineHeight: 20,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.slate500,
    fontSize: typography.size.sm,
  },
});
