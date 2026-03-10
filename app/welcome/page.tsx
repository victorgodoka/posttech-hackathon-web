'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCases } from '@/app/_infrastructure/di/container';
import { useAuth } from '@/app/_components/AuthProvider';

type StartMode = 'calm' | 'focused' | 'organize';

export default function WelcomePage() {
  const [showChoice, setShowChoice] = useState(false);
  const [selectedMode, setSelectedMode] = useState<StartMode | null>(null);
  const router = useRouter();
  const { refresh, isAuthenticated, loading, user } = useAuth();

  // Redirecionar para dashboard se já estiver autenticado
  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, loading, user, router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowChoice(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  async function handleContinue(mode?: StartMode) {
    await useCases.continueAsGuest.execute();
    await refresh();
    router.push('/dashboard');
  }

  if (!showChoice) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-dark-bg-primary to-dark-bg-secondary">
        <div className="text-center">
          <Image
            src="/mindease.png"
            alt="MindEase"
            width={100}
            height={100}
            className="mx-auto mb-6"
            priority
          />
          <h1 className="text-2xl font-light text-dark-accent-teal-light dark:text-dark-accent-teal-light">
            MindEase
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-dark-bg-primary to-dark-bg-secondary px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <Image
            src="/mindease.png"
            alt="MindEase"
            width={80}
            height={80}
            className="mx-auto mb-4"
            priority
          />
          <h2 className="text-2xl font-light text-dark-accent-teal-light dark:text-dark-accent-teal-light mb-8">
            MindEase
          </h2>
          <h1 className="text-2xl font-light text-dark-text-primary dark:text-dark-text-primary mb-3">
            Vamos começar com calma.
          </h1>
        </div>

        <div className="space-y-6">
          <button
            onClick={() => handleContinue()}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-4 px-6 rounded-lg transition-colors duration-200 text-base font-normal"
          >
            Continuar como convidado
          </button>
          <p className="text-xs text-center text-dark-text-secondary font-light px-4">
            Modo visitante • Sem necessidade de criar conta
          </p>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dark-border-default"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-gradient-to-b from-dark-bg-primary to-dark-bg-secondary px-3 text-dark-text-muted font-light">ou</span>
            </div>
          </div>

          <button
            onClick={() => router.push('/login')}
            className="w-full bg-dark-bg-elevated hover:bg-dark-surface-muted dark:bg-dark-bg-elevated dark:hover:bg-dark-surface-muted text-dark-text-primary dark:text-dark-text-primary py-3 px-6 rounded-lg border border-dark-border-default transition-colors duration-200 text-sm font-light"
          >
            Entrar com e-mail
          </button>

        </div>
      </div>
    </div>
  );
}
