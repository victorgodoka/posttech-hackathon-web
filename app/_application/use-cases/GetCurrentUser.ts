import { User } from '@/app/_domain/entities/User';
import { IUserRepository } from '@/app/_domain/repositories/IUserRepository';
import { IAuthRepository } from '@/app/_domain/repositories/IAuthRepository';

const GUEST_USER_ID = 'guest-user';

export class GetCurrentUser {
  constructor(
    private userRepository: IUserRepository,
    private authRepository: IAuthRepository
  ) {}

  async execute(): Promise<User | null> {
    const userId = await this.authRepository.getSession();
    
    if (!userId) {
      return null;
    }

    // Se for guest, retornar null mas a sessão existe
    if (userId === GUEST_USER_ID) {
      return null;
    }

    return await this.userRepository.findById(userId);
  }
}
