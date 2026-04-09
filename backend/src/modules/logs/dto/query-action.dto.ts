import { IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { ActionType } from '../entities/admin-action.entity';

export class QueryActionDto extends PaginationDto {
  @IsOptional()
  @IsEnum(ActionType)
  action?: ActionType;

  @IsOptional()
  @IsString()
  entityType?: string;

  @IsOptional()
  @IsString()
  userId?: string;

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
