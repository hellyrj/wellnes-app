import jwt from 'jsonwebtoken';

export const generateTokens = (userId: string, email: string) => {
  const accessToken = jwt.sign(
    { userId, email },
    process.env.JWT_SECRET!,
    { expiresIn: (process.env.JWT_EXPIRES_IN || '15m') as any }
  );

  const refreshToken = jwt.sign(
    { userId, email },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as any }
  );

  return { accessToken, refreshToken };
};

export const verifyToken = (token: string, isRefresh = false) => {
  const secret = isRefresh ? process.env.JWT_REFRESH_SECRET! : process.env.JWT_SECRET!;
  return jwt.verify(token, secret) as { userId: string; email: string };
};