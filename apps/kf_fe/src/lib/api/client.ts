import type { PageQuery, PageResult } from "@/types/api";
import { invalidateApiCache } from "@/lib/api/cache";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
  "https://api.sieunhon.top";

export type RequestOptions = {
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

type ApiResponseEnvelope<T> = {
  data: T;
  message?: string;
  success: boolean;
  timestamp?: string;
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

  const token = localStorage.getItem("kf_token");
  if (isJwtExpired(token)) {
    clearStoredAuthSession();
    return null;
  }

  return token;
}

export function buildUrl(path: string, query?: PageQuery | Record<string, unknown>) {
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
  const token = options?.token === undefined ? getStoredToken() : getActiveRequestToken(options.token);
  const hasBody = options?.body !== undefined;
  const isFormData = typeof FormData !== "undefined" && options?.body instanceof FormData;
  const response = await fetch(buildUrl(path, query), {
    body: hasBody ? (isFormData ? options.body as BodyInit : JSON.stringify(options.body)) : undefined,
    headers: {
      Accept: "application/json",
      ...(hasBody && !isFormData ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
    method: options?.method ?? (hasBody ? "POST" : "GET"),
    next: options?.next,
    signal: options?.signal,
  } as RequestInit);

  if (!response.ok) {
    if (response.status === 401 && token) {
      clearStoredAuthSession();
    }
    throw new ApiError(await readError(response), response.status);
  }

  if (response.status === 204) {
    if ((options?.method ?? (hasBody ? "POST" : "GET")) !== "GET") {
      invalidateApiCache();
    }
    return undefined as T;
  }

  const result = unwrapApiResponse<T>(await readResponseBody(response));
  if ((options?.method ?? (hasBody ? "POST" : "GET")) !== "GET") {
    invalidateApiCache();
  }
  return result;
}

export async function apiGet<T>(
  path: string,
  query?: PageQuery | Record<string, unknown>,
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
  let rawMessage = "";
  try {
    const body = await response.json();
    rawMessage = String(body.message ?? body.error ?? "");
  } catch {
    rawMessage = "";
  }

  return toFriendlyErrorMessage(response.status, rawMessage);
}

function getActiveRequestToken(token: string | null) {
  if (isJwtExpired(token)) {
    clearStoredAuthSession();
    return null;
  }

  return token;
}

function toFriendlyErrorMessage(status: number, rawMessage: string) {
  const normalized = rawMessage.toLowerCase();

  if (status === 401 || normalized.includes("unauthorized") || normalized.includes("login required")) {
    return "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
  }

  if (status === 403 || normalized.includes("forbidden") || normalized.includes("insufficient role")) {
    return "Bạn không có quyền thực hiện thao tác này.";
  }

  if (status === 404) {
    return "Không tìm thấy dữ liệu cần xử lý.";
  }

  if (status === 413 || normalized.includes("payload too large") || normalized.includes("maximum upload size")) {
    return "File quá lớn so với giới hạn upload hiện tại. Vui lòng chọn file nhỏ hơn hoặc liên hệ quản trị viên.";
  }

  if (
    normalized.includes("could not commit jpa transaction") ||
    normalized.includes("data too long") ||
    normalized.includes("constraint") ||
    normalized.includes("sql") ||
    normalized.includes("duplicate")
  ) {
    if (normalized.includes("email") || normalized.includes("duplicate")) {
      return "Email này đã được sử dụng hoặc chưa hợp lệ. Vui lòng kiểm tra lại.";
    }

    return "Không thể lưu thay đổi lúc này. Vui lòng kiểm tra thông tin và thử lại.";
  }

  if (status >= 500) {
    return "Hệ thống đang gặp sự cố. Vui lòng thử lại sau ít phút.";
  }

  if (status === 400 || status === 422) {
    return rawMessage && !looksTechnical(rawMessage)
      ? rawMessage
      : "Thông tin chưa hợp lệ. Vui lòng kiểm tra lại.";
  }

  return rawMessage && !looksTechnical(rawMessage)
    ? rawMessage
    : "Không thể hoàn tất thao tác. Vui lòng thử lại.";
}

function looksTechnical(message: string) {
  const normalized = message.toLowerCase();
  return (
    normalized.includes("request failed") ||
    normalized.includes("exception") ||
    normalized.includes("transaction") ||
    normalized.includes("hibernate") ||
    normalized.includes("jpa") ||
    normalized.includes("sql") ||
    normalized.includes("constraint") ||
    normalized.includes("stack")
  );
}

async function readResponseBody(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

function unwrapApiResponse<T>(body: unknown) {
  if (isApiResponseEnvelope<T>(body)) {
    return body.data;
  }

  return body as T;
}

function isApiResponseEnvelope<T>(body: unknown): body is ApiResponseEnvelope<T> {
  return (
    typeof body === "object" &&
    body !== null &&
    "success" in body &&
    "data" in body &&
    typeof (body as { success: unknown }).success === "boolean"
  );
}

function clearStoredAuthSession() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem("kf_token");
  localStorage.removeItem("kf_username");
  localStorage.removeItem("kf_avatar");
  document.cookie = "kf_token=; path=/; max-age=0; SameSite=Lax";
  window.dispatchEvent(new Event("auth:update"));
}

function isJwtExpired(token: string | null | undefined) {
  if (!token) {
    return false;
  }

  const [, payload] = token.split(".");
  if (!payload) {
    return true;
  }

  try {
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const decoded = JSON.parse(globalThis.atob(padded)) as { exp?: number };
    return Boolean(decoded.exp && decoded.exp * 1000 <= Date.now());
  } catch {
    return true;
  }
}
