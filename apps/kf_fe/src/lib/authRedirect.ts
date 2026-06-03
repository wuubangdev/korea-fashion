"use client";

import { usePathname, useSearchParams } from "next/navigation";

export function buildLoginHref(nextPath: string) {
  const safeNextPath = nextPath && nextPath.startsWith("/") && !nextPath.startsWith("//") ? nextPath : "/";
  return `/login?next=${encodeURIComponent(safeNextPath)}`;
}

export function useLoginRedirectHref(fallbackPath = "/") {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  return buildLoginHref(`${pathname || fallbackPath}${query ? `?${query}` : ""}`);
}
