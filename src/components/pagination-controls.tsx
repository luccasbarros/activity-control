"use client";

import { type FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { flushSync } from "react-dom";
import { UI_COPY } from "@/lib/copy";
import { type ActivityFilters } from "@/lib/filters";
import { buildActivityListPath } from "@/lib/navigation";
import {
  DEFAULT_PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
  type PaginationState,
} from "@/lib/pagination";
import { ButtonSpinner } from "./button-spinner";
import { PendingLink } from "./pending-link";

type PaginationControlsProps = {
  filters: ActivityFilters;
  pagination: PaginationState;
};

export function PaginationControls({
  filters,
  pagination,
}: PaginationControlsProps) {
  const router = useRouter();
  const [pageSizePending, setPageSizePending] = useState(false);
  const source = {
    ...filters,
    pageSize: String(pagination.pageSize),
  };

  useEffect(() => {
    setPageSizePending(false);
  }, [pagination.currentPage, pagination.pageSize, pagination.totalItems]);

  function handlePageSizeSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const path = buildActivityListPath(
      {
        assignee: getFormValue(formData, "assignee"),
        category: getFormValue(formData, "category"),
        priority: getFormValue(formData, "priority"),
        team: getFormValue(formData, "team"),
      },
      {
        page: "1",
        pageSize: getFormValue(formData, "pageSize"),
      },
    );

    flushSync(() => setPageSizePending(true));

    if (path === `${window.location.pathname}${window.location.search}`) {
      setPageSizePending(false);
      return;
    }

    router.push(path);
  }

  return (
    <nav
      aria-label={UI_COPY.pagination.ariaLabel}
      className="panel flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
    >
      <p className="text-sm font-medium text-slate">
        {UI_COPY.pagination.showingLabel} {pagination.itemStart}-
        {pagination.itemEnd} {UI_COPY.pagination.pageOfLabel}{" "}
        {pagination.totalItems} {UI_COPY.pagination.activitiesLabel}
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <form
          className="flex items-center gap-2"
          onSubmit={handlePageSizeSubmit}
        >
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
            {UI_COPY.fields.pageSize}
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
          <button
            aria-busy={pageSizePending}
            className="ghost-button"
            disabled={pageSizePending}
            type="submit"
          >
            {pageSizePending ? (
              <>
                <ButtonSpinner />
                {UI_COPY.loading.updating}
              </>
            ) : (
              UI_COPY.actions.set
            )}
          </button>
        </form>

        <div className="flex items-center gap-2">
          {pagination.hasPreviousPage ? (
            <PendingLink
              className="ghost-button"
              href={buildActivityListPath(source, {
                page: String(pagination.currentPage - 1),
              })}
              pendingLabel={UI_COPY.loading.loading}
            >
              {UI_COPY.pagination.previous}
            </PendingLink>
          ) : (
            <span className="disabled-button">{UI_COPY.pagination.previous}</span>
          )}

          <span className="pill">
            {UI_COPY.pagination.pageLabel} {pagination.currentPage}{" "}
            {UI_COPY.pagination.pageOfLabel} {pagination.totalPages}
          </span>

          {pagination.hasNextPage ? (
            <PendingLink
              className="ghost-button"
              href={buildActivityListPath(source, {
                page: String(pagination.currentPage + 1),
              })}
              pendingLabel={UI_COPY.loading.loading}
            >
              {UI_COPY.pagination.next}
            </PendingLink>
          ) : (
            <span className="disabled-button">{UI_COPY.pagination.next}</span>
          )}
        </div>

        {pagination.pageSize !== DEFAULT_PAGE_SIZE ? (
          <PendingLink
            className="ghost-button"
            href={buildActivityListPath(filters, { page: "1" })}
            pendingLabel={UI_COPY.loading.resetting}
          >
            {UI_COPY.pagination.resetSize}
          </PendingLink>
        ) : null}
      </div>
    </nav>
  );
}

function getFormValue(formData: FormData, name: string) {
  const value = formData.get(name);

  return typeof value === "string" ? value : undefined;
}
