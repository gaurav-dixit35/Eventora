import { PrismaClient, EventStatus, OrganizerStatus, TicketTypeStatus } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

const cities = [
  ['Mumbai', 'mumbai'],
  ['Thane', 'thane'],
  ['Navi Mumbai', 'navi-mumbai'],
  ['Pune', 'pune'],
  ['Bengaluru', 'bengaluru'],
  ['Delhi', 'delhi'],
  ['Hyderabad', 'hyderabad'],
] as const;
const categories = [
  'Music',
  'Theatre',
  'Technology',
  'Sports',
  'Gaming',
  'Education',
  'Business',
  'Startup',
  'Comedy',
  'Art',
  'Festival',
  'Workshop',
] as const;
const venueSeeds = [
  ['Nehru Centre', 'nehru-centre', 'Mumbai', 'Dr Annie Besant Road, Worli', 19.0176, 72.8165],
  [
    'The Courtyard',
    'the-courtyard-thane',
    'Thane',
    'Pokhran Road No. 2, Thane West',
    19.2183,
    72.9781,
  ],
  [
    'CIDCO Exhibition Centre',
    'cidco-exhibition-centre',
    'Navi Mumbai',
    'Vashi, Navi Mumbai',
    19.0771,
    72.9986,
  ],
  ['Balewadi High Street', 'balewadi-high-street', 'Pune', 'Balewadi, Pune', 18.5708, 73.7726],
  [
    'Bangalore International Centre',
    'bangalore-international-centre',
    'Bengaluru',
    'Domlur, Bengaluru',
    12.9611,
    77.6387,
  ],
  [
    'India Habitat Centre',
    'india-habitat-centre',
    'Delhi',
    'Lodhi Road, New Delhi',
    28.588,
    77.225,
  ],
  [
    'HITEX Exhibition Centre',
    'hitex-exhibition-centre',
    'Hyderabad',
    'Izzathnagar, Hyderabad',
    17.4702,
    78.3721,
  ],
] as const;
const eventSeeds = [
  [
    'Mumbai Future Tech Summit',
    'mumbai-future-tech-summit',
    'Technology',
    'Mumbai',
    EventStatus.PUBLISHED,
  ],
  ['Indie Music By The Bay', 'indie-music-by-the-bay', 'Music', 'Mumbai', EventStatus.PUBLISHED],
  ['Thane Startup Mixer', 'thane-startup-mixer', 'Startup', 'Thane', EventStatus.PUBLISHED],
  [
    'Navi Mumbai Game Jam',
    'navi-mumbai-game-jam',
    'Gaming',
    'Navi Mumbai',
    EventStatus.PENDING_REVIEW,
  ],
  ['Pune Design Workshop', 'pune-design-workshop', 'Workshop', 'Pune', EventStatus.PUBLISHED],
  [
    'Bengaluru Product Night',
    'bengaluru-product-night',
    'Business',
    'Bengaluru',
    EventStatus.DRAFT,
  ],
  ['Delhi Laugh Festival', 'delhi-laugh-festival', 'Comedy', 'Delhi', EventStatus.PUBLISHED],
  ['Hyderabad Art Walk', 'hyderabad-art-walk', 'Art', 'Hyderabad', EventStatus.PUBLISHED],
  ['Pune Campus Theatre', 'pune-campus-theatre', 'Theatre', 'Pune', EventStatus.COMPLETED],
  ['Mumbai Weekend Football', 'mumbai-weekend-football', 'Sports', 'Mumbai', EventStatus.CANCELLED],
  ['Bengaluru Code Camp', 'bengaluru-code-camp', 'Education', 'Bengaluru', EventStatus.PUBLISHED],
  [
    'Delhi Culture Carnival',
    'delhi-culture-carnival',
    'Festival',
    'Delhi',
    EventStatus.PENDING_REVIEW,
  ],
] as const;

async function main(): Promise<void> {
  await prisma.auditLog.deleteMany();
  await prisma.complaint.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.subscriptionPlan.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.review.deleteMany();
  await prisma.savedEvent.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.bookingItem.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.ticketType.deleteMany();
  await prisma.eventScheduleItem.deleteMany();
  await prisma.eventSpeaker.deleteMany();
  await prisma.eventTag.deleteMany();
  await prisma.event.deleteMany();
  await prisma.venue.deleteMany();
  await prisma.category.deleteMany();
  await prisma.organizer.deleteMany();
  await prisma.userRole.deleteMany();
  await prisma.role.deleteMany();
  await prisma.user.deleteMany();
  await prisma.city.deleteMany();

  const [adminRole, organizerRole, attendeeRole] = await Promise.all(
    ['ADMIN', 'ORGANIZER', 'ATTENDEE'].map((name) => prisma.role.create({ data: { name } })),
  );
  const passwordHash = await hash('EventoraDev123!', 12);
  const [admin, organizerUser, attendee] = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Eventora Admin',
        email: 'admin@eventora.test',
        phone: '9000000001',
        passwordHash,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Eventora Organizer',
        email: 'organizer@eventora.test',
        phone: '9000000002',
        passwordHash,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Eventora Attendee',
        email: 'attendee@eventora.test',
        phone: '9000000003',
        passwordHash,
      },
    }),
  ]);
  await prisma.userRole.createMany({
    data: [
      { userId: admin.id, roleId: adminRole.id },
      { userId: organizerUser.id, roleId: organizerRole.id },
      { userId: attendee.id, roleId: attendeeRole.id },
    ],
  });
  const organizer = await prisma.organizer.create({
    data: {
      userId: organizerUser.id,
      organizationName: 'Eventora Studios',
      slug: 'eventora-studios',
      description: 'Synthetic development organizer. Never use seeded credentials in production.',
      verificationStatus: OrganizerStatus.VERIFIED,
    },
  });

  const cityRecords = new Map<string, string>();
  for (const [name, slug] of cities) {
    const city = await prisma.city.create({ data: { name, slug } });
    cityRecords.set(name, city.id);
  }
  const categoryRecords = new Map<string, string>();
  for (const name of categories) {
    const category = await prisma.category.create({
      data: { name, slug: name.toLowerCase().replaceAll(' ', '-') },
    });
    categoryRecords.set(name, category.id);
  }
  const venueRecords = new Map<string, string>();
  for (const [name, slug, cityName, address, latitude, longitude] of venueSeeds) {
    const cityId = cityRecords.get(cityName);
    if (!cityId) throw new Error(`Missing city: ${cityName}`);
    const venue = await prisma.venue.create({
      data: { name, slug, cityId, address, latitude, longitude, capacity: 1200 },
    });
    venueRecords.set(cityName, venue.id);
  }

  const now = new Date();
  for (const [index, [title, slug, categoryName, cityName, status]] of eventSeeds.entries()) {
    const cityId = cityRecords.get(cityName);
    const categoryId = categoryRecords.get(categoryName);
    const venueId = venueRecords.get(cityName);
    if (!cityId || !categoryId || !venueId)
      throw new Error(`Incomplete event relation for ${title}`);
    const startAt = new Date(now.getTime() + (index + 2) * 86_400_000);
    const endAt = new Date(startAt.getTime() + 4 * 3_600_000);
    const saleStart = new Date(startAt.getTime() - 30 * 86_400_000);
    const saleEnd = new Date(startAt.getTime() - 3_600_000);
    await prisma.event.create({
      data: {
        title,
        slug,
        categoryId,
        cityId,
        venueId,
        organizerId: organizer.id,
        status,
        shortDescription: `A curated ${categoryName.toLowerCase()} experience in ${cityName}.`,
        description: `${title} is seeded development data for Eventora discovery and ticketing flows.`,
        startAt,
        endAt,
        terms: 'Development seed event terms.',
        refundPolicy: 'Development seed refund policy.',
        tags: {
          create: [
            { name: categoryName.toLowerCase() },
            { name: cityName.toLowerCase().replaceAll(' ', '-') },
          ],
        },
        speakers: {
          create: [
            {
              name: 'Aarav Mehta',
              title: 'Featured Speaker',
              biography: 'Synthetic speaker profile.',
              sortOrder: 1,
            },
          ],
        },
        schedule: {
          create: [
            {
              title: 'Registration',
              startAt,
              endAt: new Date(startAt.getTime() + 30 * 60_000),
              sortOrder: 1,
            },
            {
              title: 'Main session',
              startAt: new Date(startAt.getTime() + 30 * 60_000),
              endAt,
              sortOrder: 2,
            },
          ],
        },
        ticketTypes: {
          create: [
            {
              name: 'Free',
              price: 0,
              quantity: 50,
              maxPerOrder: 2,
              saleStart,
              saleEnd,
              status: TicketTypeStatus.ACTIVE,
            },
            {
              name: 'General',
              price: 499,
              quantity: 200,
              maxPerOrder: 6,
              saleStart,
              saleEnd,
              status: TicketTypeStatus.ACTIVE,
            },
            {
              name: 'Student',
              price: 299,
              quantity: 75,
              maxPerOrder: 2,
              saleStart,
              saleEnd,
              status: TicketTypeStatus.ACTIVE,
            },
            {
              name: 'VIP',
              price: 1499,
              quantity: 30,
              maxPerOrder: 4,
              saleStart,
              saleEnd,
              status: TicketTypeStatus.ACTIVE,
            },
            {
              name: 'Early Bird',
              price: 349,
              quantity: 40,
              maxPerOrder: 4,
              saleStart,
              saleEnd,
              status: TicketTypeStatus.ACTIVE,
            },
          ],
        },
      },
    });
  }
  await prisma.subscriptionPlan.createMany({
    data: [
      { name: 'Gold', slug: 'gold', price: 99, benefits: ['Early access'] },
      {
        name: 'Platinum',
        slug: 'platinum',
        price: 199,
        benefits: ['Early access', 'Priority booking'],
      },
    ],
  });
  console.info(
    'Seeded Eventora development data. Test password for all seeded users: EventoraDev123!',
  );
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
