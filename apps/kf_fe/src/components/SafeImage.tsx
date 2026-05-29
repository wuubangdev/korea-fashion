"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
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

const fallbackImage = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f5f5f4"/>
      <stop offset="1" stop-color="#e7e5e4"/>
    </linearGradient>
  </defs>
  <rect width="800" height="1000" fill="url(#bg)"/>
  <path d="M260 330h280l42 92-62 26-28-58v330H308V390l-28 58-62-26 42-92z" fill="#d6d3d1"/>
  <path d="M332 330c10 36 34 56 68 56s58-20 68-56" fill="none" stroke="#a8a29e" stroke-width="20" stroke-linecap="round"/>
</svg>
`)}`;

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
  const [currentSrc, setCurrentSrc] = useState(safeSrc);

  useEffect(() => {
    setCurrentSrc(safeSrc);
  }, [safeSrc]);

  return (
    <div className={cn("relative overflow-hidden bg-stone-100", className)}>
      <Image
        unoptimized
        fill
        alt={alt || fallbackLabel}
        className={cn("object-cover", imgClassName)}
        priority={priority}
        sizes={sizes}
        src={currentSrc}
        onError={() => setCurrentSrc(fallbackImage)}
      />
    </div>
  );
}

function normalizeImageSrc(src?: string | null) {
  const value = src?.trim();
  if (!value) {
    return fallbackImage;
  }

  return value;
}
