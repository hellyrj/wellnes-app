//1. prisma user type (for internal use only)
import {User as PrismaUser} from '@prisma/client'

// re-export prisma types for internal use

export type User = PrismaUser;

//2. request DTO (what clients sends)
export interface RegisterRequest {
    email: string;
    password: string;
    name?: string;
}

export interface LoginRequest {
    email: string;
    password: string
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    token: string;
    newPassword: string;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

//3. response DTO (what server sends back to clients)
export interface UserResponse {
  id: string;
  email: string;
  name?: string;
  profilePicture?: string;
  isEmailVerified: boolean;
  createdAt: Date;
}

export interface AuthResponse {
  user: UserResponse;
  accessToken: string;
  refreshToken: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

// 4. Helper function to sanitize user
export function toUserResponse(user: PrismaUser): UserResponse {
  return {
    id: user.id,
    email: user.email,
    name: user.name || undefined,
    profilePicture: user.profilePicture || undefined,
    isEmailVerified: user.isEmailVerified,
    createdAt: user.createdAt,
  };
}