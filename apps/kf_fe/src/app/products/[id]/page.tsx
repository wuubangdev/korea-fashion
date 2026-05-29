"use client";

import { useParams } from "next/navigation";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfoPanel } from "@/components/product/ProductInfoPanel";
import { ProductReviews } from "@/components/product/ProductReviews";
import { SuggestedProductsCarousel } from "@/components/product/SuggestedProductsCarousel";
import { StoreFooter } from "@/components/StoreFooter";
import { StoreHeader } from "@/components/StoreHeader";
import { useApiResource } from "@/hooks/useApiResource";
import type { Product } from "@/types/api";

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const product = useApiResource<Product>({
    path: `/api/products/${params.id}`,
  });
  const currentProduct = product.data;

  return (
    <main className="min-h-screen bg-stone-50 text-stone-950">
      <StoreHeader />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {product.error ? (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{product.error}</div>
        ) : null}

        {currentProduct ? (
          <>
            <div className="rounded-lg border border-stone-200 bg-white p-3 shadow-xl shadow-stone-950/5 sm:p-4">
              <div className="grid items-start gap-4 lg:grid-cols-2">
                <ProductGallery product={currentProduct} />
                <ProductInfoPanel product={currentProduct} />
              </div>
            </div>
            <SuggestedProductsCarousel productId={params.id} />
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
