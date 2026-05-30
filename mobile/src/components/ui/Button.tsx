import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { borderRadius, spacing } from '../../theme/spacing';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

/**
 * Button component using TouchableOpacity instead of Pressable.
 *
 * WHY: NativeWind v4's `jsxImportSource: 'nativewind'` babel preset
 * intercepts all JSX style props. Pressable uses a FUNCTION for its
 * style prop: `style={({ pressed }) => [...]}`. NativeWind's interop
 * layer doesn't forward function-based style callbacks on Android,
 * so the style function never executes and all visual styles are lost.
 *
 * TouchableOpacity uses a plain style array (not a function), which
 * NativeWind processes correctly. Press feedback is handled via the
 * built-in opacity animation (activeOpacity).
 */
export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
  fullWidth = false,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.85}
      style={[
        styles.base,
        variantStyle[variant],
        sizeStyle[size],
        fullWidth ? styles.fullWidth : null,
        isDisabled ? styles.disabled : null,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? colors.white : colors.primary}
        />
      ) : (
        <View style={styles.content}>
          {icon}
          <Text
            style={[
              styles.text,
              textVariantStyle[variant],
              textSizeStyle[size],
              icon ? styles.textWithIcon : null,
              textStyle,
            ]}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: typography.weight.semibold,
    letterSpacing: typography.letterSpacing.wide,
  },
  textWithIcon: {
    marginLeft: spacing[2],
  },

  // ─── Variant: container ───────────────────
  v_primary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  v_secondary: {
    backgroundColor: colors.slate100,
    borderColor: colors.slate200,
  },
  v_outline: {
    backgroundColor: 'transparent',
    borderColor: colors.slate300,
  },
  v_ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },

  // ─── Variant: text ────────────────────────
  vt_primary: { color: colors.white },
  vt_secondary: { color: colors.slate900 },
  vt_outline: { color: colors.slate700 },
  vt_ghost: { color: colors.slate600 },

  // ─── Size: container ──────────────────────
  s_sm: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1.5],
    borderRadius: borderRadius.md,
  },
  s_md: {
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[3],
  },
  s_lg: {
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[3.5],
    borderRadius: borderRadius.xl,
  },

  // ─── Size: text ───────────────────────────
  st_sm: { fontSize: typography.size.sm },
  st_md: { fontSize: typography.size.base },
  st_lg: { fontSize: typography.size.md },
});

// Lookup maps — reference StyleSheet-registered styles by variant/size key
const variantStyle: Record<ButtonVariant, ViewStyle> = {
  primary: styles.v_primary,
  secondary: styles.v_secondary,
  outline: styles.v_outline,
  ghost: styles.v_ghost,
};
const textVariantStyle: Record<ButtonVariant, TextStyle> = {
  primary: styles.vt_primary,
  secondary: styles.vt_secondary,
  outline: styles.vt_outline,
  ghost: styles.vt_ghost,
};
const sizeStyle: Record<ButtonSize, ViewStyle> = {
  sm: styles.s_sm,
  md: styles.s_md,
  lg: styles.s_lg,
};
const textSizeStyle: Record<ButtonSize, TextStyle> = {
  sm: styles.st_sm,
  md: styles.st_md,
  lg: styles.st_lg,
};
