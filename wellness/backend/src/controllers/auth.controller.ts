import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthRequest } from '../middlewares/auth.middleware';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  refreshTokenSchema,
} from '../validations/auth.validation';
import { AsyncHandler } from '../decorators/async-handler.decoder';
import { AppError } from '../utils/appError';
import passport from '../strategies/google.strategy';

const authService = new AuthService();

export class AuthController {

  // REGISTER
  @AsyncHandler()
  async register(req: Request, res: Response) {
    const validatedData = registerSchema.parse(req.body);
    const result = await authService.register(validatedData);
    
    res.status(201).json({
      success: true,
      message: result.message,
      data: result.user,
    });
  }

  // LOGIN
  @AsyncHandler()
  async login(req: Request, res: Response) {
    const validatedData = loginSchema.parse(req.body);
    const result = await authService.login(validatedData);
    
    // Set HTTP-only cookies for tokens
    res.cookie('access_token', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });
    
    res.cookie('refresh_token', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: { user: result.user },
    });
  }

  // VERIFY EMAIL
  @AsyncHandler()
  async verifyEmail(req: Request, res: Response) {
    const { token } = req.query;
    if (!token || typeof token !== 'string') {
      throw new AppError('Verification token required', 400);
    }
    
    const result = await authService.verifyEmail(token);
    res.status(200).json({
      success: true,
      message: result.message,
    });
  }

  // RESEND VERIFICATION
  @AsyncHandler()
  async resendVerification(req: Request, res: Response) {
    const { email } = req.body;
    if (!email) {
      throw new AppError('Email is required', 400);
    }
    
    const result = await authService.resendVerificationEmail(email);
    res.status(200).json({
      success: true,
      message: result.message,
    });
  }

  // FORGOT PASSWORD
  @AsyncHandler()
  async forgotPassword(req: Request, res: Response) {
    const validatedData = forgotPasswordSchema.parse(req.body);
    const result = await authService.forgotPassword(validatedData);
    
    res.status(200).json({
      success: true,
      message: result.message,
    });
  }

  // RESET PASSWORD
  @AsyncHandler()
  async resetPassword(req: Request, res: Response) {
    const validatedData = resetPasswordSchema.parse(req.body);
    const result = await authService.resetPassword(validatedData);
    
    res.status(200).json({
      success: true,
      message: result.message,
    });
  }

  // REFRESH TOKEN
  @AsyncHandler()
  async refreshToken(req: Request, res: Response) {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
      throw new AppError('Refresh token not found', 401);
    }
    
    const tokens = await authService.refreshToken(refreshToken);
    
    // Set new HTTP-only cookies
    res.cookie('access_token', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });
    
    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    
    res.status(200).json({
      success: true,
      data: { accessToken: tokens.accessToken },
    });
  }

  // GET PROFILE (Protected)
  @AsyncHandler()
  async getProfile(req: AuthRequest, res: Response) {
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    const user = await authService.getProfile(req.user.userId);
    res.status(200).json({
      success: true,
      data: user,
    });
  }

  // LOGOUT
  @AsyncHandler()
  async logout(req: Request, res: Response) {
    // Clear cookies
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    
    res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  }

  // GOOGLE OAUTH
  async googleAuth(req: Request, res: Response) {
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res);
  }

  async googleCallback(req: Request, res: Response) {
    passport.authenticate('google', { session: false }, (err: any, data: any) => {
      if (err || !data) {
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
      }

      const { user, tokens } = data;
      
      // Redirect to frontend with tokens
      res.redirect(
        `${process.env.FRONTEND_URL}/auth/callback?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`
      );
    })(req, res);
  }
}