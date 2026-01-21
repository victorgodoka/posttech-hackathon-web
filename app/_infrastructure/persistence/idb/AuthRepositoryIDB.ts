import { IAuthRepository } from '@/app/_domain/repositories/IAuthRepository';
import { getDB } from './db';

const SESSION_KEY = 'current-user-id';

export class AuthRepositoryIDB implements IAuthRepository {
  async saveSession(userId: string): Promise<void> {
    const db = await getDB();
    await db.put('auth', { key: SESSION_KEY, value: userId });
  }

  async getSession(): Promise<string | null> {
    const db = await getDB();
    const session = await db.get('auth', SESSION_KEY);
    return session?.value ?? null;
  }

  async clearSession(): Promise<void> {
    const db = await getDB();
    await db.delete('auth', SESSION_KEY);
  }
}
