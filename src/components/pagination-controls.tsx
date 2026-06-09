import Link from "next/link";
import { type ActivityFilters } from "@/lib/filters";
import { buildActivityListPath } from "@/lib/navigation";
import {
  DEFAULT_PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
  type PaginationState,
} from "@/lib/pagination";

type PaginationControlsProps = {
  filters: ActivityFilters;
  pagination: PaginationState;
};

export function PaginationControls({
  filters,
  pagination,
}: PaginationControlsProps) {
  const source = {
    ...filters,
    pageSize: String(pagination.pageSize),
  };

  return (
    <nav
      aria-label="Activity pagination"
      className="panel flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
    >
      <p className="text-sm font-medium text-slate">
        Showing {pagination.itemStart}-{pagination.itemEnd} of{" "}
        {pagination.totalItems} activities
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <form className="flex items-center gap-2">
          {filters.priority ? (
            <input type="hidden" name="priority" value={filters.priority} />
          ) : null}
          {filters.category ? (
            <input type="hidden" name="category" value={filters.category} />
          ) : null}
          {filters.team ? <input type="hidden" name="team" value={filters.team} /> : null}
          {filters.assignee ? (
            <input type="hidden" name="assignee" value={filters.assignee} />
          ) : null}
          <label className="text-sm font-medium text-ink" htmlFor="pageSize">
            Page size
          </label>
          <select
            className="field min-h-10 w-24"
            defaultValue={pagination.pageSize}
            id="pageSize"
            name="pageSize"
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <button className="ghost-button" type="submit">
            Set
          </button>
        </form>

        <div className="flex items-center gap-2">
          {pagination.hasPreviousPage ? (
            <Link
              className="ghost-button"
              href={buildActivityListPath(source, {
                page: String(pagination.currentPage - 1),
              })}
            >
              Previous
            </Link>
          ) : (
            <span className="disabled-button">Previous</span>
          )}

          <span className="pill">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>

          {pagination.hasNextPage ? (
            <Link
              className="ghost-button"
              href={buildActivityListPath(source, {
                page: String(pagination.currentPage + 1),
              })}
            >
              Next
            </Link>
          ) : (
            <span className="disabled-button">Next</span>
          )}
        </div>

        {pagination.pageSize !== DEFAULT_PAGE_SIZE ? (
          <Link
            className="ghost-button"
            href={buildActivityListPath(filters, { page: "1" })}
          >
            Reset size
          </Link>
        ) : null}
      </div>
    </nav>
  );
}
