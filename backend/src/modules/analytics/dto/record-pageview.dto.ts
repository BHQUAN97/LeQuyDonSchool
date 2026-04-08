import { IsString, MaxLength } from 'class-validator';

export class RecordPageviewDto {
  @IsString()
  @MaxLength(500)
  path!: string;
}
