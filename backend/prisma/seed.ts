import { PrismaClient, TaskStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.task.count();
  if (count > 0) {
    console.log("Database already seeded, skipping.");
    return;
  }

  await prisma.task.createMany({
    data: [
      {
        title: "Set up Render PostgreSQL",
        description: "Create a managed Postgres instance and copy DATABASE_URL.",
        status: TaskStatus.DONE,
      },
      {
        title: "Deploy backend web service",
        description: "Connect repo, set env vars, and verify /health/db.",
        status: TaskStatus.IN_PROGRESS,
      },
      {
        title: "Deploy frontend static site",
        description: "Point VITE_API_URL at the backend service URL.",
        status: TaskStatus.TODO,
      },
    ],
  });

  console.log("Seeded sample tasks.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
