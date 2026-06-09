import { ChangeHistory } from "@/components/change-history";
import { DashboardPanels } from "@/components/dashboard-panels";
import { MetricCards } from "@/components/metric-cards";
import { PageHeading } from "@/components/page-heading";
import { calculateActivityMetrics } from "@/lib/metrics";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [activities, recentChanges] = await Promise.all([
    prisma.activity.findMany({
      orderBy: [{ updatedAt: "desc" }],
    }),
    prisma.activityChange.findMany({
      orderBy: [{ createdAt: "desc" }],
      take: 6,
    }),
  ]);

  const metrics = calculateActivityMetrics(activities);

  return (
    <div className="page-stack">
      <PageHeading
        description="Track status, risk, workload, and recent operational movement."
        eyebrow="Operations overview"
        title="Dashboard"
      />
      <MetricCards metrics={metrics} />
      <DashboardPanels activities={activities} />
      <ChangeHistory changes={recentChanges} />
    </div>
  );
}
