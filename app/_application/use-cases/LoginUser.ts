import { User } from '@/app/_domain/entities/User';
import { Email } from '@/app/_domain/value-objects/Email';
import { Password } from '@/app/_domain/value-objects/Password';
import { IUserRepository } from '@/app/_domain/repositories/IUserRepository';
import { IAuthRepository } from '@/app/_domain/repositories/IAuthRepository';

export interface LoginUserDTO {
  email: string;
  password: string;
}

export class LoginUser {
  constructor(
    private userRepository: IUserRepository,
    private authRepository: IAuthRepository
  ) {}

  async execute(data: LoginUserDTO): Promise<User> {
    const email = Email.create(data.email);
    
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Credenciais inválidas');
    }

    const password = Password.create(data.password);
    const isPasswordValid = await password.compare(user.hashedPassword);
    
    if (!isPasswordValid) {
      throw new Error('Credenciais inválidas');
    }

    await this.authRepository.saveSession(user.id);

    return user;
  }
}
