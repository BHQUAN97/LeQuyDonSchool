import { IsString, MinLength, MaxLength, IsOptional, IsEnum } from 'class-validator';
import { PageStatus } from '../entities/page.entity';

export class CreatePageDto {
  @IsString()
  @MinLength(1, { message: 'Tieu de khong duoc de trong' })
  @MaxLength(255)
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  slug?: string;

  @IsString()
  @MaxLength(500000)
  content!: string;

  @IsOptional()
  @IsEnum(PageStatus)
  status?: PageStatus;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  seoTitle?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  seoDescription?: string;
}
