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

const AUTH_STORAGE_KEY = 'ifps_admin_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initAuth() {
      if (isSupabaseConfigured) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            // Fetch profile
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
            } else {
              setUser({
                id: session.user.id,
                email: session.user.email || 'admin@iraqifps.org',
                full_name: 'مدير النظام',
                role: 'admin',
                created_at: new Date().toISOString(),
              });
            }
          }
        } catch (e) {
          console.error('Supabase auth session error:', e);
        }
      } else {
        // Check local saved session
        const savedSession = localStorage.getItem(AUTH_STORAGE_KEY);
        if (savedSession) {
          try {
            setUser(JSON.parse(savedSession));
          } catch {
            localStorage.removeItem(AUTH_STORAGE_KEY);
          }
        }
      }
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

  const ADMIN_PASSCODE = 'Allawi@91';

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    // 1. Direct Master Admin Passcode Verification
    if (password.trim() === ADMIN_PASSCODE) {
      const masterAdmin: UserProfile = {
        id: 'admin-master',
        email: email.trim() || 'admin@iraqifps.org',
        full_name: 'مدير النظام (IFPS Admin)',
        role: 'admin',
        created_at: new Date().toISOString(),
      };
      setUser(masterAdmin);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(masterAdmin));
      setIsLoading(false);
      return { success: true };
    }

    // 2. Cloud Supabase Authentication (if configured)
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
      } catch {
        // Fallback to error return
      }
    }

    setIsLoading(false);
    return { success: false, error: 'رمز الدخول غير صحيح، يرجى إدخال الرمز المعتمد للإدارة' };
  };

  const logout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
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
