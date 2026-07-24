import { PrismaPg } from '@prisma/adapter-pg';
import * as argon2 from 'argon2';
import 'dotenv/config';
import { PrismaClient } from 'src/generated/prisma/client';
import {
  ApplicationStatus,
  InternshipTrack,
  Role,
} from 'src/generated/prisma/enums';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = 'admin@example.com';
  const adminPassword = 'Admin@12345';

  console.log('SEEDING THE DATABASE');
  console.log('Seeding admin');

  const hashedPassword = await argon2.hash(adminPassword);

  // id, createdAt, email, name, password, role
  const admin = await prisma.admin.upsert({
    where: { email: adminEmail },
    update: { password: hashedPassword },
    create: {
      email: adminEmail,
      name: 'Yanet Geleta',
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  console.log(`Admin seeded successfully: ${admin.email}`);

  const seedApplicants = [
    {
      name: 'Alice Smith',
      email: 'alice.smith@example.com',
      track: InternshipTrack.FRONT_END_WEB_DEVELOPMENT,
      status: ApplicationStatus.PENDING,
      phone: '+251911111111',
    },
    {
      name: 'Bob Jones',
      email: 'bob.jones@example.com',
      track: InternshipTrack.BACK_END_DEVELOPMENT,
      status: ApplicationStatus.SHORTLISTED,
      notes:
        'Strong Node.js background. Completed take-home challenge beautifully.',
    },
    {
      name: 'Charlie Brown',
      email: 'charlie.brown@example.com',
      track: InternshipTrack.MOBILE_DEVELOPMENT,
      status: ApplicationStatus.ACCEPTED,
      notes: 'Fluent in Flutter and Dart. Approved for final onboarding.',
    },
    {
      name: 'Diana Prince',
      email: 'diana.prince@example.com',
      track: InternshipTrack.UI_UX_DESIGN,
      status: ApplicationStatus.REJECTED,
      notes: 'Portfolio lacked interactive responsive web designs.',
    },
    {
      name: 'Evan Wright',
      email: 'evan.wright@example.com',
      track: InternshipTrack.DATA_ANALYTICS,
      status: ApplicationStatus.PENDING,
    },
    {
      name: 'Fiona Gallagher',
      email: 'fiona.g@example.com',
      track: InternshipTrack.BACK_END_DEVELOPMENT,
      status: ApplicationStatus.PENDING,
    },
    {
      name: 'George Clark',
      email: 'george.clark@example.com',
      track: InternshipTrack.FRONT_END_WEB_DEVELOPMENT,
      status: ApplicationStatus.SHORTLISTED,
      notes: 'Has solid React experience, moving to interview phase.',
    },
    {
      name: 'Hannah Abbott',
      email: 'hannah.a@example.com',
      track: InternshipTrack.UI_UX_DESIGN,
      status: ApplicationStatus.ACCEPTED,
      notes: 'Exceptional Figma portfolio and great communication skills.',
    },
  ];

  for (const applicant of seedApplicants) {
    await prisma.applicant.upsert({
      where: { email: applicant.email },
      update: {},
      create: {
        name: applicant.name,
        email: applicant.email,
        track: applicant.track,
        status: applicant.status,
        phone: applicant.phone,
        notes: applicant.notes,
      },
    });
  }

  console.log(`Seeded ${seedApplicants.length} applicant profiles cleanly.`);
}

main()
  .catch((e) => {
    console.error('Seeding process failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('Seeding connection closed.');
  });
