import { motion } from "motion/react";
import {
    User,
    Mail,
    Phone,
    ShieldCheck,
    MapPin,
    Activity,
    CheckCircle2,
    Clock,
} from "lucide-react";
import { Button } from "../../components/ui/button";

export function CitizenProfile() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                    Citizen Profile
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                    Manage your identity verifications and view your complete
                    civic history.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 text-center">
                        <div className="w-24 h-24 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-slate-900 shadow-xl flex items-center justify-center mb-4 relative">
                            <User className="w-10 h-10 text-slate-400" />
                            <div className="absolute bottom-0 right-0 p-1.5 bg-green-500 rounded-full border-2 border-white dark:border-slate-900">
                                <ShieldCheck className="w-4 h-4 text-white" />
                            </div>
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                            John Doe
                        </h2>
                        <p className="text-sm text-slate-500 mb-4">
                            Level 4 Contributor
                        </p>
                        <div className="flex justify-center gap-2 mb-6">
                            <span className="px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-xs font-semibold rounded-full border border-green-200 dark:border-green-800/30 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Identity
                                Verified
                            </span>
                        </div>
                        <Button variant="outline" className="w-full">
                            Edit Profile
                        </Button>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
                            Contact Info
                        </h3>
                        <div className="space-y-4 text-sm">
                            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                <Mail className="w-4 h-4 text-slate-400" />
                                john.doe@example.com
                            </div>
                            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                <Phone className="w-4 h-4 text-slate-400" />
                                +1 (555) 019-2834
                            </div>
                            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                <MapPin className="w-4 h-4 text-slate-400" />
                                Downtown District, Sector 4
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-6">
                            Civic Trust Score
                        </h3>

                        {/* Status Circles / Gauges */}
                        <div className="grid grid-cols-3 gap-6 text-center mb-8">
                            <div className="flex flex-col items-center">
                                <div className="relative w-20 h-20 mb-2">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle
                                            cx="40"
                                            cy="40"
                                            r="36"
                                            fill="transparent"
                                            stroke="currentColor"
                                            strokeWidth="8"
                                            className="text-slate-100 dark:text-slate-800"
                                        />
                                        <circle
                                            cx="40"
                                            cy="40"
                                            r="36"
                                            fill="transparent"
                                            stroke="currentColor"
                                            strokeWidth="8"
                                            strokeDasharray="226"
                                            strokeDashoffset="45"
                                            className="text-blue-500"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center font-bold text-slate-900 dark:text-white">
                                        850
                                    </div>
                                </div>
                                <span className="text-xs font-medium text-slate-500">
                                    Trust Points
                                </span>
                            </div>

                            <div className="flex flex-col items-center">
                                <div className="relative w-20 h-20 mb-2">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle
                                            cx="40"
                                            cy="40"
                                            r="36"
                                            fill="transparent"
                                            stroke="currentColor"
                                            strokeWidth="8"
                                            className="text-slate-100 dark:text-slate-800"
                                        />
                                        <circle
                                            cx="40"
                                            cy="40"
                                            r="36"
                                            fill="transparent"
                                            stroke="currentColor"
                                            strokeWidth="8"
                                            strokeDasharray="226"
                                            strokeDashoffset="10"
                                            className="text-green-500"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center font-bold text-slate-900 dark:text-white">
                                        98%
                                    </div>
                                </div>
                                <span className="text-xs font-medium text-slate-500">
                                    Accuracy
                                </span>
                            </div>

                            <div className="flex flex-col items-center">
                                <div className="relative w-20 h-20 mb-2">
                                    <div className="w-full h-full rounded-full border-8 border-slate-100 dark:border-slate-800 flex items-center justify-center">
                                        <span className="font-bold text-slate-900 dark:text-white">
                                            12
                                        </span>
                                    </div>
                                </div>
                                <span className="text-xs font-medium text-slate-500">
                                    Total Reports
                                </span>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                            <div className="flex items-start gap-3">
                                <Activity className="w-5 h-5 text-blue-500 mt-0.5" />
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                                        High Trust Status
                                    </h4>
                                    <p className="text-xs text-slate-500 mt-1">
                                        Your reports are automatically
                                        prioritized by the AI dispatcher due to
                                        your high accuracy history.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-6">
                            Activity Timeline
                        </h3>
                        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-700 before:to-transparent">
                            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-slate-900 bg-blue-500 text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">
                                    <CheckCircle2 className="w-4 h-4" />
                                </div>
                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-semibold text-slate-900 dark:text-white text-sm">
                                            Report Resolved
                                        </span>
                                        <time className="text-xs text-slate-500">
                                            Oct 20
                                        </time>
                                    </div>
                                    <div className="text-slate-600 dark:text-slate-400 text-xs">
                                        Your report for "Broken Streetlight" was
                                        fixed by Public Works.
                                    </div>
                                </div>
                            </div>

                            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-slate-900 bg-amber-500 text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">
                                    <Clock className="w-4 h-4" />
                                </div>
                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-semibold text-slate-900 dark:text-white text-sm">
                                            Report Submitted
                                        </span>
                                        <time className="text-xs text-slate-500">
                                            Oct 18
                                        </time>
                                    </div>
                                    <div className="text-slate-600 dark:text-slate-400 text-xs">
                                        Submitted a new infrastructure report.
                                    </div>
                                </div>
                            </div>

                            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-slate-900 bg-green-500 text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">
                                    <ShieldCheck className="w-4 h-4" />
                                </div>
                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-semibold text-slate-900 dark:text-white text-sm">
                                            Identity Verified
                                        </span>
                                        <time className="text-xs text-slate-500">
                                            Sep 01
                                        </time>
                                    </div>
                                    <div className="text-slate-600 dark:text-slate-400 text-xs">
                                        Completed government ID verification.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
