'use client';

import { ProtectedRoute } from '@/app/_components/ProtectedRoute';
import { useCognitive } from '@/app/_components/CognitiveProvider';
import { useAuth } from '@/app/_components/AuthProvider';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Icon } from '@iconify/react';
import { LayoutMode, VisualComplexity, InformationDensity, TextSize, NotificationTiming, TaskCreationMode } from '@/app/_domain/entities/UserPreferences';

export default function SettingsPage() {
  const { preferences, loading, updateLayoutMode, updateAllowExtraCustomColumns, updateOverloadBehavior, updateVisualComplexity, updateInformationDensity, updateTextSize, updateNotificationTiming, updateTaskCreationMode, updatePomodoroSettings } = useCognitive();
  const { logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push('/welcome');
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
            {/* Bloco 1: Layout Confortável */}
            <section className="bg-slate-800/40 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
              <h3 className="text-base font-medium text-slate-200 mb-3">Layout confortável</h3>
              
              <div className="space-y-3">
                <label className={`flex items-start p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  preferences.layoutMode === 'list'
                    ? 'border-amber-600/60 bg-amber-900/10'
                    : 'border-slate-600/50 hover:border-slate-500'
                }`}>
                  <input
                    type="radio"
                    name="layoutMode"
                    checked={preferences.layoutMode === 'list'}
                    onChange={() => updateLayoutMode('list')}
                    className="mt-0.5 w-4 h-4 text-amber-500 border-slate-500 focus:ring-amber-500 focus:ring-offset-0"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center gap-2">
                      <Icon icon="mdi:format-list-bulleted" className="w-4 h-4 text-amber-500" />
                      <p className="text-sm text-slate-200 font-normal">Lista</p>
                    </div>
                    <p className="text-xs text-slate-400 font-normal mt-0.5">Apenas 1 coluna de afazeres + botão de histórico</p>
                  </div>
                </label>

                <label className={`flex items-start p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  preferences.layoutMode === 'complete'
                    ? 'border-amber-600/60 bg-amber-900/10'
                    : 'border-slate-600/50 hover:border-slate-500'
                }`}>
                  <input
                    type="radio"
                    name="layoutMode"
                    checked={preferences.layoutMode === 'complete'}
                    onChange={() => updateLayoutMode('complete')}
                    className="mt-0.5 w-4 h-4 text-amber-500 border-slate-500 focus:ring-amber-500 focus:ring-offset-0"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center gap-2">
                      <Icon icon="mdi:view-column" className="w-4 h-4 text-amber-500" />
                      <p className="text-sm text-slate-200 font-normal">Completo</p>
                    </div>
                    <p className="text-xs text-slate-400 font-normal mt-0.5">A fazer • Fazendo • Completo</p>
                  </div>
                </label>

                <label className={`flex items-start p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  preferences.layoutMode === 'custom'
                    ? 'border-amber-600/60 bg-amber-900/10'
                    : 'border-slate-600/50 hover:border-slate-500'
                }`}>
                  <input
                    type="radio"
                    name="layoutMode"
                    checked={preferences.layoutMode === 'custom'}
                    onChange={() => updateLayoutMode('custom')}
                    className="mt-0.5 w-4 h-4 text-amber-500 border-slate-500 focus:ring-amber-500 focus:ring-offset-0"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center gap-2">
                      <Icon icon="mdi:tune-variant" className="w-4 h-4 text-amber-500" />
                      <p className="text-sm text-slate-200 font-normal">Customizado</p>
                    </div>
                    <p className="text-xs text-slate-400 font-normal mt-0.5">Crie suas próprias colunas personalizadas</p>
                  </div>
                </label>

                {/* Checkbox para ultrapassar limite de colunas - só aparece se modo customizado estiver ativo */}
                {preferences.layoutMode === 'custom' && (
                  <div className="ml-7 mt-2 p-3 bg-slate-700/30 rounded-lg border border-slate-600/50">
                    <label className="flex items-start cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.allowExtraCustomColumns}
                        onChange={(e) => updateAllowExtraCustomColumns(e.target.checked)}
                        className="mt-0.5 w-4 h-4 text-amber-500 border-slate-500 focus:ring-amber-500 focus:ring-offset-0 rounded"
                      />
                      <div className="ml-3">
                        <p className="text-sm text-slate-200 font-normal">Ultrapassar limite padrão de colunas personalizadas</p>
                        <p className="text-xs text-slate-400 font-normal mt-0.5">
                          Padrão: 3 colunas • Com esta opção: até 5 colunas
                        </p>
                      </div>
                    </label>
                  </div>
                )}
              </div>
            </section>

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

            {/* Bloco 4: Densidade Informacional */}
            <section className="bg-slate-800/40 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
              <h3 className="text-base font-medium text-slate-200 mb-2">Densidade de informação</h3>
              <p className="text-xs text-slate-400 font-normal mb-4">Controla quanto detalhe cada tarefa mostra</p>
              
              <div className="space-y-3">
                <label className={`flex items-start p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  preferences.informationDensity === 'essential'
                    ? 'border-cyan-600/60 bg-cyan-900/10'
                    : 'border-slate-600/50 hover:border-slate-500'
                }`}>
                  <input
                    type="radio"
                    name="informationDensity"
                    checked={preferences.informationDensity === 'essential'}
                    onChange={() => updateInformationDensity('essential')}
                    className="mt-0.5 w-4 h-4 text-cyan-500 border-slate-500 focus:ring-cyan-500 focus:ring-offset-0"
                  />
                  <div className="ml-3">
                    <p className="text-sm text-slate-200 font-normal">Essencial</p>
                    <p className="text-xs text-slate-400 font-normal mt-0.5">Apenas texto e ação principal</p>
                  </div>
                </label>

                <label className={`flex items-start p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  preferences.informationDensity === 'complete'
                    ? 'border-cyan-600/60 bg-cyan-900/10'
                    : 'border-slate-600/50 hover:border-slate-500'
                }`}>
                  <input
                    type="radio"
                    name="informationDensity"
                    checked={preferences.informationDensity === 'complete'}
                    onChange={() => updateInformationDensity('complete')}
                    className="mt-0.5 w-4 h-4 text-cyan-500 border-slate-500 focus:ring-cyan-500 focus:ring-offset-0"
                  />
                  <div className="ml-3">
                    <p className="text-sm text-slate-200 font-normal">Completo</p>
                    <p className="text-xs text-slate-400 font-normal mt-0.5">Timer, passos e todas as informações</p>
                  </div>
                </label>
              </div>
            </section>

            {/* Bloco 5: Leitura & Acessibilidade */}
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

            {/* Bloco 6: Modo de Criação de Tarefas */}
            <section className="bg-slate-800/40 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
              <h3 className="text-base font-medium text-slate-200 mb-2">Como você prefere criar tarefas?</h3>
              <p className="text-xs text-slate-400 font-normal mb-4">Escolha entre criação rápida ou detalhada</p>
              
              <div className="space-y-3">
                <label className={`flex items-start p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  preferences.taskCreationMode === 'simple'
                    ? 'border-indigo-600/60 bg-indigo-900/10'
                    : 'border-slate-600/50 hover:border-slate-500'
                }`}>
                  <input
                    type="radio"
                    name="taskCreationMode"
                    checked={preferences.taskCreationMode === 'simple'}
                    onChange={() => updateTaskCreationMode('simple')}
                    className="mt-0.5 w-4 h-4 text-indigo-500 border-slate-500 focus:ring-indigo-500 focus:ring-offset-0"
                  />
                  <div className="ml-3">
                    <div className="flex items-center gap-2">
                      <Icon icon="mdi:lightning-bolt" className="w-4 h-4 text-indigo-400" />
                      <p className="text-sm text-slate-200 font-normal">Simples</p>
                    </div>
                    <p className="text-xs text-slate-400 font-normal mt-0.5">Apenas título e categoria</p>
                  </div>
                </label>

                <label className={`flex items-start p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  preferences.taskCreationMode === 'full'
                    ? 'border-indigo-600/60 bg-indigo-900/10'
                    : 'border-slate-600/50 hover:border-slate-500'
                }`}>
                  <input
                    type="radio"
                    name="taskCreationMode"
                    checked={preferences.taskCreationMode === 'full'}
                    onChange={() => updateTaskCreationMode('full')}
                    className="mt-0.5 w-4 h-4 text-indigo-500 border-slate-500 focus:ring-indigo-500 focus:ring-offset-0"
                  />
                  <div className="ml-3">
                    <div className="flex items-center gap-2">
                      <Icon icon="mdi:text-box-multiple" className="w-4 h-4 text-indigo-400" />
                      <p className="text-sm text-slate-200 font-normal">Completo</p>
                    </div>
                    <p className="text-xs text-slate-400 font-normal mt-0.5">Título, categoria e descrição</p>
                  </div>
                </label>
              </div>
            </section>

            {/* Bloco 7: Notificações Conscientes */}
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

            {/* Configurações de Pomodoro */}
            <section className="bg-slate-800/40 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Icon icon="mdi:timer-outline" className="w-6 h-6 text-indigo-400" />
                <div>
                  <h2 className="text-lg font-medium text-slate-100">Timer Pomodoro</h2>
                  <p className="text-sm text-slate-400 font-normal">Configure a duração dos ciclos de trabalho e pausa</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="workDuration" className="block text-sm text-slate-300 font-normal mb-2">
                    Duração do trabalho (minutos)
                  </label>
                  <input
                    id="workDuration"
                    type="number"
                    min="1"
                    max="60"
                    value={preferences.pomodoroSettings.workDuration}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 25;
                      updatePomodoroSettings({
                        workDuration: value,
                        breakDuration: preferences.pomodoroSettings.breakDuration,
                      });
                    }}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    aria-label="Duração do trabalho em minutos"
                  />
                  <p className="text-xs text-slate-500 font-normal mt-1">Recomendado: 25 minutos</p>
                </div>

                <div>
                  <label htmlFor="breakDuration" className="block text-sm text-slate-300 font-normal mb-2">
                    Duração da pausa (minutos)
                  </label>
                  <input
                    id="breakDuration"
                    type="number"
                    min="1"
                    max="30"
                    value={preferences.pomodoroSettings.breakDuration}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 5;
                      updatePomodoroSettings({
                        workDuration: preferences.pomodoroSettings.workDuration,
                        breakDuration: value,
                      });
                    }}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    aria-label="Duração da pausa em minutos"
                  />
                  <p className="text-xs text-slate-500 font-normal mt-1">Recomendado: 5 minutos</p>
                </div>
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
