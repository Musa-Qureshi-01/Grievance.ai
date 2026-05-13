import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { getApiBaseUrl } from '@/api/client';
import { GlassHeroCard } from '@/components/home/GlassHeroCard';
import { LivePulseBadge } from '@/components/home/LivePulseBadge';
import { SectionHeader } from '@/components/home/SectionHeader';
import { StatPill } from '@/components/home/StatPill';
import { TaskPreviewCard } from '@/components/home/TaskPreviewCard';
import { publicService } from '@/services/publicService';
import { useSseConnectionStore } from '@/stores/sseConnectionStore';
import type { LandingPayload } from '@/types/landing';

const fmt = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 });

export function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const heroMaxWidth = useMemo(() => Math.min(560, width - 32), [width]);

  const [landing, setLanding] = useState<LandingPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sseUrl = (globalThis as any).process?.env?.EXPO_PUBLIC_SSE_URL;
  const sseError = useSseConnectionStore((s) => s.error);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);
    try {
      const data = await publicService.landing();
      setLanding(data);
    } catch (e) {
      setLanding(null);
      setError(e instanceof Error ? e.message : 'Could not load home data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void load(false);
  }, [load]);

  useEffect(() => {
    if (!sseUrl) {
      return;
    }
    useSseConnectionStore.getState().connect(sseUrl);
    return () => {
      useSseConnectionStore.getState().disconnect();
    };
  }, [sseUrl]);

  const tasks = landing?.officerWorkflow.taskQueue.slice(0, 3) ?? [];

  return (
    <LinearGradient colors={['#020617', '#0B1020', '#0f172a']} style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 12,
          paddingBottom: insets.bottom + 32,
          paddingHorizontal: 16,
        }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => void load(true)} tintColor="#93c5fd" />}>
        <Animated.View entering={FadeInDown.delay(40).springify().damping(20)} className="mb-6 flex-row flex-wrap items-center justify-between gap-3">
          <View className="min-w-40 flex-1">
            <Text className="text-2xl font-bold tracking-tight text-white">Grievance.ai</Text>
            <Text className="mt-1 text-sm text-slate-400">AI citizen grievance redressal</Text>
          </View>
          <LivePulseBadge />
        </Animated.View>

        {error ? (
          <View className="mb-6 rounded-2xl border border-red-500/30 bg-red-950/40 px-4 py-3">
            <Text className="text-sm font-semibold text-red-200">Network</Text>
            <Text className="mt-1 text-sm leading-5 text-red-100/90">{error}</Text>
            <Text className="mt-2 text-xs text-slate-400">API: {getApiBaseUrl()}</Text>
          </View>
        ) : null}

        {sseError && sseUrl ? (
          <View className="mb-4 rounded-xl border border-amber-500/30 bg-amber-950/30 px-3 py-2">
            <Text className="text-xs text-amber-100">SSE: {sseError}</Text>
          </View>
        ) : null}

        {loading && !landing ? (
          <View className="items-center py-16">
            <ActivityIndicator size="large" color="#60a5fa" />
            <Text className="mt-4 text-sm text-slate-400">Loading live intelligence…</Text>
          </View>
        ) : null}

        {landing ? (
          <>
            <GlassHeroCard maxWidth={heroMaxWidth}>
              <Text className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300/90">GovOps pulse</Text>
              <Text className="mt-2 text-2xl font-bold leading-8 text-white">Transparency-first grievance intelligence</Text>
              <Text className="mt-2 text-sm leading-5 text-slate-300">
                Same backend as the web portal — operational metrics refresh below.
              </Text>
              <View className="mt-5 flex-row flex-wrap gap-2">
                <StatPill label="Resolved" value={fmt.format(landing.hero.resolved)} accent="emerald" />
                <StatPill label="Active" value={fmt.format(landing.hero.active)} accent="blue" />
                <StatPill label="Model %" value={`${landing.hero.accuracy}%`} accent="amber" />
              </View>
              <View className="mt-6 flex-row flex-wrap gap-3">
                <Link href="/sign-in" asChild>
                  <Pressable className="min-h-12 flex-1 items-center justify-center rounded-2xl bg-blue-600 px-4 active:opacity-90">
                    <Text className="text-center text-base font-semibold text-white">Sign in</Text>
                  </Pressable>
                </Link>
                <Pressable
                  className="min-h-12 flex-1 items-center justify-center rounded-2xl border border-white/20 px-4 active:bg-white/10"
                  onPress={() => void load(true)}>
                  <Text className="text-center text-base font-semibold text-white">Refresh</Text>
                </Pressable>
              </View>
            </GlassHeroCard>

            <View className="mt-10">
              <SectionHeader
                title="Priority preview"
                subtitle="Officer task queue (public landing slice) — optimized for mobile glance."
                delayMs={120}
              />
              {tasks.map((task, index) => (
                <TaskPreviewCard key={task.id} task={task} index={index} />
              ))}
            </View>

            <View className="mt-8 rounded-2xl border border-white/10 bg-slate-900/40 px-4 py-4">
              <Text className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pipeline</Text>
              <Text className="mt-2 text-sm text-slate-300">
                Processed {fmt.format(landing.pipeline.processed)} · High priority {fmt.format(landing.pipeline.highPriority)}
              </Text>
            </View>
          </>
        ) : null}
      </ScrollView>
    </LinearGradient>
  );
}
