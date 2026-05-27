"use client";

import { PackageSearch, RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { StoreFooter } from "@/components/StoreFooter";
import { StoreHeader } from "@/components/StoreHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useApiResource } from "@/hooks/useApiResource";
import type { PageResult, Product } from "@/types/api";

const origins = ["Korea", "Vietnam", "China"];
const sortOptions = [
  { label: "Mới nhất", value: "id,desc" },
  { label: "Giá thấp đến cao", value: "price,asc" },
  { label: "Giá cao đến thấp", value: "price,desc" },
  { label: "Tên A-Z", value: "name,asc" },
];

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [origin, setOrigin] = useState("");
  const [sort, setSort] = useState("id,desc");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    setOrigin(new URLSearchParams(window.location.search).get("origin") ?? "");
  }, []);

  const query = useMemo(
    () => ({
      page: 0,
      size: 24,
      search,
      sort,
      ...(origin ? { origin } : {}),
    }),
    [origin, search, sort],
  );

  const products = useApiResource<PageResult<Product>>({
    path: "/api/products",
    query,
  });

  const filteredProducts = (products.data?.content ?? []).filter((product) => {
    if (!maxPrice) {
      return true;
    }

    return Number(product.price ?? 0) <= Number(maxPrice);
  });

  return (
    <main className="min-h-screen bg-stone-50 text-stone-950">
      <StoreHeader />
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-sm font-medium uppercase text-rose-700">Shop</p>
          <div className="mt-2 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-normal">Sản phẩm</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
                Lọc nhanh các item theo xuất xứ, mức giá và cách sắp xếp để tìm
                outfit phù hợp.
              </p>
            </div>
            <Button variant="outline" onClick={products.revalidate}>
              <RotateCcw className="h-4 w-4" />
              Tải lại
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[290px_1fr] lg:px-8">
        <aside>
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Bộ lọc
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="block text-sm font-medium text-stone-700">
                Tìm kiếm
                <div className="relative mt-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                  <Input
                    className="pl-9"
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Tên sản phẩm"
                    value={search}
                  />
                </div>
              </label>
              <label className="block text-sm font-medium text-stone-700">
                Xuất xứ
                <Select
                  className="mt-1"
                  onChange={(event) => setOrigin(event.target.value)}
                  value={origin}
                >
                  <option value="">Tất cả</option>
                  {origins.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </Select>
              </label>
              <label className="block text-sm font-medium text-stone-700">
                Giá tối đa
                <Input
                  className="mt-1"
                  min={0}
                  onChange={(event) => setMaxPrice(event.target.value)}
                  placeholder="1000000"
                  type="number"
                  value={maxPrice}
                />
              </label>
              <label className="block text-sm font-medium text-stone-700">
                Sắp xếp
                <Select
                  className="mt-1"
                  onChange={(event) => setSort(event.target.value)}
                  value={sort}
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </label>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => {
                  setSearch("");
                  setOrigin("");
                  setMaxPrice("");
                  setSort("id,desc");
                }}
              >
                Xóa bộ lọc
              </Button>
            </CardContent>
          </Card>
        </aside>

        <section>
          <div className="mb-5 flex items-center justify-between gap-3">
            <p className="text-sm text-stone-600">
              Hiển thị <span className="font-medium text-stone-950">{filteredProducts.length}</span> sản phẩm
            </p>
            <p className="hidden text-sm text-stone-500 sm:block">
              Dữ liệu lấy từ API `/api/products`
            </p>
          </div>

          {products.error ? (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {products.error}. Hãy đăng nhập nếu API đang bảo vệ route sản phẩm.
            </div>
          ) : null}

          {products.isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-96 animate-pulse rounded-lg bg-slate-200" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="grid min-h-[360px] place-items-center rounded-lg border border-dashed border-stone-300 bg-white p-8 text-center">
              <div>
                <PackageSearch className="mx-auto h-10 w-10 text-stone-400" />
                <h2 className="mt-4 text-lg font-semibold">Không tìm thấy sản phẩm</h2>
                <p className="mt-2 max-w-md text-sm leading-6 text-stone-600">
                  Thử bỏ bớt bộ lọc, đổi từ khóa tìm kiếm hoặc tải lại dữ liệu từ API.
                </p>
                <Button
                  className="mt-5"
                  variant="outline"
                  onClick={() => {
                    setSearch("");
                    setOrigin("");
                    setMaxPrice("");
                    setSort("id,desc");
                  }}
                >
                  Xóa bộ lọc
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
      <StoreFooter />
    </main>
  );
}
