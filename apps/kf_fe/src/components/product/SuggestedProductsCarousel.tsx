"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { useApiResource } from "@/hooks/useApiResource";
import type { PageResult, Product } from "@/types/api";

export function SuggestedProductsCarousel({ product }: { product: Product }) {
  const relatedProducts = useApiResource<PageResult<Product> | Product[]>({
    path: `/api/storefront/products/${product.slug || product.id}/related`,
    query: { size: 12 },
  });
  const categoryProducts = useApiResource<PageResult<Product>>({
    enabled: Boolean(product.categoryId),
    path: "/api/storefront/products",
    query: { categoryId: product.categoryId, page: 0, size: 12, sort: "id,desc" },
  });
  const brandProducts = useApiResource<PageResult<Product>>({
    enabled: Boolean(product.brand?.trim()),
    path: "/api/storefront/products",
    query: { brand: product.brand, page: 0, size: 12, sort: "id,desc" },
  });

  const products = mergeSuggestedProducts({
    brandProducts: getProducts(brandProducts.data),
    categoryProducts: getProducts(categoryProducts.data),
    currentProductId: product.id,
    relatedProducts: getProducts(relatedProducts.data),
  });
  const isLoading = relatedProducts.isLoading || categoryProducts.isLoading || brandProducts.isLoading;

  const scroll = (direction: "left" | "right") => {
    const element = document.getElementById("suggested-products");
    element?.scrollBy({ behavior: "smooth", left: direction === "left" ? -360 : 360 });
  };

  return (
    <section className="mt-10 rounded-lg border border-stone-200 bg-white p-5">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase text-rose-700">Gợi ý</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-normal">Sản phẩm có thể phù hợp</h2>
        </div>
        <div className="flex gap-2">
          <Button size="icon" variant="outline" aria-label="Lùi carousel" onClick={() => scroll("left")}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="outline" aria-label="Tiến carousel" onClick={() => scroll("right")}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-96 min-w-[260px] animate-pulse rounded-lg bg-stone-200" />
          ))}
        </div>
      ) : products.length ? (
        <div id="suggested-products" className="flex snap-x gap-4 overflow-x-auto pb-2">
          {products.map((product) => (
            <div key={product.id} className="min-w-[260px] max-w-[260px] snap-start">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-md border border-dashed border-stone-300 bg-stone-50 p-6 text-sm text-stone-600">
          Chưa có sản phẩm gợi ý.
        </div>
      )}
    </section>
  );
}

function mergeSuggestedProducts({
  brandProducts,
  categoryProducts,
  currentProductId,
  relatedProducts,
}: {
  brandProducts: Product[];
  categoryProducts: Product[];
  currentProductId: number;
  relatedProducts: Product[];
}) {
  const seen = new Set<number>([currentProductId]);
  const result: Product[] = [];

  [...categoryProducts, ...brandProducts, ...relatedProducts].forEach((item) => {
    if (seen.has(item.id)) {
      return;
    }

    seen.add(item.id);
    result.push(item);
  });

  return result.slice(0, 12);
}

function getProducts(data?: PageResult<Product> | Product[] | null) {
  if (!data) {
    return [];
  }

  return Array.isArray(data) ? data : data.content;
}
