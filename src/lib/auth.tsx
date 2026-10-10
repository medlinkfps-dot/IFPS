import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from './supabase';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole | null;
  isAdmin: boolean;
  isEditor: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  isAdmin: false,
  isEditor: false,
  isLoading: true,
  login: async () => ({ success: false }),
  logout: async () => {},
});

export const AUTH_STORAGE_KEY = 'ifps_admin_session';
export const AUTH_TOKEN_KEY = 'ifps_admin_token';

export function getAdminToken(): string | null {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initAuth() {
      // 1. Supabase Auth if active
      if (isSupabaseConfigured) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profile) {
              setUser({
                id: profile.id,
                email: profile.email,
                full_name: profile.full_name,
                role: profile.role,
                avatar_url: profile.avatar_url,
                created_at: profile.created_at,
              });
              setIsLoading(false);
              return;
            }
          }
        } catch (e) {
          console.error('Supabase auth session error:', e);
        }
      }

      // 2. Cryptographic Serverless Session Verification
      const savedToken = getAdminToken();
      if (savedToken) {
        try {
          const res = await fetch('/api/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'verify', token: savedToken }),
          });

          if (res.ok) {
            const data = await res.json();
            if (data.valid && data.user) {
              setUser(data.user);
              setIsLoading(false);
              return;
            }
          }
        } catch {
          // If offline or network issue, fallback to cached profile
          const cachedSession = localStorage.getItem(AUTH_STORAGE_KEY);
          if (cachedSession) {
            try {
              setUser(JSON.parse(cachedSession));
              setIsLoading(false);
              return;
            } catch {}
          }
        }
        // If token is invalid or rejected by server, clear it
        localStorage.removeItem(AUTH_STORAGE_KEY);
        localStorage.removeItem(AUTH_TOKEN_KEY);
      }

      setUser(null);
      setIsLoading(false);
    }

    initAuth();

    if (isSupabaseConfigured) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            setUser({
              id: profile.id,
              email: profile.email,
              full_name: profile.full_name,
              role: profile.role,
              avatar_url: profile.avatar_url,
              created_at: profile.created_at,
            });
          }
        } else {
          setUser(null);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    // 1. Authenticate via Serverless API (Zero Hardcoded Secrets in Client)
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          email: email.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.token) {
        localStorage.setItem(AUTH_TOKEN_KEY, data.token);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data.user));
        setUser(data.user);
        setIsLoading(false);
        return { success: true };
      }

      if (data.error) {
        setIsLoading(false);
        return { success: false, error: data.error };
      }
    } catch (err: any) {
      console.warn('Server auth request failed:', err);
    }

    // 2. Cloud Supabase Authentication (if configured as secondary provider)
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (!error && data?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          const activeUser: UserProfile = {
            id: data.user.id,
            email: data.user.email || email,
            full_name: profile?.full_name || 'مدير النظام',
            role: profile?.role || 'admin',
            created_at: new Date().toISOString(),
          };

          setUser(activeUser);
          setIsLoading(false);
          return { success: true };
        }
      } catch {}
    }

    setIsLoading(false);
    return { success: false, error: 'رمز الدخول غير صحيح، يرجى إدخال الرمز المعتمد للإدارة.' };
  };

  const logout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
  };

  const role = user?.role || null;
  const isAdmin = role === 'admin';
  const isEditor = role === 'admin' || role === 'editor';

  return (
    <AuthContext.Provider value={{ user, role, isAdmin, isEditor, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
