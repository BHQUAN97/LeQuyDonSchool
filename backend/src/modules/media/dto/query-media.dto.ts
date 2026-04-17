import { IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationDto } from '@/common/dto/pagination.dto';

export class QueryMediaDto extends PaginationDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  search?: string;

  @IsOptional()
  @IsString()
  mimeType?: string;
}
