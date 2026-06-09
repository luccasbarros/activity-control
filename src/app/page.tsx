import { createActivityAction } from "@/app/actions";
import { ActivityForm } from "@/components/activity-form";
import { ActivityTable } from "@/components/activity-table";
import { AppHeader } from "@/components/app-header";
import { ChangeHistory } from "@/components/change-history";
import { FilterBar } from "@/components/filter-bar";
import { requireCurrentUser } from "@/lib/auth";
import { MetricCards } from "@/components/metric-cards";
import { buildActivityWhereInput, parseActivityFilters } from "@/lib/filters";
import { calculateActivityMetrics } from "@/lib/metrics";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getSearchMessage(
  params: Record<string, string | string[] | undefined>,
  key: string,
) {
  const value = params[key];

  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export default async function Home({ searchParams }: PageProps) {
  const currentUser = await requireCurrentUser();
  const params = (await searchParams) ?? {};
  const filters = parseActivityFilters(params);
  const where = buildActivityWhereInput(filters);

  const [activities, allActivities, recentChanges] = await Promise.all([
    prisma.activity.findMany({
      where,
      orderBy: [{ updatedAt: "desc" }],
    }),
    prisma.activity.findMany({
      select: { status: true },
    }),
    prisma.activityChange.findMany({
      orderBy: [{ createdAt: "desc" }],
      take: 8,
    }),
  ]);

  const metrics = calculateActivityMetrics(allActivities);
  const error = getSearchMessage(params, "error");

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-8 px-5 py-8 lg:px-8">
      <AppHeader user={currentUser} />

      <MetricCards metrics={metrics} />

      <ChangeHistory changes={recentChanges} />

      {error ? <p className="alert">{error}</p> : null}

      <section className="panel">
        <div className="mb-5">
          <h2 className="text-2xl font-semibold text-ink">Create activity</h2>
          <p className="mt-2 text-sm leading-6 text-slate">
            Required fields are validated in the browser and again on the
            server before the activity is persisted.
          </p>
        </div>
        <ActivityForm action={createActivityAction} submitLabel="Create activity" />
      </section>

      <section className="grid gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-ink">Activity list</h2>
          <p className="mt-2 text-sm leading-6 text-slate">
            Filters are encoded in the URL so a reviewer can reproduce the same
            view after refresh.
          </p>
        </div>
        <FilterBar filters={filters} />
        <ActivityTable activities={activities} />
      </section>
    </main>
  );
}
