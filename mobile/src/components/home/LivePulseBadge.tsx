import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, { cancelAnimation, Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import { useSseConnectionStore, type SseConnectionStatus } from '@/stores/sseConnectionStore';

function statusLabel(status: SseConnectionStatus): string {
  switch (status) {
    case 'connecting':
      return 'Live · connecting';
    case 'open':
      return 'Live · streaming';
    case 'error':
      return 'Live · error';
    case 'closed':
      return 'Live · paused';
    default:
      return 'Live · standby';
  }
}

function dotColor(status: SseConnectionStatus): string {
  switch (status) {
    case 'open':
      return 'bg-emerald-400';
    case 'connecting':
      return 'bg-amber-400';
    case 'error':
      return 'bg-red-400';
    default:
      return 'bg-slate-500';
  }
}

export function LivePulseBadge() {
  const status = useSseConnectionStore((s) => s.status);
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (status === 'connecting' || status === 'open') {
      pulse.value = withRepeat(
        withTiming(0.35, { duration: 700, easing: Easing.inOut(Easing.quad) }),
        -1,
        true,
      );
    } else {
      cancelAnimation(pulse);
      pulse.value = withTiming(1, { duration: 200 });
    }
  }, [status, pulse]);

  const dotStyle = useAnimatedStyle(() => ({
    opacity: pulse.value,
    transform: [{ scale: 0.85 + pulse.value * 0.15 }],
  }));

  return (
    <View className="flex-row items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1.5">
      <Animated.View style={dotStyle} className={`h-2 w-2 rounded-full ${dotColor(status)}`} />
      <Text className="text-[11px] font-medium text-slate-300">{statusLabel(status)}</Text>
    </View>
  );
}
