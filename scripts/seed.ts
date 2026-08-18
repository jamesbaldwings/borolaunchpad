import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Seed hidden test admin account
  const hashedPassword = await bcrypt.hash('BgoDi*DTV2', 10);
  await prisma.user.upsert({
    where: { email: 'abacus-0583e856@example.com' },
    update: {},
    create: {
      email: 'abacus-0583e856@example.com',
      name: 'Admin',
      password: hashedPassword,
      role: 'admin',
    },
  });

  // Seed hosts
  const janice = await prisma.host.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'Janice Miller',
      bio: 'Janice has been teaching art for 22 years and loves helping people discover their creative side. She believes everyone can paint — you just need the right vibe and a glass of wine.',
      photoUrl: 'https://cdn.abacus.ai/images/5339a7ec-32e1-4a04-8ef4-5137b9a67a0a.png',
      email: 'janice@example.com',
      phone: '(615) 555-0101',
      isSpotlight: true,
      spotlightQuote: 'I never thought I could teach outside of a classroom. BLP gave me a space that felt like my backyard — but better.',
      spotlightStory: 'Janice hosted her first Paint & Sip at Boro Launch Pad on a whim. She\'d been teaching high school art for over two decades and wanted to try something different — a relaxed evening where adults could paint, laugh, and not worry about grades. That first event had 8 people. Her second had 14. Now she\'s a regular, and her events fill up fast. "I didn\'t need a gallery or a studio," she says. "I just needed a place to start."',
      eventsHostedCount: 3,
    },
  });

  const marcus = await prisma.host.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      name: 'Marcus Chen',
      bio: 'Marcus is a self-taught chef and food enthusiast who turned his love for charcuterie into hands-on workshops. His boards are almost too pretty to eat.',
      photoUrl: 'https://cdn.abacus.ai/images/eae20af4-4a6e-47fa-acac-17261f63868b.png',
      email: 'marcus@example.com',
      phone: '(615) 555-0202',
      isSpotlight: false,
      eventsHostedCount: 1,
    },
  });

  const sarah = await prisma.host.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      name: 'Sarah Okonkwo',
      bio: 'Sarah is a certified yoga instructor who specializes in outdoor wellness experiences. She believes nature is the best studio.',
      photoUrl: 'https://cdn.abacus.ai/images/4297e302-f08b-42d1-a3ee-11db424eafd6.png',
      email: 'sarah@example.com',
      phone: '(615) 555-0303',
      isSpotlight: false,
      eventsHostedCount: 1,
    },
  });

  // Seed events
  await prisma.event.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      title: 'Paint & Sip with Janice',
      description: 'An easygoing painting evening under the string lights. No experience needed — just show up, grab a brush, and see what happens. Janice has taught art for 22 years and this is her 3rd event at BLP. Wine and light snacks provided. Limited spots available.',
      category: 'Teach Something',
      eventDate: new Date('2026-09-12'),
      startTime: '6:00 PM',
      endTime: '9:00 PM',
      price: 35.00,
      spotsTotal: 14,
      spotsRemaining: 6,
      isSoldOut: false,
      isPublished: true,
      hostId: 1,
      imageUrl: 'https://cdn.abacus.ai/images/0362524a-4a74-47a2-af0c-dbf979d6dbbb.png',
      registrationType: 'blp',
    },
  });

  await prisma.event.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      title: 'Build Your Own Charcuterie Board',
      description: 'Learn how to build a stunning charcuterie board from scratch. Marcus walks you through selecting cheeses, meats, fruits, and garnishes — then you assemble and take home your own board. All materials included.',
      category: 'Build Something',
      eventDate: new Date('2026-09-20'),
      startTime: '2:00 PM',
      endTime: '4:30 PM',
      price: 45.00,
      spotsTotal: 12,
      spotsRemaining: 12,
      isSoldOut: false,
      isPublished: true,
      hostId: 2,
      imageUrl: 'https://cdn.abacus.ai/images/335cd18c-8d8d-4a07-9439-27e008fdbb8c.png',
      registrationType: 'blp',
    },
  });

  await prisma.event.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      title: 'Morning Flow: Outdoor Yoga',
      description: 'Start your Saturday with a grounding yoga flow in the fresh air. All levels welcome — Sarah creates a welcoming space whether you\'ve been practicing for years or this is your first downward dog. Bring your own mat or borrow one of ours.',
      category: 'Wellness & Experiences',
      eventDate: new Date('2026-09-27'),
      startTime: '8:00 AM',
      endTime: '9:30 AM',
      price: 20.00,
      spotsTotal: 16,
      spotsRemaining: 10,
      isSoldOut: false,
      isPublished: true,
      hostId: 3,
      imageUrl: 'https://cdn.abacus.ai/images/34cd236f-e6a4-4864-a6d5-7bb23e144a97.png',
      registrationType: 'blp',
    },
  });

  // Seed packages
  await prisma.package.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'Space Only',
      description: 'For experienced hosts who already have most of what they need.',
      priceDisplay: 'Contact Us for Pricing',
      features: JSON.parse(JSON.stringify([
        'Venue access',
        'Covered gathering area',
        'Basic lounge seating',
        'Parking for up to 12 vehicles',
        'Standard property use',
      ])),
      sortOrder: 1,
      isActive: true,
    },
  });

  await prisma.package.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      name: 'Event Ready',
      description: 'For hosts who want more of the setup handled.',
      priceDisplay: 'Contact Us for Pricing',
      features: JSON.parse(JSON.stringify([
        'Everything in Space Only',
        'Additional chairs',
        'Tables',
        'Pop-up tents available',
        'Coolers available',
        'Weather protection available',
      ])),
      sortOrder: 2,
      isActive: true,
    },
  });

  await prisma.package.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      name: 'Host Plus',
      description: 'For hosts who need full event infrastructure.',
      priceDisplay: 'Contact Us for Pricing',
      features: JSON.parse(JSON.stringify([
        'Everything in Event Ready',
        'Small food/beverage service trailer (availability varies)',
        'Full event setup support',
        'Additional coordination',
      ])),
      sortOrder: 3,
      isActive: true,
    },
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
