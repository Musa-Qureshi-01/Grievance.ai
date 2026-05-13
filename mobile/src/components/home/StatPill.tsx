import { Text, View } from 'react-native';

type StatPillProps = {
  label: string;
  value: string;
  accent?: 'blue' | 'emerald' | 'amber';
};

const accentRing: Record<NonNullable<StatPillProps['accent']>, string> = {
  blue: 'border-blue-500/40 bg-blue-500/10',
  emerald: 'border-emerald-500/40 bg-emerald-500/10',
  amber: 'border-amber-500/40 bg-amber-500/10',
};

export function StatPill({ label, value, accent = 'blue' }: StatPillProps) {
  return (
    <View className={`min-w-[100px] flex-1 rounded-2xl border px-3 py-3 ${accentRing[accent]}`}>
      <Text className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{label}</Text>
      <Text className="mt-1 text-xl font-bold tabular-nums text-white" numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
    </View>
  );
}
