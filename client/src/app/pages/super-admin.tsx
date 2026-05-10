import { motion } from "motion/react";
import { Users, Shield, Database, Settings, Key, UserCheck, ShieldAlert, MoreVertical } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";

export function SuperAdminPanel() {
  const users = [
    { name: "Alice Officer", email: "alice@govops.example", role: "Officer", department: "Public Works", status: "Active" },
    { name: "Bob Commander", email: "bob@govops.example", role: "Admin", department: "HQ", status: "Active" },
    { name: "Charlie Trainee", email: "charlie@govops.example", role: "Officer", department: "Traffic", status: "Pending" },
    { name: "David Tech", email: "david@govops.example", role: "Super Admin", department: "IT Security", status: "Active" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Super Admin Console</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Role-Based Access Control (RBAC) and System Configuration.</p>
        </div>
        <Button className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 text-white">
          <Key className="w-4 h-4 mr-2" />
          Generate API Key
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
            <span className="font-medium text-slate-600 dark:text-slate-400">Total Users</span>
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white">1,492</div>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
              <Shield className="w-5 h-5" />
            </div>
            <span className="font-medium text-slate-600 dark:text-slate-400">Admins</span>
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white">24</div>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
              <Database className="w-5 h-5" />
            </div>
            <span className="font-medium text-slate-600 dark:text-slate-400">System Health</span>
          </div>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">99.9%</div>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <span className="font-medium text-slate-600 dark:text-slate-400">Security Alerts</span>
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white">0</div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h2 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-slate-500" />
            Personnel Access Management
          </h2>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Manage Roles
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Department</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {users.map((user, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900 dark:text-white">{user.name}</div>
                    <div className="text-slate-500 dark:text-slate-400 text-xs">{user.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className={`
                      ${user.role === 'Super Admin' ? 'border-purple-500 text-purple-600 dark:text-purple-400' : ''}
                      ${user.role === 'Admin' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : ''}
                      ${user.role === 'Officer' ? 'border-slate-500 text-slate-600 dark:text-slate-400' : ''}
                    `}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    {user.department}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${
                      user.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 dark:hover:text-white">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
