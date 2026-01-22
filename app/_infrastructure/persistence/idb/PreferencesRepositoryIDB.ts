import { IPreferencesRepository } from '@/app/_domain/repositories/IPreferencesRepository';
import { UserPreferences } from '@/app/_domain/entities/UserPreferences';
import { getDB } from './db';

export class PreferencesRepositoryIDB implements IPreferencesRepository {
  async findByUserId(userId: string): Promise<UserPreferences | null> {
    const db = await getDB();
    const data = await db.get('preferences', userId);
    
    if (!data) {
      return null;
    }

    return UserPreferences.fromJSON(data);
  }

  async save(preferences: UserPreferences): Promise<void> {
    const db = await getDB();
    await db.put('preferences', preferences.toJSON());
  }
}
