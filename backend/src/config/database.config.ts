import { registerAs } from '@nestjs/config';

export const databaseConfig = registerAs('database', () => {
  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction && !process.env.DB_PASSWORD) {
    throw new Error('DB_PASSWORD env var is required in production');
  }

  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    username: process.env.DB_USERNAME || 'lequydon',
    password: process.env.DB_PASSWORD || (isProduction ? '' : 'lequydon_dev'),
    name: process.env.DB_NAME || 'lequydon',
  };
});
