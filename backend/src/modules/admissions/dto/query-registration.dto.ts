import { IsOptional, IsString, IsEnum, MaxLength } from 'class-validator';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { RegistrationStatus } from '../entities/admission-registration.entity';

export class QueryRegistrationDto extends PaginationDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  search?: string;

  @IsOptional()
  @IsEnum(RegistrationStatus)
  status?: RegistrationStatus;

  @IsOptional()
  @IsString()
  grade?: string;
}
