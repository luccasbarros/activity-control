import { Category, Prisma, Priority } from "@prisma/client";

const priorityValues = new Set<string>(Object.values(Priority));
const categoryValues = new Set<string>(Object.values(Category));

type FilterSource = Record<string, string | string[] | undefined>;

export type ActivityFilters = {
  priority?: Priority;
  category?: Category;
  team?: string;
  assignee?: string;
};

function firstValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function cleanText(value: string | string[] | undefined) {
  const text = firstValue(value)?.trim();
  return text ? text : undefined;
}

export function parseActivityFilters(source: FilterSource): ActivityFilters {
  const priority = cleanText(source.priority);
  const category = cleanText(source.category);

  return {
    ...(priority && priorityValues.has(priority)
      ? { priority: priority as Priority }
      : {}),
    ...(category && categoryValues.has(category)
      ? { category: category as Category }
      : {}),
    ...(cleanText(source.team) ? { team: cleanText(source.team) } : {}),
    ...(cleanText(source.assignee)
      ? { assignee: cleanText(source.assignee) }
      : {}),
  };
}

export function buildActivityWhereInput(
  filters: ActivityFilters,
): Prisma.ActivityWhereInput {
  return {
    ...(filters.priority ? { priority: filters.priority } : {}),
    ...(filters.category ? { category: filters.category } : {}),
    ...(filters.team ? { team: { contains: filters.team } } : {}),
    ...(filters.assignee ? { assignee: { contains: filters.assignee } } : {}),
  };
}

export function hasActiveFilters(filters: ActivityFilters) {
  return Object.values(filters).some(Boolean);
}
