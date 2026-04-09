import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

if (isProduction && !process.env.DB_PASSWORD) {
  throw new Error('DB_PASSWORD env var is required in production');
}

/**
 * DataSource cho TypeORM CLI (migrations).
 * Dung boi: npm run migration:run, migration:generate
 */
export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME || 'lequydon',
  password: process.env.DB_PASSWORD || (isProduction ? '' : 'lequydon_dev'),
  database: process.env.DB_NAME || 'lequydon',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
  charset: 'utf8mb4',
});
