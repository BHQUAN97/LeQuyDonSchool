import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { Article } from '../articles/entities/article.entity';
import { Page } from '../pages/entities/page.entity';
import { Event } from '../events/entities/event.entity';
import { AdmissionPost } from '../admissions/entities/admission-post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Article, Page, Event, AdmissionPost])],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
