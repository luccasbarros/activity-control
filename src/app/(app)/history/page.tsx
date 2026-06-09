import { ChangeHistory } from "@/components/change-history";
import { PageHeading } from "@/components/page-heading";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const changes = await prisma.activityChange.findMany({
    orderBy: [{ createdAt: "desc" }],
    take: 40,
  });

  return (
    <div className="page-stack">
      <PageHeading
        description="Review recent create, update, and delete events recorded by Server Actions."
        eyebrow="Operational monitor"
        title="History"
      />
      <ChangeHistory changes={changes} />
    </div>
  );
}
