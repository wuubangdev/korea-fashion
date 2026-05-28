import { crudEndpoint, deleteAction, postAction } from "../resource";
import type { RequestOptions } from "../client";
import type { User } from "@/types/api";

export type UserPayload = {
  email?: string;
  password?: string;
  roles?: Array<string | { id?: number; name?: string }>;
  username?: string;
};

export const usersApi = {
  ...crudEndpoint<User, UserPayload, UserPayload>("/api/users"),
  bulkDelete: (ids: number[], options?: RequestOptions) =>
    deleteAction<void, number[]>("/api/users/bulk", ids, options),
  bulkHardDelete: (ids: number[], options?: RequestOptions) =>
    deleteAction<void, number[]>("/api/users/hard/bulk", ids, options),
  copy: (id: number, options?: RequestOptions) =>
    postAction<User>(`/api/users/${id}/copy`, undefined, options),
};
