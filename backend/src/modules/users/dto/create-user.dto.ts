import { IsEmail, IsString, MinLength, Matches, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @IsString()
  @MinLength(2, { message: 'Họ tên tối thiểu 2 ký tự' })
  fullName!: string;

  @IsEmail({}, { message: 'Email không hợp lệ' })
  email!: string;

  @IsString()
  @MinLength(8, { message: 'Mật khẩu tối thiểu 8 ký tự' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Mật khẩu phải có ít nhất 1 chữ hoa, 1 chữ thường và 1 số',
  })
  password!: string;

  @IsEnum(UserRole, { message: 'Vai trò không hợp lệ' })
  role!: UserRole;

  @IsOptional()
  @IsString()
  phone?: string;
}
