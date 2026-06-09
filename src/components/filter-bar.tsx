"use client";

import { type FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { flushSync } from "react-dom";
import { UI_COPY } from "@/lib/copy";
import { categoryOptions, priorityOptions } from "@/lib/options";
import { type ActivityFilters, hasActiveFilters } from "@/lib/filters";
import { DEFAULT_PAGE_SIZE } from "@/lib/pagination";
import { ROUTES } from "@/lib/routes";
import { buildActivityListPath } from "@/lib/navigation";
import { ButtonSpinner } from "./button-spinner";
import { PendingLink } from "./pending-link";

type FilterBarProps = {
  filters: ActivityFilters;
  pageSize: number;
};

export function FilterBar({ filters, pageSize }: FilterBarProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setPending(false);
  }, [
    filters.assignee,
    filters.category,
    filters.priority,
    filters.team,
    pageSize,
  ]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const path = buildActivityListPath(
      {
        assignee: getFormValue(formData, "assignee"),
        category: getFormValue(formData, "category"),
        priority: getFormValue(formData, "priority"),
        team: getFormValue(formData, "team"),
      },
      { pageSize: getFormValue(formData, "pageSize") },
    );

    flushSync(() => setPending(true));

    if (path === `${window.location.pathname}${window.location.search}`) {
      setPending(false);
      return;
    }

    router.push(path);
  }

  return (
    <form
      aria-label={UI_COPY.filters.ariaLabel}
      className="panel grid gap-4 lg:grid-cols-[1fr_1fr_1fr_1fr_auto]"
      onSubmit={handleSubmit}
    >
      <input name="pageSize" type="hidden" value={pageSize} />

      <label className="grid gap-2 text-sm font-medium text-ink">
        <span>{UI_COPY.fields.priority}</span>
        <select name="priority" defaultValue={filters.priority ?? ""} className="field">
          <option value="">{UI_COPY.filters.allPriorities}</option>
          {priorityOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-2 text-sm font-medium text-ink">
        <span>{UI_COPY.fields.category}</span>
        <select name="category" defaultValue={filters.category ?? ""} className="field">
          <option value="">{UI_COPY.filters.allCategories}</option>
          {categoryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-2 text-sm font-medium text-ink">
        <span>{UI_COPY.fields.team}</span>
        <input
          name="team"
          defaultValue={filters.team ?? ""}
          className="field"
          placeholder={UI_COPY.filters.teamPlaceholder}
        />
      </label>

      <label className="grid gap-2 text-sm font-medium text-ink">
        <span>{UI_COPY.fields.assignee}</span>
        <input
          name="assignee"
          defaultValue={filters.assignee ?? ""}
          className="field"
          placeholder={UI_COPY.filters.assigneePlaceholder}
        />
      </label>

      <div className="flex items-end gap-2">
        <button
          aria-busy={pending}
          className="secondary-button"
          disabled={pending}
          type="submit"
        >
          {pending ? (
            <>
              <ButtonSpinner />
              {UI_COPY.loading.applying}
            </>
          ) : (
            UI_COPY.actions.apply
          )}
        </button>
        {hasActiveFilters(filters) ? (
          <PendingLink
            href={
              pageSize === DEFAULT_PAGE_SIZE
                ? ROUTES.activities
                : `${ROUTES.activities}?pageSize=${pageSize}`
            }
            className="ghost-button"
            pendingLabel={UI_COPY.loading.resetting}
          >
            {UI_COPY.actions.clear}
          </PendingLink>
        ) : null}
      </div>
    </form>
  );
}

function getFormValue(formData: FormData, name: string) {
  const value = formData.get(name);

  return typeof value === "string" ? value : undefined;
}
