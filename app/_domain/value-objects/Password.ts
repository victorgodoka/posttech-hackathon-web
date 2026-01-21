export class Password {
  private constructor(private readonly value: string) {}

  static create(password: string): Password {
    if (!Password.isValid(password)) {
      throw new Error('Senha deve ter no mínimo 6 caracteres');
    }
    return new Password(password);
  }

  private static isValid(password: string): boolean {
    return password.length >= 6;
  }

  getValue(): string {
    return this.value;
  }

  async hash(): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(this.value);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async compare(hashedPassword: string): Promise<boolean> {
    const currentHash = await this.hash();
    return currentHash === hashedPassword;
  }
}
