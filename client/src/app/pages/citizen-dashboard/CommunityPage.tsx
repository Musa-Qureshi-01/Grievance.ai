import { motion } from "motion/react";
import { Users, Construction, Sparkles } from "lucide-react";

export function CitizenCommunity() {
    return (
        <div className="max-w-4xl mx-auto space-y-8 flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-6">
                <Users className="w-12 h-12" />
            </div>

            <h1 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                Community Forum
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl">
                Connect with your neighbors, discuss local initiatives, and
                collaborate on community improvement projects.
            </p>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-12 p-8 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 max-w-lg w-full"
            >
                <Construction className="w-10 h-10 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    Coming Soon
                </h3>
                <p className="text-slate-500 dark:text-slate-400">
                    We're currently building the infrastructure for a safe,
                    moderated civic forum. Check back in the next update!
                </p>
            </motion.div>
        </div>
    );
}
