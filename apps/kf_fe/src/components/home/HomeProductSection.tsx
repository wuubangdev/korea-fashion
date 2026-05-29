"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { ProductPagination } from "@/components/ProductPagination";
import { Button } from "@/components/ui/button";
import { useApiResource } from "@/hooks/useApiResource";
import type { PageResult, Product } from "@/types/api";

type HomeProductSectionProps = {
  description?: string;
  query?: Record<string, unknown>;
  title: string;
  tone?: "white" | "muted";
};

export function HomeProductSection({ description, query = {}, title, tone = "white" }: HomeProductSectionProps) {
  const [page, setPage] = useState(0);
  const size = 4;
  const sectionQuery = useMemo(() => ({ page, size, ...query }), [page, query]);
  const products = useApiResource<PageResult<Product>>({
    path: "/api/products",
    query: sectionQuery,
  });

  const items = products.data?.content ?? [];
  const totalElements = products.data?.totalElements ?? items.length;
  const totalPages = products.data?.totalPages ?? 1;

  return (
    <section className={`scroll-reveal ${tone === "muted" ? "bg-stone-50" : "bg-white"} py-12`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase text-rose-700">Korea Fashion</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-normal">{title}</h2>
            {description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">{description}</p> : null}
          </div>
          <Link href="/products" className="hidden sm:block">
            <Button variant="outline">Xem tất cả</Button>
          </Link>
        </div>

        {products.isLoading && items.length === 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-96 animate-pulse rounded-lg bg-stone-200" />
            ))}
          </div>
        ) : items.length ? (
          <div className="relative">
            {products.isLoading ? (
              <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-1 overflow-hidden rounded-full bg-emerald-50">
                <div className="h-full w-1/3 animate-loading-bar bg-emerald-600" />
              </div>
            ) : null}
            <div className={`stagger-grid grid gap-4 sm:grid-cols-2 lg:grid-cols-4 ${products.isLoading ? "opacity-75" : ""}`}>
              {items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-md border border-dashed border-stone-300 bg-white p-8 text-center text-sm text-stone-600">
            Chưa có sản phẩm phù hợp.
          </div>
        )}

        <div className="mt-6">
          <ProductPagination
            page={page}
            setPage={setPage}
            showSize={false}
            size={size}
            totalElements={totalElements}
            totalPages={totalPages}
          />
        </div>
      </div>
    </section>
  );
}
