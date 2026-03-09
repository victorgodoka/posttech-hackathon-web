'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { ToastContainer, Toast, ToastType } from './ToastNotification';
import { useCognitive } from './CognitiveProvider';
import { useBrowserNotification } from './BrowserNotification';

interface ToastContextValue {
  showToast: (message: string, type: ToastType, force?: boolean) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const { preferences } = useCognitive();
  const { showNotification, permission } = useBrowserNotification();

  const showToast = useCallback((message: string, type: ToastType, force: boolean = false) => {
    // Respeitar notificationTiming
    const timing = preferences?.notificationTiming || 'only-when-asked';
    
    // Sempre mostrar erros (críticos)
    if (type === 'error' || force) {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, message, type }]);
      
      // Mostrar notificação nativa do browser para erros
      if (permission === 'granted') {
        showNotification('MindEase', {
          body: message,
          tag: 'mindease-error',
          icon: '/mindease.png',
        });
      }
      return;
    }
    
    // Controlar notificações baseado em timing
    if (timing === 'only-when-asked') {
      // Não mostrar notificações automáticas (apenas erros)
      return;
    }
    
    // Para 'focus-ends' e 'long-breaks', mostrar normalmente
    // (lógica de tempo seria implementada aqui se necessário)
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Mostrar notificação nativa do browser
    if (permission === 'granted') {
      const notificationTitle = type === 'success' ? '✓ MindEase' : 'ℹ️ MindEase';
      showNotification(notificationTitle, {
        body: message,
        tag: `mindease-${type}`,
        icon: '/mindease.png',
      });
    }
  }, [preferences, permission, showNotification]);

  const showSuccess = useCallback((message: string) => {
    showToast(message, 'success', false);
  }, [showToast]);

  const showError = useCallback((message: string) => {
    showToast(message, 'error', true); // Erros sempre forçados
  }, [showToast]);

  const showInfo = useCallback((message: string) => {
    showToast(message, 'info', false);
  }, [showToast]);

  const closeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, showSuccess, showError, showInfo }}>
      {children}
      <ToastContainer toasts={toasts} onClose={closeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
