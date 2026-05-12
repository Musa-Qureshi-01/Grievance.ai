import { useEffect, useMemo, useState } from "react";
import {
  activityEvents as baseEvents,
  aiSuggestions as baseSuggestions,
  complaints as baseComplaints,
  kpiStats as baseKpis,
} from "../services/operations-data";
import type {
  ActivityEvent,
  AISuggestion,
  ComplaintItem,
  KPIStat,
} from "../types/operations";

interface RealtimeState {
  complaints: ComplaintItem[];
  kpis: KPIStat[];
  activity: ActivityEvent[];
  aiSuggestions: AISuggestion[];
  lastUpdated: string;
  isLive: boolean;
}

export function useRealtimeComplaints(): RealtimeState {
  const [complaints, setComplaints] = useState<ComplaintItem[]>(baseComplaints);
  const [kpis, setKpis] = useState<KPIStat[]>(baseKpis);
  const [activity, setActivity] = useState<ActivityEvent[]>(baseEvents);
  const [aiSuggestions] = useState<AISuggestion[]>(baseSuggestions);
  const [lastUpdated, setLastUpdated] = useState<string>("just now");

  useEffect(() => {
    const interval = window.setInterval(() => {
      setComplaints((items) =>
        items.map((item) => ({
          ...item,
          slaMinutes: Math.max(0, item.slaMinutes - 1),
        }))
      );

      setKpis((items) =>
        items.map((item) => ({
          ...item,
          value:
            item.id === "active"
              ? Math.max(0, item.value + (Math.random() > 0.6 ? 1 : 0))
              : item.value,
        }))
      );

      setActivity((items) => {
        const next = [...items];
        if (Math.random() > 0.7) {
          next.unshift({
            id: `act-${Date.now()}`,
            type: "note",
            title: "AI alert update",
            description: "Live stream updated priority risk indicators.",
            createdAt: "just now",
            actor: "AI Copilot",
          });
        }
        return next.slice(0, 8);
      });

      setLastUpdated("moments ago");
    }, 8000);

    return () => window.clearInterval(interval);
  }, []);

  return useMemo(
    () => ({
      complaints,
      kpis,
      activity,
      aiSuggestions,
      lastUpdated,
      isLive: true,
    }),
    [activity, aiSuggestions, complaints, kpis, lastUpdated]
  );
}
