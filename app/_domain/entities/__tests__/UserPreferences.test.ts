import { UserPreferences } from '../UserPreferences';

describe('UserPreferences Entity', () => {
  describe('createDefault', () => {
    it('should create default preferences', () => {
      const prefs = UserPreferences.createDefault('user-1');

      expect(prefs.userId).toBe('user-1');
      expect(prefs.layoutMode).toBe('list');
      expect(prefs.visualComplexity).toBe('balanced');
      expect(prefs.informationDensity).toBe('complete');
      expect(prefs.textSize).toBe('medium');
      expect(prefs.notificationTiming).toBe('only-when-asked');
      expect(prefs.taskCreationMode).toBe('simple');
      expect(prefs.pomodoroSettings).toEqual({
        workDuration: 25,
        breakDuration: 5,
      });
      expect(prefs.customColumns).toEqual([]);
    });
  });

  describe('layout mode', () => {
    it('should update layout mode', () => {
      const prefs = UserPreferences.createDefault('user-1');

      prefs.updateLayoutMode('complete');
      expect(prefs.layoutMode).toBe('complete');

      prefs.updateLayoutMode('custom');
      expect(prefs.layoutMode).toBe('custom');
    });
  });

  describe('custom columns', () => {
    it('should add custom column', () => {
      const prefs = UserPreferences.createDefault('user-1');

      prefs.addCustomColumn('In Progress');
      expect(prefs.customColumns).toHaveLength(1);
      expect(prefs.customColumns[0].name).toBe('In Progress');
      expect(prefs.customColumns[0].order).toBe(0);
    });

    it('should add column after specific column', () => {
      const prefs = UserPreferences.createDefault('user-1');
      prefs.addCustomColumn('Column 1');
      const firstColumnId = prefs.customColumns[0].id;

      prefs.addCustomColumn('Column 2', firstColumnId);
      expect(prefs.customColumns).toHaveLength(2);
      expect(prefs.customColumns[0].name).toBe('Column 1');
      expect(prefs.customColumns[1].name).toBe('Column 2');
      expect(prefs.customColumns[1].order).toBe(1);
    });

    it('should update custom column name', () => {
      const prefs = UserPreferences.createDefault('user-1');
      prefs.addCustomColumn('Old Name');
      const columnId = prefs.customColumns[0].id;

      prefs.updateCustomColumn(columnId, 'New Name');
      expect(prefs.customColumns[0].name).toBe('New Name');
    });

    it('should remove custom column', () => {
      const prefs = UserPreferences.createDefault('user-1');
      prefs.addCustomColumn('Column 1');
      prefs.addCustomColumn('Column 2');
      const columnId = prefs.customColumns[0].id;

      prefs.removeCustomColumn(columnId);
      expect(prefs.customColumns).toHaveLength(1);
      expect(prefs.customColumns[0].name).toBe('Column 2');
    });
  });

  describe('cognitive preferences', () => {
    it('should update visual complexity', () => {
      const prefs = UserPreferences.createDefault('user-1');

      prefs.updateVisualComplexity('minimal');
      expect(prefs.visualComplexity).toBe('minimal');
    });

    it('should update information density', () => {
      const prefs = UserPreferences.createDefault('user-1');

      prefs.updateInformationDensity('essential');
      expect(prefs.informationDensity).toBe('essential');
    });

    it('should update text size', () => {
      const prefs = UserPreferences.createDefault('user-1');

      prefs.updateTextSize('large');
      expect(prefs.textSize).toBe('large');
    });

    it('should update notification timing', () => {
      const prefs = UserPreferences.createDefault('user-1');

      prefs.updateNotificationTiming('focus-ends');
      expect(prefs.notificationTiming).toBe('focus-ends');
    });

    it('should update task creation mode', () => {
      const prefs = UserPreferences.createDefault('user-1');

      prefs.updateTaskCreationMode('full');
      expect(prefs.taskCreationMode).toBe('full');
    });
  });

  describe('pomodoro settings', () => {
    it('should update pomodoro settings', () => {
      const prefs = UserPreferences.createDefault('user-1');

      prefs.updatePomodoroSettings(30, 10);
      expect(prefs.pomodoroSettings).toEqual({
        workDuration: 30,
        breakDuration: 10,
      });
    });
  });

  describe('JSON serialization', () => {
    it('should serialize to JSON', () => {
      const prefs = UserPreferences.createDefault('user-1');
      prefs.addCustomColumn('Column 1');
      prefs.updatePomodoroSettings(30, 10);

      const json = prefs.toJSON();

      expect(json.userId).toBe('user-1');
      expect(json.layoutMode).toBe('list');
      expect(json.customColumns).toHaveLength(1);
      expect(json.pomodoroSettings).toEqual({
        workDuration: 30,
        breakDuration: 10,
      });
      expect(typeof json.updatedAt).toBe('string');
    });

    it('should deserialize from JSON', () => {
      const json = {
        userId: 'user-1',
        layoutMode: 'complete',
        customColumns: [{ id: 'col-1', name: 'Column 1', order: 0 }],
        visualComplexity: 'minimal',
        pomodoroSettings: { workDuration: 30, breakDuration: 10 },
        updatedAt: new Date().toISOString(),
      };

      const prefs = UserPreferences.fromJSON(json);

      expect(prefs.userId).toBe('user-1');
      expect(prefs.layoutMode).toBe('complete');
      expect(prefs.customColumns).toHaveLength(1);
      expect(prefs.visualComplexity).toBe('minimal');
      expect(prefs.pomodoroSettings).toEqual({
        workDuration: 30,
        breakDuration: 10,
      });
    });

    it('should use defaults for missing fields', () => {
      const json = {
        userId: 'user-1',
        updatedAt: new Date().toISOString(),
      };

      const prefs = UserPreferences.fromJSON(json);

      expect(prefs.layoutMode).toBe('list');
      expect(prefs.visualComplexity).toBe('balanced');
      expect(prefs.pomodoroSettings).toEqual({
        workDuration: 25,
        breakDuration: 5,
      });
    });
  });
});
