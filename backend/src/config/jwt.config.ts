import { registerAs } from '@nestjs/config';

export const jwtConfig = registerAs('jwt', () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required');
  }

  return {
    secret,
    expiresIn: parseInt(process.env.JWT_EXPIRATION || '900', 10), // 15 phut
    refreshExpiresIn: parseInt(process.env.REFRESH_TOKEN_EXPIRATION || '604800', 10), // 7 ngay
  };
});
