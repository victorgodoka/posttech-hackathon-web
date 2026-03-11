import { IAuthRepository } from '@/app/_domain/repositories/IAuthRepository';

const GUEST_USER_ID = 'guest-user';

export class ContinueAsGuest {
  constructor(private authRepository: IAuthRepository) {}

  async execute(): Promise<void> {
    console.log('🎭 ContinueAsGuest: Iniciando...');
    await this.authRepository.saveSession(GUEST_USER_ID);
    console.log('🎭 ContinueAsGuest: Sessão salva no repositório');
    
    // Marcar modo guest no localStorage para o container usar IndexedDB
    if (typeof window !== 'undefined') {
      localStorage.setItem('guest-mode', 'true');
      console.log('🎭 ContinueAsGuest: Flag guest-mode salva no localStorage');
    }
    console.log('🎭 ContinueAsGuest: Concluído');
  }
}
