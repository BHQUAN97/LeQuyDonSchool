import { registerAs } from '@nestjs/config';

export const databaseConfig = registerAs('database', () => ({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME || 'lequydon',
  password: process.env.DB_PASSWORD || 'lequydon_dev',
  name: process.env.DB_NAME || 'lequydon',
}));
