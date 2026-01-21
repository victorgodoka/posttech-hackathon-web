import { IUserRepository } from '@/app/_domain/repositories/IUserRepository';
import { User } from '@/app/_domain/entities/User';
import { Email } from '@/app/_domain/value-objects/Email';
import { getDB } from './db';

export class UserRepositoryIDB implements IUserRepository {
  async save(user: User): Promise<void> {
    const db = await getDB();
    await db.put('users', user.toJSON());
  }

  async findByEmail(email: Email): Promise<User | null> {
    const db = await getDB();
    const userData = await db.getFromIndex('users', 'by-email', email.getValue());
    
    if (!userData) {
      return null;
    }

    return User.fromJSON(userData);
  }

  async findById(id: string): Promise<User | null> {
    const db = await getDB();
    const userData = await db.get('users', id);
    
    if (!userData) {
      return null;
    }

    return User.fromJSON(userData);
  }

  async delete(id: string): Promise<void> {
    const db = await getDB();
    await db.delete('users', id);
  }
}
