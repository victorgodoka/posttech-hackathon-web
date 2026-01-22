import { IPreferencesRepository } from '@/app/_domain/repositories/IPreferencesRepository';
import { UserPreferences } from '@/app/_domain/entities/UserPreferences';

export class GetUserPreferences {
  constructor(private preferencesRepository: IPreferencesRepository) {}

  async execute(userId: string): Promise<UserPreferences> {
    const preferences = await this.preferencesRepository.findByUserId(userId);
    
    if (!preferences) {
      const defaultPreferences = UserPreferences.createDefault(userId);
      await this.preferencesRepository.save(defaultPreferences);
      return defaultPreferences;
    }

    return preferences;
  }
}
