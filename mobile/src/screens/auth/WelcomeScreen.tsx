import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/ui/Button';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';

const { width } = Dimensions.get('window');

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Welcome'>;
};

export function WelcomeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={['#0B1020', '#111D42', '#162350']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Decorative grid overlay */}
      <View style={styles.gridOverlay} />

      {/* Decorative glowing orbs */}
      <View style={[styles.orb, styles.orbPrimary]} />
      <View style={[styles.orb, styles.orbSecondary]} />

      {/* Content */}
      <View style={[styles.content, { paddingTop: insets.top + spacing[12] }]}>
        {/* Logo & Brand */}
        <View style={styles.heroSection}>
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={['#2563EB', '#1D4ED8']}
              style={styles.logoGradient}>
              <Ionicons name="shield-checkmark" size={32} color={colors.white} />
            </LinearGradient>
          </View>

          <Text style={styles.brandName}>Grievance.ai</Text>
          <Text style={styles.brandTagline}>Smart Governance Platform</Text>

          <View style={styles.divider} />

          <Text style={styles.heroDescription}>
            AI-powered grievance management that connects citizens with
            government officers for faster, transparent resolutions.
          </Text>
        </View>

        {/* Feature pills */}
        <View style={styles.featureRow}>
          {[
            { icon: 'flash-outline' as const, text: 'AI Triage' },
            { icon: 'analytics-outline' as const, text: 'Real-time' },
            { icon: 'shield-outline' as const, text: 'Transparent' },
          ].map((feat) => (
            <View key={feat.text} style={styles.featurePill}>
              <Ionicons name={feat.icon} size={14} color={colors.primaryLight} />
              <Text style={styles.featurePillText}>{feat.text}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Bottom CTA section */}
      <View style={[styles.ctaSection, { paddingBottom: insets.bottom + spacing[6] }]}>
        <View style={styles.ctaCard}>
          <Button
            title="Sign In"
            onPress={() => navigation.navigate('Login')}
            variant="primary"
            size="lg"
            fullWidth
          />

          <View style={styles.ctaSpacer} />

          <Button
            title="Create Account"
            onPress={() => navigation.navigate('Signup')}
            variant="outline"
            size="lg"
            fullWidth
            style={styles.outlineBtn}
            textStyle={styles.outlineBtnText}
          />

          <Text style={styles.ctaFooter}>
            Secured by GovOps Intelligence Platform
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1020',
  },

  // ─── Decorative ───────────────────────────
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.04,
    borderWidth: 0.5,
    borderColor: colors.white,
  },
  orb: {
    position: 'absolute',
    borderRadius: 999,
  },
  orbPrimary: {
    width: width * 0.8,
    height: width * 0.8,
    top: -width * 0.2,
    right: -width * 0.3,
    backgroundColor: 'rgba(37, 99, 235, 0.08)',
  },
  orbSecondary: {
    width: width * 0.6,
    height: width * 0.6,
    bottom: width * 0.1,
    left: -width * 0.25,
    backgroundColor: 'rgba(99, 102, 241, 0.06)',
  },

  // ─── Content ──────────────────────────────
  content: {
    flex: 1,
    paddingHorizontal: spacing[6],
    justifyContent: 'center',
  },

  // ─── Hero ─────────────────────────────────
  heroSection: {
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: spacing[5],
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  logoGradient: {
    width: 72,
    height: 72,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    fontSize: typography.size['3xl'],
    fontWeight: typography.weight.extrabold,
    color: colors.white,
    letterSpacing: typography.letterSpacing.tight,
    marginBottom: spacing[1.5],
  },
  brandTagline: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    color: colors.slate400,
    textTransform: 'uppercase',
    letterSpacing: typography.letterSpacing.widest,
  },
  divider: {
    width: 40,
    height: 2,
    backgroundColor: colors.primary,
    borderRadius: 1,
    marginVertical: spacing[5],
    opacity: 0.6,
  },
  heroDescription: {
    fontSize: typography.size.base,
    lineHeight: typography.size.base * typography.lineHeight.relaxed,
    color: colors.slate400,
    textAlign: 'center',
    paddingHorizontal: spacing[2],
  },

  // ─── Feature Pills ────────────────────────
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing[2],
    marginTop: spacing[8],
  },
  featurePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1.5],
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.2)',
    backgroundColor: 'rgba(37, 99, 235, 0.06)',
  },
  featurePillText: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.medium,
    color: colors.primaryLight,
  },

  // ─── CTA Section ──────────────────────────
  ctaSection: {
    paddingHorizontal: spacing[6],
  },
  ctaCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 24,
    padding: spacing[5],
    alignItems: 'center',
  },
  ctaSpacer: {
    height: spacing[3],
  },
  outlineBtn: {
    borderColor: 'rgba(255, 255, 255, 0.15)',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  outlineBtnText: {
    color: colors.slate300,
  },
  ctaFooter: {
    fontSize: typography.size.xs,
    color: colors.slate600,
    marginTop: spacing[4],
    letterSpacing: typography.letterSpacing.wide,
  },
});
