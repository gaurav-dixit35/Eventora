import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EventsService, type EventQuery } from './events.service';

@ApiTags('discovery')
@Controller()
export class EventsController {
  constructor(private readonly events: EventsService) {}
  @Get('events') list(@Query() query: EventQuery) {
    return this.events.list({
      ...query,
      page: query.page ? Number(query.page) : undefined,
      limit: query.limit ? Number(query.limit) : undefined,
      minPrice: query.minPrice ? Number(query.minPrice) : undefined,
      maxPrice: query.maxPrice ? Number(query.maxPrice) : undefined,
    });
  }
  @Get('events/:slug') detail(@Param('slug') slug: string) {
    return this.events.detail(slug);
  }
  @Get('categories') categories() {
    return this.events.categories();
  }
  @Get('cities') cities() {
    return this.events.cities();
  }
  @Get('cities/:slug/events') cityEvents(@Param('slug') city: string, @Query() query: EventQuery) {
    return this.events.list({ ...query, city });
  }
  @Get('search/events') search(@Query('q') q = '', @Query() query: EventQuery) {
    return this.events.list({ ...query, q });
  }
}
