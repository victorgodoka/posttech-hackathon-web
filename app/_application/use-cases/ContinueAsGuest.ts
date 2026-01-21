import { IAuthRepository } from '@/app/_domain/repositories/IAuthRepository';

const GUEST_USER_ID = 'guest-user';

export class ContinueAsGuest {
  constructor(private authRepository: IAuthRepository) {}

  async execute(): Promise<void> {
    await this.authRepository.saveSession(GUEST_USER_ID);
  }
}
