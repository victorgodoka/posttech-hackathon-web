'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCases } from '@/app/_infrastructure/di/container';

type StartMode = 'calm' | 'focused' | 'organize';

export default function WelcomePage() {
  const [showChoice, setShowChoice] = useState(false);
  const [selectedMode, setSelectedMode] = useState<StartMode | null>(null);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowChoice(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  async function handleContinue(mode?: StartMode) {
    await useCases.continueAsGuest.execute();
    router.push('/dashboard');
  }

  if (!showChoice) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100">
        <div className="text-center">
          <Image
            src="/mindease.png"
            alt="MindEase"
            width={100}
            height={100}
            className="mx-auto mb-6"
            priority
          />
          <h1 className="text-2xl font-light text-teal-500">
            MindEase
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 px-4">
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
          <h2 className="text-2xl font-light text-teal-500 mb-8">
            MindEase
          </h2>
          <h1 className="text-2xl font-light text-gray-800 mb-3">
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
          <p className="text-xs text-center text-gray-500 font-light px-4">
            Modo visitante • Sem necessidade de criar conta
          </p>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-gradient-to-b from-slate-50 to-slate-100 px-3 text-gray-400 font-light">ou</span>
            </div>
          </div>

          <button
            onClick={() => router.push('/login')}
            className="w-full bg-white hover:bg-gray-50 text-gray-600 py-3 px-6 rounded-lg border border-gray-200 transition-colors duration-200 text-sm font-light"
          >
            Entrar com e-mail
          </button>

        </div>
      </div>
    </div>
  );
}
