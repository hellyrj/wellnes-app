import { describe, it, expect, beforeEach, vi } from 'vitest';
import { generateTokens, verifyToken } from '../../src/utils/jwt';

describe('JWT Utils', () => {
  beforeEach(() => {
    // Set test environment variables
    process.env.JWT_SECRET = 'test-secret-key';
    process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-key';
    process.env.JWT_EXPIRES_IN = '15m';
    process.env.JWT_REFRESH_EXPIRES_IN = '7d';
  });

  describe('generateTokens', () => {
    it('should generate access and refresh tokens', () => {
      const userId = 'user-123';
      const email = 'test@example.com';

      const tokens = generateTokens(userId, email);

      expect(tokens).toHaveProperty('accessToken');
      expect(tokens).toHaveProperty('refreshToken');
      expect(typeof tokens.accessToken).toBe('string');
      expect(typeof tokens.refreshToken).toBe('string');
      expect(tokens.accessToken.length).toBeGreaterThan(0);
      expect(tokens.refreshToken.length).toBeGreaterThan(0);
    });

    it('should generate different tokens for different users', () => {
      const tokens1 = generateTokens('user-1', 'user1@example.com');
      const tokens2 = generateTokens('user-2', 'user2@example.com');

      expect(tokens1.accessToken).not.toBe(tokens2.accessToken);
      expect(tokens1.refreshToken).not.toBe(tokens2.refreshToken);
    });

    it('should include userId and email in access token payload', () => {
      const userId = 'user-123';
      const email = 'test@example.com';

      const tokens = generateTokens(userId, email);
      const decoded = verifyToken(tokens.accessToken);

      expect(decoded.userId).toBe(userId);
      expect(decoded.email).toBe(email);
    });

    it('should include userId and email in refresh token payload', () => {
      const userId = 'user-123';
      const email = 'test@example.com';

      const tokens = generateTokens(userId, email);
      const decoded = verifyToken(tokens.refreshToken, true);

      expect(decoded.userId).toBe(userId);
      expect(decoded.email).toBe(email);
    });
  });

  describe('verifyToken', () => {
    it('should verify valid access token', () => {
      const userId = 'user-123';
      const email = 'test@example.com';
      const { accessToken } = generateTokens(userId, email);

      const decoded = verifyToken(accessToken);

      expect(decoded.userId).toBe(userId);
      expect(decoded.email).toBe(email);
    });

    it('should verify valid refresh token', () => {
      const userId = 'user-123';
      const email = 'test@example.com';
      const { refreshToken } = generateTokens(userId, email);

      const decoded = verifyToken(refreshToken, true);

      expect(decoded.userId).toBe(userId);
      expect(decoded.email).toBe(email);
    });

    it('should throw error for invalid access token', () => {
      expect(() => verifyToken('invalid-token')).toThrow();
    });

    it('should throw error for invalid refresh token', () => {
      expect(() => verifyToken('invalid-token', true)).toThrow();
    });

    it('should throw error for expired token', () => {
      // Create a token with very short expiry
      process.env.JWT_EXPIRES_IN = '0s';
      const userId = 'user-123';
      const email = 'test@example.com';
      const { accessToken } = generateTokens(userId, email);

      // Wait a moment to ensure expiry
      return new Promise((resolve) => {
        setTimeout(() => {
          expect(() => verifyToken(accessToken)).toThrow();
          resolve(null);
        }, 100);
      });
    });

    it('should throw error when verifying access token with refresh secret', () => {
      const userId = 'user-123';
      const email = 'test@example.com';
      const { accessToken } = generateTokens(userId, email);

      expect(() => verifyToken(accessToken, true)).toThrow();
    });

    it('should throw error when verifying refresh token with access secret', () => {
      const userId = 'user-123';
      const email = 'test@example.com';
      const { refreshToken } = generateTokens(userId, email);

      expect(() => verifyToken(refreshToken, false)).toThrow();
    });
  });
});
