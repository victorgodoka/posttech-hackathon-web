import { IPreferencesRepository } from '@/app/_domain/repositories/IPreferencesRepository';
import { UserPreferences, LayoutMode, CustomColumn, VisualComplexity, InformationDensity, TextSize, NotificationTiming } from '@/app/_domain/entities/UserPreferences';

export interface UpdatePreferencesDTO {
  layoutMode?: LayoutMode;
  customColumns?: CustomColumn[];
  overloadBehavior?: 'warn-only' | 'suggest-move' | 'no-warning';
  visualComplexity?: VisualComplexity;
  informationDensity?: InformationDensity;
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

    if (updates.layoutMode !== undefined) {
      preferences.updateLayoutMode(updates.layoutMode);
    }

    if (updates.customColumns !== undefined) {
      preferences.reorderCustomColumns(updates.customColumns);
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

    await this.preferencesRepository.save(preferences);
    return preferences;
  }
}
