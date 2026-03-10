import { IPreferencesRepository } from '@/app/_domain/repositories/IPreferencesRepository';
import { UserPreferences } from '@/app/_domain/entities/UserPreferences';

export class GetUserPreferences {
  constructor(private preferencesRepository: IPreferencesRepository) {}

  async execute(userId: string): Promise<UserPreferences> {
    const preferences = await this.preferencesRepository.findByUserId(userId);
    
    if (!preferences) {
      const defaultPreferences = UserPreferences.createDefault(userId);
      
      // Tentar salvar as preferências padrão
      // Se falhar (ex: usuário não autenticado no Firebase), apenas retornar as preferências padrão
      try {
        await this.preferencesRepository.save(defaultPreferences);
      } catch (error) {
        console.warn('Não foi possível salvar preferências padrão:', error);
      }
      
      return defaultPreferences;
    }

    return preferences;
  }
}
