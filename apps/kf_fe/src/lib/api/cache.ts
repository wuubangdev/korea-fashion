const cache = new Map<string, { expiresAt: number; value: unknown }>();
const DEFAULT_TTL = 30_000;

export function getCachedValue<T>(key: string): T | null {
  const item = cache.get(key);
  if (!item) {
    return null;
  }

  if (item.expiresAt < Date.now()) {
    cache.delete(key);
    return null;
  }

  return item.value as T;
}

export function setCachedValue(key: string, value: unknown, ttl = DEFAULT_TTL) {
  cache.set(key, {
    expiresAt: Date.now() + ttl,
    value,
  });
}

export function invalidateApiCache(prefix?: string) {
  if (!prefix) {
    cache.clear();
    return;
  }

  Array.from(cache.keys()).forEach((key) => {
    if (key.startsWith(prefix)) {
      cache.delete(key);
    }
  });
}
