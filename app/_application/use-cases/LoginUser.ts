import { User } from '@/app/_domain/entities/User';
import { Email } from '@/app/_domain/value-objects/Email';
import { Password } from '@/app/_domain/value-objects/Password';
import { IUserRepository } from '@/app/_domain/repositories/IUserRepository';
import { IAuthRepository } from '@/app/_domain/repositories/IAuthRepository';
import { AuthRepositoryFirebase } from '@/app/_infrastructure/persistence/firebase/AuthRepositoryFirebase';

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
    
    // Se estiver usando Firebase, usar Firebase Auth
    if (this.authRepository instanceof AuthRepositoryFirebase) {
      const userId = await this.authRepository.login(data.email, data.password);
      
      // Buscar ou criar usuário no Firestore
      let user = await this.userRepository.findById(userId);
      if (!user) {
        // Criar usuário se não existir (caso de login após registro via Firebase Auth)
        user = User.fromPersistence({
          id: userId,
          email: email,
          name: data.email.split('@')[0],
          hashedPassword: '',
          createdAt: new Date(),
        });
        await this.userRepository.save(user);
      }
      
      await this.authRepository.saveSession(userId);
      return user;
    }
    
    // Fluxo original para IndexedDB
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
