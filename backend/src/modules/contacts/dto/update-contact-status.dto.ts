import { IsEnum } from 'class-validator';
import { ContactStatus } from '../entities/contact.entity';

export class UpdateContactStatusDto {
  @IsEnum(ContactStatus, { message: 'Trang thai khong hop le' })
  status!: ContactStatus;
}
