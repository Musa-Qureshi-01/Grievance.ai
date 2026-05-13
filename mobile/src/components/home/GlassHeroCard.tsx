import type { ReactNode } from 'react';
import { Platform, View } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn } from 'react-native-reanimated';

type GlassHeroCardProps = {
  children: ReactNode;
  maxWidth?: number;
};

export function GlassHeroCard({ children, maxWidth }: GlassHeroCardProps) {
  const intensity = Platform.OS === 'ios' ? 48 : 32;

  return (
    <Animated.View entering={FadeIn.duration(500)} className="w-full self-center overflow-hidden rounded-3xl" style={{ maxWidth }}>
      <View className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
        <BlurView intensity={intensity} tint="dark" style={{ borderRadius: 24 }}>
          <View className="px-5 py-6">{children}</View>
        </BlurView>
      </View>
    </Animated.View>
  );
}
