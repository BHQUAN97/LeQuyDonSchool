import { IsString, IsOptional, IsEnum, IsUrl, MinLength, MaxLength, IsDateString } from 'class-validator';
import { EventStatus } from '../entities/event.entity';

export class UpdateEventDto {
  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'Tiêu đề không được để trống' })
  @MaxLength(255, { message: 'Tiêu đề tối đa 255 ký tự' })
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10000)
  description?: string;

  @IsOptional()
  @IsString()
  @IsUrl({ require_tld: false, protocols: ['http', 'https'] }, { message: 'Đường dẫn ảnh không hợp lệ' })
  @MaxLength(500)
  imageUrl?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Ngày bắt đầu không hợp lệ' })
  startDate?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Ngày kết thúc không hợp lệ' })
  endDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  location?: string;

  @IsOptional()
  @IsString()
  @IsUrl({ require_tld: false, protocols: ['http', 'https'] }, { message: 'Đường dẫn liên kết không hợp lệ' })
  @MaxLength(500)
  linkUrl?: string;

  @IsOptional()
  @IsEnum(EventStatus, { message: 'Trạng thái không hợp lệ' })
  status?: EventStatus;
}
