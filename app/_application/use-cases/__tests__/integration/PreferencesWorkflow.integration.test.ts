/**
 * Testes de Integração - Fluxo de Preferências Cognitivas
 * 
 * Testa o fluxo completo de gerenciamento de preferências do usuário
 */

import { GetUserPreferences } from '../../GetUserPreferences';
import { UpdateUserPreferences } from '../../UpdateUserPreferences';
import { PreferencesRepositoryIDB } from '../../../../_infrastructure/persistence/idb/PreferencesRepositoryIDB';

describe('Preferences Workflow Integration Tests', () => {
  let preferencesRepository: PreferencesRepositoryIDB;
  let getUserPreferences: GetUserPreferences;
  let updateUserPreferences: UpdateUserPreferences;

  beforeEach(() => {
    preferencesRepository = new PreferencesRepositoryIDB();
    getUserPreferences = new GetUserPreferences(preferencesRepository);
    updateUserPreferences = new UpdateUserPreferences(preferencesRepository);
  });

  describe('Cognitive Preferences Management', () => {
    it('should create default preferences for new user', async () => {
      const userId = 'test-user-1';
      
      const preferences = await getUserPreferences.execute(userId);
      
      expect(preferences).toBeDefined();
      expect(preferences.userId).toBe(userId);
      expect(preferences.layoutMode).toBe('list');
      expect(preferences.visualComplexity).toBe('balanced');
      expect(preferences.textSize).toBe('medium');
      expect(preferences.pomodoroSettings.workDuration).toBe(25);
      expect(preferences.pomodoroSettings.breakDuration).toBe(5);
    });

    it('should update layout mode', async () => {
      const userId = 'test-user-2';
      
      // Criar preferências padrão
      await getUserPreferences.execute(userId);
      
      // Atualizar layout mode
      const updated = await updateUserPreferences.execute(userId, {
        layoutMode: 'complete'
      });
      
      expect(updated.layoutMode).toBe('complete');
      
      // Verificar persistência
      const retrieved = await getUserPreferences.execute(userId);
      expect(retrieved.layoutMode).toBe('complete');
    });

    it('should update visual complexity', async () => {
      const userId = 'test-user-3';
      
      await getUserPreferences.execute(userId);
      
      const updated = await updateUserPreferences.execute(userId, {
        visualComplexity: 'minimal'
      });
      
      expect(updated.visualComplexity).toBe('minimal');
    });

    it('should update multiple preferences at once', async () => {
      const userId = 'test-user-4';
      
      await getUserPreferences.execute(userId);
      
      const updated = await updateUserPreferences.execute(userId, {
        layoutMode: 'custom',
        visualComplexity: 'informative',
        textSize: 'large',
        informationDensity: 'essential',
        taskCreationMode: 'full'
      });
      
      expect(updated.layoutMode).toBe('custom');
      expect(updated.visualComplexity).toBe('informative');
      expect(updated.textSize).toBe('large');
      expect(updated.informationDensity).toBe('essential');
      expect(updated.taskCreationMode).toBe('full');
    });

    it('should update pomodoro settings', async () => {
      const userId = 'test-user-5';
      
      await getUserPreferences.execute(userId);
      
      const updated = await updateUserPreferences.execute(userId, {
        pomodoroSettings: {
          workDuration: 45,
          breakDuration: 10
        }
      });
      
      expect(updated.pomodoroSettings.workDuration).toBe(45);
      expect(updated.pomodoroSettings.breakDuration).toBe(10);
    });

    it('should manage custom columns', async () => {
      const userId = 'test-user-6';
      
      const prefs = await getUserPreferences.execute(userId);
      
      // Adicionar coluna customizada
      prefs.addCustomColumn('Backlog');
      await preferencesRepository.save(prefs);
      
      const retrieved = await getUserPreferences.execute(userId);
      expect(retrieved.customColumns).toHaveLength(1);
      expect(retrieved.customColumns[0].name).toBe('Backlog');
    });
  });

  describe('Cognitive Accessibility Features', () => {
    it('should support minimal visual complexity for cognitive overload', async () => {
      const userId = 'cognitive-user-1';
      
      const updated = await updateUserPreferences.execute(userId, {
        visualComplexity: 'minimal',
        informationDensity: 'essential',
        textSize: 'large'
      });
      
      // Configuração ideal para reduzir sobrecarga cognitiva
      expect(updated.visualComplexity).toBe('minimal');
      expect(updated.informationDensity).toBe('essential');
      expect(updated.textSize).toBe('large');
    });

    it('should support focus mode (list layout)', async () => {
      const userId = 'focus-user-1';
      
      const updated = await updateUserPreferences.execute(userId, {
        layoutMode: 'list', // Modo foco
        visualComplexity: 'minimal',
        notificationTiming: 'only-when-asked'
      });
      
      expect(updated.layoutMode).toBe('list');
      expect(updated.notificationTiming).toBe('only-when-asked');
    });
  });
});
