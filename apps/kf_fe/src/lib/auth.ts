import { apiFetch } from "@/lib/api";
import { isTokenExpired, parseJwtPayload } from "@/lib/authRoles";
import type { AuthRequest, AuthResponse } from "@/types/api";

export const AUTH_TOKEN_KEY = "kf_token";
export const AUTH_USER_KEY = "kf_username";
export const AUTH_AVATAR_KEY = "kf_avatar";
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
  localStorage.removeItem(AUTH_AVATAR_KEY);
  document.cookie = `${AUTH_TOKEN_KEY}=${encodeURIComponent(
    auth.token,
  )}; path=/; max-age=${AUTH_COOKIE_MAX_AGE}; SameSite=Lax`;
  window.dispatchEvent(new Event("auth:update"));
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
  localStorage.removeItem(AUTH_AVATAR_KEY);
  document.cookie = `${AUTH_TOKEN_KEY}=; path=/; max-age=0; SameSite=Lax`;
  window.dispatchEvent(new Event("auth:update"));
}

export function getActiveAuthToken() {
  if (typeof window === "undefined") {
    return null;
  }

  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) {
    return null;
  }

  if (isTokenExpired(parseJwtPayload(token))) {
    clearAuthSession();
    return null;
  }

  return token;
}

export function getAuthTokenExpirationMs(token: string | null | undefined) {
  const payload = parseJwtPayload(token);
  return payload?.exp ? payload.exp * 1000 : null;
}
