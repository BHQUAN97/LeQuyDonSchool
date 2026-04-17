import { IsString, IsOptional, IsEnum, IsUrl, MinLength, MaxLength, IsDateString } from 'class-validator';
import { ArticleStatus } from '../entities/article.entity';

export class CreateArticleDto {
  @IsString()
  @MinLength(1, { message: 'Tiêu đề không được để trống' })
  @MaxLength(255, { message: 'Tiêu đề tối đa 255 ký tự' })
  title!: string;

  @IsString()
  @MinLength(1, { message: 'Nội dung không được để trống' })
  @MaxLength(500_000, { message: 'Nội dung quá dài' })
  content!: string;

  @IsOptional()
  @IsString()
  @MaxLength(26)
  categoryId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  excerpt?: string;

  @IsOptional()
  @IsString()
  @IsUrl({ require_tld: false, protocols: ['http', 'https'] }, { message: 'Đường dẫn ảnh không hợp lệ' })
  @MaxLength(500)
  thumbnailUrl?: string;

  @IsOptional()
  @IsEnum(ArticleStatus, { message: 'Trạng thái không hợp lệ' })
  status?: ArticleStatus;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  seoTitle?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  seoDescription?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Ngày đăng không hợp lệ' })
  publishedAt?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  slug?: string;
}
