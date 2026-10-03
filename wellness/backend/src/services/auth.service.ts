import bcrypt from 'bcryptjs';
import { UserRepository } from '../repositories/user.repository';
import { generateTokens, verifyToken } from '../utils/jwt';
import { sendVerificationEmail, sendPasswordResetEmail } from '../utils/email';
import { toUserResponse } from '../models/user.model';
import type {
  RegisterRequest,
  LoginRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  AuthResponse,
  TokenResponse,
} from '../models/user.model';

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  // REGISTER
  async register(data: RegisterRequest): Promise<{ user: any; message: string }> {
    // Check if user exists
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      // Check if user registered with Google OAuth
      if (existingUser.provider === 'google') {
        throw new Error('This email is already registered with Google. Please use Google login instead.');
      }
      throw new Error('User already exists with this email');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Create user
    const user = await this.userRepository.create({
      email: data.email,
      password: hashedPassword,
      name: data.name,
    });

    // Generate verification token
    const verificationToken = generateTokens(user.id, user.email).accessToken;
    await this.userRepository.setVerificationToken(user.id, verificationToken);

    // Send verification email (don't await - fire and forget)
    sendVerificationEmail(user.email, verificationToken).catch(console.error);

    return {
      user: toUserResponse(user),
      message: 'Registration successful. Please check your email for verification.',
    };
  }

  // ============================================
  // LOGIN
  // ============================================
  async login(data: LoginRequest): Promise<AuthResponse> {
    // Find user
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check password
    if (!user.password) {
      throw new Error('This account uses OAuth login. Please use your OAuth provider to login.');
    }
    const isValidPassword = await bcrypt.compare(data.password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      throw new Error('Please verify your email before logging in');
    }

    // Generate tokens
    const tokens = generateTokens(user.id, user.email);

    return {
      user: toUserResponse(user),
      ...tokens,
    };
  }

  // ============================================
  // VERIFY EMAIL
  // ============================================
  async verifyEmail(token: string): Promise<{ message: string }> {
    // Verify token
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (error) {
      throw new Error('Invalid or expired verification token');
    }

    // Find user by verification token
    const user = await this.userRepository.findByVerificationToken(token);
    if (!user) {
      throw new Error('Invalid verification token');
    }

    // Mark as verified
    await this.userRepository.verifyEmail(user.id);

    return { message: 'Email verified successfully' };
  }

  // ============================================
  // RESEND VERIFICATION
  // ============================================
  async resendVerificationEmail(email: string): Promise<{ message: string }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    if (user.isEmailVerified) {
      throw new Error('Email already verified');
    }

    // Generate new token
    const verificationToken = generateTokens(user.id, user.email).accessToken;
    await this.userRepository.setVerificationToken(user.id, verificationToken);

    // Send email
    await sendVerificationEmail(user.email, verificationToken);

    return { message: 'Verification email sent' };
  }

  // ============================================
  // FORGOT PASSWORD
  // ============================================
  async forgotPassword(data: ForgotPasswordRequest): Promise<{ message: string }> {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new Error('User not found');
    }

    // Generate reset token
    const resetToken = generateTokens(user.id, user.email).accessToken;
    
    // Set expiry (1 hour)
    const expires = new Date();
    expires.setHours(expires.getHours() + 1);

    await this.userRepository.setResetToken(user.id, resetToken, expires);

    // Send email
    await sendPasswordResetEmail(user.email, resetToken);

    return { message: 'Password reset email sent' };
  }

  // ============================================
  // RESET PASSWORD
  // ============================================
  async resetPassword(data: ResetPasswordRequest): Promise<{ message: string }> {
    // Verify token
    let decoded;
    try {
      decoded = verifyToken(data.token);
    } catch (error) {
      throw new Error('Invalid or expired reset token');
    }

    // Find user with valid reset token
    const user = await this.userRepository.findByEmail(decoded.email);
    if (!user || 
        user.passwordResetToken !== data.token || 
        !user.passwordResetExpires || 
        user.passwordResetExpires < new Date()) {
      throw new Error('Invalid or expired reset token');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(data.newPassword, 12);

    // Update password
    await this.userRepository.updatePassword(user.id, hashedPassword);

    return { message: 'Password reset successfully' };
  }

  // ============================================
  // REFRESH TOKEN
  // ============================================
  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    try {
      const decoded = verifyToken(refreshToken, true);
      const user = await this.userRepository.findById(decoded.userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      const tokens = generateTokens(user.id, user.email);
      return tokens;
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  // ============================================
  // GET PROFILE
  // ============================================
  async getProfile(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return toUserResponse(user);
  }
}