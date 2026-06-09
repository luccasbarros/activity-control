import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "./pagination";

type SearchSource = Record<string, string | string[] | undefined>;

type QueryMessage = {
  key: "notice" | "error";
  value: string;
};

const listParams = ["priority", "category", "team", "assignee", "page", "pageSize"];
const transientParams = new Set(["notice", "error"]);

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

  if (params.get("page") === String(DEFAULT_PAGE)) {
    params.delete("page");
  }

  if (params.get("pageSize") === String(DEFAULT_PAGE_SIZE)) {
    params.delete("pageSize");
  }

  const query = params.toString();
  return query ? `/?${query}` : "/";
}

export function sanitizeReturnTo(returnTo: FormDataEntryValue | string | null) {
  const value = String(returnTo ?? "/");

  if (!value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }

  const url = new URL(value, "http://activity-control.local");

  for (const key of transientParams) {
    url.searchParams.delete(key);
  }

  return `${url.pathname}${url.search}`;
}

export function withQueryMessage(path: string, message: QueryMessage) {
  const cleanPath = sanitizeReturnTo(path);
  const url = new URL(cleanPath, "http://activity-control.local");

  for (const key of transientParams) {
    url.searchParams.delete(key);
  }

  url.searchParams.set(message.key, message.value);

  return `${url.pathname}${url.search}`;
}
