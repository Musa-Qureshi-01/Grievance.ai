import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { RoleSelector, type RoleOption } from '../../components/shared/RoleSelector';
import { useAuth } from '../../contexts/AuthContext';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { borderRadius, spacing } from '../../theme/spacing';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'>;
};

export function LoginScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { signIn } = useAuth();

  const [role, setRole] = useState<RoleOption>('citizen');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    const result = await signIn({ email: email.trim(), password });
    setLoading(false);

    if (result.error) {
      setError(result.error);
    }
    // On success, AuthContext updates → RootNavigator switches to dashboard
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={['#0B1020', '#111D42', '#162350']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: insets.top + spacing[4], paddingBottom: insets.bottom + spacing[6] },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>

          {/* Header with back button */}
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            hitSlop={12}>
            <Ionicons name="arrow-back" size={22} color={colors.slate400} />
          </Pressable>

          {/* Logo */}
          <View style={styles.logoRow}>
            <LinearGradient
              colors={['#2563EB', '#1D4ED8']}
              style={styles.logoIcon}>
              <Ionicons name="shield-checkmark" size={22} color={colors.white} />
            </LinearGradient>
          </View>

          <Text style={styles.title}>Sign in to your account</Text>
          <Text style={styles.subtitle}>
            Access the GovOps Intelligence Platform
          </Text>

          {/* Form Card */}
          <View style={styles.formCard}>
            <RoleSelector selected={role} onSelect={setRole} />

            <Input
              label="Email address"
              placeholder="you@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoComplete="email"
              icon={
                <Ionicons name="mail-outline" size={20} color={colors.slate400} />
              }
            />

            <Input
              label="Password"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              isPassword
              icon={
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={colors.slate400}
                />
              }
            />

            {/* Error display */}
            {error ? (
              <View style={styles.errorBanner}>
                <Ionicons
                  name="alert-circle"
                  size={16}
                  color={colors.error}
                />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <Button
              title="Sign In"
              onPress={handleSubmit}
              loading={loading}
              variant="primary"
              size="lg"
              fullWidth
              icon={
                !loading ? (
                  <Ionicons name="arrow-forward" size={18} color={colors.white} />
                ) : undefined
              }
            />

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>New to GovOps?</Text>
              <View style={styles.dividerLine} />
            </View>

            <Button
              title="Create an account"
              onPress={() => navigation.replace('Signup')}
              variant="outline"
              size="md"
              fullWidth
            />

            <Text style={styles.footer}>
              Secured by GovOps Intelligence Platform
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1020',
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing[5],
  },

  // ─── Header ───────────────────────────────
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[6],
  },
  logoRow: {
    alignItems: 'center',
    marginBottom: spacing[5],
  },
  logoIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  title: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.extrabold,
    color: colors.white,
    textAlign: 'center',
    letterSpacing: typography.letterSpacing.tight,
    marginBottom: spacing[1],
  },
  subtitle: {
    fontSize: typography.size.sm,
    color: colors.slate400,
    textAlign: 'center',
    marginBottom: spacing[6],
  },

  // ─── Form Card ────────────────────────────
  formCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius['2xl'],
    padding: spacing[5],
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },

  // ─── Error ────────────────────────────────
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    backgroundColor: colors.errorFaint,
    padding: spacing[3],
    borderRadius: borderRadius.lg,
    marginBottom: spacing[4],
  },
  errorText: {
    flex: 1,
    fontSize: typography.size.sm,
    color: colors.error,
    fontWeight: typography.weight.medium,
  },

  // ─── Divider ──────────────────────────────
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing[5],
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.slate200,
  },
  dividerText: {
    fontSize: typography.size.xs,
    color: colors.slate500,
    paddingHorizontal: spacing[3],
  },

  // ─── Footer ───────────────────────────────
  footer: {
    fontSize: typography.size.xs,
    color: colors.slate400,
    textAlign: 'center',
    marginTop: spacing[5],
    letterSpacing: typography.letterSpacing.wide,
  },
});
