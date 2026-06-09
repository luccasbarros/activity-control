import Link from "next/link";
import { categoryOptions, priorityOptions } from "@/lib/options";
import { type ActivityFilters, hasActiveFilters } from "@/lib/filters";

type FilterBarProps = {
  filters: ActivityFilters;
};

export function FilterBar({ filters }: FilterBarProps) {
  return (
    <form className="panel grid gap-4 lg:grid-cols-[1fr_1fr_1fr_1fr_auto]">
      <label className="grid gap-2 text-sm font-medium text-ink">
        <span>Priority</span>
        <select name="priority" defaultValue={filters.priority ?? ""} className="field">
          <option value="">All priorities</option>
          {priorityOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-2 text-sm font-medium text-ink">
        <span>Category</span>
        <select name="category" defaultValue={filters.category ?? ""} className="field">
          <option value="">All categories</option>
          {categoryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-2 text-sm font-medium text-ink">
        <span>Team</span>
        <input
          name="team"
          defaultValue={filters.team ?? ""}
          className="field"
          placeholder="Platform"
        />
      </label>

      <label className="grid gap-2 text-sm font-medium text-ink">
        <span>Assignee</span>
        <input
          name="assignee"
          defaultValue={filters.assignee ?? ""}
          className="field"
          placeholder="Alex"
        />
      </label>

      <div className="flex items-end gap-2">
        <button type="submit" className="secondary-button">
          Apply
        </button>
        {hasActiveFilters(filters) ? (
          <Link href="/" className="ghost-button">
            Clear
          </Link>
        ) : null}
      </div>
    </form>
  );
}
