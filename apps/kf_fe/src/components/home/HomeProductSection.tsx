"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { ProductPagination } from "@/components/ProductPagination";
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
  const isDark = tone === "muted";
  const sectionQuery = useMemo(() => ({ page, size, ...query }), [page, query]);
  const products = useApiResource<PageResult<Product>>({
    path: "/api/products",
    query: sectionQuery,
  });

  const items = products.data?.content ?? [];
  const totalElements = products.data?.totalElements ?? items.length;
  const totalPages = products.data?.totalPages ?? 1;

  return (
    <section
      className={`scroll-reveal relative overflow-hidden py-12 ${
        isDark
          ? "bg-[linear-gradient(135deg,#f4f2ee_0%,#eee7e3_44%,#e8eee8_100%)]"
          : "bg-white"
      }`}
    >
      {isDark ? (
        <>
          <div className="pointer-events-none absolute inset-0 opacity-[0.22] [background-image:radial-gradient(circle_at_1px_1px,rgba(68,64,60,0.16)_1px,transparent_0)] [background-size:13px_13px]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.36),transparent_42%,rgba(68,64,60,0.06))]" />
        </>
      ) : null}

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className={`text-sm font-medium uppercase ${isDark ? "text-rose-700" : "text-rose-700"}`}>Korea Fashion</p>
            <h2 className={`mt-2 text-3xl font-semibold tracking-normal ${isDark ? "text-stone-950" : "text-stone-950"}`}>{title}</h2>
            {description ? (
              <p className={`mt-2 max-w-2xl text-sm leading-6 ${isDark ? "text-stone-600" : "text-stone-600"}`}>{description}</p>
            ) : null}
          </div>
          <ViewAllLink isDark={isDark} />
        </div>

        {products.isLoading && items.length === 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className={`h-96 animate-pulse rounded-lg ${isDark ? "bg-stone-200/70" : "bg-stone-200"}`} />
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
          <div className={`rounded-md border border-dashed p-8 text-center text-sm ${
            isDark ? "border-stone-300 bg-white/65 text-stone-600 backdrop-blur" : "border-stone-300 bg-white text-stone-600"
          }`}>
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
        <div className="mt-4 sm:hidden">
          <ViewAllLink isDark={isDark} mobile />
        </div>
      </div>
    </section>
  );
}

function ViewAllLink({ isDark, mobile = false }: { isDark: boolean; mobile?: boolean }) {
  return (
    <Link
      href="/products"
      className={`group ${mobile ? "flex" : "hidden sm:flex"} h-10 items-center justify-between gap-2 rounded-full border px-3 pl-4 text-sm font-semibold shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
        isDark
          ? "border-white/75 bg-white/75 text-stone-950 shadow-stone-950/5 backdrop-blur hover:bg-white hover:shadow-stone-950/10"
          : "border-stone-200 bg-stone-950 text-white shadow-stone-950/10 hover:bg-rose-700 hover:shadow-rose-950/20"
      }`}
    >
      <span className="leading-none">Xem tất cả</span>
      <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full transition group-hover:translate-x-0.5 ${
        isDark ? "bg-stone-950 text-white" : "bg-white text-stone-950"
      }`}>
        <ArrowRight className="h-4 w-4" />
      </span>
    </Link>
  );
}
