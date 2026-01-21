'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@/app/_domain/entities/User';
import { useCases } from '@/app/_infrastructure/di/container';
import { getDB } from '@/app/_infrastructure/persistence/idb/db';

interface AuthContextValue {
  user: User | null;
  isGuest: boolean;
  isAuthenticated: boolean;
  loading: boolean;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const GUEST_USER_ID = 'guest-user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loadUser() {
    try {
      // Verificar sessão diretamente
      const db = await getDB();
      const session = await db.get('auth', 'current-user-id');
      
      if (!session) {
        setUser(null);
        setIsGuest(false);
      } else if (session.value === GUEST_USER_ID) {
        setUser(null);
        setIsGuest(true);
      } else {
        const currentUser = await useCases.getCurrentUser.execute();
        setUser(currentUser);
        setIsGuest(false);
      }
    } catch (error) {
      setUser(null);
      setIsGuest(false);
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await useCases.logoutUser.execute();
    setUser(null);
    setIsGuest(false);
  }

  const isAuthenticated = !!user || isGuest;

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isGuest, isAuthenticated, loading, logout, refresh: loadUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
