"use client";

import { PackageSearch, RotateCcw } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { ProductPagination } from "@/components/ProductPagination";
import { ProductFilters, type ProductFilterValues } from "@/components/ProductFilters";
import { StoreFooter } from "@/components/StoreFooter";
import { StoreHeader } from "@/components/StoreHeader";
import { Button } from "@/components/ui/button";
import { useApiResource } from "@/hooks/useApiResource";
import type { Category, PageResult, Product } from "@/types/api";

type Collection<T> = PageResult<T> | T[] | null;

const origins = ["Korea", "Vietnam", "China"];
const sortOptions = [
  { label: "Mới nhất", value: "id,desc" },
  { label: "Giá thấp đến cao", value: "price,asc" },
  { label: "Giá cao đến thấp", value: "price,desc" },
  { label: "Tên A-Z", value: "name,asc" },
];

function getItems<T>(data: Collection<T>) {
  if (!data) {
    return [];
  }

  return Array.isArray(data) ? data : data.content ?? [];
}

export default function ProductsPage() {
  return (
    <Suspense fallback={null}>
      <ProductsContent />
    </Suspense>
  );
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [origin, setOrigin] = useState("");
  const [brand, setBrand] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [sort, setSort] = useState("id,desc");
  const [maxPrice, setMaxPrice] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(12);

  useEffect(() => {
    queueMicrotask(() => {
      setOrigin(searchParams.get("origin") ?? "");
      setBrand(searchParams.get("brand") ?? "");
      setCategoryId(searchParams.get("categoryId") ?? "");
      setPage(0);
    });
  }, [searchParams]);

  const query = useMemo(
    () => ({
      page,
      size,
      search,
      sort,
      ...(origin ? { origin } : {}),
      ...(brand ? { brand } : {}),
      ...(categoryId ? { categoryId } : {}),
    }),
    [brand, categoryId, origin, page, search, size, sort],
  );

  const products = useApiResource<PageResult<Product>>({
    path: "/api/products",
    query,
  });
  const categoriesResource = useApiResource<Collection<Category>>({
    path: "/api/storefront/categories",
  });
  const brandProductsResource = useApiResource<Collection<Product>>({
    path: "/api/products",
    query: { page: 0, size: 100, sort: "brand,asc" },
  });

  const categories = useMemo(
    () => getItems(categoriesResource.data).filter((item) => item.active !== false),
    [categoriesResource.data],
  );
  const brands = useMemo(
    () =>
      Array.from(
        new Set(
          getItems(brandProductsResource.data)
            .map((item) => item.brand?.trim())
            .filter((item): item is string => Boolean(item)),
        ),
      ),
    [brandProductsResource.data],
  );

  const pageResult = products.data;
  const filteredProducts = (pageResult?.content ?? []).filter((product) => {
    if (!maxPrice) {
      return true;
    }

    return Number(product.price ?? 0) <= Number(maxPrice);
  });
  const totalPages = Math.max(pageResult?.totalPages ?? 1, 1);
  const totalElements = pageResult?.totalElements ?? filteredProducts.length;

  const updateFilters = (values: Partial<ProductFilterValues>) => {
    if (values.search !== undefined) setSearch(values.search);
    if (values.origin !== undefined) setOrigin(values.origin);
    if (values.brand !== undefined) setBrand(values.brand);
    if (values.categoryId !== undefined) setCategoryId(values.categoryId);
    if (values.maxPrice !== undefined) setMaxPrice(values.maxPrice);
    if (values.sort !== undefined) setSort(values.sort);
    setPage(0);
  };

  const resetFilters = () => {
    setSearch("");
    setOrigin("");
    setBrand("");
    setCategoryId("");
    setMaxPrice("");
    setSort("id,desc");
    setPage(0);
  };

  return (
    <main className="min-h-screen bg-stone-50 text-stone-950">
      <StoreHeader />
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-sm font-medium uppercase text-rose-700">Cửa hàng</p>
          <div className="mt-2 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-normal">Sản phẩm</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
                Lọc nhanh theo danh mục, brand, xuất xứ, mức giá và cách sắp xếp để tìm item phù hợp.
              </p>
            </div>
            <Button variant="outline" onClick={products.revalidate}>
              <RotateCcw className="h-4 w-4" />
              Tải lại
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[340px_1fr] lg:px-8">
        <aside>
          <ProductFilters
            brand={brand}
            brands={brands}
            categories={categories}
            categoryId={categoryId}
            maxPrice={maxPrice}
            onReset={resetFilters}
            onUpdate={updateFilters}
            origin={origin}
            origins={origins}
            search={search}
            sort={sort}
            sortOptions={sortOptions}
          />
        </aside>

        <section>
          <div className="mb-5">
            <ProductPagination
              page={page}
              setPage={setPage}
              setSize={setSize}
              size={size}
              totalElements={totalElements}
              totalPages={totalPages}
            />
          </div>

          {products.error ? (
            <div className="mb-5 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {products.error}. Hãy đăng nhập nếu API đang bảo vệ route sản phẩm.
            </div>
          ) : null}

          {products.isLoading && filteredProducts.length === 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-96 animate-pulse rounded-lg bg-stone-200" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="grid min-h-[360px] place-items-center rounded-lg border border-dashed border-stone-300 bg-white p-8 text-center">
              <div>
                <PackageSearch className="mx-auto h-10 w-10 text-stone-400" />
                <h2 className="mt-4 text-lg font-semibold">Không tìm thấy sản phẩm</h2>
                <p className="mt-2 max-w-md text-sm leading-6 text-stone-600">
                  Thử bỏ bớt bộ lọc, đổi từ khóa tìm kiếm hoặc tải lại danh sách.
                </p>
                <Button className="mt-5" variant="outline" onClick={resetFilters}>
                  Xóa bộ lọc
                </Button>
              </div>
            </div>
          ) : (
            <div className="relative">
              {products.isLoading ? (
                <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-1 overflow-hidden rounded-full bg-emerald-50">
                  <div className="h-full w-1/3 animate-loading-bar bg-emerald-600" />
                </div>
              ) : null}
              <div className={`grid gap-4 sm:grid-cols-2 xl:grid-cols-3 ${products.isLoading ? "opacity-75" : ""}`}>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}

          <div className="mt-6">
            <ProductPagination
              page={page}
              setPage={setPage}
              setSize={setSize}
              size={size}
              totalElements={totalElements}
              totalPages={totalPages}
            />
          </div>
        </section>
      </div>
      <StoreFooter />
    </main>
  );
}
