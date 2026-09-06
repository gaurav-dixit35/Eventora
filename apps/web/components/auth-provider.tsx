'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { apiFetch, type SessionUser } from '../lib/api';

type AuthContextValue = {
  user: SessionUser | null;
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
};
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const refresh = async (): Promise<void> => {
    try {
      setUser((await apiFetch<{ user: SessionUser }>('/auth/me')).user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  const logout = async (): Promise<void> => {
    await apiFetch<void>('/auth/logout', { method: 'POST' });
    setUser(null);
  };
  useEffect(() => {
    void refresh();
  }, []);
  return (
    <AuthContext.Provider value={{ user, loading, refresh, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider.');
  return context;
}
