import { apiFetch, apiGet, getPage, type RequestOptions } from "../client";
import type { MediaAsset, PageQuery } from "@/types/api";

export type CreateMediaLinkPayload = {
  folder: string;
  name: string;
  url: string;
};

export type UpdateMediaPayload = {
  folder: string;
  name: string;
  url?: string;
};

type CreateFolderResponse = {
  folder: string;
};

export const mediaApi = {
  createFolder: (folder: string, options?: RequestOptions) =>
    apiFetch<CreateFolderResponse>("/api/media/folders", undefined, { ...options, body: { folder }, method: "POST" })
      .then((result) => result.folder),
  createLink: (body: CreateMediaLinkPayload, options?: RequestOptions) =>
    apiFetch<MediaAsset>("/api/media/link", undefined, { ...options, body, method: "POST" }),
  delete: (id: number, options?: RequestOptions) =>
    apiFetch<void>(`/api/media/${id}`, undefined, { ...options, method: "DELETE" }),
  folders: (options?: RequestOptions) => apiGet<string[]>("/api/media/folders", undefined, options),
  hardDelete: (id: number, options?: RequestOptions) =>
    apiFetch<void>(`/api/media/${id}/hard`, undefined, { ...options, method: "DELETE" }),
  list: (query: PageQuery & { folder?: string }, options?: RequestOptions) => getPage<MediaAsset>("/api/media", query, options),
  restore: (id: number, options?: RequestOptions) =>
    apiFetch<void>(`/api/media/${id}/restore`, undefined, { ...options, method: "POST" }),
  trash: (query: PageQuery, options?: RequestOptions) => getPage<MediaAsset>("/api/media/trash", query, options),
  update: (id: number, body: UpdateMediaPayload, options?: RequestOptions) =>
    apiFetch<MediaAsset>(`/api/media/${id}`, undefined, { ...options, body, method: "PUT" }),
  upload: (file: File, folder: string, name?: string, options?: RequestOptions) => {
    const body = new FormData();
    body.append("file", file);
    body.append("folder", folder);
    if (name) {
      body.append("name", name);
    }
    return apiFetch<MediaAsset>("/api/media/upload", undefined, { ...options, body, method: "POST" });
  },
};
