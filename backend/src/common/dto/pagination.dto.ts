import { IsOptional, IsInt, Min, Max, IsIn, IsString, MaxLength, Matches } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100_000, { message: 'Trang quá lớn' })
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 20;

  // Chi cho phep cot hop le — chan SQL injection qua ORDER BY
  @IsOptional()
  @IsString()
  @MaxLength(50)
  @Matches(/^[a-zA-Z_][a-zA-Z0-9_]*$/, { message: 'Trường sắp xếp không hợp lệ' })
  sort: string = 'created_at';

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  order: 'ASC' | 'DESC' = 'DESC';
}
