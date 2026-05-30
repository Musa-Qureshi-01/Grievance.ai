import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { authService, type AuthUser } from '../services/auth.service';
import { storage } from '../utils/storage';

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  signUp: (data: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) => Promise<{ error?: string }>;
  signIn: (data: {
    email: string;
    password: string;
  }) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const setAuthenticated = useCallback(
    async (authToken: string, authUser: AuthUser) => {
      await storage.setToken(authToken);
      await storage.setUser(authUser);
      setToken(authToken);
      setUser(authUser);
    },
    [],
  );

  const clearAuthentication = useCallback(async () => {
    await storage.clearAuth();
    setToken(null);
    setUser(null);
  }, []);

  const refreshSession = useCallback(async () => {
    const savedToken = await storage.getToken();
    if (!savedToken) {
      await clearAuthentication();
      return;
    }
    try {
      const currentUser = await authService.me();
      setToken(savedToken);
      setUser(currentUser);
      await storage.setUser(currentUser);
    } catch {
      await clearAuthentication();
    }
  }, [clearAuthentication]);

  // On mount: check for existing session
  useEffect(() => {
    refreshSession().finally(() => setLoading(false));
  }, [refreshSession]);

  const signUp = useCallback(
    async (data: {
      name: string;
      email: string;
      password: string;
      role: string;
    }) => {
      try {
        const result = await authService.register(data);
        await setAuthenticated(result.token, result.user);
        return {};
      } catch (err: any) {
        return { error: err?.message || 'Sign up failed' };
      }
    },
    [setAuthenticated],
  );

  const signIn = useCallback(
    async (data: { email: string; password: string }) => {
      try {
        const result = await authService.login(data);
        await setAuthenticated(result.token, result.user);
        return {};
      } catch (err: any) {
        return { error: err?.message || 'Sign in failed' };
      }
    },
    [setAuthenticated],
  );

  const signOut = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Sign-out locally even if server is unreachable
    }
    await clearAuthentication();
  }, [clearAuthentication]);

  return (
    <AuthContext.Provider
      value={{ user, token, loading, signUp, signIn, signOut, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
