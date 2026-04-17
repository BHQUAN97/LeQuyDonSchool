import { IsOptional, IsString, IsEnum, MaxLength } from 'class-validator';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { AdmissionPostStatus } from '../entities/admission-post.entity';

export class QueryAdmissionPostDto extends PaginationDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  search?: string;

  @IsOptional()
  @IsEnum(AdmissionPostStatus)
  status?: AdmissionPostStatus;
}
