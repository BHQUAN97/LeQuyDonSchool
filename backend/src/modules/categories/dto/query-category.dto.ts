import { IsOptional, IsString, IsEnum, IsBooleanString, MaxLength } from 'class-validator';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { CategoryStatus } from '../entities/category.entity';

export class QueryCategoryDto extends PaginationDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  search?: string;

  @IsOptional()
  @IsEnum(CategoryStatus)
  status?: CategoryStatus;

  @IsOptional()
  @IsString()
  parentId?: string;

  @IsOptional()
  @IsBooleanString()
  tree?: string;
}
