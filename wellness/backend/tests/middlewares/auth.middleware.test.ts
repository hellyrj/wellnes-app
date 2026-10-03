import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { authenticate, AuthRequest } from '../../src/middlewares/auth.middleware';
import { verifyToken } from '../../src/utils/jwt';

// Mock JWT utility
vi.mock('../../src/utils/jwt');

describe('Auth Middleware', () => {
  let mockReq: Partial<AuthRequest>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockReq = {
      headers: {},
    };
    
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    
    mockNext = vi.fn();
  });

  describe('authenticate', () => {
    it('should call next() with valid token', () => {
      const validToken = 'valid-token';
      const decodedUser = { userId: 'user-123', email: 'test@example.com' };

      mockReq.headers = { authorization: `Bearer ${validToken}` };
      (verifyToken as any).mockReturnValue(decodedUser);

      authenticate(mockReq as AuthRequest, mockRes as Response, mockNext);

      expect(verifyToken).toHaveBeenCalledWith(validToken);
      expect(mockReq.user).toEqual(decodedUser);
      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should return 401 if no authorization header', () => {
      mockReq.headers = {};

      authenticate(mockReq as AuthRequest, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'No token provided',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 if authorization header does not start with Bearer', () => {
      mockReq.headers = { authorization: 'InvalidToken' };

      authenticate(mockReq as AuthRequest, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'No token provided',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 if token is invalid', () => {
      const invalidToken = 'invalid-token';
      mockReq.headers = { authorization: `Bearer ${invalidToken}` };
      (verifyToken as any).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      authenticate(mockReq as AuthRequest, mockRes as Response, mockNext);

      expect(verifyToken).toHaveBeenCalledWith(invalidToken);
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid token',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 with custom error message', () => {
      const expiredToken = 'expired-token';
      mockReq.headers = { authorization: `Bearer ${expiredToken}` };
      (verifyToken as any).mockImplementation(() => {
        throw new Error('Token expired');
      });

      authenticate(mockReq as AuthRequest, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Token expired',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should extract token correctly from Bearer header', () => {
      const validToken = 'valid-token-123';
      const decodedUser = { userId: 'user-123', email: 'test@example.com' };

      mockReq.headers = { authorization: `Bearer ${validToken}` };
      (verifyToken as any).mockReturnValue(decodedUser);

      authenticate(mockReq as AuthRequest, mockRes as Response, mockNext);

      expect(verifyToken).toHaveBeenCalledWith(validToken);
      expect(mockReq.user).toEqual(decodedUser);
    });

    it('should handle tokens with extra spaces', () => {
      const validToken = 'valid-token';
      const decodedUser = { userId: 'user-123', email: 'test@example.com' };

      mockReq.headers = { authorization: `Bearer  ${validToken}` };
      (verifyToken as any).mockReturnValue(decodedUser);

      authenticate(mockReq as AuthRequest, mockRes as Response, mockNext);

      // The split will include empty string, so this should fail
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
