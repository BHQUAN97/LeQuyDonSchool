import { IsOptional, IsString, IsEnum, MaxLength } from 'class-validator';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { UserRole, UserStatus } from '../entities/user.entity';

export class QueryUserDto extends PaginationDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  search?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}
