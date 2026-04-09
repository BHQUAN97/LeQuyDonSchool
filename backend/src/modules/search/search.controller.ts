import { Controller, Get, Query } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { SearchService } from './search.service';
import { Public } from '@/common/decorators/public.decorator';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  /** Tim kiem toan bo — public, khong can auth */
  @Get()
  @Public()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  async search(
    @Query('q') q: string,
    @Query('type') type?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '12',
  ) {
    return this.searchService.search(
      q,
      type,
      parseInt(page, 10),
      parseInt(limit, 10),
    );
  }
}
