import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const adminEmail = process.env.ADMIN_EMAIL as string;
  const adminPassword = process.env.ADMIN_PASSWORD as string;

  // cleanup the existing database
  await prisma.user.delete({ where: { email: adminEmail } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await prisma.user.create({
    data: {
      email: adminEmail,
      password: { create: { hash: hashedPassword } },
    },
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
