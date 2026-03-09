'use client';

import { useEffect, useState } from 'react';

export type NotificationPermission = 'default' | 'granted' | 'denied';

interface BrowserNotificationProps {
  onPermissionChange?: (permission: NotificationPermission) => void;
}

export function useBrowserNotification() {
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission as NotificationPermission);
    }
  }, []);

  async function requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('Este navegador não suporta notificações');
      return 'denied';
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result as NotificationPermission);
      return result as NotificationPermission;
    } catch (error) {
      console.error('Erro ao solicitar permissão de notificação:', error);
      return 'denied';
    }
  }

  function showNotification(title: string, options?: NotificationOptions): Notification | null {
    if (!('Notification' in window)) {
      console.warn('Este navegador não suporta notificações');
      return null;
    }

    if (Notification.permission !== 'granted') {
      console.warn('Permissão de notificação não concedida');
      return null;
    }

    try {
      const notificationOptions: NotificationOptions = {
        body: options?.body || '',
        icon: options?.icon || '/mindease.png',
        badge: options?.badge || '/mindease.png',
        tag: options?.tag || 'mindease-notification',
        requireInteraction: options?.requireInteraction || false,
        silent: false, // Garantir que não está silenciosa
      };

      const notification = new Notification(title, notificationOptions);

      // Listeners de eventos
      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      notification.onerror = (error) => {
        console.error('Erro ao exibir notificação:', error);
      };

      // Auto-fechar após 10 segundos se não for interativa
      if (!options?.requireInteraction) {
        setTimeout(() => {
          notification.close();
        }, 10000);
      }

      return notification;
    } catch (error) {
      console.error('❌ Erro ao mostrar notificação:', error);
      return null;
    }
  }

  return {
    permission,
    requestPermission,
    showNotification,
    isSupported: typeof window !== 'undefined' && 'Notification' in window,
  };
}

export function BrowserNotificationSetup({ onPermissionChange }: BrowserNotificationProps) {
  const { permission, requestPermission, isSupported } = useBrowserNotification();

  useEffect(() => {
    if (onPermissionChange) {
      onPermissionChange(permission);
    }
  }, [permission, onPermissionChange]);

  if (!isSupported) {
    return (
      <div className="p-4 bg-amber-900/20 border border-amber-700/50 rounded-lg">
        <p className="text-sm text-amber-400">
          Seu navegador não suporta notificações nativas.
        </p>
      </div>
    );
  }

  if (permission === 'denied') {
    return (
      <div className="p-4 bg-red-900/20 border border-red-700/50 rounded-lg">
        <p className="text-sm text-red-400">
          Notificações bloqueadas. Habilite nas configurações do navegador.
        </p>
      </div>
    );
  }

  if (permission === 'default') {
    return (
      <button
        onClick={requestPermission}
        className="w-full p-4 bg-indigo-900/20 border border-indigo-700/50 rounded-lg hover:bg-indigo-900/30 transition-colors"
      >
        <p className="text-sm text-indigo-400 font-normal">
          🔔 Ativar notificações do navegador
        </p>
        <p className="text-xs text-dark-text-muted mt-1">
          Receba alertas mesmo quando não estiver na aba
        </p>
      </button>
    );
  }

  return (
    <div className="p-4 bg-emerald-900/20 border border-emerald-700/50 rounded-lg">
      <p className="text-sm text-emerald-400">
        ✓ Notificações ativadas
      </p>
    </div>
  );
}
