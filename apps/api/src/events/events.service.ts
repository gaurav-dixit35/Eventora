import { Injectable, NotFoundException } from '@nestjs/common';
import { EventStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export type EventQuery = {
  page?: number;
  limit?: number;
  city?: string;
  category?: string;
  q?: string;
  from?: string;
  to?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'date' | 'price';
};

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: EventQuery) {
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.min(50, Math.max(1, query.limit ?? 12));
    const where: Prisma.EventWhereInput = {
      status: EventStatus.PUBLISHED,
      ...(query.city ? { city: { slug: query.city } } : {}),
      ...(query.category ? { category: { slug: query.category } } : {}),
      ...(query.from || query.to
        ? {
            startAt: {
              ...(query.from ? { gte: new Date(query.from) } : {}),
              ...(query.to ? { lte: new Date(query.to) } : {}),
            },
          }
        : {}),
      ...(query.q
        ? {
            OR: [
              { title: { contains: query.q, mode: 'insensitive' } },
              { description: { contains: query.q, mode: 'insensitive' } },
              { organizer: { organizationName: { contains: query.q, mode: 'insensitive' } } },
              { venue: { name: { contains: query.q, mode: 'insensitive' } } },
              { tags: { some: { name: { contains: query.q, mode: 'insensitive' } } } },
            ],
          }
        : {}),
      ...(query.minPrice !== undefined || query.maxPrice !== undefined
        ? {
            ticketTypes: {
              some: {
                status: 'ACTIVE',
                price: {
                  ...(query.minPrice !== undefined ? { gte: query.minPrice } : {}),
                  ...(query.maxPrice !== undefined ? { lte: query.maxPrice } : {}),
                },
              },
            },
          }
        : {}),
    };
    const orderBy: Prisma.EventOrderByWithRelationInput = {
      startAt: query.sort === 'price' ? 'desc' : 'asc',
    };
    const [items, total] = await this.prisma.$transaction([
      this.prisma.event.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
        include: {
          city: true,
          venue: true,
          category: true,
          organizer: { select: { organizationName: true, slug: true } },
          ticketTypes: {
            where: { status: 'ACTIVE' },
            select: { price: true, currency: true, quantity: true, soldQuantity: true },
            orderBy: { price: 'asc' },
            take: 1,
          },
        },
      }),
      this.prisma.event.count({ where }),
    ]);
    return { items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
  }

  async detail(slug: string) {
    const event = await this.prisma.event.findFirst({
      where: { slug, status: EventStatus.PUBLISHED },
      include: {
        city: true,
        venue: true,
        category: true,
        organizer: {
          select: { organizationName: true, slug: true, description: true, logoUrl: true },
        },
        tags: true,
        speakers: { orderBy: { sortOrder: 'asc' } },
        schedule: { orderBy: { startAt: 'asc' } },
        ticketTypes: { where: { status: 'ACTIVE' }, orderBy: { price: 'asc' } },
        reviews: {
          select: {
            rating: true,
            comment: true,
            createdAt: true,
            user: { select: { name: true } },
          },
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!event) throw new NotFoundException('Event not found.');
    return event;
  }

  categories() {
    return this.prisma.category.findMany({ orderBy: { name: 'asc' } });
  }
  cities() {
    return this.prisma.city.findMany({ orderBy: { name: 'asc' } });
  }
}
