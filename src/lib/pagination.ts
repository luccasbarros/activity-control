export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 5;
export const PAGE_SIZE_OPTIONS = [5, 10, 20] as const;

type PaginationSource = Record<string, string | string[] | undefined>;

export type PaginationParams = {
  page: number;
  pageSize: (typeof PAGE_SIZE_OPTIONS)[number];
};

export type PaginationState = {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  skip: number;
  take: number;
  itemStart: number;
  itemEnd: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function positiveInteger(value: string | string[] | undefined) {
  const parsed = Number(firstValue(value));

  if (!Number.isInteger(parsed) || parsed < 1) {
    return null;
  }

  return parsed;
}

export function parsePaginationParams(source: PaginationSource): PaginationParams {
  const page = positiveInteger(source.page) ?? DEFAULT_PAGE;
  const requestedPageSize = positiveInteger(source.pageSize);
  const pageSize = PAGE_SIZE_OPTIONS.includes(
    requestedPageSize as PaginationParams["pageSize"],
  )
    ? (requestedPageSize as PaginationParams["pageSize"])
    : DEFAULT_PAGE_SIZE;

  return { page, pageSize };
}

export function getPaginationState({
  totalItems,
  requestedPage,
  pageSize,
}: {
  totalItems: number;
  requestedPage: number;
  pageSize: number;
}): PaginationState {
  const safeTotal = Math.max(0, totalItems);
  const totalPages = Math.max(1, Math.ceil(safeTotal / pageSize));
  const currentPage = Math.min(Math.max(1, requestedPage), totalPages);
  const skip = (currentPage - 1) * pageSize;
  const itemStart = safeTotal === 0 ? 0 : skip + 1;
  const itemEnd = Math.min(skip + pageSize, safeTotal);

  return {
    currentPage,
    pageSize,
    totalItems: safeTotal,
    totalPages,
    skip,
    take: pageSize,
    itemStart,
    itemEnd,
    hasPreviousPage: currentPage > 1,
    hasNextPage: currentPage < totalPages,
  };
}
