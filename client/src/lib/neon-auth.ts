type AuthError = { message: string; code?: string };
type AuthResult<T> = { data: T | null; error: AuthError | null };
type SessionData = {
  session?: { token?: string | null } | null;
  user?: {
    id: string;
    name?: string | null;
    email?: string | null;
    role?: string | null;
    emailVerified?: boolean | null;
    image?: string | null;
  } | null;
};

const NEON_AUTH_URL =
  import.meta.env.VITE_NEON_AUTH_URL ||
  "https://ep-morning-sky-aozlbkmh.neonauth.c-2.ap-southeast-1.aws.neon.tech/neondb/auth";
const SESSION_VERIFIER_PARAM = "neon_auth_session_verifier";

function authUrl(path: string) {
  return `${NEON_AUTH_URL.replace(/\/+$/, "")}${path}`;
}

async function authRequest<T>(path: string, init: RequestInit = {}): Promise<AuthResult<T>> {
  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type") && init.body) headers.set("Content-Type", "application/json");

  const response = await fetch(authUrl(path), {
    credentials: "include",
    ...init,
    headers,
  });
  const payload = await response.json().catch(() => null);
  const jwt = response.headers.get("set-auth-jwt");

  if (!response.ok) {
    return {
      data: null,
      error: {
        message: payload?.message || payload?.error || `Authentication request failed (${response.status})`,
        code: payload?.code,
      },
    };
  }

  if (jwt && payload?.session) payload.session.token = jwt;
  return { data: payload as T, error: null };
}

async function getSession() {
  const url = new URL(authUrl("/get-session"));
  const verifier = new URLSearchParams(window.location.search).get(SESSION_VERIFIER_PARAM);
  if (verifier) url.searchParams.set(SESSION_VERIFIER_PARAM, verifier);

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });
  const payload = await response.json().catch(() => null);
  const jwt = response.headers.get("set-auth-jwt");

  if (!response.ok || !payload) return null;
  if (jwt && payload?.session) payload.session.token = jwt;

  if (verifier) {
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.delete(SESSION_VERIFIER_PARAM);
    window.history.replaceState(window.history.state, "", currentUrl.href);
  }

  return payload as SessionData;
}

export const neonAuthClient = {
  getSession,
  signUp: {
    email: (data: { email: string; password: string; name: string }) =>
      authRequest<SessionData>("/sign-up/email", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },
  signIn: {
    email: (data: { email: string; password: string }) =>
      authRequest<SessionData>("/sign-in/email", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    social: async (data: { provider: string; callbackURL: string }) => {
      const result = await authRequest<{ url?: string }>("/sign-in/social", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (result.data?.url) {
        window.location.href = result.data.url;
      }

      return result;
    },
  },
  signOut: () => authRequest("/sign-out", { method: "POST" }),
  verify: {
    email: (data: { email: string; code: string }) =>
      authRequest<SessionData>("/email-otp/verify-email", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },
};

export async function getNeonJWT() {
  const session = await getSession();
  const token = session?.session?.token || null;
  if (token) localStorage.setItem("authToken", token);
  return token;
}
