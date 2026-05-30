export type JwtPayload = {
  exp?: number;
  iat?: number;
  roles?: string[];
  sub?: string;
};

const ADMIN_ROLES = new Set(["ADMIN", "SUPER_ADMIN", "SUPPER_ADMIN"]);

export function parseJwtPayload(token: string | null | undefined): JwtPayload | null {
  if (!token) {
    return null;
  }

  const [, payload] = token.split(".");
  if (!payload) {
    return null;
  }

  try {
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    return JSON.parse(globalThis.atob(padded)) as JwtPayload;
  } catch {
    return null;
  }
}

export function normalizeRole(role: string) {
  return role.trim().toUpperCase().replace(/^ROLE_/, "");
}

export function hasAdminAccessRole(roles: string[] | undefined) {
  return roles?.some((role) => ADMIN_ROLES.has(normalizeRole(role))) ?? false;
}

export function isTokenExpired(payload: JwtPayload | null, now = Date.now()) {
  return Boolean(payload?.exp && payload.exp * 1000 <= now);
}

export function hasAdminAccessToken(token: string | null | undefined, now = Date.now()) {
  const payload = parseJwtPayload(token);

  return Boolean(payload && !isTokenExpired(payload, now) && hasAdminAccessRole(payload.roles));
}
