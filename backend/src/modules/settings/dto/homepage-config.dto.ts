import { Type } from 'class-transformer';
import {
  IsArray, IsBoolean, IsHexColor, IsIn, IsInt, IsNotEmpty,
  IsOptional, IsString, Min, ValidateNested, ArrayMinSize,
} from 'class-validator';
import { VALID_FONTS } from '../homepage-config';

export class HomepageBlockDto {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsString()
  @IsNotEmpty()
  label!: string;

  @IsBoolean()
  visible!: boolean;

  @IsString()
  @IsNotEmpty()
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
  @IsString()
  logoUrl!: string | null;

  @IsIn(['compact', 'normal', 'spacious'])
  spacing!: string;
}

export class UpdateHomepageConfigDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => HomepageBlockDto)
  blocks!: HomepageBlockDto[];

  @ValidateNested()
  @Type(() => HomepageThemeDto)
  theme!: HomepageThemeDto;
}
