import { apiFetch } from "@/lib/api";
import type { AuthRequest, AuthResponse } from "@/types/api";

export const AUTH_TOKEN_KEY = "kf_token";
export const AUTH_USER_KEY = "kf_username";
const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24;

export function login(payload: AuthRequest) {
  return apiFetch<AuthResponse>("/api/auth/login", undefined, {
    body: payload,
    method: "POST",
    token: null,
  });
}

export function register(payload: AuthRequest) {
  return apiFetch<AuthResponse>("/api/auth/register", undefined, {
    body: payload,
    method: "POST",
    token: null,
  });
}

export function saveAuthSession(auth: AuthResponse) {
  localStorage.setItem(AUTH_TOKEN_KEY, auth.token);
  localStorage.setItem(AUTH_USER_KEY, auth.username);
  document.cookie = `${AUTH_TOKEN_KEY}=${encodeURIComponent(
    auth.token,
  )}; path=/; max-age=${AUTH_COOKIE_MAX_AGE}; SameSite=Lax`;
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
  document.cookie = `${AUTH_TOKEN_KEY}=; path=/; max-age=0; SameSite=Lax`;
}
