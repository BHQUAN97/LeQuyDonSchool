import { IsString, IsOptional, IsEmail, IsBoolean, MinLength, MaxLength, Matches } from 'class-validator';

export class CreateRegistrationDto {
  @IsString()
  @MinLength(2, { message: 'Họ tên tối thiểu 2 ký tự' })
  @MaxLength(100, { message: 'Họ tên tối đa 100 ký tự' })
  fullName!: string;

  @IsString()
  @Matches(/^[0-9]{9,11}$/, { message: 'Số điện thoại không hợp lệ (9-11 chữ số)' })
  phone!: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email?: string;

  @IsString()
  @Matches(/^Lớp [1-5]$/, { message: 'Lớp phải từ Lớp 1 đến Lớp 5' })
  grade!: string;

  @IsOptional()
  @IsBoolean()
  isClubMember?: boolean;

  @IsOptional()
  @IsString()
  note?: string;
}
