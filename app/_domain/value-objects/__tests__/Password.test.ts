import { Password } from '../Password';

describe('Password Value Object', () => {
  describe('create', () => {
    it('should create password with valid length', () => {
      const password = Password.create('password123');

      expect(password.getValue()).toBe('password123');
    });

    it('should accept minimum length password', () => {
      const password = Password.create('123456');

      expect(password.getValue()).toBe('123456');
    });

    it('should throw error for password too short', () => {
      expect(() => Password.create('12345')).toThrow('Senha deve ter no mínimo 6 caracteres');
      expect(() => Password.create('abc')).toThrow('Senha deve ter no mínimo 6 caracteres');
      expect(() => Password.create('')).toThrow('Senha deve ter no mínimo 6 caracteres');
    });

    it('should accept long passwords', () => {
      const longPassword = 'a'.repeat(100);
      const password = Password.create(longPassword);

      expect(password.getValue()).toBe(longPassword);
    });
  });

  describe('getValue', () => {
    it('should return the password value', () => {
      const password = Password.create('mypassword');

      expect(password.getValue()).toBe('mypassword');
    });
  });

  describe('hash', () => {
    it('should hash the password', async () => {
      const password = Password.create('mypassword');

      const hashed = await password.hash();

      expect(hashed).toBeDefined();
      expect(typeof hashed).toBe('string');
      expect(hashed.length).toBeGreaterThan(0);
      expect(hashed).not.toBe('mypassword');
    });

    it('should generate consistent hash for same password', async () => {
      const password = Password.create('mypassword');

      const hash1 = await password.hash();
      const hash2 = await password.hash();

      expect(hash1).toBe(hash2);
    });

    it('should generate different hashes for different passwords', async () => {
      const password1 = Password.create('password1');
      const password2 = Password.create('password2');

      const hash1 = await password1.hash();
      const hash2 = await password2.hash();

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('compare', () => {
    it('should return true for matching password', async () => {
      const password = Password.create('mypassword');
      const hashed = await password.hash();

      const isMatch = await password.compare(hashed);

      expect(isMatch).toBe(true);
    });

    it('should return false for non-matching password', async () => {
      const password1 = Password.create('password1');
      const password2 = Password.create('password2');
      const hashed = await password1.hash();

      const isMatch = await password2.compare(hashed);

      expect(isMatch).toBe(false);
    });

    it('should return false for invalid hash', async () => {
      const password = Password.create('mypassword');

      const isMatch = await password.compare('invalid-hash');

      expect(isMatch).toBe(false);
    });
  });
});
