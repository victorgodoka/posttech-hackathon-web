'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@/app/_domain/entities/User';
import { useCases } from '@/app/_infrastructure/di/container';
import { getDB } from '@/app/_infrastructure/persistence/idb/db';
import { auth } from '@/app/_infrastructure/persistence/firebase/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

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
const USE_FIREBASE = process.env.NEXT_PUBLIC_USE_FIREBASE === 'true';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loadUser() {
    console.log('🔄 AuthProvider.loadUser: Iniciando...');
    try {
      // Verificar sessão no IndexedDB (funciona tanto para Firebase quanto IndexedDB)
      const db = await getDB();
      const session = await db.get('auth', 'current-user-id');
      console.log('🔄 AuthProvider.loadUser: Sessão encontrada:', session);
      
      if (!session) {
        console.log('🔄 AuthProvider.loadUser: Sem sessão');
        setUser(null);
        setIsGuest(false);
      } else if (session.value === GUEST_USER_ID) {
        console.log('🔄 AuthProvider.loadUser: Modo GUEST detectado!');
        setUser(null);
        setIsGuest(true);
      } else {
        console.log('🔄 AuthProvider.loadUser: Sessão de usuário real');
        // Tem sessão de usuário real
        if (USE_FIREBASE && typeof window !== 'undefined') {
          // Firebase Auth state será gerenciado pelo useEffect com onAuthStateChanged
          console.log('🔄 AuthProvider.loadUser: Firebase ativo, delegando para onAuthStateChanged');
          return;
        }
        const currentUser = await useCases.getCurrentUser.execute();
        setUser(currentUser);
        setIsGuest(false);
      }
    } catch (error) {
      console.error('🔄 AuthProvider.loadUser: Erro:', error);
      setUser(null);
      setIsGuest(false);
    } finally {
      setLoading(false);
      console.log('🔄 AuthProvider.loadUser: Concluído. isGuest:', isGuest);
    }
  }

  async function logout() {
    await useCases.logoutUser.execute();
    setUser(null);
    setIsGuest(false);
  }

  const isAuthenticated = !!user || isGuest;

  useEffect(() => {
    // Se estiver usando Firebase, usar onAuthStateChanged
    if (USE_FIREBASE && typeof window !== 'undefined') {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        try {
          if (firebaseUser) {
            // Usuário autenticado no Firebase
            const currentUser = await useCases.getCurrentUser.execute();
            setUser(currentUser);
            setIsGuest(false);
          } else {
            // Não autenticado no Firebase - verificar se é guest
            const db = await getDB();
            const session = await db.get('auth', 'current-user-id');
            
            if (session?.value === GUEST_USER_ID) {
              setUser(null);
              setIsGuest(true);
            } else {
              setUser(null);
              setIsGuest(false);
            }
          }
        } catch (error) {
          console.error('Erro ao carregar usuário:', error);
          setUser(null);
          setIsGuest(false);
        } finally {
          setLoading(false);
        }
      });
      
      return () => unsubscribe();
    } else {
      // Fluxo IndexedDB
      loadUser();
    }
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
