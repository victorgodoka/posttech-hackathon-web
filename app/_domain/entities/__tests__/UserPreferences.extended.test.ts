import { UserPreferences } from '../UserPreferences';

describe('UserPreferences Entity - Extended Coverage', () => {
  describe('updateAllowExtraCustomColumns', () => {
    it('should update allow extra custom columns', () => {
      const prefs = UserPreferences.createDefault('user-1');
      
      prefs.updateAllowExtraCustomColumns(true);
      
      expect(prefs.allowExtraCustomColumns).toBe(true);
    });

    it('should toggle allow extra custom columns', () => {
      const prefs = UserPreferences.createDefault('user-1');
      
      prefs.updateAllowExtraCustomColumns(true);
      expect(prefs.allowExtraCustomColumns).toBe(true);
      
      prefs.updateAllowExtraCustomColumns(false);
      expect(prefs.allowExtraCustomColumns).toBe(false);
    });
  });

  describe('updateOverloadBehavior', () => {
    it('should update overload behavior to warn-only', () => {
      const prefs = UserPreferences.createDefault('user-1');
      
      prefs.updateOverloadBehavior('warn-only');
      
      expect(prefs.overloadBehavior).toBe('warn-only');
    });

    it('should update overload behavior to suggest-move', () => {
      const prefs = UserPreferences.createDefault('user-1');
      
      prefs.updateOverloadBehavior('suggest-move');
      
      expect(prefs.overloadBehavior).toBe('suggest-move');
    });

    it('should update overload behavior to no-warning', () => {
      const prefs = UserPreferences.createDefault('user-1');
      
      prefs.updateOverloadBehavior('no-warning');
      
      expect(prefs.overloadBehavior).toBe('no-warning');
    });
  });

  describe('updateNotificationTiming', () => {
    it('should update notification timing to focus-ends', () => {
      const prefs = UserPreferences.createDefault('user-1');
      
      prefs.updateNotificationTiming('focus-ends');
      
      expect(prefs.notificationTiming).toBe('focus-ends');
    });

    it('should update notification timing to long-breaks', () => {
      const prefs = UserPreferences.createDefault('user-1');
      
      prefs.updateNotificationTiming('long-breaks');
      
      expect(prefs.notificationTiming).toBe('long-breaks');
    });

    it('should update notification timing to only-when-asked', () => {
      const prefs = UserPreferences.createDefault('user-1');
      
      prefs.updateNotificationTiming('only-when-asked');
      
      expect(prefs.notificationTiming).toBe('only-when-asked');
    });
  });

  describe('updateTaskCreationMode', () => {
    it('should update task creation mode to simple', () => {
      const prefs = UserPreferences.createDefault('user-1');
      
      prefs.updateTaskCreationMode('simple');
      
      expect(prefs.taskCreationMode).toBe('simple');
    });

    it('should update task creation mode to full', () => {
      const prefs = UserPreferences.createDefault('user-1');
      
      prefs.updateTaskCreationMode('full');
      
      expect(prefs.taskCreationMode).toBe('full');
    });
  });

  describe('fromPersistence', () => {
    it('should restore preferences from persistence', () => {
      const now = new Date();
      const prefs = UserPreferences.fromPersistence({
        userId: 'user-1',
        layoutMode: 'custom',
        customColumns: [],
        allowExtraCustomColumns: true,
        overloadBehavior: 'suggest-move',
        visualComplexity: 'minimal',
        informationDensity: 'complete',
        textSize: 'large',
        notificationTiming: 'long-breaks',
        taskCreationMode: 'full',
        pomodoroSettings: {
          workDuration: 30,
          breakDuration: 10,
        },
        updatedAt: now,
      });
      
      expect(prefs.userId).toBe('user-1');
      expect(prefs.layoutMode).toBe('kanban');
      expect(prefs.allowExtraCustomColumns).toBe(true);
      expect(prefs.overloadBehavior).toBe('suggest-move');
      expect(prefs.visualComplexity).toBe('minimal');
      expect(prefs.informationDensity).toBe('summary');
      expect(prefs.textSize).toBe('large');
      expect(prefs.notificationTiming).toBe('delayed');
      expect(prefs.taskCreationMode).toBe('complete');
      expect(prefs.pomodoroSettings.workDuration).toBe(30);
      expect(prefs.pomodoroSettings.breakDuration).toBe(10);
      expect(prefs.updatedAt).toBe(now);
    });
  });

  describe('edge cases', () => {
    it('should handle multiple custom columns operations', () => {
      const prefs = UserPreferences.createDefault('user-1');
      
      prefs.addCustomColumn('Column 1');
      prefs.addCustomColumn('Column 2');
      prefs.addCustomColumn('Column 3');
      
      expect(prefs.customColumns).toHaveLength(3);
      
      const col2Id = prefs.customColumns[1].id;
      prefs.removeCustomColumn(col2Id);
      
      expect(prefs.customColumns).toHaveLength(2);
      expect(prefs.customColumns[0].name).toBe('Column 1');
      expect(prefs.customColumns[1].name).toBe('Column 3');
    });

    it('should maintain column order after reorder', () => {
      const prefs = UserPreferences.createDefault('user-1');
      
      prefs.addCustomColumn('A');
      prefs.addCustomColumn('B');
      prefs.addCustomColumn('C');
      
      const columns = [...prefs.customColumns];
      const reordered = [columns[2], columns[0], columns[1]];
      
      prefs.reorderCustomColumns(reordered);
      
      expect(prefs.customColumns[0].name).toBe('C');
      expect(prefs.customColumns[1].name).toBe('A');
      expect(prefs.customColumns[2].name).toBe('B');
    });

    it('should serialize and deserialize correctly', () => {
      const prefs = UserPreferences.createDefault('user-1');
      prefs.updateLayoutMode('custom');
      prefs.addCustomColumn('Custom 1');
      prefs.updateVisualComplexity('minimal');
      prefs.updatePomodoroSettings(30, 10);
      
      const json = prefs.toJSON();
      const restored = UserPreferences.fromJSON(json);
      
      expect(restored.userId).toBe('user-1');
      expect(restored.layoutMode).toBe('custom');
      expect(restored.customColumns).toHaveLength(1);
      expect(restored.customColumns[0].name).toBe('Custom 1');
      expect(restored.visualComplexity).toBe('minimal');
      expect(restored.pomodoroSettings.workDuration).toBe(30);
      expect(restored.pomodoroSettings.breakDuration).toBe(10);
    });
  });
});
