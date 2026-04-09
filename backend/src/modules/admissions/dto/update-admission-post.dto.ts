import { IsString, IsOptional, IsEnum, MinLength, MaxLength, IsDateString } from 'class-validator';
import { AdmissionPostStatus } from '../entities/admission-post.entity';

export class UpdateAdmissionPostDto {
  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'Tiêu đề không được để trống' })
  @MaxLength(255, { message: 'Tiêu đề tối đa 255 ký tự' })
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'Nội dung không được để trống' })
  @MaxLength(500000)
  content?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  slug?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  thumbnailUrl?: string;

  @IsOptional()
  @IsEnum(AdmissionPostStatus, { message: 'Trạng thái không hợp lệ' })
  status?: AdmissionPostStatus;

  @IsOptional()
  @IsDateString({}, { message: 'Ngày đăng không hợp lệ' })
  publishedAt?: string;
}
