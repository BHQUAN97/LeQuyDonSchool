import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdmissionsController } from './admissions.controller';
import { AdmissionsService } from './admissions.service';
import { AdmissionPost } from './entities/admission-post.entity';
import { AdmissionFaq } from './entities/admission-faq.entity';
import { AdmissionRegistration } from './entities/admission-registration.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdmissionPost, AdmissionFaq, AdmissionRegistration]),
  ],
  controllers: [AdmissionsController],
  providers: [AdmissionsService],
  exports: [AdmissionsService],
})
export class AdmissionsModule {}
