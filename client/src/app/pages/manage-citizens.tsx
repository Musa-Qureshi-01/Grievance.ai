import { motion } from "motion/react";
import { Users } from "lucide-react";

export function ManageCitizens() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Citizen Directory</h1>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
      >
        <div className="flex items-center gap-3 mb-4 text-blue-600 dark:text-blue-400">
          <Users className="w-6 h-6" />
          <h2 className="text-lg font-medium">Citizen CRM</h2>
        </div>
        <p className="text-slate-500 dark:text-slate-400">Citizen management module configuration is currently pending backend integration.</p>
      </motion.div>
    </div>
  );
}
