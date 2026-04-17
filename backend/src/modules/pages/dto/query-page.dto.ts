import { IsOptional, IsString, IsEnum, MaxLength } from 'class-validator';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { PageStatus } from '../entities/page.entity';

export class QueryPageDto extends PaginationDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  search?: string;

  @IsOptional()
  @IsEnum(PageStatus)
  status?: PageStatus;
}
