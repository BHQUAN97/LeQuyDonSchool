import { IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { ArticleStatus } from '../entities/article.entity';

export class QueryArticleDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(ArticleStatus)
  status?: ArticleStatus;

  @IsOptional()
  @IsString()
  categoryId?: string;

  /** Filter theo category slug — tien cho frontend */
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @IsOptional()
  @IsDateString()
  dateTo?: string;
}
