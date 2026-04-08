import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

/**
 * DataSource cho TypeORM CLI (migrations).
 * Dung boi: npm run migration:run, migration:generate
 */
export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME || 'lequydon',
  password: process.env.DB_PASSWORD || 'lequydon_dev',
  database: process.env.DB_NAME || 'lequydon',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
  charset: 'utf8mb4',
});
