import { apiFetch, type RequestOptions } from "../client";
import type { AuthRequest, AuthResponse } from "@/types/api";

export const authApi = {
  login: (body: Pick<AuthRequest, "password" | "username">, options?: RequestOptions) =>
    apiFetch<AuthResponse>("/api/auth/login", undefined, { ...options, body, method: "POST" }),
  register: (body: AuthRequest, options?: RequestOptions) =>
    apiFetch<AuthResponse>("/api/auth/register", undefined, { ...options, body, method: "POST" }),
};

export const login = authApi.login;
export const register = authApi.register;
