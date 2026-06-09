import {
  ActivityStatus,
  Category,
  PrismaClient,
  Priority,
} from "@prisma/client";

const prisma = new PrismaClient();

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
  await prisma.activity.deleteMany();
  await prisma.activity.createMany({ data: activities });
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
