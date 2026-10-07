import { prisma } from "../src/lib/prisma";

async function main() {
  await prisma.task.deleteMany();

  await prisma.task.createMany({
    data: [
      {
        title: "Learn Express",
        description: "Practice Express API",
        completed: true,
        priority: "Medium",
      },
      {
        title: "Learn Testing",
        description: "Practice Vitest and Supertest",
        completed: true,
        priority: "High",
      },
      {
        title: "Learn Prisma",
        description: "Practice Prisma with PostgreSQL",
        completed: false,
        priority: "Critical",
      },
    ],
  });

  console.log("Database has been seeded. 🚀");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });