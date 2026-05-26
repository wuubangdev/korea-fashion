"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { StoreHeader } from "@/components/StoreHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useApiResource } from "@/hooks/useApiResource";
import type { PageResult, Product } from "@/types/api";

const origins = ["Korea", "Vietnam", "China"];
const sortOptions = [
  { label: "Moi nhat", value: "id,desc" },
  { label: "Gia thap den cao", value: "price,asc" },
  { label: "Gia cao den thap", value: "price,desc" },
  { label: "Ten A-Z", value: "name,asc" },
];

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [origin, setOrigin] = useState("");
  const [sort, setSort] = useState("id,desc");
  const [maxPrice, setMaxPrice] = useState("");

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
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <StoreHeader />
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8">
        <aside>
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Bo loc
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="block text-sm font-medium text-slate-700">
                Tim kiem
                <div className="relative mt-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    className="pl-9"
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Ten san pham"
                    value={search}
                  />
                </div>
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Xuat xu
                <Select
                  className="mt-1"
                  onChange={(event) => setOrigin(event.target.value)}
                  value={origin}
                >
                  <option value="">Tat ca</option>
                  {origins.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </Select>
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Gia toi da
                <Input
                  className="mt-1"
                  min={0}
                  onChange={(event) => setMaxPrice(event.target.value)}
                  placeholder="1000000"
                  type="number"
                  value={maxPrice}
                />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Sap xep
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
                Xoa bo loc
              </Button>
            </CardContent>
          </Card>
        </aside>

        <section>
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">San pham</h1>
              <p className="mt-1 text-sm text-slate-600">
                Du lieu duoc fetch tu API /api/products.
              </p>
            </div>
            <Button variant="outline" onClick={products.revalidate}>
              Tai lai
            </Button>
          </div>

          {products.error ? (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {products.error}. Hay dang nhap admin de co token neu API dang bao ve route.
            </div>
          ) : null}

          {products.isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-96 animate-pulse rounded-lg bg-slate-200" />
              ))}
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
    </main>
  );
}
