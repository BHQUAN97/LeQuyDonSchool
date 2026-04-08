import { IsOptional, IsString } from 'class-validator';

export class AnalyticsQueryDto {
  @IsOptional()
  @IsString()
  start?: string;

  @IsOptional()
  @IsString()
  end?: string;

  @IsOptional()
  @IsString()
  path?: string;
}
