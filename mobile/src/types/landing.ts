/** Mirrors `getLandingData()` from `server/src/modules/public/public.service.js` (subset used on mobile home). */
export type LandingHero = {
  resolved: number;
  accuracy: number;
  slaTime: number | null;
  active: number;
  users: number;
};

export type LandingPipeline = {
  active: number;
  accuracy: number;
  processed: number;
  highPriority: number;
  departments: { id: string; name: string; reports: number }[];
};

export type LandingTask = {
  id: string;
  title: string;
  priority: string;
  department: string;
  location: string;
  sla: string;
  status: string;
  aiSuggestion: string;
};

export type LandingPayload = {
  hero: LandingHero;
  pipeline: LandingPipeline;
  officerWorkflow: {
    taskQueue: LandingTask[];
    alerts: { id: string; message: string; time: string | Date; type: string }[];
    overview: { assigned: number; completed: number; inProgress: number; pending: number };
  };
};
