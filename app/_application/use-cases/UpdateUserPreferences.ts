import { IPreferencesRepository } from '@/app/_domain/repositories/IPreferencesRepository';
import { UserPreferences, LayoutMode, CustomColumn, VisualComplexity, InformationDensity, TextSize, NotificationTiming, TaskCreationMode, PomodoroSettings } from '@/app/_domain/entities/UserPreferences';

export interface UpdatePreferencesDTO {
  layoutMode?: LayoutMode;
  customColumns?: CustomColumn[];
  allowExtraCustomColumns?: boolean;
  overloadBehavior?: 'warn-only' | 'suggest-move' | 'no-warning';
  visualComplexity?: VisualComplexity;
  informationDensity?: InformationDensity;
  textSize?: TextSize;
  notificationTiming?: NotificationTiming;
  taskCreationMode?: TaskCreationMode;
  pomodoroSettings?: PomodoroSettings;
}

export class UpdateUserPreferences {
  constructor(private preferencesRepository: IPreferencesRepository) {}

  async execute(userId: string, updates: UpdatePreferencesDTO): Promise<UserPreferences> {
    let preferences = await this.preferencesRepository.findByUserId(userId);
    
    if (!preferences) {
      preferences = UserPreferences.createDefault(userId);
    }

    if (updates.layoutMode !== undefined) {
      preferences.updateLayoutMode(updates.layoutMode);
    }

    if (updates.customColumns !== undefined) {
      preferences.reorderCustomColumns(updates.customColumns);
    }

    if (updates.allowExtraCustomColumns !== undefined) {
      preferences.updateAllowExtraCustomColumns(updates.allowExtraCustomColumns);
    }

    if (updates.overloadBehavior !== undefined) {
      preferences.updateOverloadBehavior(updates.overloadBehavior);
    }

    if (updates.visualComplexity !== undefined) {
      preferences.updateVisualComplexity(updates.visualComplexity);
    }

    if (updates.informationDensity !== undefined) {
      preferences.updateInformationDensity(updates.informationDensity);
    }

    if (updates.textSize !== undefined) {
      preferences.updateTextSize(updates.textSize);
    }

    if (updates.notificationTiming !== undefined) {
      preferences.updateNotificationTiming(updates.notificationTiming);
    }

    if (updates.taskCreationMode !== undefined) {
      preferences.updateTaskCreationMode(updates.taskCreationMode);
    }

    if (updates.pomodoroSettings !== undefined) {
      preferences.updatePomodoroSettings(
        updates.pomodoroSettings.workDuration,
        updates.pomodoroSettings.breakDuration
      );
    }

    await this.preferencesRepository.save(preferences);
    return preferences;
  }
}
