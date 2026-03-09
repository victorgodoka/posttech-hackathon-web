export class Email {
  private constructor(private readonly value: string) {}

  static create(email: string): Email {
    const normalized = email.toLowerCase().trim();
    if (!Email.isValid(normalized)) {
      throw new Error('Email inválido');
    }
    return new Email(normalized);
  }

  private static isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }
}
