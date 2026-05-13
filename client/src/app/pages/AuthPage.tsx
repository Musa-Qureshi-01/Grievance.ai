import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Shield, Mail, Lock, User, ArrowRight, Loader2, AlertCircle, Building } from "lucide-react";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";

export function AuthPage() {
  const navigate = useNavigate();
  const { user, session, signUp, signIn, loading: authLoading } = useAuth();

  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [role, setRole] = useState<"citizen" | "officer" | "admin">("citizen");
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getRoleDashboard = (r: string) => {
    if (r === "officer") return "/office";
    if (r === "admin") return "/admin";
    return "/dashboard";
  };

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (!authLoading && session && user) {
      const savedRole = localStorage.getItem("govops_role") || "citizen";
      navigate(getRoleDashboard(savedRole), { replace: true });
    }
  }, [authLoading, session, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (authMode === "signup") {
      if (!formData.name || !formData.email || !formData.password) {
        setError("Please fill all fields");
        return;
      }
      if (formData.password.length < 8) {
        setError("Password must be at least 8 characters");
        return;
      }

      setLoading(true);
      const result = await signUp({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role,
      });

      if (result.error) {
        setError(result.error);
        setLoading(false);
      } else {
        // Signup successful — session is already active, redirect directly
        localStorage.setItem("govops_role", role);
        navigate(getRoleDashboard(role), { replace: true });
      }
    } else {
      if (!formData.email || !formData.password) {
        setError("Please fill all fields");
        return;
      }

      setLoading(true);
      const result = await signIn({
        email: formData.email,
        password: formData.password,
      });

      if (result.error) {
        setError(result.error);
        setLoading(false);
      } else {
        localStorage.setItem("govops_role", role);
        navigate(getRoleDashboard(role), { replace: true });
      }
    }
  };

  // Show loading while checking auth state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0B1020] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1020] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20"
          >
            <Shield className="w-6 h-6 text-white" />
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {authMode === "login" && "Sign in to your account"}
            {authMode === "signup" && "Create your account"}
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
            {authMode === "login" && "Access the GovOps Intelligence Platform"}
            {authMode === "signup" && "Join the smart governance network"}
          </p>
        </motion.div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <AnimatePresence mode="wait">
          <motion.div
            key={authMode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="bg-white dark:bg-slate-900 py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-slate-200 dark:border-slate-800"
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

            <form className="space-y-5" onSubmit={handleSubmit}>
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
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-colors"
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
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-colors"
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
                    autoComplete={authMode === "login" ? "current-password" : "new-password"}
                    required
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-colors"
                    placeholder="••••••••"
                  />
                </div>
                {authMode === "signup" && (
                  <p className="mt-1.5 text-xs text-slate-500">Must be at least 8 characters</p>
                )}
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2.5 rounded-lg text-sm"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm h-11 text-sm font-medium"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      {authMode === "login" ? "Sign in" : "Create Account"}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </>
                  )}
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
                  onClick={() => {
                    setAuthMode(authMode === "login" ? "signup" : "login");
                    setError("");
                  }}
                >
                  {authMode === "login" ? "Create an account" : "Sign in to existing account"}
                </Button>
              </div>
            </div>

            <p className="mt-6 text-center text-xs text-slate-400 dark:text-slate-600">
              Secured by GovOps Intelligence Platform
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
