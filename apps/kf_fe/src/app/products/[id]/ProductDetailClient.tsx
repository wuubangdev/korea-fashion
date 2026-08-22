"use client";

import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfoPanel } from "@/components/product/ProductInfoPanel";
import { ProductReviews } from "@/components/product/ProductReviews";
import { SuggestedProductsCarousel } from "@/components/product/SuggestedProductsCarousel";
import { StoreFooter } from "@/components/StoreFooter";
import { StoreHeader } from "@/components/StoreHeader";
import { useApiResource } from "@/hooks/useApiResource";
import type { Product } from "@/types/api";

export function ProductDetailClient({ productId }: { productId: string }) {
  const product = useApiResource<Product>({
    path: `/api/storefront/products/${productId}`,
  });
  const currentProduct = product.data;

  return (
    <main className="min-h-screen bg-stone-50 text-stone-950">
      <StoreHeader />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {product.error ? (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{product.error}</div>
        ) : null}

        {currentProduct ? (
          <>
            <div className="overflow-hidden rounded-xl border border-stone-200 bg-white p-4 shadow-xl shadow-stone-950/5 sm:p-5 lg:p-6">
              <div className="grid min-w-0 items-start gap-6 lg:grid-cols-2 lg:gap-8">
                <ProductGallery product={currentProduct} />
                <ProductInfoPanel product={currentProduct} />
              </div>
            </div>
            <SuggestedProductsCarousel product={currentProduct} />
            <ProductReviews product={currentProduct} />
          </>
        ) : (
          <div className="h-[560px] animate-pulse rounded-lg bg-stone-200" />
        )}
      </div>
      <StoreFooter />
    </main>
  );
}
