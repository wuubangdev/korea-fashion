const DEFAULT_AUTH_REDIRECT_PATH = "/admin";

export function getSafeAuthRedirectPath(search: string) {
  const nextPath = new URLSearchParams(search).get("next");

  if (!nextPath || !nextPath.startsWith("/") || nextPath.startsWith("//")) {
    return DEFAULT_AUTH_REDIRECT_PATH;
  }

  return nextPath;
}
