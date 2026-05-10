import { useState } from "react";
import { motion } from "motion/react";
import { Shield, Mail, Lock, User, Building, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "../components/ui/button";

export function AuthPage() {
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [role, setRole] = useState<"citizen" | "officer" | "admin">("citizen");
  
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1020] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {authMode === "login" && "Sign in to your account"}
          {authMode === "signup" && "Create your account"}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
          {authMode === "login" && "Access the GovOps Intelligence Platform"}
          {authMode === "signup" && "Join the smart governance network"}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-slate-200 dark:border-slate-800"
        >
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Select your role</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setRole("citizen")}
                  className={`flex flex-col items-center justify-center py-3 px-2 border rounded-xl transition-all ${
                    role === "citizen" 
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400" 
                      : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <User className="w-5 h-5 mb-1" />
                  <span className="text-xs font-medium">Citizen</span>
                </button>
                <button
                  onClick={() => setRole("officer")}
                  className={`flex flex-col items-center justify-center py-3 px-2 border rounded-xl transition-all ${
                    role === "officer" 
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400" 
                      : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <Building className="w-5 h-5 mb-1" />
                  <span className="text-xs font-medium">Officer</span>
                </button>
                <button
                  onClick={() => setRole("admin")}
                  className={`flex flex-col items-center justify-center py-3 px-2 border rounded-xl transition-all ${
                    role === "admin" 
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400" 
                      : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <Shield className="w-5 h-5 mb-1" />
                  <span className="text-xs font-medium">Admin</span>
                </button>
              </div>
            </div>

          <form className="space-y-6">
            {authMode === "signup" && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Full Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="••••••••"
                />
              </div>
            </div>
            
            {error && <p className="text-red-500 text-sm">{error}</p>}

            {authMode === "login" && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-900 dark:text-slate-300">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
                    Forgot your password?
                  </a>
                </div>
              </div>
            )}

            <div>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                disabled={loading}
                onClick={async (e) => {
                  e.preventDefault();
                  setError("");
                  
                  if (authMode === "signup") {
                    if (!formData.name || !formData.email || !formData.password) {
                      setError("Please fill all fields");
                      return;
                    }
                    setLoading(true);
                    try {
                      const res = await fetch("http://localhost:3001/api/auth/register", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email: formData.email, name: formData.name, role })
                      });
                      const data = await res.json();
                      if (data.success) {
                        window.location.href = role === "citizen" ? "/citizen-dashboard" : "/dashboard";
                      } else {
                        setError(data.error || "Failed to register");
                      }
                    } catch (err) {
                      setError("Server not reachable. Did you start the backend?");
                    }
                    setLoading(false);
                  } else {
                    // Mock login success
                    setLoading(true);
                    setTimeout(() => {
                      window.location.href = role === "citizen" ? "/citizen-dashboard" : "/dashboard";
                    }, 1000);
                  }
                }}
              >
                {loading ? "Processing..." : (authMode === "login" ? "Sign in" : "Create Account")}
                {!loading && <ArrowRight className="ml-2 w-4 h-4" />}
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300 dark:border-slate-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-slate-900 text-slate-500">
                  {authMode === "login" ? "New to GovOps?" : "Already have an account?"}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Button 
                variant="outline" 
                className="w-full border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")}
              >
                {authMode === "login" ? "Create an account" : "Sign in to existing account"}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
