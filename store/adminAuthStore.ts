import { create } from 'zustand';

/*  
   Types
  */

type Admin = {
  admin_id: number;
  admin_name: string;
  email: string;
};

type AdminAuthState = {
  admin: Admin | null;
  token: string | null;
  loading: boolean;
  initialized: boolean;
  error: string | null;

  sendOtp: (email: string) => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  fetchAdminMe: () => Promise<void>;
  logout: () => void;
};

/*  
   Cookie helpers (Admin)
  */

const ADMIN_TOKEN_COOKIE = 'admin_token';

const getAdminTokenFromCookie = () => {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${ADMIN_TOKEN_COOKIE}=([^;]*)`)
  );
  return match ? decodeURIComponent(match[1]) : null;
};

const setAdminTokenCookie = (token: string) => {
  if (typeof document === 'undefined') return;
  document.cookie = `${ADMIN_TOKEN_COOKIE}=${encodeURIComponent(
    token
  )}; path=/; max-age=${60 * 60 * 24 * 7}`;
};

const clearAdminTokenCookie = () => {
  if (typeof document === 'undefined') return;
  document.cookie = `${ADMIN_TOKEN_COOKIE}=; path=/; max-age=0`;
};

/*  
   API helpers
  */

async function adminApi(body: any) {
  const res = await fetch('/api/auth/admin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Admin auth failed');
  return data;
}

/*  
   Zustand Store
  */

export const useAdminAuthStore = create<AdminAuthState>((set, get) => ({
  admin: null,
  token: null,
  loading: false,
  initialized: false,
  error: null,

  /*  
     SEND OTP
    */
  sendOtp: async (email) => {
    set({ loading: true, error: null });
    try {
      await adminApi({
        action: 'send-otp',
        email
      });
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  /*  
     VERIFY OTP
    */
  verifyOtp: async (email, otp) => {
    set({ loading: true, error: null });
    try {
      const res = await adminApi({
        action: 'verify-otp',
        email,
        otp
      });

      set({
        admin: res.admin,
        token: res.token,
        loading: false,
        initialized: true
      });

      setAdminTokenCookie(res.token);
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  /*  
     FETCH ADMIN (optional future API)
    */
  fetchAdminMe: async () => {
    const token = get().token || getAdminTokenFromCookie();
    if (!token) {
      set({ initialized: true });
      return;
    }

    set({ loading: true, error: null });

    try {
    
      set({
        token,
        initialized: true,
        loading: false
      });
    } catch {
      clearAdminTokenCookie();
      set({
        admin: null,
        token: null,
        loading: false,
        initialized: true
      });
    }
  },

  /*  
     LOGOUT
    */
  logout: () => {
    clearAdminTokenCookie();
    set({
      admin: null,
      token: null,
      initialized: true,
      loading: false,
      error: null
    });
  }
}));
