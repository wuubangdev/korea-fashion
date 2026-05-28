"use client";

import { useCallback, useState } from "react";
import { apiFetch } from "@/lib/api";

type MutationOptions<TBody> = {
  body?: TBody;
  headers?: HeadersInit;
  method?: "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  token?: string | null;
};

export function useApiMutation<TData, TBody = unknown>() {
  const [data, setData] = useState<TData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const mutate = useCallback(async (options: MutationOptions<TBody>) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await apiFetch<TData>(options.path, undefined, {
        body: options.body,
        headers: options.headers,
        method: options.method ?? "POST",
        token: options.token,
      });

      setData(result);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Không thể kết nối API";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return { data, error, isLoading, mutate, reset };
}
