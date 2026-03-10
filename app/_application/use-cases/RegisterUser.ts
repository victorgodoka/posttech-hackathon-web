import { User } from '@/app/_domain/entities/User';
import { Email } from '@/app/_domain/value-objects/Email';
import { Password } from '@/app/_domain/value-objects/Password';
import { IUserRepository } from '@/app/_domain/repositories/IUserRepository';
import { UserRepositoryFirebase } from '@/app/_infrastructure/persistence/firebase/UserRepositoryFirebase';
import { AuthRepositoryFirebase } from '@/app/_infrastructure/persistence/firebase/AuthRepositoryFirebase';

export interface RegisterUserDTO {
  email: string;
  name: string;
  password: string;
}

export class RegisterUser {
  constructor(
    private userRepository: IUserRepository,
    private authRepository?: AuthRepositoryFirebase
  ) {}

  async execute(data: RegisterUserDTO): Promise<User> {
    const email = Email.create(data.email);
    
    // Se estiver usando Firebase, usar Firebase Auth
    if (this.userRepository instanceof UserRepositoryFirebase && this.authRepository) {
      const userId = await this.authRepository.register(data.email, data.password);
      
      const user = User.fromPersistence({
        id: userId,
        email: email,
        name: data.name,
        hashedPassword: '',
        createdAt: new Date(),
      });
      
      await this.userRepository.save(user);
      return user;
    }
    
    // Fluxo original para IndexedDB
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('Email já cadastrado');
    }

    const password = Password.create(data.password);
    const hashedPassword = await password.hash();

    const user = User.create({
      email,
      name: data.name,
      hashedPassword,
    });

    await this.userRepository.save(user);

    return user;
  }
}
