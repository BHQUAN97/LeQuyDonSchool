import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MenuStatus } from '../entities/menu.entity';
import { MenuItemDto } from './create-menu.dto';

export class UpdateMenuDto {
  @IsOptional()
  @IsDateString({}, { message: 'Ngày không hợp lệ (YYYY-MM-DD)' })
  date?: string;

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
