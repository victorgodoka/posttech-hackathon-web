import { IAuthRepository } from '@/app/_domain/repositories/IAuthRepository';

export class LogoutUser {
  constructor(private authRepository: IAuthRepository) {}

  async execute(): Promise<void> {
    await this.authRepository.clearSession();
  }
}
