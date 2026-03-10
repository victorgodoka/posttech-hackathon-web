import { IUserRepository } from '@/app/_domain/repositories/IUserRepository';
import { User } from '@/app/_domain/entities/User';
import { Email } from '@/app/_domain/value-objects/Email';
import { AuthRepositoryFirebase } from '@/app/_infrastructure/persistence/firebase/AuthRepositoryFirebase';

export class LoginWithGoogle {
  constructor(
    private userRepository: IUserRepository,
    private authRepository: AuthRepositoryFirebase
  ) {}

  async execute(): Promise<User> {
    const result = await this.authRepository.loginWithGoogle();
    
    // Buscar usuário pelo ID (mais eficiente e evita problemas de permissão com queries)
    let user = await this.userRepository.findById(result.userId);
    
    // Se usuário não existe, criar registro
    if (!user) {
      const email = Email.create(result.email);
      user = User.fromPersistence({
        id: result.userId,
        email: email,
        name: result.name || 'Usuário',
        hashedPassword: '', // Sem senha para login social
        createdAt: new Date(),
      });
      await this.userRepository.save(user);
    }
    
    // Salvar sessão
    await this.authRepository.saveSession(result.userId);
    
    return user;
  }
}
