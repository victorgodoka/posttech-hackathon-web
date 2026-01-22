'use client';

import { ProtectedRoute } from '@/app/_components/ProtectedRoute';
import { useCognitive } from '@/app/_components/CognitiveProvider';
import { useAuth } from '@/app/_components/AuthProvider';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FocusRhythm, VisualComplexity, TextSize, NotificationTiming } from '@/app/_domain/entities/UserPreferences';

export default function SettingsPage() {
  const { preferences, loading, updateFocusRhythm, updateMaxTasksInFocus, updateOverloadBehavior, updateVisualComplexity, updateTextSize, updateNotificationTiming } = useCognitive();
  const { logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push('/login');
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800">
          <p className="text-slate-400 font-normal">Carregando...</p>
        </div>
      </ProtectedRoute>
    );
  }

  if (!preferences) {
    return null;
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
        <header className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700">
          <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Image
                src="/mindease.png"
                alt="MindEase"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <h1 className="text-lg font-medium text-teal-400">Painel Cognitivo</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200 transition-colors font-light"
              >
                Voltar ao Board
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200 border border-slate-600 rounded-lg hover:bg-slate-700/50 transition-colors font-light"
              >
                Sair
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-base text-slate-300 font-normal">
              Ajustes para reduzir sobrecarga
            </p>
            <p className="text-sm text-slate-500 font-normal mt-1">
              Você pode mudar isso quando quiser • Não precisa acertar
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bloco 1: Ritmo Cognitivo */}
            <section className="bg-slate-800/40 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
              <h3 className="text-base font-medium text-slate-200 mb-3">Como você prefere focar agora?</h3>
              
              <div className="space-y-3">
                <label className={`flex items-start p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  preferences.focusRhythm === 'one-at-time'
                    ? 'border-amber-600/60 bg-amber-900/10'
                    : 'border-slate-600/50 hover:border-slate-500'
                }`}>
                  <input
                    type="radio"
                    name="focusRhythm"
                    checked={preferences.focusRhythm === 'one-at-time'}
                    onChange={() => updateFocusRhythm('one-at-time')}
                    className="mt-0.5 w-4 h-4 text-amber-500 border-slate-500 focus:ring-amber-500 focus:ring-offset-0"
                  />
                  <div className="ml-3">
                    <p className="text-sm text-slate-200 font-normal">Uma coisa por vez <span className="text-amber-400 text-xs">(recomendado)</span></p>
                    <p className="text-xs text-slate-400 font-normal mt-0.5">Menos sobrecarga, mais clareza</p>
                  </div>
                </label>

                <label className={`flex items-start p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  preferences.focusRhythm === 'few-parallel'
                    ? 'border-amber-600/60 bg-amber-900/10'
                    : 'border-slate-600/50 hover:border-slate-500'
                }`}>
                  <input
                    type="radio"
                    name="focusRhythm"
                    checked={preferences.focusRhythm === 'few-parallel'}
                    onChange={() => updateFocusRhythm('few-parallel')}
                    className="mt-0.5 w-4 h-4 text-amber-500 border-slate-500 focus:ring-amber-500 focus:ring-offset-0"
                  />
                  <div className="ml-3">
                    <p className="text-sm text-slate-200 font-normal">Poucas coisas em paralelo</p>
                    <p className="text-xs text-slate-400 font-normal mt-0.5">Até 3 tarefas visíveis</p>
                  </div>
                </label>

                <label className={`flex items-start p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  preferences.focusRhythm === 'no-limit'
                    ? 'border-amber-600/60 bg-amber-900/10'
                    : 'border-slate-600/50 hover:border-slate-500'
                }`}>
                  <input
                    type="radio"
                    name="focusRhythm"
                    checked={preferences.focusRhythm === 'no-limit'}
                    onChange={() => updateFocusRhythm('no-limit')}
                    className="mt-0.5 w-4 h-4 text-amber-500 border-slate-500 focus:ring-amber-500 focus:ring-offset-0"
                  />
                  <div className="ml-3">
                    <p className="text-sm text-slate-200 font-normal">Sem limite visível</p>
                    <p className="text-xs text-slate-400 font-normal mt-0.5">Você decide quantas tarefas quer ver</p>
                  </div>
                </label>
              </div>
            </section>

            {/* Bloco 2: Limites de Sobrecarga */}
            {preferences.focusRhythm !== 'no-limit' && (
              <section className="bg-slate-800/40 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
                <h3 className="text-base font-medium text-slate-200 mb-3">Comportamento ao ultrapassar limite</h3>
                
                <div className="space-y-3">
                  <label className={`flex items-start p-4 rounded-lg border-2 transition-all cursor-pointer ${
                    preferences.overloadBehavior === 'suggest-move'
                      ? 'border-indigo-600/60 bg-indigo-900/10'
                      : 'border-slate-600/50 hover:border-slate-500'
                  }`}>
                    <input
                      type="radio"
                      name="overloadBehavior"
                      checked={preferences.overloadBehavior === 'suggest-move'}
                      onChange={() => updateOverloadBehavior('suggest-move')}
                      className="mt-0.5 w-4 h-4 text-indigo-500 border-slate-500 focus:ring-indigo-500 focus:ring-offset-0"
                    />
                    <div className="ml-3">
                      <p className="text-sm text-slate-200 font-normal">Sugerir mover para Próximas</p>
                      <p className="text-xs text-slate-400 font-normal mt-0.5">Aviso gentil com sugestão</p>
                    </div>
                  </label>

                  <label className={`flex items-start p-4 rounded-lg border-2 transition-all cursor-pointer ${
                    preferences.overloadBehavior === 'warn-only'
                      ? 'border-indigo-600/60 bg-indigo-900/10'
                      : 'border-slate-600/50 hover:border-slate-500'
                  }`}>
                    <input
                      type="radio"
                      name="overloadBehavior"
                      checked={preferences.overloadBehavior === 'warn-only'}
                      onChange={() => updateOverloadBehavior('warn-only')}
                      className="mt-0.5 w-4 h-4 text-indigo-500 border-slate-500 focus:ring-indigo-500 focus:ring-offset-0"
                    />
                    <div className="ml-3">
                      <p className="text-sm text-slate-200 font-normal">Apenas avisar</p>
                      <p className="text-xs text-slate-400 font-normal mt-0.5">Só um lembrete, você decide</p>
                    </div>
                  </label>

                  <label className={`flex items-start p-4 rounded-lg border-2 transition-all cursor-pointer ${
                    preferences.overloadBehavior === 'no-warning'
                      ? 'border-indigo-600/60 bg-indigo-900/10'
                      : 'border-slate-600/50 hover:border-slate-500'
                  }`}>
                    <input
                      type="radio"
                      name="overloadBehavior"
                      checked={preferences.overloadBehavior === 'no-warning'}
                      onChange={() => updateOverloadBehavior('no-warning')}
                      className="mt-0.5 w-4 h-4 text-indigo-500 border-slate-500 focus:ring-indigo-500 focus:ring-offset-0"
                    />
                    <div className="ml-3">
                      <p className="text-sm text-slate-200 font-normal">Não mostrar aviso</p>
                      <p className="text-xs text-slate-400 font-normal mt-0.5">Sem interrupções</p>
                    </div>
                  </label>
                </div>
              </section>
            )}

            {/* Bloco 3: Estímulos Visuais */}
            <section className="bg-slate-800/40 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
              <h3 className="text-base font-medium text-slate-200 mb-2">Complexidade visual</h3>
              <p className="text-xs text-slate-400 font-normal mb-4">Menos estímulos pode ajudar quando tudo parece demais</p>
              
              <div className="space-y-3">
                <label className={`flex items-start p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  preferences.visualComplexity === 'minimal'
                    ? 'border-teal-600/60 bg-teal-900/10'
                    : 'border-slate-600/50 hover:border-slate-500'
                }`}>
                  <input
                    type="radio"
                    name="visualComplexity"
                    checked={preferences.visualComplexity === 'minimal'}
                    onChange={() => updateVisualComplexity('minimal')}
                    className="mt-0.5 w-4 h-4 text-teal-500 border-slate-500 focus:ring-teal-500 focus:ring-offset-0"
                  />
                  <div className="ml-3">
                    <p className="text-sm text-slate-200 font-normal">Minimal</p>
                    <p className="text-xs text-slate-400 font-normal mt-0.5">Menos sombras, bordas e detalhes</p>
                  </div>
                </label>

                <label className={`flex items-start p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  preferences.visualComplexity === 'balanced'
                    ? 'border-teal-600/60 bg-teal-900/10'
                    : 'border-slate-600/50 hover:border-slate-500'
                }`}>
                  <input
                    type="radio"
                    name="visualComplexity"
                    checked={preferences.visualComplexity === 'balanced'}
                    onChange={() => updateVisualComplexity('balanced')}
                    className="mt-0.5 w-4 h-4 text-teal-500 border-slate-500 focus:ring-teal-500 focus:ring-offset-0"
                  />
                  <div className="ml-3">
                    <p className="text-sm text-slate-200 font-normal">Equilibrado</p>
                    <p className="text-xs text-slate-400 font-normal mt-0.5">Padrão confortável</p>
                  </div>
                </label>

                <label className={`flex items-start p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  preferences.visualComplexity === 'informative'
                    ? 'border-teal-600/60 bg-teal-900/10'
                    : 'border-slate-600/50 hover:border-slate-500'
                }`}>
                  <input
                    type="radio"
                    name="visualComplexity"
                    checked={preferences.visualComplexity === 'informative'}
                    onChange={() => updateVisualComplexity('informative')}
                    className="mt-0.5 w-4 h-4 text-teal-500 border-slate-500 focus:ring-teal-500 focus:ring-offset-0"
                  />
                  <div className="ml-3">
                    <p className="text-sm text-slate-200 font-normal">Mais informativo</p>
                    <p className="text-xs text-slate-400 font-normal mt-0.5">Mais detalhes visuais</p>
                  </div>
                </label>
              </div>
            </section>

            {/* Bloco 4: Leitura & Acessibilidade */}
            <section className="bg-slate-800/40 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
              <h3 className="text-base font-medium text-slate-200 mb-4">Tamanho do texto</h3>
              
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => updateTextSize('small')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    preferences.textSize === 'small'
                      ? 'border-purple-600/60 bg-purple-900/10 text-slate-100'
                      : 'border-slate-600/50 text-slate-400 hover:border-slate-500'
                  }`}
                >
                  <p className="text-sm font-normal">Pequeno</p>
                </button>

                <button
                  onClick={() => updateTextSize('medium')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    preferences.textSize === 'medium'
                      ? 'border-purple-600/60 bg-purple-900/10 text-slate-100'
                      : 'border-slate-600/50 text-slate-400 hover:border-slate-500'
                  }`}
                >
                  <p className="text-sm font-normal">Médio</p>
                </button>

                <button
                  onClick={() => updateTextSize('large')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    preferences.textSize === 'large'
                      ? 'border-purple-600/60 bg-purple-900/10 text-slate-100'
                      : 'border-slate-600/50 text-slate-400 hover:border-slate-500'
                  }`}
                >
                  <p className="text-sm font-normal">Grande</p>
                </button>
              </div>
            </section>

            {/* Bloco 5: Notificações Conscientes */}
            <section className="bg-slate-800/40 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
              <h3 className="text-base font-medium text-slate-200 mb-2">Quando você gostaria de ser lembrado?</h3>
              <p className="text-xs text-slate-400 font-normal mb-4">O MindEase evita interrupções desnecessárias</p>
              
              <div className="space-y-3">
                <label className={`flex items-start p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  preferences.notificationTiming === 'only-when-asked'
                    ? 'border-blue-600/60 bg-blue-900/10'
                    : 'border-slate-600/50 hover:border-slate-500'
                }`}>
                  <input
                    type="radio"
                    name="notificationTiming"
                    checked={preferences.notificationTiming === 'only-when-asked'}
                    onChange={() => updateNotificationTiming('only-when-asked')}
                    className="mt-0.5 w-4 h-4 text-blue-500 border-slate-500 focus:ring-blue-500 focus:ring-offset-0"
                  />
                  <div className="ml-3">
                    <p className="text-sm text-slate-200 font-normal">Só quando eu pedir</p>
                    <p className="text-xs text-slate-400 font-normal mt-0.5">Sem notificações automáticas</p>
                  </div>
                </label>

                <label className={`flex items-start p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  preferences.notificationTiming === 'focus-ends'
                    ? 'border-blue-600/60 bg-blue-900/10'
                    : 'border-slate-600/50 hover:border-slate-500'
                }`}>
                  <input
                    type="radio"
                    name="notificationTiming"
                    checked={preferences.notificationTiming === 'focus-ends'}
                    onChange={() => updateNotificationTiming('focus-ends')}
                    className="mt-0.5 w-4 h-4 text-blue-500 border-slate-500 focus:ring-blue-500 focus:ring-offset-0"
                  />
                  <div className="ml-3">
                    <p className="text-sm text-slate-200 font-normal">Quando um foco termina</p>
                    <p className="text-xs text-slate-400 font-normal mt-0.5">Aviso ao fim do timer</p>
                  </div>
                </label>

                <label className={`flex items-start p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  preferences.notificationTiming === 'long-breaks'
                    ? 'border-blue-600/60 bg-blue-900/10'
                    : 'border-slate-600/50 hover:border-slate-500'
                }`}>
                  <input
                    type="radio"
                    name="notificationTiming"
                    checked={preferences.notificationTiming === 'long-breaks'}
                    onChange={() => updateNotificationTiming('long-breaks')}
                    className="mt-0.5 w-4 h-4 text-blue-500 border-slate-500 focus:ring-blue-500 focus:ring-offset-0"
                  />
                  <div className="ml-3">
                    <p className="text-sm text-slate-200 font-normal">Em pausas longas</p>
                    <p className="text-xs text-slate-400 font-normal mt-0.5">Lembrete suave após inatividade</p>
                  </div>
                </label>
              </div>
            </section>
          </div>

          <div className="mt-8 p-4 bg-slate-800/20 border border-slate-700/30 rounded-lg lg:col-span-2">
            <p className="text-xs text-slate-500 font-normal text-center">
              Isso não é um compromisso • Você pode ajustar sempre que precisar
            </p>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
