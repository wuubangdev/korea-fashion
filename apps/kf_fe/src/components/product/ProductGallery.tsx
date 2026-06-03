"use client";

import { useEffect, useMemo, useState } from "react";
import { SafeImage } from "@/components/SafeImage";
import type { Product } from "@/types/api";

type GalleryImage = {
  id: number;
  imageUrl?: string;
};

export function ProductGallery({ product }: { product: Product }) {
  const images = useMemo(() => getGalleryImages(product), [product]);
  const [selection, setSelection] = useState({ index: 0, productId: product.id });
  const activeIndex = selection.productId === product.id ? selection.index : 0;
  const activeImage = images[activeIndex] ?? images[0];

  useEffect(() => {
    if (images.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setSelection((current) => ({
        index: current.productId === product.id ? (current.index + 1) % images.length : 0,
        productId: product.id,
      }));
    }, 3500);

    return () => window.clearInterval(timer);
  }, [images.length, product.id]);

  return (
    <div className="flex flex-col gap-3 lg:sticky lg:top-24">
      <SafeImage
        alt={product.name}
        className="mx-auto aspect-square w-full max-w-[520px] rounded-lg border border-stone-200 transition"
        sizes="(min-width: 1024px) 50vw, 100vw"
        src={activeImage?.imageUrl}
      />
      <div className="flex max-w-full shrink-0 justify-center gap-2 overflow-x-auto pb-1">
        {images.map((item, index) => (
          <button
            key={item.id}
            aria-label={`Xem ảnh sản phẩm ${index + 1}`}
            className={`group relative h-16 w-16 shrink-0 overflow-hidden rounded-md border bg-white p-0.5 transition hover:-translate-y-0.5 hover:shadow-md ${
              index === activeIndex ? "border-stone-950 shadow-sm" : "border-stone-200"
            }`}
            type="button"
            onClick={() => setSelection({ index, productId: product.id })}
          >
            <SafeImage
              alt={product.name}
              className="h-full w-full rounded-[5px]"
              sizes="64px"
              src={item.imageUrl}
            />
            <span
              className={`absolute inset-x-2 bottom-1 h-0.5 origin-left rounded-full bg-stone-950 transition ${
                index === activeIndex ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

function getGalleryImages(product: Product): GalleryImage[] {
  const rawProduct = product as Product & {
    images?: Array<{ imageUrl?: string } | string>;
    productImages?: Array<{ imageUrl?: string } | string>;
  };
  const rawImages = rawProduct.images ?? rawProduct.productImages ?? [];
  const imageUrls = rawImages
    .map((item) => (typeof item === "string" ? item : item.imageUrl))
    .filter((imageUrl): imageUrl is string => Boolean(imageUrl?.trim()));
  const uniqueUrls = Array.from(new Set([product.imageUrl, ...imageUrls].filter(Boolean)));
  const fallbackUrls = uniqueUrls.length ? uniqueUrls : [product.imageUrl];

  return Array.from({ length: Math.max(fallbackUrls.length, 4) }, (_, index) => ({
    id: index,
    imageUrl: fallbackUrls[index % fallbackUrls.length],
  }));
}
