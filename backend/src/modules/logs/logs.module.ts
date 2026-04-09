import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogsController } from './logs.controller';
import { LogsService } from './logs.service';
import { AdminActionsService } from './admin-actions.service';
import { AppLog } from './entities/app-log.entity';
import { AdminAction } from './entities/admin-action.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([AppLog, AdminAction])],
  controllers: [LogsController],
  providers: [LogsService, AdminActionsService],
  exports: [LogsService, AdminActionsService],
})
export class LogsModule {}
