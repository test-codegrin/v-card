import { create } from 'zustand';
import { fetchCurrentUser, loginUser, signupUser } from '@/lib/api';

type User = { id: number; name: string; email: string };

type AuthState = {
  user: User | null;
  token: string | null;
  loading: boolean;
  initialized: boolean;
  error: string | null;
  login: (payload: { email: string; password: string }) => Promise<void>;
  signup: (payload: { name: string; email: string; password: string }) => Promise<void>;
  fetchMe: () => Promise<void>;
  logout: () => void;
};

// Cookie helpers (no localStorage usage)
const TOKEN_COOKIE = 'vcard_token';

const getTokenFromCookie = () => {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${TOKEN_COOKIE}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
};

const setTokenCookie = (token: string) => {
  if (typeof document === 'undefined') return;
  document.cookie = `${TOKEN_COOKIE}=${encodeURIComponent(token)}; path=/; max-age=${60 * 60 * 24 * 7}`;
};

const clearTokenCookie = () => {
  if (typeof document === 'undefined') return;
  document.cookie = `${TOKEN_COOKIE}=; path=/; max-age=0`;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  loading: false,
  initialized: false,
  error: null,

  // Authenticate and store token in memory + cookie
  login: async (payload) => {
    set({ loading: true, error: null });
    try {
      const res = await loginUser(payload);
      set({ user: res.user, token: res.token, loading: false, initialized: true });
      setTokenCookie(res.token);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      set({ error: message, loading: false });
      throw error;
    }
  },

  // Signup then auto-login to get token
  signup: async (payload) => {
    set({ loading: true, error: null });
    try {
      await signupUser(payload);
      await get().login({ email: payload.email, password: payload.password });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Signup failed';
      set({ error: message, loading: false });
      throw error;
    }
  },

  // Hydrate user from existing cookie token
  fetchMe: async () => {
    const token = get().token || getTokenFromCookie();
    if (!token) {
      set({ initialized: true });
      return;
    }
    set({ loading: true, error: null });
    try {
      const user = await fetchCurrentUser(token);
      set({ user, token, loading: false, initialized: true });
    } catch (error) {
      clearTokenCookie();
      set({ user: null, token: null, loading: false, initialized: true, error: null });
    }
  },

  logout: () => {
    clearTokenCookie();
    set({ user: null, token: null, initialized: true, loading: false, error: null });
  }
}));
