import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "./pagination";
import { INTERNAL_URL_BASE, ROUTES } from "./routes";
import { QUERY_PARAMS } from "./constants";

type SearchSource = Record<string, string | string[] | undefined>;

type QueryMessage = {
  key: "notice" | "error";
  value: string;
};

const listParams = [
  QUERY_PARAMS.priority,
  QUERY_PARAMS.category,
  QUERY_PARAMS.team,
  QUERY_PARAMS.assignee,
  QUERY_PARAMS.page,
  QUERY_PARAMS.pageSize,
];
const transientParams = new Set([QUERY_PARAMS.notice, QUERY_PARAMS.error]);

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function appendIfPresent(params: URLSearchParams, key: string, value: string | null) {
  const cleaned = value?.trim();

  if (cleaned) {
    params.set(key, cleaned);
  }
}

export function buildActivityListPath(source: SearchSource, overrides: SearchSource = {}) {
  const params = new URLSearchParams();

  for (const key of listParams) {
    appendIfPresent(params, key, firstValue(overrides[key] ?? source[key]) ?? null);
  }

  if (params.get(QUERY_PARAMS.page) === String(DEFAULT_PAGE)) {
    params.delete(QUERY_PARAMS.page);
  }

  if (params.get(QUERY_PARAMS.pageSize) === String(DEFAULT_PAGE_SIZE)) {
    params.delete(QUERY_PARAMS.pageSize);
  }

  const query = params.toString();
  return query ? `${ROUTES.activities}?${query}` : ROUTES.activities;
}

export function sanitizeReturnTo(returnTo: FormDataEntryValue | string | null) {
  const value = String(returnTo ?? ROUTES.dashboard);

  if (!value.startsWith(ROUTES.root) || value.startsWith("//")) {
    return ROUTES.dashboard;
  }

  const url = new URL(value, INTERNAL_URL_BASE);

  for (const key of transientParams) {
    url.searchParams.delete(key);
  }

  return `${url.pathname}${url.search}`;
}

export function withQueryMessage(path: string, message: QueryMessage) {
  const cleanPath = sanitizeReturnTo(path);
  const url = new URL(cleanPath, INTERNAL_URL_BASE);

  for (const key of transientParams) {
    url.searchParams.delete(key);
  }

  url.searchParams.set(message.key, message.value);

  return `${url.pathname}${url.search}`;
}
