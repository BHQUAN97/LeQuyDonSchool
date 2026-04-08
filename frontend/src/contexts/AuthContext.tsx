'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { api, setAccessToken } from '@/lib/api';
import type { User, ApiResponse, LoginResponse } from '@/types';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Khi mount: thu refresh token de khoi phuc phien
  useEffect(() => {
    const init = async () => {
      try {
        const refreshRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/auth/refresh`,
          { method: 'POST', credentials: 'include' },
        );
        if (refreshRes.ok) {
          const data = await refreshRes.json();
          if (data.success && data.data?.accessToken) {
            setAccessToken(data.data.accessToken);
            // Lay thong tin user
            const meRes = await api<ApiResponse<User>>('/auth/me');
            if (meRes.success) setUser(meRes.data);
          }
        }
      } catch {
        // Khong lam gi — chua dang nhap
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api<ApiResponse<LoginResponse>>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (res.success) {
      setAccessToken(res.data.accessToken);
      setUser(res.data.user);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api('/auth/logout', { method: 'POST' });
    } catch {
      // Ignore — van xoa local state
    }
    setAccessToken(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const res = await api<ApiResponse<User>>('/auth/me');
      if (res.success) setUser(res.data);
    } catch {
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}
