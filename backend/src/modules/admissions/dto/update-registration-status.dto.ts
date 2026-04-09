import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { RegistrationStatus } from '../entities/admission-registration.entity';

export class UpdateRegistrationStatusDto {
  @IsEnum(RegistrationStatus, { message: 'Trạng thái không hợp lệ' })
  status!: RegistrationStatus;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  note?: string;
}
