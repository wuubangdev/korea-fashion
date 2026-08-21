"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";

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

  const revalidate = useCallback(() => {
    setRefreshKey((current) => current + 1);
  }, []);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const controller = new AbortController();

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
      .then(setData)
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }

        setError(err instanceof Error ? err.message : "Không thể tải dữ liệu");
        setData(null);
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [enabled, path, queryKey, refreshKey, token]);

  return { data, error, isLoading, revalidate };
}
