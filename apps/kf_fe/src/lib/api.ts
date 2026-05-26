import type { PageQuery, PageResult } from "@/types/api";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
  "http://103.173.66.91:3398";

type RequestOptions = {
  body?: unknown;
  headers?: HeadersInit;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
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

function buildUrl(path: string, query?: PageQuery | Record<string, unknown>) {
  const url = new URL(`${API_BASE_URL}${path}`);

  if (!query) {
    return url.toString();
  }

  if ("page" in query && query.page !== undefined) {
    url.searchParams.set("page", String(query.page));
  }

  if ("size" in query && query.size !== undefined) {
    url.searchParams.set("size", String(query.size));
  }

  if (typeof query.search === "string" && query.search.trim()) {
    url.searchParams.set("search", query.search.trim());
  }

  if (typeof query.sort === "string" && query.sort) {
    url.searchParams.set("sort", query.sort);
  }

  Object.entries(("filters" in query ? query.filters : query) ?? {}).forEach(([key, value]) => {
    if (["page", "size", "search", "sort", "filters"].includes(key)) {
      return;
    }

    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
}

export async function apiFetch<T>(
  path: string,
  query?: PageQuery | Record<string, unknown>,
  options?: RequestOptions,
) {
  const token = options?.token ?? getStoredToken();
  const hasBody = options?.body !== undefined;
  const response = await fetch(buildUrl(path, query), {
    body: hasBody ? JSON.stringify(options.body) : undefined,
    headers: {
      Accept: "application/json",
      ...(hasBody ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
    method: options?.method ?? (hasBody ? "POST" : "GET"),
    next: options?.next,
    signal: options?.signal,
  } as RequestInit);

  if (!response.ok) {
    throw new ApiError(await readError(response), response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function apiGet<T>(
  path: string,
  query?: PageQuery,
  options?: RequestOptions,
) {
  return apiFetch<T>(path, query, { ...options, method: "GET" });
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
