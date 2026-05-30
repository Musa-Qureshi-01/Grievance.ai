import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { GlassCard } from '../shared/GlassCard';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export interface KPIStat {
  id: string;
  label: string;
  value: number | string;
  unit?: string;
  trend?: number;
  trendLabel?: string;
  intent: 'positive' | 'negative' | 'warning' | 'neutral';
  icon: LucideIcon;
}

interface KpiGridProps {
  stats: KPIStat[];
}

export function KpiGrid({ stats }: KpiGridProps) {
  return (
    <View style={styles.grid}>
      {stats.map((stat) => {
        const Icon = stat.icon;
        
        let iconBg = 'rgba(255,255,255,0.1)';
        let iconColor: string = colors.white;
        
        if (stat.intent === 'positive') {
          iconBg = 'rgba(16, 185, 129, 0.2)';
          iconColor = colors.success;
        } else if (stat.intent === 'warning') {
          iconBg = 'rgba(245, 158, 11, 0.2)';
          iconColor = colors.warning;
        } else if (stat.intent === 'negative') {
          iconBg = 'rgba(244, 63, 94, 0.2)';
          iconColor = colors.error;
        } else {
          iconBg = 'rgba(56, 189, 248, 0.2)';
          iconColor = colors.info;
        }

        return (
          <GlassCard key={stat.id} style={styles.card}>
            <View style={styles.header}>
              <Text style={styles.label}>{stat.label}</Text>
              <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
                <Icon size={18} color={iconColor} />
              </View>
            </View>
            <View style={styles.valueContainer}>
              <Text style={styles.value}>{stat.value}</Text>
              {stat.unit && <Text style={styles.unit}>{stat.unit}</Text>}
            </View>
            {stat.trend !== undefined && (
              <View style={styles.trendContainer}>
                <Text
                  style={[
                    styles.trendText,
                    { color: stat.trend >= 0 ? colors.success : colors.error },
                  ]}>
                  {stat.trend >= 0 ? '+' : ''}{stat.trend}%
                </Text>
                {stat.trendLabel && (
                  <Text style={styles.trendLabel}>{stat.trendLabel}</Text>
                )}
              </View>
            )}
          </GlassCard>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  card: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    color: colors.slate400,
    fontSize: typography.size.xs,
    fontWeight: typography.weight.medium,
  },
  iconContainer: {
    padding: 8,
    borderRadius: 12,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  value: {
    color: colors.white,
    fontSize: typography.size['3xl'],
    fontWeight: typography.weight.bold,
  },
  unit: {
    color: colors.slate400,
    fontSize: typography.size.sm,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  trendText: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
  },
  trendLabel: {
    color: colors.slate500,
    fontSize: typography.size.xs,
  },
});
