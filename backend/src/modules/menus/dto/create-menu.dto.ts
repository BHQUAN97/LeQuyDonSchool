import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  ValidateNested,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MenuStatus } from '../entities/menu.entity';

/** Sub-DTO mo ta 1 bua an — tat ca truong optional */
export class MenuItemDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  mainDish?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  vegetable?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  soup?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  starch?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  dessert?: string;
}

export class CreateMenuDto {
  @IsDateString({}, { message: 'Ngày không hợp lệ (YYYY-MM-DD)' })
  date!: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => MenuItemDto)
  breakfast?: MenuItemDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => MenuItemDto)
  lunch?: MenuItemDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => MenuItemDto)
  dinner?: MenuItemDto;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsEnum(MenuStatus, { message: 'Trạng thái không hợp lệ' })
  status?: MenuStatus;
}
