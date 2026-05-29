"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";
import { getCachedValue, invalidateApiCache, setCachedValue } from "@/lib/api/cache";

type UseApiResourceOptions = {
  enabled?: boolean;
  path: string;
  query?: Record<string, unknown>;
  token?: string | null;
};

export function useApiResource<TData>({
  enabled = true,
  path,
  query,
  token,
}: UseApiResourceOptions) {
  const [data, setData] = useState<TData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(enabled);
  const [refreshKey, setRefreshKey] = useState(0);
  const queryKey = useMemo(() => JSON.stringify(query ?? {}), [query]);
  const cacheKey = useMemo(() => `${path}?${queryKey}`, [path, queryKey]);

  const revalidate = useCallback(() => {
    invalidateApiCache(path);
    setRefreshKey((current) => current + 1);
  }, [path]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const controller = new AbortController();
    const cached = getCachedValue<TData>(cacheKey);

    if (cached) {
      queueMicrotask(() => {
        if (!controller.signal.aborted) {
          setData(cached);
          setError(null);
          setIsLoading(false);
        }
      });
      return () => controller.abort();
    }

    queueMicrotask(() => {
      if (!controller.signal.aborted) {
        setIsLoading(true);
        setError(null);
      }
    });

    apiFetch<TData>(path, queryKey ? JSON.parse(queryKey) : {}, {
      method: "GET",
      signal: controller.signal,
      token,
    })
      .then((result) => {
        setCachedValue(cacheKey, result);
        setData(result);
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }

        setError(err instanceof Error ? err.message : "Không thể tải dữ liệu");
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [cacheKey, enabled, path, queryKey, refreshKey, token]);

  return { data, error, isLoading, revalidate };
}
