"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getPage } from "@/lib/api";
import type { PageQuery, PageResult } from "@/types/api";

type UsePaginatedResourceOptions = {
  path: string;
  initialPage?: number;
  initialSize?: number;
  initialSearch?: string;
  initialSort?: string;
  initialFilters?: PageQuery["filters"];
};

const emptyPage = <T,>(page: number, size: number): PageResult<T> => ({
  content: [],
  page,
  size,
  totalElements: 0,
  totalPages: 0,
});

export function usePaginatedResource<T>({
  path,
  initialPage = 0,
  initialSize = 10,
  initialSearch = "",
  initialSort = "id,desc",
  initialFilters = {},
}: UsePaginatedResourceOptions) {
  const [page, setPage] = useState(initialPage);
  const [size, setSize] = useState(initialSize);
  const [search, setSearchValue] = useState(initialSearch);
  const [sort, setSortValue] = useState(initialSort);
  const [filters, setFilters] = useState<PageQuery["filters"]>(initialFilters);
  const [data, setData] = useState<PageResult<T>>(emptyPage(initialPage, initialSize));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const query = useMemo(
    () => ({ page, size, search, sort, filters }),
    [filters, page, search, size, sort],
  );

  const refresh = useCallback(() => {
    setRefreshKey((current) => current + 1);
  }, []);

  const setSearch = useCallback((value: string) => {
    setPage(0);
    setSearchValue(value);
  }, []);

  const setSort = useCallback((value: string) => {
    setPage(0);
    setSortValue(value);
  }, []);

  const updateFilter = useCallback(
    (key: string, value: string | number | boolean | undefined | null) => {
      setPage(0);
      setFilters((current) => ({ ...current, [key]: value }));
    },
    [],
  );

  useEffect(() => {
    const controller = new AbortController();

    setIsLoading(true);
    setError(null);

    getPage<T>(path, query, { signal: controller.signal })
      .then(setData)
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }

        setError(err instanceof Error ? err.message : "Khong the tai du lieu");
        setData(emptyPage<T>(page, size));
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [page, path, query, refreshKey, size]);

  return {
    data,
    error,
    filters,
    isLoading,
    page,
    query,
    refresh,
    search,
    setPage,
    setSearch,
    setSize,
    setSort,
    sort,
    updateFilter,
  };
}
