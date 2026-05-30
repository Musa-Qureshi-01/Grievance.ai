import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { borderRadius, spacing } from '../../theme/spacing';

export type RoleOption = 'citizen' | 'officer';

interface RoleSelectorProps {
  selected: RoleOption;
  onSelect: (role: RoleOption) => void;
}

const roles: { key: RoleOption; label: string; icon: keyof typeof Ionicons.glyphMap; description: string }[] = [
  {
    key: 'citizen',
    label: 'Citizen',
    icon: 'person-outline',
    description: 'File & track grievances',
  },
  {
    key: 'officer',
    label: 'Officer',
    icon: 'briefcase-outline',
    description: 'Manage & resolve cases',
  },
];

export function RoleSelector({ selected, onSelect }: RoleSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select your role</Text>
      <View style={styles.grid}>
        {roles.map((role) => {
          const isActive = selected === role.key;
          return (
            <Pressable
              key={role.key}
              onPress={() => onSelect(role.key)}
              style={[
                styles.card,
                isActive && styles.cardActive,
              ]}>
              <View
                style={[
                  styles.iconCircle,
                  isActive && styles.iconCircleActive,
                ]}>
                <Ionicons
                  name={role.icon}
                  size={22}
                  color={isActive ? colors.white : colors.slate500}
                />
              </View>
              <Text
                style={[
                  styles.roleLabel,
                  isActive && styles.roleLabelActive,
                ]}>
                {role.label}
              </Text>
              <Text
                style={[
                  styles.roleDesc,
                  isActive && styles.roleDescActive,
                ]}>
                {role.description}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing[5],
  },
  label: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    color: colors.slate600,
    marginBottom: spacing[2.5],
    textTransform: 'uppercase',
    letterSpacing: typography.letterSpacing.wider,
  },
  grid: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  card: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[3],
    borderWidth: 1.5,
    borderColor: colors.slate200,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.white,
  },
  cardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryFaint,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.slate100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[2],
  },
  iconCircleActive: {
    backgroundColor: colors.primary,
  },
  roleLabel: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.slate700,
    marginBottom: spacing[0.5],
  },
  roleLabelActive: {
    color: colors.primary,
  },
  roleDesc: {
    fontSize: typography.size.xs,
    color: colors.slate400,
    textAlign: 'center',
  },
  roleDescActive: {
    color: colors.primaryDark,
  },
});
