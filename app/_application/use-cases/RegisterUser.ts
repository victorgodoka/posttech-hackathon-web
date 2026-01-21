import { User } from '@/app/_domain/entities/User';
import { Email } from '@/app/_domain/value-objects/Email';
import { Password } from '@/app/_domain/value-objects/Password';
import { IUserRepository } from '@/app/_domain/repositories/IUserRepository';

export interface RegisterUserDTO {
  email: string;
  name: string;
  password: string;
}

export class RegisterUser {
  constructor(private userRepository: IUserRepository) {}

  async execute(data: RegisterUserDTO): Promise<User> {
    const email = Email.create(data.email);
    
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
