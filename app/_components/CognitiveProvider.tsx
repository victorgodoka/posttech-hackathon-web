'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { UserPreferences, LayoutMode, CustomColumn, VisualComplexity, InformationDensity, TextSize, NotificationTiming, TaskCreationMode, PomodoroSettings } from '@/app/_domain/entities/UserPreferences';
import { useCases } from '@/app/_infrastructure/di/container';
import { useAuth } from './AuthProvider';

interface CognitiveContextValue {
  preferences: UserPreferences | null;
  loading: boolean;
  updateLayoutMode: (mode: LayoutMode) => Promise<void>;
  addCustomColumn: (name: string, afterColumnId?: string) => Promise<void>;
  updateCustomColumn: (columnId: string, name: string) => Promise<void>;
  removeCustomColumn: (columnId: string) => Promise<void>;
  updateAllowExtraCustomColumns: (allow: boolean) => Promise<void>;
  updateOverloadBehavior: (behavior: 'warn-only' | 'suggest-move' | 'no-warning') => Promise<void>;
  updateVisualComplexity: (complexity: VisualComplexity) => Promise<void>;
  updateInformationDensity: (density: InformationDensity) => Promise<void>;
  updateTextSize: (size: TextSize) => Promise<void>;
  updateNotificationTiming: (timing: NotificationTiming) => Promise<void>;
  updateTaskCreationMode: (mode: TaskCreationMode) => Promise<void>;
  updatePomodoroSettings: (settings: PomodoroSettings) => Promise<void>;
  refresh: () => Promise<void>;
}

const CognitiveContext = createContext<CognitiveContextValue | undefined>(undefined);

export function CognitiveProvider({ children }: { children: ReactNode }) {
  const { user, isGuest, isAuthenticated } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadPreferences() {
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

  async function updateLayoutMode(mode: LayoutMode) {
    const userId = user?.id || 'guest-user';
    const updated = await useCases.updateUserPreferences.execute(userId, { layoutMode: mode });
    setPreferences(updated);
  }

  async function addCustomColumn(name: string, afterColumnId?: string) {
    if (!preferences) return;
    const userId = user?.id || 'guest-user';
    preferences.addCustomColumn(name, afterColumnId);
    const updated = await useCases.updateUserPreferences.execute(userId, {
      customColumns: preferences.customColumns,
    });
    setPreferences(updated);
  }

  async function updateCustomColumn(columnId: string, name: string) {
    if (!preferences) return;
    const userId = user?.id || 'guest-user';
    preferences.updateCustomColumn(columnId, name);
    const updated = await useCases.updateUserPreferences.execute(userId, { customColumns: preferences.customColumns });
    setPreferences(updated);
  }

  async function removeCustomColumn(columnId: string) {
    if (!preferences) return;
    const userId = user?.id || 'guest-user';
    preferences.removeCustomColumn(columnId);
    const updated = await useCases.updateUserPreferences.execute(userId, { customColumns: preferences.customColumns });
    setPreferences(updated);
  }

  async function updateAllowExtraCustomColumns(allow: boolean) {
    if (!preferences) return;
    const userId = user?.id || 'guest-user';
    preferences.updateAllowExtraCustomColumns(allow);
    const updated = await useCases.updateUserPreferences.execute(userId, { allowExtraCustomColumns: allow });
    setPreferences(updated);
  }

  async function updateOverloadBehavior(behavior: 'warn-only' | 'suggest-move' | 'no-warning') {
    const userId = user?.id || 'guest-user';
    const updated = await useCases.updateUserPreferences.execute(userId, { overloadBehavior: behavior });
    setPreferences(updated);
  }

  async function updateVisualComplexity(complexity: VisualComplexity) {
    const userId = user?.id || 'guest-user';
    const updated = await useCases.updateUserPreferences.execute(userId, { visualComplexity: complexity });
    setPreferences(updated);
  }

  async function updateInformationDensity(density: InformationDensity) {
    const userId = user?.id || 'guest-user';
    const updated = await useCases.updateUserPreferences.execute(userId, { informationDensity: density });
    setPreferences(updated);
  }

  async function updateTextSize(size: TextSize) {
    const userId = user?.id || 'guest-user';
    const updated = await useCases.updateUserPreferences.execute(userId, { textSize: size });
    setPreferences(updated);
  }

  async function updateNotificationTiming(timing: NotificationTiming) {
    const userId = user?.id || 'guest-user';
    const updated = await useCases.updateUserPreferences.execute(userId, { notificationTiming: timing });
    setPreferences(updated);
  }

  async function updateTaskCreationMode(mode: TaskCreationMode) {
    const userId = user?.id || 'guest-user';
    const updated = await useCases.updateUserPreferences.execute(userId, { taskCreationMode: mode });
    setPreferences(updated);
  }

  async function updatePomodoroSettings(settings: PomodoroSettings) {
    const userId = user?.id || 'guest-user';
    const updated = await useCases.updateUserPreferences.execute(userId, { pomodoroSettings: settings });
    setPreferences(updated);
  }

  return (
    <CognitiveContext.Provider
      value={{
        preferences,
        loading,
        updateLayoutMode,
        addCustomColumn,
        updateCustomColumn,
        removeCustomColumn,
        updateAllowExtraCustomColumns,
        updateOverloadBehavior,
        updateVisualComplexity,
        updateInformationDensity,
        updateTextSize,
        updateNotificationTiming,
        updateTaskCreationMode,
        updatePomodoroSettings,
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
