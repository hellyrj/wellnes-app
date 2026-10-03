import prisma from '../utils/prisma';
import asyncHandler from '../utils/asyncHandler';
import { User } from '@prisma/client';

export class UserRepository {
  async create(data: { 
    email: string; 
    password?: string; 
    name?: string; 
    profilePicture?: string;
    provider?: string;
    providerId?: string;
    isEmailVerified?: boolean;
  }) {
    const createData: any = {
      email: data.email,
      name: data.name,
      profilePicture: data.profilePicture,
      provider: data.provider,
      providerId: data.providerId,
      isEmailVerified: data.isEmailVerified,
    };
    
    if (data.password) {
      createData.password = data.password;
    }
    
    return await prisma.user.create({
      data: createData,
    });
  }

  async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  async findByVerificationToken(token: string) {
    return await prisma.user.findUnique({
      where: { emailVerificationToken: token },
    });
  }

  async setVerificationToken(userId: string, token: string) {
    return await prisma.user.update({
      where: { id: userId },
      data: { emailVerificationToken: token },
    });
  }

  async verifyEmail(userId: string) {
    return await prisma.user.update({
      where: { id: userId },
      data: { 
        isEmailVerified: true,
        emailVerificationToken: null,
      },
    });
  }

  async setResetToken(userId: string, token: string, expires: Date) {
    return await prisma.user.update({
      where: { id: userId },
      data: {
        passwordResetToken: token,
        passwordResetExpires: expires,
      },
    });
  }

  async updatePassword(userId: string, hashedPassword: string) {
    return await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });
  }

  async findByProviderId(provider: string, providerId: string) {
    return await prisma.user.findFirst({
      where: {
        provider,
        providerId,
      },
    });
  }

  async updateProvider(userId: string, provider: string, providerId: string) {
    return await prisma.user.update({
      where: { id: userId },
      data: {
        provider,
        providerId,
        isEmailVerified: true,
      },
    });
  }
}