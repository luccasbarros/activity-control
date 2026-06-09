import Link from "next/link";
import { UI_COPY } from "@/lib/copy";
import { categoryOptions, priorityOptions } from "@/lib/options";
import { type ActivityFilters, hasActiveFilters } from "@/lib/filters";
import { DEFAULT_PAGE_SIZE } from "@/lib/pagination";
import { ROUTES } from "@/lib/routes";

type FilterBarProps = {
  filters: ActivityFilters;
  pageSize: number;
};

export function FilterBar({ filters, pageSize }: FilterBarProps) {
  return (
    <form className="panel grid gap-4 lg:grid-cols-[1fr_1fr_1fr_1fr_auto]">
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
        <button type="submit" className="secondary-button">
          {UI_COPY.actions.apply}
        </button>
        {hasActiveFilters(filters) ? (
          <Link
            href={
              pageSize === DEFAULT_PAGE_SIZE
                ? ROUTES.activities
                : `${ROUTES.activities}?pageSize=${pageSize}`
            }
            className="ghost-button"
          >
            {UI_COPY.actions.clear}
          </Link>
        ) : null}
      </div>
    </form>
  );
}
