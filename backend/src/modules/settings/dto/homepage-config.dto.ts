import { Type } from 'class-transformer';
import {
  IsArray, IsBoolean, IsHexColor, IsIn, IsInt, IsNotEmpty,
  IsOptional, IsString, IsUrl, MaxLength, Min, ValidateNested,
  ArrayMinSize, ArrayMaxSize, ValidateIf,
} from 'class-validator';
import { VALID_FONTS, VALID_BLOCK_VARIANTS } from '../homepage-config';

export class HomepageBlockDto {
  @IsIn(Object.keys(VALID_BLOCK_VARIANTS))
  id!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  label!: string;

  @IsBoolean()
  visible!: boolean;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  variant!: string;

  @IsInt()
  @Min(0)
  order!: number;
}

export class HomepageThemeDto {
  @IsHexColor()
  primaryColor!: string;

  @IsHexColor()
  accentColor!: string;

  @IsIn(VALID_FONTS)
  headingFont!: string;

  @IsIn(VALID_FONTS)
  bodyFont!: string;

  @IsOptional()
  @ValidateIf((o) => o.logoUrl !== null && o.logoUrl !== '')
  @IsUrl({ protocols: ['http', 'https'], require_protocol: true }, { message: 'logoUrl phải là URL hợp lệ (http/https)' })
  @MaxLength(2048)
  logoUrl!: string | null;

  @IsIn(['compact', 'normal', 'spacious'])
  spacing!: string;
}

export class UpdateHomepageConfigDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => HomepageBlockDto)
  blocks!: HomepageBlockDto[];

  @ValidateNested()
  @Type(() => HomepageThemeDto)
  theme!: HomepageThemeDto;
}
