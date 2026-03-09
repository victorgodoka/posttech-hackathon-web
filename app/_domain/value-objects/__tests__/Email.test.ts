import { Email } from '../Email';

describe('Email Value Object', () => {
  describe('create', () => {
    it('should create email with valid format', () => {
      const email = Email.create('test@example.com');

      expect(email.getValue()).toBe('test@example.com');
    });

    it('should normalize email to lowercase', () => {
      const email = Email.create('Test@Example.COM');

      expect(email.getValue()).toBe('test@example.com');
    });

    it('should trim whitespace', () => {
      const email = Email.create('  test@example.com  ');

      expect(email.getValue()).toBe('test@example.com');
    });

    it('should throw error for invalid email format', () => {
      expect(() => Email.create('invalid-email')).toThrow('Email inválido');
      expect(() => Email.create('test@')).toThrow('Email inválido');
      expect(() => Email.create('@example.com')).toThrow('Email inválido');
      expect(() => Email.create('test@example')).toThrow('Email inválido');
      expect(() => Email.create('')).toThrow('Email inválido');
    });

    it('should accept valid email formats', () => {
      expect(() => Email.create('user@domain.com')).not.toThrow();
      expect(() => Email.create('user.name@domain.com')).not.toThrow();
      expect(() => Email.create('user+tag@domain.co.uk')).not.toThrow();
      expect(() => Email.create('user_name@sub.domain.com')).not.toThrow();
    });
  });

  describe('getValue', () => {
    it('should return the email value', () => {
      const email = Email.create('test@example.com');

      expect(email.getValue()).toBe('test@example.com');
    });
  });

  describe('equals', () => {
    it('should return true for equal emails', () => {
      const email1 = Email.create('test@example.com');
      const email2 = Email.create('test@example.com');

      expect(email1.equals(email2)).toBe(true);
    });

    it('should return true for emails with different casing', () => {
      const email1 = Email.create('Test@Example.com');
      const email2 = Email.create('test@example.com');

      expect(email1.equals(email2)).toBe(true);
    });

    it('should return false for different emails', () => {
      const email1 = Email.create('test1@example.com');
      const email2 = Email.create('test2@example.com');

      expect(email1.equals(email2)).toBe(false);
    });
  });
});
