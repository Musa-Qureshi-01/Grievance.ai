import { motion } from "motion/react";
import { Plus, Search, MapPin, Clock, CheckCircle2, AlertCircle, MessageSquare } from "lucide-react";
import { Button } from "../components/ui/button";

export function CitizenDashboard() {
  const complaints = [
    {
      id: "GRV-8829",
      title: "Pothole on Main Street causing traffic hazards",
      status: "In Progress",
      date: "Oct 24, 2026",
      location: "Downtown District",
      aiAssigned: "Public Works Dept",
    },
    {
      id: "GRV-8810",
      title: "Streetlight broken near Central Park",
      status: "Resolved",
      date: "Oct 15, 2026",
      location: "Westside Zone",
      aiAssigned: "Electrical Division",
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1020]">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <span className="font-semibold text-slate-900 dark:text-white">Citizen Portal</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Identity Verified</span>
            </div>
            <Button variant="ghost" onClick={() => window.location.href = "/"}>Sign out</Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome back, John</h1>
            <p className="text-slate-500 dark:text-slate-400">Track your community reports and civic requests.</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white shrink-0">
            <Plus className="w-4 h-4 mr-2" />
            File New Report
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                <AlertCircle className="w-5 h-5" />
              </div>
              <span className="font-medium text-slate-600 dark:text-slate-400">Active</span>
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">1</div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <span className="font-medium text-slate-600 dark:text-slate-400">Resolved</span>
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">1</div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
                <MessageSquare className="w-5 h-5" />
              </div>
              <span className="font-medium text-slate-600 dark:text-slate-400">Updates</span>
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">2</div>
          </motion.div>
        </div>

        {/* Complaints List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Your Reports</h2>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search reports..." 
                className="pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
              />
            </div>
          </div>

          <div className="space-y-4">
            {complaints.map((complaint, idx) => (
              <motion.div 
                key={complaint.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + (idx * 0.1) }}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 transition-colors cursor-pointer"
              >
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{complaint.id}</span>
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${
                        complaint.status === "Resolved" 
                          ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800" 
                          : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
                      }`}>
                        {complaint.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white">{complaint.title}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        {complaint.location}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {complaint.date}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex sm:flex-col items-center sm:items-end justify-between pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                    <div className="text-sm text-slate-500 dark:text-slate-400 text-right">
                      <div className="text-xs mb-1">Routed to</div>
                      <div className="font-medium text-slate-900 dark:text-slate-300">{complaint.aiAssigned}</div>
                    </div>
                    <Button variant="outline" size="sm" className="mt-2 text-xs">View Details</Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
