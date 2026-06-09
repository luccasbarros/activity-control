import { createActivityAction } from "@/app/actions";
import { ActivityForm } from "@/components/activity-form";
import { ActivityTable } from "@/components/activity-table";
import { AppHeader } from "@/components/app-header";
import { ChangeHistory } from "@/components/change-history";
import { FilterBar } from "@/components/filter-bar";
import { PaginationControls } from "@/components/pagination-controls";
import { SectionNavigation } from "@/components/section-navigation";
import { Toast } from "@/components/toast";
import { requireCurrentUser } from "@/lib/auth";
import { MetricCards } from "@/components/metric-cards";
import { buildActivityWhereInput, parseActivityFilters } from "@/lib/filters";
import { calculateActivityMetrics } from "@/lib/metrics";
import { buildActivityListPath } from "@/lib/navigation";
import { getNotification } from "@/lib/notifications";
import { getPaginationState, parsePaginationParams } from "@/lib/pagination";
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
  const paginationParams = parsePaginationParams(params);
  const where = buildActivityWhereInput(filters);

  const [totalActivities, allActivities, recentChanges] = await Promise.all([
    prisma.activity.count({ where }),
    prisma.activity.findMany({
      select: { status: true },
    }),
    prisma.activityChange.findMany({
      orderBy: [{ createdAt: "desc" }],
      take: 8,
    }),
  ]);

  const pagination = getPaginationState({
    totalItems: totalActivities,
    requestedPage: paginationParams.page,
    pageSize: paginationParams.pageSize,
  });

  const activities = await prisma.activity.findMany({
    where,
    orderBy: [{ updatedAt: "desc" }],
    skip: pagination.skip,
    take: pagination.take,
  });

  const metrics = calculateActivityMetrics(allActivities);
  const error = getSearchMessage(params, "error");
  const notice = getSearchMessage(params, "notice");
  const notification = getNotification({ error, notice });
  const returnTo = buildActivityListPath(params);

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-8 px-5 py-8 lg:px-8">
      <Toast notification={notification} />

      <AppHeader user={currentUser} />

      <SectionNavigation />

      <MetricCards metrics={metrics} />

      <ChangeHistory changes={recentChanges} />

      <section className="panel scroll-mt-28" id="create-activity">
        <div className="mb-5">
          <h2 className="text-2xl font-semibold text-ink">Create activity</h2>
          <p className="mt-2 text-sm leading-6 text-slate">
            Required fields are validated in the browser and again on the
            server before the activity is persisted.
          </p>
        </div>
        <ActivityForm
          action={createActivityAction}
          returnTo={returnTo}
          submitLabel="Create activity"
        />
      </section>

      <section className="grid scroll-mt-28 gap-4" id="activity-list">
        <div>
          <h2 className="text-2xl font-semibold text-ink">Activity list</h2>
          <p className="mt-2 text-sm leading-6 text-slate">
            Filters are encoded in the URL so the same view can be reproduced
            after refresh.
          </p>
        </div>
        <FilterBar filters={filters} pageSize={pagination.pageSize} />
        <ActivityTable activities={activities} returnTo={returnTo} />
        <PaginationControls filters={filters} pagination={pagination} />
      </section>
    </main>
  );
}
