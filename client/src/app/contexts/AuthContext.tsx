import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { authService, type AuthUser } from "../../services/auth.service";

interface User extends AuthUser {
  emailVerified: boolean;
  image?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (data: { name: string; email: string; password: string; role: string }) => Promise<{ error?: string }>;
  signIn: (data: { email: string; password: string }) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function toAppUser(user: AuthUser): User {
  const now = new Date().toISOString();

  return {
    ...user,
    emailVerified: true,
    image: null,
    createdAt: now,
    updatedAt: now,
  };
}

function toSession(token: string, userId: string): Session {
  return {
    id: token,
    userId,
    token,
    expiresAt: "",
  };
}

function persistAuth(token: string, user: User) {
  localStorage.setItem("authToken", token);
  localStorage.setItem("currentUser", JSON.stringify(user));
}

function clearAuth() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("currentUser");
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const setAuthenticatedUser = useCallback((token: string, authUser: AuthUser) => {
    const appUser = toAppUser(authUser);
    persistAuth(token, appUser);
    setSession(toSession(token, appUser.id));
    setUser(appUser);
  }, []);

  const refreshSession = useCallback(async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      clearAuth();
      setSession(null);
      setUser(null);
      return;
    }

    try {
      const currentUser = await authService.me();
      setAuthenticatedUser(token, currentUser);
    } catch {
      clearAuth();
      setSession(null);
      setUser(null);
    }
  }, [setAuthenticatedUser]);

  useEffect(() => {
    refreshSession().finally(() => setLoading(false));
  }, [refreshSession]);

  const signUp = useCallback(async (data: { name: string; email: string; password: string; role: string }) => {
    try {
      const result = await authService.register(data);
      setAuthenticatedUser(result.token, result.user);
      return {};
    } catch (err: any) {
      return { error: err?.message || "Sign up failed" };
    }
  }, [setAuthenticatedUser]);

  const signIn = useCallback(async (data: { email: string; password: string }) => {
    try {
      const result = await authService.login(data);
      setAuthenticatedUser(result.token, result.user);
      return {};
    } catch (err: any) {
      return { error: err?.message || "Sign in failed" };
    }
  }, [setAuthenticatedUser]);

  const handleSignOut = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Local sign-out should still complete if the server is unreachable.
    }

    clearAuth();
    setSession(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signUp,
      signIn,
      signOut: handleSignOut,
      refreshSession,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
