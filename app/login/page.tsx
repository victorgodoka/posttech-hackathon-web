'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCases } from '@/app/_infrastructure/di/container';
import { LoginForm } from '@/app/_components/LoginForm';
import { RegisterForm } from '@/app/_components/RegisterForm';

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const router = useRouter();

  function handleSuccess() {
    router.push('/dashboard');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 dark:from-slate-900 dark:to-slate-800 px-4">
      <div className="w-full max-w-md">
        {/* Cabeçalho minimalista */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <Image
              src="/mindease.png"
              alt="MindEase"
              width={80}
              height={80}
              className="mx-auto"
              priority
            />
          </div>
          <h2 className="text-2xl font-light text-teal-400 dark:text-teal-400 mb-8">
            MindEase
          </h2>
          <h1 className="text-2xl font-light text-slate-100 dark:text-slate-100 mb-3">
            Vamos começar com calma.
          </h1>
          <p className="text-sm text-slate-400 dark:text-slate-400 font-light">
            Você pode entrar agora ou continuar mais tarde.
          </p>
        </div>

        <div className="bg-slate-800 dark:bg-slate-800 p-8 rounded-lg border border-slate-700 dark:border-slate-700">
          <button
            onClick={() => router.push('/welcome')}
            className="mb-6 text-sm text-slate-400 hover:text-slate-200 dark:text-slate-400 dark:hover:text-slate-200 transition-colors font-light flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar
          </button>

          {mode === 'login' ? (
            <LoginForm
              onSuccess={handleSuccess}
              onSwitchToRegister={() => setMode('register')}
            />
          ) : (
            <RegisterForm
              onSuccess={handleSuccess}
              onSwitchToLogin={() => setMode('login')}
            />
          )}
        </div>
      </div>
    </div>
  );
}
