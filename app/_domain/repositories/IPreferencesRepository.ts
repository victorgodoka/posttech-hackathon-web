import { UserPreferences } from '../entities/UserPreferences';

export interface IPreferencesRepository {
  findByUserId(userId: string): Promise<UserPreferences | null>;
  save(preferences: UserPreferences): Promise<void>;
}
