import { User } from '../User';
import { Email } from '../../value-objects/Email';

describe('User Entity', () => {
  describe('create', () => {
    it('should create a user with valid data', () => {
      const email = Email.create('test@example.com');
      const user = User.create({
        email,
        name: 'Test User',
        hashedPassword: 'hashed123',
      });

      expect(user.email).toBe(email);
      expect(user.name).toBe('Test User');
      expect(user.hashedPassword).toBe('hashed123');
      expect(user.id).toBeDefined();
      expect(user.createdAt).toBeInstanceOf(Date);
    });
  });

  describe('fromPersistence', () => {
    it('should create user from persistence data', () => {
      const email = Email.create('test@example.com');
      const createdAt = new Date('2024-01-01');
      
      const user = User.fromPersistence({
        id: 'user-123',
        email,
        name: 'Test User',
        hashedPassword: 'hashed123',
        createdAt,
      });

      expect(user.id).toBe('user-123');
      expect(user.email).toBe(email);
      expect(user.name).toBe('Test User');
      expect(user.createdAt).toBe(createdAt);
    });
  });

  describe('JSON serialization', () => {
    it('should serialize to JSON', () => {
      const email = Email.create('test@example.com');
      const user = User.create({
        email,
        name: 'Test User',
        hashedPassword: 'hashed123',
      });

      const json = user.toJSON();

      expect(json.email).toBe('test@example.com');
      expect(json.name).toBe('Test User');
      expect(json.hashedPassword).toBe('hashed123');
      expect(typeof json.id).toBe('string');
      expect(typeof json.createdAt).toBe('string');
    });

    it('should deserialize from JSON', () => {
      const json = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        hashedPassword: 'hashed123',
        createdAt: new Date().toISOString(),
      };

      const user = User.fromJSON(json);

      expect(user.id).toBe('user-123');
      expect(user.email.getValue()).toBe('test@example.com');
      expect(user.name).toBe('Test User');
      expect(user.hashedPassword).toBe('hashed123');
      expect(user.createdAt).toBeInstanceOf(Date);
    });
  });

  describe('getters', () => {
    it('should expose all properties via getters', () => {
      const email = Email.create('test@example.com');
      const user = User.create({
        email,
        name: 'Test User',
        hashedPassword: 'hashed123',
      });

      expect(user.id).toBeDefined();
      expect(user.email).toBe(email);
      expect(user.name).toBe('Test User');
      expect(user.hashedPassword).toBe('hashed123');
      expect(user.createdAt).toBeInstanceOf(Date);
    });
  });
});
