import { IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @MinLength(1, { message: 'Mật khẩu hiện tại không được để trống' })
  @MaxLength(128, { message: 'Mật khẩu hiện tại quá dài' })
  currentPassword!: string;

  @IsString()
  @MinLength(8, { message: 'Mật khẩu mới tối thiểu 8 ký tự' })
  @MaxLength(128, { message: 'Mật khẩu mới tối đa 128 ký tự' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Mật khẩu phải có ít nhất 1 chữ hoa, 1 chữ thường và 1 số',
  })
  newPassword!: string;
}
