import { IsOptional, IsString, IsEnum, MaxLength } from 'class-validator';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { EventStatus } from '../entities/event.entity';

export class QueryEventDto extends PaginationDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  search?: string;

  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;
}
