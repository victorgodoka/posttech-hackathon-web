import { IPreferencesRepository } from '@/app/_domain/repositories/IPreferencesRepository';
import { UserPreferences, FocusRhythm, VisualComplexity, TextSize, NotificationTiming } from '@/app/_domain/entities/UserPreferences';

export interface UpdatePreferencesDTO {
  focusRhythm?: FocusRhythm;
  maxTasksInFocus?: number;
  overloadBehavior?: 'warn-only' | 'suggest-move' | 'no-warning';
  visualComplexity?: VisualComplexity;
  textSize?: TextSize;
  notificationTiming?: NotificationTiming;
}

export class UpdateUserPreferences {
  constructor(private preferencesRepository: IPreferencesRepository) {}

  async execute(userId: string, updates: UpdatePreferencesDTO): Promise<UserPreferences> {
    let preferences = await this.preferencesRepository.findByUserId(userId);
    
    if (!preferences) {
      preferences = UserPreferences.createDefault(userId);
    }

    if (updates.focusRhythm !== undefined) {
      preferences.updateFocusRhythm(updates.focusRhythm);
    }

    if (updates.maxTasksInFocus !== undefined) {
      preferences.updateMaxTasksInFocus(updates.maxTasksInFocus);
    }

    if (updates.overloadBehavior !== undefined) {
      preferences.updateOverloadBehavior(updates.overloadBehavior);
    }

    if (updates.visualComplexity !== undefined) {
      preferences.updateVisualComplexity(updates.visualComplexity);
    }

    if (updates.textSize !== undefined) {
      preferences.updateTextSize(updates.textSize);
    }

    if (updates.notificationTiming !== undefined) {
      preferences.updateNotificationTiming(updates.notificationTiming);
    }

    await this.preferencesRepository.save(preferences);
    return preferences;
  }
}
