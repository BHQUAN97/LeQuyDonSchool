import { IsString, IsOptional, IsInt, IsBoolean, MinLength, MaxLength, Min } from 'class-validator';

export class UpdateFaqDto {
  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'Câu hỏi không được để trống' })
  @MaxLength(500, { message: 'Câu hỏi tối đa 500 ký tự' })
  question?: string;

  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'Câu trả lời không được để trống' })
  answer?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  displayOrder?: number;

  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;
}
