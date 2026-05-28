"use client";

import { Filter, RotateCcw, Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { Category } from "@/types/api";

type ProductFiltersProps = {
  brand: string;
  brands: string[];
  categories: Category[];
  categoryId: string;
  maxPrice: string;
  onReset: () => void;
  onUpdate: (values: Partial<ProductFilterValues>) => void;
  origin: string;
  origins: string[];
  search: string;
  sort: string;
  sortOptions: Array<{ label: string; value: string }>;
};

export type ProductFilterValues = {
  brand: string;
  categoryId: string;
  maxPrice: string;
  origin: string;
  search: string;
  sort: string;
};

export function ProductFilters({
  brand,
  brands,
  categories,
  categoryId,
  maxPrice,
  onReset,
  onUpdate,
  origin,
  origins,
  search,
  sort,
  sortOptions,
}: ProductFiltersProps) {
  const activeFilters = [
    search ? { key: "search", label: `Từ khóa: ${search}` } : null,
    categoryId ? { key: "categoryId", label: categories.find((item) => String(item.id) === categoryId)?.name ?? "Danh mục" } : null,
    brand ? { key: "brand", label: `Thương hiệu: ${brand}` } : null,
    origin ? { key: "origin", label: `Xuất xứ: ${origin}` } : null,
    maxPrice ? { key: "maxPrice", label: `Giá tối đa: ${Number(maxPrice).toLocaleString("vi-VN")}đ` } : null,
  ].filter(Boolean) as Array<{ key: keyof ProductFilterValues; label: string }>;

  return (
    <Card className="sticky top-20 overflow-hidden border-stone-200 shadow-sm">
      <CardHeader className="border-b border-stone-200 bg-white p-5">
        <CardTitle className="flex items-center justify-between gap-3 text-lg">
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5" />
            Bộ lọc
          </span>
          <Button size="sm" variant="ghost" onClick={onReset}>
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5 bg-white p-5">
        <label className="block text-sm font-medium text-stone-700">
          Tìm kiếm
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <Input
              className="h-11 pl-9"
              onChange={(event) => onUpdate({ search: event.target.value })}
              placeholder="Tên sản phẩm, SKU..."
              value={search}
            />
          </div>
        </label>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <label className="block text-sm font-medium text-stone-700">
            Danh mục
            <Select className="mt-2 h-11" onChange={(event) => onUpdate({ categoryId: event.target.value })} value={categoryId}>
              <option value="">Tất cả danh mục</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </label>

          <label className="block text-sm font-medium text-stone-700">
            Thương hiệu
            <Select className="mt-2 h-11" onChange={(event) => onUpdate({ brand: event.target.value })} value={brand}>
              <option value="">Tất cả thương hiệu</option>
              {brands.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>
          </label>

          <label className="block text-sm font-medium text-stone-700">
            Xuất xứ
            <Select className="mt-2 h-11" onChange={(event) => onUpdate({ origin: event.target.value })} value={origin}>
              <option value="">Tất cả xuất xứ</option>
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
              className="mt-2 h-11"
              min={0}
              onChange={(event) => onUpdate({ maxPrice: event.target.value })}
              placeholder="1.000.000"
              type="number"
              value={maxPrice}
            />
          </label>

          <label className="block text-sm font-medium text-stone-700">
            Sắp xếp
            <Select className="mt-2 h-11" onChange={(event) => onUpdate({ sort: event.target.value })} value={sort}>
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </label>
        </div>

        <div className="rounded-md border border-stone-200 bg-stone-50 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-stone-950">
            <Filter className="h-4 w-4" />
            Đang áp dụng
          </div>
          {activeFilters.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {activeFilters.map((item) => (
                <button
                  key={item.key}
                  className="inline-flex items-center gap-1 rounded-md bg-white px-2.5 py-1.5 text-xs font-medium text-stone-700 shadow-sm ring-1 ring-stone-200 hover:bg-stone-100"
                  type="button"
                  onClick={() => onUpdate({ [item.key]: "" })}
                >
                  {item.label}
                  <X className="h-3 w-3" />
                </button>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-sm text-stone-500">Chưa chọn bộ lọc.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
