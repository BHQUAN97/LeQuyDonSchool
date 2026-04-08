import { IsEnum, IsOptional, IsString } from 'class-validator';
import { RegistrationStatus } from '../entities/admission-registration.entity';

export class UpdateRegistrationStatusDto {
  @IsEnum(RegistrationStatus, { message: 'Trạng thái không hợp lệ' })
  status!: RegistrationStatus;

  @IsOptional()
  @IsString()
  note?: string;
}
