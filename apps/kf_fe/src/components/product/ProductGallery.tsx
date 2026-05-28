"use client";

import type { Product } from "@/types/api";

export function ProductGallery({ product }: { product: Product }) {
  const images = Array.from({ length: 4 }, (_, index) => ({
    id: index,
    imageUrl: product.imageUrl,
  }));

  return (
    <div className="grid gap-4 md:grid-cols-[1fr_110px]">
      <div
        className="min-h-[560px] rounded-lg border border-stone-200 bg-stone-100"
        style={{
          backgroundImage: product.imageUrl ? `url('${product.imageUrl}')` : undefined,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      />
      <div className="hidden gap-3 md:grid">
        {images.slice(1).map((item) => (
          <div
            key={item.id}
            className="rounded-lg border border-stone-200 bg-stone-100"
            style={{
              backgroundImage: item.imageUrl ? `url('${item.imageUrl}')` : undefined,
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          />
        ))}
      </div>
    </div>
  );
}
