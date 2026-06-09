import {
  ActivityChangeType,
  ActivityStatus,
  Category,
  PrismaClient,
  Priority,
  UserRole,
} from "@prisma/client";
import { hashPassword } from "../src/lib/password";

const prisma = new PrismaClient();

const demoUser = {
  email: "admin@example.com",
  name: "Demo Admin",
  password: "ActivityControl123!",
};

const activities = [
  {
    title: "Fix login callback failure",
    description:
      "Users reported intermittent failures after returning from the OAuth provider. Review logs and validate callback handling.",
    priority: Priority.CRITICAL,
    category: Category.BUG,
    team: "Platform",
    assignee: "Marina Costa",
    status: ActivityStatus.BLOCKED,
  },
  {
    title: "Add assignee filter",
    description:
      "Add a combinable assignee filter to the activity control screen.",
    priority: Priority.HIGH,
    category: Category.FEATURE,
    team: "Product",
    assignee: "Alex Morgan",
    status: ActivityStatus.IN_PROGRESS,
  },
  {
    title: "Review support copy",
    description:
      "Update error messages to reduce repeated tickets in the support request flow.",
    priority: Priority.MEDIUM,
    category: Category.SUPPORT,
    team: "Support",
    assignee: "Bianca Lima",
    status: ActivityStatus.PENDING,
  },
  {
    title: "Improve responsive table layout",
    description:
      "Adjust columns and visual hierarchy for narrow screens without hiding essential information.",
    priority: Priority.MEDIUM,
    category: Category.IMPROVEMENT,
    team: "Frontend",
    assignee: "Rafael Souza",
    status: ActivityStatus.IN_PROGRESS,
  },
  {
    title: "Close monthly reconciliation routine",
    description:
      "Validate the operational checklist and mark remaining issues before month-end closing.",
    priority: Priority.LOW,
    category: Category.OPERATIONAL,
    team: "Operations",
    assignee: "Carolina Mendes",
    status: ActivityStatus.DONE,
  },
  {
    title: "Monitor notification incident",
    description:
      "Monitor the notification queue and confirm recovery after the latency spike.",
    priority: Priority.HIGH,
    category: Category.OPERATIONAL,
    team: "SRE",
    assignee: "Diego Alves",
    status: ActivityStatus.PENDING,
  },
];

async function main() {
  const password = hashPassword(demoUser.password);
  const user = await prisma.user.upsert({
    where: { email: demoUser.email },
    update: {
      name: demoUser.name,
      role: UserRole.ADMIN,
    },
    create: {
      email: demoUser.email,
      name: demoUser.name,
      role: UserRole.ADMIN,
      passwordHash: password.passwordHash,
      passwordSalt: password.passwordSalt,
    },
  });

  const activityCount = await prisma.activity.count();

  if (activityCount > 0) {
    const changeCount = await prisma.activityChange.count();

    if (changeCount === 0) {
      const existingActivities = await prisma.activity.findMany();

      for (const activity of existingActivities) {
        await prisma.activityChange.create({
          data: {
            activityId: activity.id,
            activityTitle: activity.title,
            type: ActivityChangeType.CREATED,
            summary: "Backfilled seed activity history.",
            actorId: user.id,
            actorName: user.name,
          },
        });
      }
    }

    return;
  }

  for (const activity of activities) {
    const createdActivity = await prisma.activity.create({ data: activity });
    await prisma.activityChange.create({
      data: {
        activityId: createdActivity.id,
        activityTitle: createdActivity.title,
        type: ActivityChangeType.CREATED,
        summary: "Seeded demo activity.",
        actorId: user.id,
        actorName: user.name,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
