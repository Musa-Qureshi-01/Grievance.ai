import { useState } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Activity,
  Users,
  AlertOctagon,
  Clock,
  Shield,
  Download,
  Calendar
} from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";

// A mock representation of a recharts chart to avoid complex dependencies setup if not needed,
// but since recharts is in package.json, we can actually use it.
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from "recharts";

const performanceData = [
  { name: 'Mon', resolved: 40, incoming: 24, escalated: 4 },
  { name: 'Tue', resolved: 30, incoming: 39, escalated: 8 },
  { name: 'Wed', resolved: 45, incoming: 20, escalated: 2 },
  { name: 'Thu', resolved: 50, incoming: 27, escalated: 3 },
  { name: 'Fri', resolved: 65, incoming: 48, escalated: 12 },
  { name: 'Sat', resolved: 40, incoming: 38, escalated: 5 },
  { name: 'Sun', resolved: 30, incoming: 43, escalated: 7 },
];

const departmentData = [
  { name: 'PWD', compliance: 85, SLA: 92 },
  { name: 'Water', compliance: 78, SLA: 85 },
  { name: 'Power', compliance: 92, SLA: 96 },
  { name: 'Sanitation', compliance: 88, SLA: 90 },
  { name: 'Traffic', compliance: 74, SLA: 80 },
];

export function GovernanceDashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Governance Intelligence</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Executive-grade insights and city-wide performance metrics.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
            <Calendar className="w-4 h-4 mr-2" />
            Last 7 Days
          </Button>
          <Button className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 text-white shadow-sm">
            <Download className="w-4 h-4 mr-2" />
            Export Brief
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Resolutions</h3>
            <div className="w-8 h-8 rounded-lg bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
              <Activity className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">4,289</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="flex items-center text-xs font-medium text-green-600 dark:text-green-400">
              <TrendingUp className="w-3 h-3 mr-0.5" />
              +14.5%
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">vs last period</span>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Avg Resolution Time</h3>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
              <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">18.4h</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="flex items-center text-xs font-medium text-green-600 dark:text-green-400">
              <TrendingDown className="w-3 h-3 mr-0.5" />
              -2.1h
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">vs last period</span>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">SLA Compliance</h3>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
              <Shield className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">94.2%</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="flex items-center text-xs font-medium text-green-600 dark:text-green-400">
              <TrendingUp className="w-3 h-3 mr-0.5" />
              +1.2%
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Target: 90%</span>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Citizen Satisfaction</h3>
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
              <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">4.6/5</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="flex items-center text-xs font-medium text-green-600 dark:text-green-400">
              <TrendingUp className="w-3 h-3 mr-0.5" />
              +0.2
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Based on 1,204 ratings</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Charts */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-6">Volume & Resolution Trends</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorIncoming" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
                    itemStyle={{ color: '#f8fafc' }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Area type="monotone" dataKey="resolved" name="Resolved Cases" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorResolved)" />
                  <Area type="monotone" dataKey="incoming" name="Incoming Cases" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorIncoming)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-6">Department Compliance</h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" opacity={0.2} />
                  <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
                    cursor={{fill: '#334155', opacity: 0.1}}
                  />
                  <Legend />
                  <Bar dataKey="SLA" name="SLA Target %" fill="#94a3b8" radius={[0, 4, 4, 0]} barSize={12} />
                  <Bar dataKey="compliance" name="Actual Compliance %" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={12} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Intelligence Sidebar */}
        <div className="space-y-6">
          <div className="bg-indigo-600 rounded-xl p-6 shadow-md text-white">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-indigo-200" />
              <h3 className="font-semibold text-white">AI Governance Insights</h3>
            </div>
            <div className="space-y-4">
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-white/10">
                <div className="flex items-start gap-2 mb-1">
                  <AlertOctagon className="w-4 h-4 text-amber-300 mt-0.5" />
                  <h4 className="font-medium text-sm">Emerging Hotspot</h4>
                </div>
                <p className="text-indigo-100 text-sm">Traffic related grievances have spiked by 42% in Sector 18. Recommend temporary deployment of traffic marshals.</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-white/10">
                <div className="flex items-start gap-2 mb-1">
                  <Activity className="w-4 h-4 text-green-300 mt-0.5" />
                  <h4 className="font-medium text-sm">Positive Trend</h4>
                </div>
                <p className="text-indigo-100 text-sm">Sanitation resolution time has improved by 2.4 hours on average after the recent AI routing update.</p>
              </div>
            </div>
            <Button variant="ghost" className="w-full mt-4 text-indigo-100 hover:text-white hover:bg-white/10 border border-white/20">
              View Full Report
            </Button>
          </div>

          <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Top Escalations</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Water Supply Line 3</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">14 repeated complaints</p>
                </div>
                <Badge variant="secondary" className="bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400">Critical</Badge>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Zone B Power Grid</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">8 repeated complaints</p>
                </div>
                <Badge variant="secondary" className="bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">High</Badge>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Park St. Drainage</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">5 repeated complaints</p>
                </div>
                <Badge variant="secondary" className="bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">High</Badge>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
              View All Escalations
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
