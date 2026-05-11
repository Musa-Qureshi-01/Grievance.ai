import { motion } from "motion/react";
import {
    Plus,
    Search,
    MapPin,
    Clock,
    CheckCircle2,
    AlertCircle,
    MessageSquare,
    Trophy,
} from "lucide-react";
import { Button } from "../../components/ui/button";

export function CitizenOverview() {
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
        },
    ];

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                        Welcome back, John
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Track your community reports and civic requests.
                    </p>
                </div>
                <Button className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-md px-6 shadow-md">
                    <Plus className="w-4 h-4 mr-2" />
                    File New Report
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-4">
                        <span className="font-medium text-slate-600 dark:text-slate-400">
                            Active Issues
                        </span>
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl">
                            <AlertCircle className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="text-4xl font-bold text-slate-900 dark:text-white">
                        1
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-6 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-4">
                        <span className="font-medium text-slate-600 dark:text-slate-400">
                            Resolved
                        </span>
                        <div className="p-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="text-4xl font-bold text-slate-900 dark:text-white">
                        1
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-6 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-4">
                        <span className="font-medium text-slate-600 dark:text-slate-400">
                            Community Rank
                        </span>
                        <div className="p-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-xl">
                            <Trophy className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="text-4xl font-bold text-slate-900 dark:text-white">
                        #42
                    </div>
                </motion.div>
            </div>

            {/* Complaints List */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        Your Reports
                    </h2>
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search reports..."
                            className="pl-9 pr-4 py-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-md text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-slate-900 dark:focus:ring-white outline-none w-full sm:w-64 transition-shadow"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    {complaints.map((complaint, idx) => (
                        <motion.div
                            key={complaint.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + idx * 0.1 }}
                            className="group p-6 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer shadow-sm hover:shadow-md"
                        >
                            <div className="flex flex-col sm:flex-row justify-between gap-4">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                                            {complaint.id}
                                        </span>
                                        <span
                                            className={`px-3 py-1 text-xs font-semibold rounded-md border ${
                                                complaint.status === "Resolved"
                                                    ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                                                    : "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
                                            }`}
                                        >
                                            {complaint.status}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200">
                                        {complaint.title}
                                    </h3>
                                    <div className="flex flex-wrap items-center gap-5 text-sm text-slate-500 dark:text-slate-400 font-medium">
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
                                    <div className="text-sm text-slate-500 dark:text-slate-400 sm:text-right">
                                        <div className="text-xs mb-1 uppercase tracking-wider font-semibold">
                                            Routed to
                                        </div>
                                        <div className="font-medium text-slate-900 dark:text-slate-300 flex items-center gap-1.5">
                                            <div className="w-2 h-2 rounded-md bg-blue-500"></div>
                                            {complaint.aiAssigned}
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="mt-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        View Details &rarr;
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
