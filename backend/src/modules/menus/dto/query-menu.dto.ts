import { IsOptional, IsEnum, IsDateString } from 'class-validator';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { MenuStatus } from '../entities/menu.entity';

/**
 * Query params cho GET /menus — filter theo khoang ngay + trang thai.
 */
export class QueryMenuDto extends PaginationDto {
  @IsOptional()
  @IsDateString({}, { message: 'dateFrom không hợp lệ' })
  dateFrom?: string;

  @IsOptional()
  @IsDateString({}, { message: 'dateTo không hợp lệ' })
  dateTo?: string;

  @IsOptional()
  @IsEnum(MenuStatus, { message: 'Trạng thái không hợp lệ' })
  status?: MenuStatus;
}
