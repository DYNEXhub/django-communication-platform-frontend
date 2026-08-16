import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  avatar: string | null;
}

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  setUser: (user: User | null) => void;
  fetchProfile: () => Promise<void>;
}

function setAuthCookie(token: string | null) {
  if (typeof document === 'undefined') return;
  if (token) {
    document.cookie = `auth-token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
  } else {
    document.cookie = 'auth-token=; path=/; max-age=0';
  }
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      login: async (username: string, password: string) => {
        try {
          const response = await fetch(`${API_URL}/auth/token/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
          });

          if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            return {
              success: false,
              error: data.detail || 'Invalid credentials',
            };
          }

          const tokens = await response.json();

          set({
            accessToken: tokens.access,
            refreshToken: tokens.refresh,
            isAuthenticated: true,
          });

          setAuthCookie(tokens.access);

          // Fetch user profile
          try {
            const profileRes = await fetch(`${API_URL}/accounts/users/me/`, {
              headers: { Authorization: `Bearer ${tokens.access}` },
            });
            if (profileRes.ok) {
              const user = await profileRes.json();
              set({ user });
            }
          } catch {
            // Profile fetch is non-critical
          }

          return { success: true };
        } catch (error) {
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Login failed',
          };
        }
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
        setAuthCookie(null);
      },

      setUser: (user) => {
        set({ user });
      },

      fetchProfile: async () => {
        const { accessToken } = get();
        if (!accessToken) return;

        try {
          const res = await fetch(`${API_URL}/accounts/users/me/`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          if (res.ok) {
            const user = await res.json();
            set({ user });
          }
        } catch {
          // Silent fail
        }
      },
    }),
    {
      name: 'auth-store',
    }
  )
);

// Sync cookie on rehydration and token changes
if (typeof window !== 'undefined') {
  useAuthStore.subscribe((state) => {
    setAuthCookie(state.accessToken);
  });
}
