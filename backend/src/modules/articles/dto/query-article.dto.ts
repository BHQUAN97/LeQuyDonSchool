import { IsOptional, IsString, IsEnum, IsDateString, MaxLength } from 'class-validator';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { ArticleStatus } from '../entities/article.entity';

export class QueryArticleDto extends PaginationDto {
  @IsOptional()
  @IsString()
  @MaxLength(200, { message: 'Từ khóa tìm kiếm quá dài' })
  search?: string;

  @IsOptional()
  @IsEnum(ArticleStatus)
  status?: ArticleStatus;

  @IsOptional()
  @IsString()
  @MaxLength(26)
  categoryId?: string;

  /** Filter theo category slug — tien cho frontend */
  @IsOptional()
  @IsString()
  @MaxLength(150)
  category?: string;

  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @IsOptional()
  @IsDateString()
  dateTo?: string;
}
