import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateMediaDto {
  /** Ten hien thi (khong phai storage key) */
  @IsOptional()
  @IsString()
  @MaxLength(255)
  original_name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  alt_text?: string;
}
