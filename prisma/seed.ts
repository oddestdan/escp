import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = "rachel@remix.run";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("racheliscool", 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  await prisma.note.create({
    data: {
      title: "My first note",
      body: "Hello, world!",
      userId: user.id,
    },
  });

  await prisma.note.create({
    data: {
      title: "My second note",
      body: "Hello, world!",
      userId: user.id,
    },
  });

  const posts = [
    {
      slug: "my-first-post",
      title: "My First Post",
      markdown: `
# This is my first post

Isn't it great?
    `.trim(),
    },
    {
      slug: "90s-mixtape",
      title: "A Mixtape I Made Just For You",
      markdown: `
# 90s Mixtape

- I wish (Skee-Lo)
- This Is How We Do It (Montell Jordan)
    `.trim(),
    },
  ];

  for (const post of posts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
  }

  // const appointments = [
  //   {
  //     date: "2022-07-15",
  //     timeFrom: "2022-07-15T09:45:00",
  //     timeTo: "2022-07-15T11:15:00",
  //   },
  //   {
  //     date: "2022-07-20",
  //     timeFrom: "2022-07-14T07:45:00",
  //     timeTo: "2022-07-14T08:45:00",
  //   },
  // ];

  // for (const appointment of appointments) {
  //   await prisma.appointment.create({
  //     data: { ...appointment },
  //   });
  // }

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
