import { IsString, MaxLength, Matches } from 'class-validator';

export class RecordPageviewDto {
  @IsString()
  @MaxLength(500)
  // Path phai bat dau bang / va chi chua chu, so, /, -, _, ., query string
  // Chan data: URIs va ky tu dac biet trong analytics storage.
  @Matches(/^\/[\w\-./?=&%]*$/, { message: 'Đường dẫn không hợp lệ' })
  path!: string;
}
