import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthService } from '../../src/services/auth.service';
import { UserRepository } from '../../src/repositories/user.repository';
import { generateTokens, verifyToken } from '../../src/utils/jwt';
import bcrypt from 'bcryptjs';

// Mock dependencies
vi.mock('../../src/repositories/user.repository');
vi.mock('../../src/utils/jwt');
vi.mock('../../src/utils/email');
vi.mock('bcryptjs');

describe('AuthService', () => {
  let authService: AuthService;
  let mockUserRepository: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUserRepository = {
      findByEmail: vi.fn(),
      create: vi.fn(),
      setVerificationToken: vi.fn(),
      verifyEmail: vi.fn(),
      setResetToken: vi.fn(),
      updatePassword: vi.fn(),
      findById: vi.fn(),
      findByVerificationToken: vi.fn(),
    };
    (UserRepository as any).mockImplementation(() => mockUserRepository);
    authService = new AuthService();
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'Test123!@#',
        name: 'John Doe',
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);
      (bcrypt.hash as any).mockResolvedValue('hashedPassword');
      mockUserRepository.create.mockResolvedValue({
        id: 'user-1',
        email: userData.email,
        name: userData.name,
      });
      (generateTokens as any).mockReturnValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });

      const result = await authService.register(userData);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(userData.email);
      expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 12);
      expect(mockUserRepository.create).toHaveBeenCalled();
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('message');
    });

    it('should throw error if user already exists', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'Test123!@#',
        name: 'John Doe',
      };

      mockUserRepository.findByEmail.mockResolvedValue({
        id: 'user-1',
        email: userData.email,
        provider: 'local',
      });

      await expect(authService.register(userData)).rejects.toThrow(
        'User already exists with this email'
      );
    });

    it('should throw error if user registered with Google', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'Test123!@#',
        name: 'John Doe',
      };

      mockUserRepository.findByEmail.mockResolvedValue({
        id: 'user-1',
        email: userData.email,
        provider: 'google',
      });

      await expect(authService.register(userData)).rejects.toThrow(
        'This email is already registered with Google'
      );
    });
  });

  describe('login', () => {
    it('should successfully login with valid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'Test123!@#',
      };

      const mockUser = {
        id: 'user-1',
        email: loginData.email,
        password: 'hashedPassword',
        isEmailVerified: true,
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as any).mockResolvedValue(true);
      (generateTokens as any).mockReturnValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });

      const result = await authService.login(loginData);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(loginData.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(loginData.password, mockUser.password);
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('should throw error if user not found', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'Test123!@#',
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(authService.login(loginData)).rejects.toThrow(
        'Invalid email or password'
      );
    });

    it('should throw error if password is invalid', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'Test123!@#',
      };

      const mockUser = {
        id: 'user-1',
        email: loginData.email,
        password: 'hashedPassword',
        isEmailVerified: true,
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as any).mockResolvedValue(false);

      await expect(authService.login(loginData)).rejects.toThrow(
        'Invalid email or password'
      );
    });

    it('should throw error if email not verified', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'Test123!@#',
      };

      const mockUser = {
        id: 'user-1',
        email: loginData.email,
        password: 'hashedPassword',
        isEmailVerified: false,
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as any).mockResolvedValue(true);

      await expect(authService.login(loginData)).rejects.toThrow(
        'Please verify your email before logging in'
      );
    });

    it('should throw error for OAuth user without password', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'Test123!@#',
      };

      const mockUser = {
        id: 'user-1',
        email: loginData.email,
        password: null,
        isEmailVerified: true,
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);

      await expect(authService.login(loginData)).rejects.toThrow(
        'This account uses OAuth login'
      );
    });
  });

  describe('verifyEmail', () => {
    it('should successfully verify email with valid token', async () => {
      const token = 'valid-token';
      const decodedToken = { userId: 'user-1', email: 'test@example.com' };

      (verifyToken as any).mockReturnValue(decodedToken);
      mockUserRepository.findByVerificationToken.mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
      });
      mockUserRepository.verifyEmail.mockResolvedValue(undefined);

      const result = await authService.verifyEmail(token);

      expect(verifyToken).toHaveBeenCalledWith(token);
      expect(mockUserRepository.verifyEmail).toHaveBeenCalledWith('user-1');
      expect(result).toEqual({ message: 'Email verified successfully' });
    });

    it('should throw error if token is invalid', async () => {
      const token = 'invalid-token';
      (verifyToken as any).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(authService.verifyEmail(token)).rejects.toThrow(
        'Invalid or expired verification token'
      );
    });

    it('should throw error if verification token not found', async () => {
      const token = 'valid-token';
      const decodedToken = { userId: 'user-1', email: 'test@example.com' };

      (verifyToken as any).mockReturnValue(decodedToken);
      mockUserRepository.findByVerificationToken.mockResolvedValue(null);

      await expect(authService.verifyEmail(token)).rejects.toThrow(
        'Invalid verification token'
      );
    });
  });

  describe('refreshToken', () => {
    it('should successfully refresh token', async () => {
      const refreshToken = 'valid-refresh-token';
      const decodedToken = { userId: 'user-1', email: 'test@example.com' };

      (verifyToken as any).mockReturnValue(decodedToken);
      mockUserRepository.findById.mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
      });
      (generateTokens as any).mockReturnValue({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      });

      const result = await authService.refreshToken(refreshToken);

      expect(verifyToken).toHaveBeenCalledWith(refreshToken, true);
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('should throw error if refresh token is invalid', async () => {
      const refreshToken = 'invalid-refresh-token';
      (verifyToken as any).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(authService.refreshToken(refreshToken)).rejects.toThrow(
        'Invalid refresh token'
      );
    });

    it('should throw error if user not found', async () => {
      const refreshToken = 'valid-refresh-token';
      const decodedToken = { userId: 'user-1', email: 'test@example.com' };

      (verifyToken as any).mockReturnValue(decodedToken);
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(authService.refreshToken(refreshToken)).rejects.toThrow(
        'User not found'
      );
    });
  });

  describe('getProfile', () => {
    it('should successfully get user profile', async () => {
      const userId = 'user-1';
      const mockUser = {
        id: userId,
        email: 'test@example.com',
        name: 'John Doe',
      };

      mockUserRepository.findById.mockResolvedValue(mockUser);

      const result = await authService.getProfile(userId);

      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('email');
    });

    it('should throw error if user not found', async () => {
      const userId = 'user-1';
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(authService.getProfile(userId)).rejects.toThrow(
        'User not found'
      );
    });
  });
});
