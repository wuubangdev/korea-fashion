"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type SafeImageProps = {
  alt: string;
  className?: string;
  fallbackLabel?: string;
  imgClassName?: string;
  priority?: boolean;
  sizes?: string;
  src?: string | null;
};

export function SafeImage({
  alt,
  className,
  fallbackLabel = "Korea Fashion",
  imgClassName,
  priority,
  sizes = "100vw",
  src,
}: SafeImageProps) {
  const safeSrc = useMemo(() => normalizeImageSrc(src), [src]);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showFallback = !safeSrc || failedSrc === safeSrc;

  return (
    <div className={cn("relative isolate min-h-0 min-w-0 overflow-hidden bg-stone-100", className)}>
      {showFallback ? (
        <div
          aria-label={alt || fallbackLabel}
          className="absolute inset-0 flex select-none flex-col items-center justify-center gap-2 bg-gradient-to-br from-stone-100 to-stone-200 p-4 text-center text-stone-500"
          role="img"
        >
          <svg aria-hidden="true" className="h-8 w-8" fill="none" viewBox="0 0 24 24">
            <path d="m3 3 18 18M10.6 10.6 5 16h11m-9-3.5V5h10v9.5M8 8h.01" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
          <span className="max-w-full truncate text-xs font-medium">{fallbackLabel}</span>
        </div>
      ) : (
        <Image
          unoptimized
          fill
          alt={alt || fallbackLabel}
          className={cn("object-cover", imgClassName)}
          priority={priority}
          sizes={sizes}
          src={safeSrc}
          onError={() => setFailedSrc(safeSrc)}
        />
      )}
    </div>
  );
}

function normalizeImageSrc(src?: string | null) {
  const value = src?.trim();
  if (!value) {
    return null;
  }

  if (value.startsWith("/") && !value.startsWith("//")) {
    return value;
  }

  if (value.startsWith("data:image/") || value.startsWith("blob:")) {
    return value;
  }

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? value : null;
  } catch {
    return /^[\w%+.,@~-]+(?:\/[\w%+.,@~-]+)*\.(?:avif|gif|jpe?g|png|svg|webp)(?:\?.*)?$/i.test(value)
      ? `/${value}`
      : null;
  }
}
