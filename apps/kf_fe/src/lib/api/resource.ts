import { apiFetch, apiGet, getPage, type RequestOptions } from "./client";
import type { PageQuery, PageResult } from "@/types/api";

export type ResourceId = string | number;
export type IdType = "number" | "string";

export type CrudEndpoint<T, TCreate = Partial<T>, TUpdate = Partial<T>> = {
  basePath: string;
  create: (body: TCreate, options?: RequestOptions) => Promise<T>;
  delete: (id: ResourceId, options?: RequestOptions) => Promise<void>;
  get: (id: ResourceId, options?: RequestOptions) => Promise<T>;
  hardDelete: (id: ResourceId, options?: RequestOptions) => Promise<void>;
  list: (query?: Partial<PageQuery>, options?: RequestOptions) => Promise<PageResult<T>>;
  update: (id: ResourceId, body: TUpdate, options?: RequestOptions) => Promise<T>;
};

export function crudEndpoint<T, TCreate = Partial<T>, TUpdate = Partial<T>>(
  basePath: string,
): CrudEndpoint<T, TCreate, TUpdate> {
  return {
    basePath,
    create: (body, options) => apiFetch<T>(basePath, undefined, { ...options, body, method: "POST" }),
    delete: (id, options) => apiFetch<void>(`${basePath}/${id}`, undefined, { ...options, method: "DELETE" }),
    get: (id, options) => apiGet<T>(`${basePath}/${id}`, undefined, options),
    hardDelete: (id, options) => apiFetch<void>(`${basePath}/${id}/hard`, undefined, { ...options, method: "DELETE" }),
    list: (query = {}, options) => getPage<T>(basePath, { page: 0, size: 10, sort: "id,desc", ...query }, options),
    update: (id, body, options) => apiFetch<T>(`${basePath}/${id}`, undefined, { ...options, body, method: "PUT" }),
  };
}

export function postAction<TResponse = void, TBody = unknown>(
  path: string,
  body?: TBody,
  options?: RequestOptions,
) {
  return apiFetch<TResponse>(path, undefined, { ...options, body, method: "POST" });
}

export function putAction<TResponse = void, TBody = unknown>(
  path: string,
  body?: TBody,
  options?: RequestOptions,
) {
  return apiFetch<TResponse>(path, undefined, { ...options, body, method: "PUT" });
}

export function deleteAction<TResponse = void, TBody = unknown>(
  path: string,
  body?: TBody,
  options?: RequestOptions,
) {
  return apiFetch<TResponse>(path, undefined, { ...options, body, method: "DELETE" });
}
