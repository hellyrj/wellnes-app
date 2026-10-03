import { describe, it, expect } from 'vitest';
import { registerSchema, loginSchema, resetPasswordSchema } from '../../src/validations/auth.validation';

describe('Auth Validation Schemas', () => {
  describe('registerSchema', () => {
    it('should validate valid registration data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'Test123!@#',
        name: 'John Doe',
      };
      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email format', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'Test123!@#',
        name: 'John Doe',
      };
      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Invalid email format');
      }
    });

    it('should reject password less than 8 characters', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'Test1!',
        name: 'John Doe',
      };
      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('at least 8 characters');
      }
    });

    it('should reject password without uppercase letter', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'test123!@#',
        name: 'John Doe',
      };
      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('uppercase letter');
      }
    });

    it('should reject password without lowercase letter', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'TEST123!@#',
        name: 'John Doe',
      };
      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('lowercase letter');
      }
    });

    it('should reject password without number', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'TestABC!@#',
        name: 'John Doe',
      };
      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('number');
      }
    });

    it('should reject password without special character', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'Test123ABC',
        name: 'John Doe',
      };
      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('special character');
      }
    });

    it('should reject password with whitespace', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'Test 123!@#',
        name: 'John Doe',
      };
      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('whitespace');
      }
    });

    it('should allow registration without name', () => {
      const validData = {
        email: 'test@example.com',
        password: 'Test123!@#',
      };
      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('loginSchema', () => {
    it('should validate valid login data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'Test123!@#',
      };
      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email format', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'Test123!@#',
      };
      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject empty password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '',
      };
      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('resetPasswordSchema', () => {
    it('should validate valid reset password data', () => {
      const validData = {
        token: 'valid-token',
        newPassword: 'NewPass123!@#',
      };
      const result = resetPasswordSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject weak password', () => {
      const invalidData = {
        token: 'valid-token',
        newPassword: 'weak',
      };
      const result = resetPasswordSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject empty token', () => {
      const invalidData = {
        token: '',
        newPassword: 'NewPass123!@#',
      };
      const result = resetPasswordSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});
