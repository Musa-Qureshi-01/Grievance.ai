import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { AuthStack } from './AuthStack';
import { CitizenTabNavigator } from './CitizenTabNavigator';
import { OfficerTabNavigator } from './OfficerTabNavigator';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

/**
 * Root navigator — switches between Auth and Dashboard based on auth state and role.
 */
export function RootNavigator() {
  const { user, loading } = useAuth();

  // Show loading splash while checking auth state
  if (loading) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.splashText}>Loading...</Text>
      </View>
    );
  }

  // Not authenticated → show auth flow
  if (!user) {
    return <AuthStack />;
  }

  // Authenticated → show role-based dashboard
  if (user.role === 'officer' || user.role === 'admin') {
    return <OfficerTabNavigator />;
  }

  // Default to citizen for other roles
  return <CitizenTabNavigator />;
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: '#0B1020',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  splashText: {
    color: colors.slate400,
    fontSize: typography.size.sm,
  },
  dashboard: {
    flex: 1,
    backgroundColor: '#0B1020',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  dashboardCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    width: '100%',
  },
  dashboardWelcome: {
    color: colors.slate400,
    fontSize: typography.size.sm,
    marginBottom: 4,
  },
  dashboardName: {
    color: colors.white,
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    marginBottom: 12,
  },
  roleBadge: {
    backgroundColor: 'rgba(37, 99, 235, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 20,
  },
  roleBadgeText: {
    color: colors.primaryLight,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
  },
  dashboardHint: {
    color: colors.slate500,
    fontSize: typography.size.xs,
    textAlign: 'center',
  },
});
