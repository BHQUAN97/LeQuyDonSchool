import { IsString, MinLength, MaxLength, IsOptional, IsEnum } from 'class-validator';
import { PageStatus } from '../entities/page.entity';

export class CreatePageDto {
  @IsString()
  @MinLength(1, { message: 'Tieu de khong duoc de trong' })
  @MaxLength(255)
  title!: string;

  @IsString()
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
  seoDescription?: string;
}
