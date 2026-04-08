import { IsOptional, IsString, IsEnum } from 'class-validator';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { AdmissionPostStatus } from '../entities/admission-post.entity';

export class QueryAdmissionPostDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(AdmissionPostStatus)
  status?: AdmissionPostStatus;
}
