import { Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import type { LandingTask } from '@/types/landing';

type TaskPreviewCardProps = {
  task: LandingTask;
  index: number;
};

export function TaskPreviewCard({ task, index }: TaskPreviewCardProps) {
  const urgent = task.status === 'urgent';
  const border = urgent ? 'border-l-amber-400' : 'border-l-blue-400';

  return (
    <Animated.View
      entering={FadeInDown.delay(80 * index).springify().damping(16)}
      className={`mb-3 rounded-2xl border border-white/10 bg-slate-900/60 pl-4 ${border} border-l-[3px]`}>
      <View className="py-3 pr-4">
        <Text className="text-base font-semibold text-white" numberOfLines={2}>
          {task.title}
        </Text>
        <Text className="mt-1 text-xs text-slate-400">
          {task.department} · {task.priority}
        </Text>
        <Text className="mt-2 text-xs italic leading-4 text-slate-500" numberOfLines={2}>
          AI: {task.aiSuggestion}
        </Text>
      </View>
    </Animated.View>
  );
}
