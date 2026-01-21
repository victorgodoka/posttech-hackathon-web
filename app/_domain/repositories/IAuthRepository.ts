export interface IAuthRepository {
  saveSession(userId: string): Promise<void>;
  getSession(): Promise<string | null>;
  clearSession(): Promise<void>;
}
