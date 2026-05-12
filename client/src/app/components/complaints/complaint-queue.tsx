import { useMemo, useState } from "react";
import {
  Clock,
  Filter,
  MapPin,
  MessageSquare,
  MoreVertical,
  Search,
  ShieldAlert,
  UserCircle2,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import type { ComplaintItem } from "../../types/operations";

const statusStyles: Record<string, string> = {
  New: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  Triaged: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200",
  Assigned: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200",
  "In Progress": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200",
  Escalated: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200",
  Resolved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200",
};

const priorityStyles: Record<string, string> = {
  Critical: "bg-rose-500/10 text-rose-500 border-rose-500/30",
  High: "bg-amber-500/10 text-amber-500 border-amber-500/30",
  Medium: "bg-cyan-500/10 text-cyan-500 border-cyan-500/30",
  Low: "bg-slate-500/10 text-slate-500 border-slate-500/30",
};

interface ComplaintQueueProps {
  complaints: ComplaintItem[];
}

export function ComplaintQueue({ complaints }: ComplaintQueueProps) {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<string | null>(complaints[0]?.id ?? null);
  const [filter, setFilter] = useState("All");

  const filtered = useMemo(() => {
    return complaints.filter((item) => {
      const matchesQuery =
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.location.toLowerCase().includes(query.toLowerCase()) ||
        item.id.toLowerCase().includes(query.toLowerCase());
      const matchesFilter = filter === "All" || item.priority === filter;
      return matchesQuery && matchesFilter;
    });
  }, [complaints, filter, query]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Live Complaint Queue
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Prioritized for decision velocity and SLA compliance.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {[
            "All",
            "Critical",
            "High",
            "Medium",
            "Low",
          ].map((level) => (
            <Button
              key={level}
              variant={filter === level ? "default" : "outline"}
              className={
                filter === level
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                  : "bg-white/60 dark:bg-slate-900/50"
              }
              size="sm"
              onClick={() => setFilter(level)}
            >
              {level}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search queue by ID, location, or category"
            className="w-full rounded-xl border border-slate-200/80 dark:border-slate-700/60 bg-white/70 dark:bg-slate-900/60 px-9 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/60"
          />
        </div>
        <Button variant="outline" className="bg-white/70 dark:bg-slate-900/60">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      <div className="space-y-3">
        {filtered.map((item) => {
          const isExpanded = expanded === item.id;
          return (
            <div
              key={item.id}
              className="rounded-2xl border border-white/40 dark:border-slate-700/60 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl p-4 shadow-sm transition-all hover:shadow-[0_20px_50px_-30px_rgba(59,130,246,0.55)]"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono text-slate-400">{item.id}</span>
                    <Badge variant="secondary" className={priorityStyles[item.priority]}>
                      {item.priority}
                    </Badge>
                    <Badge variant="secondary" className={statusStyles[item.status]}>
                      {item.status}
                    </Badge>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {item.category}
                    </Badge>
                    <Badge variant="secondary" className="bg-cyan-500/10 text-cyan-500 border-cyan-500/30">
                      AI {Math.round(item.confidence * 100)}%
                    </Badge>
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                    {item.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {item.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      SLA {item.slaMinutes}m
                    </span>
                    <span className="flex items-center gap-1">
                      <UserCircle2 className="h-4 w-4" />
                      {item.assignedOfficer}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button size="sm" className="bg-cyan-600 hover:bg-cyan-500 text-white">
                    Assign
                  </Button>
                  <Button size="sm" variant="outline" className="bg-white/70 dark:bg-slate-900/60">
                    Escalate
                  </Button>
                  <Button size="sm" variant="outline" className="bg-white/70 dark:bg-slate-900/60">
                    Resolve
                  </Button>
                  <Button size="icon" variant="ghost" className="text-slate-400">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {isExpanded ? (
                <div className="mt-4 grid gap-3 md:grid-cols-[1.4fr_1fr]">
                  <div className="rounded-xl border border-slate-200/60 dark:border-slate-700/60 bg-slate-50/70 dark:bg-slate-950/50 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                      <ShieldAlert className="h-4 w-4 text-cyan-500" />
                      AI Summary
                    </div>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                      {item.summary}
                    </p>
                    <p className="mt-3 text-sm font-medium text-cyan-600 dark:text-cyan-400">
                      Recommendation: {item.aiRecommendation}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-slate-200/60 dark:border-slate-700/60 px-2 py-1 text-xs text-slate-500"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200/60 dark:border-slate-700/60 bg-slate-50/70 dark:bg-slate-950/50 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                        <MessageSquare className="h-4 w-4 text-amber-500" />
                        Internal Notes
                      </div>
                      <Button size="sm" variant="ghost" className="text-slate-500">
                        Add
                      </Button>
                    </div>
                    <div className="mt-3 space-y-3">
                      {item.comments.length === 0 ? (
                        <p className="text-sm text-slate-400">No internal notes yet.</p>
                      ) : (
                        item.comments.map((comment) => (
                          <div key={comment.id} className="text-sm">
                            <p className="font-medium text-slate-700 dark:text-slate-200">
                              {comment.author}
                            </p>
                            <p className="text-slate-500 dark:text-slate-400">
                              {comment.message}
                            </p>
                            <p className="text-xs text-slate-400">{comment.createdAt}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                  <span className="rounded-full border border-slate-200/60 dark:border-slate-700/60 px-2 py-1">
                    AI summary available
                  </span>
                  <span className="rounded-full border border-slate-200/60 dark:border-slate-700/60 px-2 py-1">
                    {item.comments.length} internal notes
                  </span>
                </div>
              )}

              <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                <span>Created {item.createdAt}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-cyan-600 dark:text-cyan-400"
                  onClick={() => setExpanded(isExpanded ? null : item.id)}
                >
                  {isExpanded ? "Collapse" : "Expand"} details
                </Button>
              </div>

              {isExpanded && (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <Button variant="outline" className="bg-white/70 dark:bg-slate-900/60">
                    View AI Insights
                  </Button>
                  <Button variant="outline" className="bg-white/70 dark:bg-slate-900/60">
                    Add Internal Comment
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
