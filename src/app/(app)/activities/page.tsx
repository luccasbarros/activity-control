import Link from "next/link";
import { Plus } from "lucide-react";
import { ActiveFilterChips } from "@/components/active-filter-chips";
import { ActivityTable } from "@/components/activity-table";
import { FilterBar } from "@/components/filter-bar";
import { PageHeading } from "@/components/page-heading";
import { PaginationControls } from "@/components/pagination-controls";
import { Toast } from "@/components/toast";
import { buildActivityWhereInput, parseActivityFilters } from "@/lib/filters";
import { buildActivityListPath } from "@/lib/navigation";
import { getNotification } from "@/lib/notifications";
import { getPaginationState, parsePaginationParams } from "@/lib/pagination";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

type ActivitiesPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getSearchMessage(
  params: Record<string, string | string[] | undefined>,
  key: string,
) {
  const value = params[key];

  return Array.isArray(value) ? value[0] : value;
}

export default async function ActivitiesPage({
  searchParams,
}: ActivitiesPageProps) {
  const params = (await searchParams) ?? {};
  const filters = parseActivityFilters(params);
  const paginationParams = parsePaginationParams(params);
  const where = buildActivityWhereInput(filters);
  const totalActivities = await prisma.activity.count({ where });
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
  const notification = getNotification({
    error: getSearchMessage(params, "error"),
    notice: getSearchMessage(params, "notice"),
  });
  const returnTo = buildActivityListPath(params);

  return (
    <div className="page-stack">
      <Toast notification={notification} />
      <PageHeading
        actions={
          <Link className="primary-button" href="/activities/new">
            <Plus aria-hidden="true" size={16} />
            New activity
          </Link>
        }
        description="Filter, review, edit, and delete internal activities."
        eyebrow="Activity operations"
        title="Activities"
      />
      <FilterBar filters={filters} pageSize={pagination.pageSize} />
      <ActiveFilterChips filters={filters} pageSize={pagination.pageSize} />
      <ActivityTable activities={activities} returnTo={returnTo} />
      <PaginationControls filters={filters} pagination={pagination} />
    </div>
  );
}
