import { IsDateString } from 'class-validator';

/**
 * Input cho action duplicate menu tu 1 ngay sang 1 ngay khac.
 */
export class CopyMenuDto {
  @IsDateString({}, { message: 'Ngày nguồn không hợp lệ' })
  fromDate!: string;

  @IsDateString({}, { message: 'Ngày đích không hợp lệ' })
  toDate!: string;
}
