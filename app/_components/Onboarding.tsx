'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';

interface OnboardingProps {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Bem-vindo ao MindEase',
      description: 'Uma ferramenta de organização projetada para reduzir sobrecarga cognitiva.',
      icon: 'mdi:hand-wave',
    },
    {
      title: 'Organize suas tarefas',
      description: 'Adicione tarefas, divida em passos e use o timer Pomodoro para manter o foco.',
      icon: 'mdi:format-list-checks',
    },
    {
      title: 'Escolha seu layout',
      description: 'Modo Lista (1 coluna), Completo (3 colunas) ou Customizado (suas próprias colunas).',
      icon: 'mdi:view-column',
    },
    {
      title: 'Ajuste a interface',
      description: 'Nas configurações, você pode ajustar tamanho de fonte, densidade de informação e muito mais.',
      icon: 'mdi:tune',
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleNext();
    if (e.key === 'Escape') handleSkip();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-dark-bg-primary/95 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
      <div className="max-w-md w-full mx-4 bg-dark-bg-elevated rounded-xl border border-dark-border-default p-8 shadow-2xl">
        <div className="flex flex-col items-center text-center">
          <Icon 
            icon={steps[currentStep].icon} 
            className="w-16 h-16 text-indigo-400 mb-4" 
          />
          
          <h2 
            id="onboarding-title"
            className="text-2xl font-medium text-dark-text-primary mb-3"
          >
            {steps[currentStep].title}
          </h2>
          
          <p className="text-base text-dark-text-primary mb-6">
            {steps[currentStep].description}
          </p>

          <div className="flex gap-2 mb-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentStep
                    ? 'w-8 bg-indigo-500'
                    : index < currentStep
                    ? 'w-1.5 bg-indigo-600/50'
                    : 'w-1.5 bg-dark-surface-subtle'
                }`}
                aria-label={`Passo ${index + 1} de ${steps.length}${index === currentStep ? ' (atual)' : ''}`}
              />
            ))}
          </div>

          <div className="flex gap-3 w-full">
            <button
              onClick={handleSkip}
              onKeyDown={handleKeyDown}
              className="flex-1 px-4 py-2 text-sm text-dark-text-secondary hover:text-dark-text-primary transition-colors font-normal"
              aria-label="Pular tutorial"
            >
              Pular
            </button>
            <button
              onClick={handleNext}
              onKeyDown={handleKeyDown}
              className="flex-1 px-4 py-2 text-sm bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors font-normal"
              aria-label={currentStep < steps.length - 1 ? 'Próximo passo' : 'Começar a usar'}
            >
              {currentStep < steps.length - 1 ? 'Próximo' : 'Começar'}
            </button>
          </div>

          <p className="text-xs text-dark-text-muted mt-4">
            Passo {currentStep + 1} de {steps.length}
          </p>
        </div>
      </div>
    </div>
  );
}
