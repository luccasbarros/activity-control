import Link from "next/link";
import { X } from "lucide-react";
import { type ActivityFilters, hasActiveFilters } from "@/lib/filters";
import { buildActivityListPath } from "@/lib/navigation";
import { categoryOptions, getLabel, priorityOptions } from "@/lib/options";

type ActiveFilterChipsProps = {
  filters: ActivityFilters;
  pageSize: number;
};

export function ActiveFilterChips({ filters, pageSize }: ActiveFilterChipsProps) {
  if (!hasActiveFilters(filters)) {
    return null;
  }

  const source = {
    ...filters,
    pageSize: String(pageSize),
  };
  const chips = [
    filters.priority
      ? {
          key: "priority",
          label: `Priority: ${getLabel(priorityOptions, filters.priority)}`,
        }
      : null,
    filters.category
      ? {
          key: "category",
          label: `Category: ${getLabel(categoryOptions, filters.category)}`,
        }
      : null,
    filters.team ? { key: "team", label: `Team: ${filters.team}` } : null,
    filters.assignee
      ? { key: "assignee", label: `Assignee: ${filters.assignee}` }
      : null,
  ].filter((chip): chip is { key: keyof ActivityFilters; label: string } =>
    Boolean(chip),
  );

  return (
    <div aria-label="Active filters" className="filter-chip-list">
      {chips.map((chip) => (
        <Link
          className="filter-chip"
          href={buildActivityListPath(source, { [chip.key]: "" })}
          key={chip.key}
        >
          {chip.label}
          <X aria-hidden="true" size={14} />
        </Link>
      ))}
    </div>
  );
}
