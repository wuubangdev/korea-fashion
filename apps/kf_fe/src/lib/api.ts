import type { PageQuery, PageResult } from "@/types/api";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
  "http://localhost:8080";

type RequestOptions = {
  signal?: AbortSignal;
  token?: string | null;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function getStoredToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("kf_token");
}

function buildUrl(path: string, query?: PageQuery) {
  const url = new URL(`${API_BASE_URL}${path}`);

  if (!query) {
    return url.toString();
  }

  url.searchParams.set("page", String(query.page));
  url.searchParams.set("size", String(query.size));

  if (query.search?.trim()) {
    url.searchParams.set("search", query.search.trim());
  }

  if (query.sort) {
    url.searchParams.set("sort", query.sort);
  }

  Object.entries(query.filters ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
}

export async function apiGet<T>(
  path: string,
  query?: PageQuery,
  options?: RequestOptions,
) {
  const token = options?.token ?? getStoredToken();
  const response = await fetch(buildUrl(path, query), {
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    signal: options?.signal,
  });

  if (!response.ok) {
    throw new ApiError(await readError(response), response.status);
  }

  return (await response.json()) as T;
}

export function getPage<T>(
  path: string,
  query: PageQuery,
  options?: RequestOptions,
) {
  return apiGet<PageResult<T>>(path, query, options);
}

async function readError(response: Response) {
  try {
    const body = await response.json();
    return body.message ?? body.error ?? `Request failed (${response.status})`;
  } catch {
    return `Request failed (${response.status})`;
  }
}
