import { LoginUser } from '../LoginUser';
import { RegisterUser } from '../RegisterUser';
import { GetCurrentUser } from '../GetCurrentUser';
import { LogoutUser } from '../LogoutUser';
import { ContinueAsGuest } from '../ContinueAsGuest';
import { IUserRepository } from '../../../_domain/repositories/IUserRepository';
import { IAuthRepository } from '../../../_domain/repositories/IAuthRepository';
import { User } from '../../../_domain/entities/User';
import { Email } from '../../../_domain/value-objects/Email';

describe('Auth Use Cases', () => {
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let mockAuthRepository: jest.Mocked<IAuthRepository>;

  beforeEach(() => {
    mockUserRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    mockAuthRepository = {
      saveSession: jest.fn(),
      getSession: jest.fn(),
      clearSession: jest.fn(),
    };
  });

  describe('LoginUser', () => {
    let loginUser: LoginUser;

    beforeEach(() => {
      loginUser = new LoginUser(mockUserRepository, mockAuthRepository);
    });

    it('should login user with valid credentials', async () => {
      const email = Email.create('test@example.com');
      const password = 'password123';
      const hashedPassword = '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92'; // SHA-256 hash of '123456'
      
      const mockUser = User.create({
        email,
        name: 'Test User',
        hashedPassword,
      });

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);

      const result = await loginUser.execute({
        email: 'test@example.com',
        password: '123456', // matches the hash above
      });

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(expect.any(Email));
      expect(mockAuthRepository.saveSession).toHaveBeenCalledWith(mockUser.id);
      expect(result).toBe(mockUser);
    });

    it('should throw error if user not found', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(
        loginUser.execute({
          email: 'nonexistent@example.com',
          password: 'password123',
        })
      ).rejects.toThrow('Credenciais inválidas');
    });

    it('should throw error if password is invalid', async () => {
      const email = Email.create('test@example.com');
      const mockUser = User.create({
        email,
        name: 'Test User',
        hashedPassword: 'wrong-hash',
      });

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);

      await expect(
        loginUser.execute({
          email: 'test@example.com',
          password: 'wrongpassword',
        })
      ).rejects.toThrow('Credenciais inválidas');
    });

    it('should throw error for invalid email format', async () => {
      await expect(
        loginUser.execute({
          email: 'invalid-email',
          password: 'password123',
        })
      ).rejects.toThrow('Email inválido');
    });
  });

  describe('RegisterUser', () => {
    let registerUser: RegisterUser;

    beforeEach(() => {
      registerUser = new RegisterUser(mockUserRepository);
    });

    it('should register new user', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);

      const result = await registerUser.execute({
        email: 'newuser@example.com',
        name: 'New User',
        password: 'password123',
      });

      expect(mockUserRepository.findByEmail).toHaveBeenCalled();
      expect(mockUserRepository.save).toHaveBeenCalledWith(expect.any(User));
      expect(result).toBeInstanceOf(User);
      expect(result.email.getValue()).toBe('newuser@example.com');
      expect(result.name).toBe('New User');
    });

    it('should throw error if email already exists', async () => {
      const email = Email.create('existing@example.com');
      const existingUser = User.create({
        email,
        name: 'Existing User',
        hashedPassword: 'hash',
      });

      mockUserRepository.findByEmail.mockResolvedValue(existingUser);

      await expect(
        registerUser.execute({
          email: 'existing@example.com',
          name: 'New User',
          password: 'password123',
        })
      ).rejects.toThrow('Email já cadastrado');
    });

    it('should throw error for invalid email format', async () => {
      await expect(
        registerUser.execute({
          email: 'invalid-email',
          name: 'User',
          password: 'password123',
        })
      ).rejects.toThrow('Email inválido');
    });

    it('should throw error for short password', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(
        registerUser.execute({
          email: 'user@example.com',
          name: 'User',
          password: '123',
        })
      ).rejects.toThrow('Senha deve ter no mínimo 6 caracteres');
    });

    it('should hash password before saving', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);

      const result = await registerUser.execute({
        email: 'user@example.com',
        name: 'User',
        password: 'password123',
      });

      expect(result.hashedPassword).not.toBe('password123');
      expect(result.hashedPassword.length).toBeGreaterThan(0);
    });
  });

  describe('GetCurrentUser', () => {
    let getCurrentUser: GetCurrentUser;

    beforeEach(() => {
      getCurrentUser = new GetCurrentUser(mockUserRepository, mockAuthRepository);
    });

    it('should return user if session exists', async () => {
      const email = Email.create('test@example.com');
      const mockUser = User.create({
        email,
        name: 'Test User',
        hashedPassword: 'hash',
      });

      mockAuthRepository.getSession.mockResolvedValue(mockUser.id);
      mockUserRepository.findById.mockResolvedValue(mockUser);

      const result = await getCurrentUser.execute();

      expect(mockAuthRepository.getSession).toHaveBeenCalled();
      expect(mockUserRepository.findById).toHaveBeenCalledWith(mockUser.id);
      expect(result).toBe(mockUser);
    });

    it('should return null if no session', async () => {
      mockAuthRepository.getSession.mockResolvedValue(null);

      const result = await getCurrentUser.execute();

      expect(result).toBeNull();
      expect(mockUserRepository.findById).not.toHaveBeenCalled();
    });

    it('should return null for guest user', async () => {
      mockAuthRepository.getSession.mockResolvedValue('guest-user');

      const result = await getCurrentUser.execute();

      expect(result).toBeNull();
      expect(mockUserRepository.findById).not.toHaveBeenCalled();
    });

    it('should return user from repository', async () => {
      const userId = 'user-123';
      const email = Email.create('test@example.com');
      const mockUser = User.create({
        email,
        name: 'Test User',
        hashedPassword: 'hash',
      });

      mockAuthRepository.getSession.mockResolvedValue(userId);
      mockUserRepository.findById.mockResolvedValue(mockUser);

      const result = await getCurrentUser.execute();

      expect(result).toBe(mockUser);
    });
  });

  describe('LogoutUser', () => {
    let logoutUser: LogoutUser;

    beforeEach(() => {
      logoutUser = new LogoutUser(mockAuthRepository);
    });

    it('should clear session', async () => {
      await logoutUser.execute();

      expect(mockAuthRepository.clearSession).toHaveBeenCalled();
      expect(mockAuthRepository.clearSession).toHaveBeenCalledTimes(1);
    });

    it('should handle errors from auth repository', async () => {
      mockAuthRepository.clearSession.mockRejectedValue(new Error('Auth error'));

      await expect(logoutUser.execute()).rejects.toThrow('Auth error');
    });
  });

  describe('ContinueAsGuest', () => {
    let continueAsGuest: ContinueAsGuest;

    beforeEach(() => {
      continueAsGuest = new ContinueAsGuest(mockAuthRepository);
    });

    it('should save guest session', async () => {
      await continueAsGuest.execute();

      expect(mockAuthRepository.saveSession).toHaveBeenCalledWith('guest-user');
      expect(mockAuthRepository.saveSession).toHaveBeenCalledTimes(1);
    });

    it('should handle errors from auth repository', async () => {
      mockAuthRepository.saveSession.mockRejectedValue(new Error('Auth error'));

      await expect(continueAsGuest.execute()).rejects.toThrow('Auth error');
    });
  });
});
