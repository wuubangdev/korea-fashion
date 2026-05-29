"use client";

import { SafeImage } from "@/components/SafeImage";
import type { Product } from "@/types/api";

export function ProductGallery({ product }: { product: Product }) {
  const images = Array.from({ length: 4 }, (_, index) => ({
    id: index,
    imageUrl: product.imageUrl,
  }));

  return (
    <div className="grid gap-4 md:grid-cols-[1fr_110px]">
      <SafeImage
        alt={product.name}
        className="min-h-[560px] rounded-lg border border-stone-200"
        sizes="(min-width: 768px) calc(100vw - 260px), 100vw"
        src={product.imageUrl}
      />
      <div className="hidden gap-3 md:grid">
        {images.slice(1).map((item) => (
          <SafeImage
            key={item.id}
            alt={product.name}
            className="min-h-[170px] rounded-lg border border-stone-200"
            sizes="110px"
            src={item.imageUrl}
          />
        ))}
      </div>
    </div>
  );
}
