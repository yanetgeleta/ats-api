import { PrismaPg } from '@prisma/adapter-pg';
import * as argon2 from 'argon2';
import 'dotenv/config';
import { PrismaClient } from 'src/generated/prisma/client';
import { Role } from 'src/generated/prisma/enums';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = 'admin@example.com';
  const adminPassword = 'Admin@12345';

  console.log('SEEDING THE DATABASE');

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
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Error during seeding:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
