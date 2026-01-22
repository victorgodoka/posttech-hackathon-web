'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { UserPreferences, FocusRhythm, VisualComplexity, TextSize, NotificationTiming } from '@/app/_domain/entities/UserPreferences';
import { useCases } from '@/app/_infrastructure/di/container';
import { useAuth } from './AuthProvider';

interface CognitiveContextValue {
  preferences: UserPreferences | null;
  loading: boolean;
  updateFocusRhythm: (rhythm: FocusRhythm) => Promise<void>;
  updateMaxTasksInFocus: (max: number) => Promise<void>;
  updateOverloadBehavior: (behavior: 'warn-only' | 'suggest-move' | 'no-warning') => Promise<void>;
  updateVisualComplexity: (complexity: VisualComplexity) => Promise<void>;
  updateTextSize: (size: TextSize) => Promise<void>;
  updateNotificationTiming: (timing: NotificationTiming) => Promise<void>;
  refresh: () => Promise<void>;
}

const CognitiveContext = createContext<CognitiveContextValue | undefined>(undefined);

export function CognitiveProvider({ children }: { children: ReactNode }) {
  const { user, isGuest, isAuthenticated } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadPreferences() {
    if (!isAuthenticated) {
      setPreferences(null);
      setLoading(false);
      return;
    }

    try {
      const userId = user?.id || 'guest-user';
      const prefs = await useCases.getUserPreferences.execute(userId);
      setPreferences(prefs);
    } catch (error) {
      console.error('Erro ao carregar preferências:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPreferences();
  }, [isAuthenticated, user?.id]);

  async function updateFocusRhythm(rhythm: FocusRhythm) {
    if (!isAuthenticated) return;
    
    const userId = user?.id || 'guest-user';
    const updated = await useCases.updateUserPreferences.execute(userId, { focusRhythm: rhythm });
    setPreferences(updated);
  }

  async function updateMaxTasksInFocus(max: number) {
    if (!isAuthenticated) return;
    
    const userId = user?.id || 'guest-user';
    const updated = await useCases.updateUserPreferences.execute(userId, { maxTasksInFocus: max });
    setPreferences(updated);
  }

  async function updateOverloadBehavior(behavior: 'warn-only' | 'suggest-move' | 'no-warning') {
    if (!isAuthenticated) return;
    
    const userId = user?.id || 'guest-user';
    const updated = await useCases.updateUserPreferences.execute(userId, { overloadBehavior: behavior });
    setPreferences(updated);
  }

  async function updateVisualComplexity(complexity: VisualComplexity) {
    if (!isAuthenticated) return;
    
    const userId = user?.id || 'guest-user';
    const updated = await useCases.updateUserPreferences.execute(userId, { visualComplexity: complexity });
    setPreferences(updated);
  }

  async function updateTextSize(size: TextSize) {
    if (!isAuthenticated) return;
    
    const userId = user?.id || 'guest-user';
    const updated = await useCases.updateUserPreferences.execute(userId, { textSize: size });
    setPreferences(updated);
  }

  async function updateNotificationTiming(timing: NotificationTiming) {
    if (!isAuthenticated) return;
    
    const userId = user?.id || 'guest-user';
    const updated = await useCases.updateUserPreferences.execute(userId, { notificationTiming: timing });
    setPreferences(updated);
  }

  return (
    <CognitiveContext.Provider
      value={{
        preferences,
        loading,
        updateFocusRhythm,
        updateMaxTasksInFocus,
        updateOverloadBehavior,
        updateVisualComplexity,
        updateTextSize,
        updateNotificationTiming,
        refresh: loadPreferences,
      }}
    >
      {children}
    </CognitiveContext.Provider>
  );
}

export function useCognitive() {
  const context = useContext(CognitiveContext);
  if (!context) {
    throw new Error('useCognitive deve ser usado dentro de CognitiveProvider');
  }
  return context;
}
