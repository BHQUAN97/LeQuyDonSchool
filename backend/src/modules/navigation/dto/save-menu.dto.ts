import {
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  IsBoolean,
  IsArray,
  ValidateNested,
  MaxLength,
  Matches,
  Min,
  ArrayMaxSize,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { MenuTarget } from '../entities/menu-item.entity';

/** Strip HTML tags — phong chong XSS qua label */
function stripHtmlTags(value: string): string {
  return value.replace(/<[^>]*>/g, '');
}

export class MenuItemDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  @MaxLength(100, { message: 'Nhãn tối đa 100 ký tự' })
  @Transform(({ value }) => (typeof value === 'string' ? stripHtmlTags(value) : value))
  label!: string;

  @IsString()
  @MaxLength(500, { message: 'URL tối đa 500 ký tự' })
  @Matches(/^(\/|https?:\/\/)/, { message: 'URL must be relative path or http(s)' })
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
  @ArrayMaxSize(100)
  @ValidateNested({ each: true })
  @Type(() => MenuItemDto)
  children?: MenuItemDto[];
}

export class SaveMenuDto {
  @IsArray()
  @ArrayMaxSize(100)
  @ValidateNested({ each: true })
  @Type(() => MenuItemDto)
  items!: MenuItemDto[];
}
