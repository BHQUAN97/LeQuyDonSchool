import {
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  IsBoolean,
  IsArray,
  ValidateNested,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MenuTarget } from '../entities/menu-item.entity';

export class MenuItemDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  @MaxLength(100, { message: 'Nhãn tối đa 100 ký tự' })
  label!: string;

  @IsString()
  @MaxLength(500, { message: 'URL tối đa 500 ký tự' })
  url!: string;

  @IsOptional()
  @IsEnum(MenuTarget, { message: 'Target không hợp lệ' })
  target?: MenuTarget;

  @IsOptional()
  @IsString()
  parentId?: string | null;

  @IsOptional()
  @IsInt()
  @Min(0)
  displayOrder?: number;

  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MenuItemDto)
  children?: MenuItemDto[];
}

export class SaveMenuDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MenuItemDto)
  items!: MenuItemDto[];
}
