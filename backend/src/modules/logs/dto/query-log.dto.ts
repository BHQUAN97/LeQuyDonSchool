import { IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { LogLevel } from '../entities/app-log.entity';

export class QueryLogDto extends PaginationDto {
  @IsOptional()
  @IsEnum(LogLevel)
  level?: LogLevel;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
