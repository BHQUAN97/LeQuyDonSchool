import { IsString, MaxLength, IsArray, ValidateNested, IsNotEmpty, ArrayMaxSize } from 'class-validator';
import { Type } from 'class-transformer';

export class SettingItemDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  key!: string;

  @IsString()
  @MaxLength(10000)
  value!: string;

  @IsString()
  @MaxLength(50)
  group!: string;
}

export class BulkUpsertSettingDto {
  @IsArray()
  @ArrayMaxSize(100)
  @ValidateNested({ each: true })
  @Type(() => SettingItemDto)
  items!: SettingItemDto[];
}
