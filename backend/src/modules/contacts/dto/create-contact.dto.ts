import { IsString, IsEmail, IsOptional, MinLength, MaxLength } from 'class-validator';

export class CreateContactDto {
  @IsString()
  @MinLength(2, { message: 'Ho ten toi thieu 2 ky tu' })
  @MaxLength(100)
  fullName!: string;

  @IsEmail({}, { message: 'Email khong hop le' })
  email!: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @IsString()
  @MinLength(10, { message: 'Noi dung toi thieu 10 ky tu' })
  content!: string;
}
