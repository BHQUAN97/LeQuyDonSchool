import { registerAs } from '@nestjs/config';

export const r2Config = registerAs('r2', () => ({
  accountId: process.env.R2_ACCOUNT_ID || '',
  accessKey: process.env.R2_ACCESS_KEY_ID || '',
  secretKey: process.env.R2_SECRET_ACCESS_KEY || '',
  bucket: process.env.R2_BUCKET_NAME || 'lequydon-public',
  publicUrl: process.env.R2_PUBLIC_URL || '',
  // R2 disabled khi khong co credentials — dung local storage
  enabled: !!(process.env.R2_ACCOUNT_ID && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY),
}));
