import { Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  delayMs?: number;
};

export function SectionHeader({ title, subtitle, delayMs = 0 }: SectionHeaderProps) {
  return (
    <Animated.View entering={FadeInDown.delay(delayMs).springify().damping(18)} className="mb-3">
      <Text className="text-lg font-semibold tracking-tight text-white">{title}</Text>
      {subtitle ? <Text className="mt-1 text-sm leading-5 text-slate-400">{subtitle}</Text> : null}
    </Animated.View>
  );
}
