"use client";

import { Filter, RotateCcw, Search, SlidersHorizontal, X } from "lucide-react";
import type { ReactNode } from "react";
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

  const hasActiveFilters = activeFilters.length > 0;

  return (
    <Card className="sticky top-20 overflow-hidden border-stone-200 bg-white shadow-md shadow-stone-950/5">
      <CardHeader className="border-b border-stone-200 bg-stone-950 p-5 text-white">
        <CardTitle className="flex items-center justify-between gap-3 text-base text-white">
          <span className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-white/10">
              <SlidersHorizontal className="h-4 w-4" />
            </span>
            Bộ lọc
          </span>
          <Button
            size="sm"
            variant="ghost"
            className="text-white/80 hover:bg-white/10 hover:text-white"
            onClick={onReset}
          >
            <RotateCcw className="h-4 w-4" />
            Đặt lại
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5 p-5">
        <label className="block text-sm font-semibold text-stone-800">
          Tìm kiếm
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <Input
              className="h-11 rounded-lg border-stone-300 pl-9"
              onChange={(event) => onUpdate({ search: event.target.value })}
              placeholder="Tên sản phẩm, SKU..."
              value={search}
            />
          </div>
        </label>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <FilterField label="Danh mục">
            <Select className="h-11 rounded-lg" onChange={(event) => onUpdate({ categoryId: event.target.value })} value={categoryId}>
              <option value="">Tất cả danh mục</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </FilterField>

          <FilterField label="Thương hiệu">
            <Select className="h-11 rounded-lg" onChange={(event) => onUpdate({ brand: event.target.value })} value={brand}>
              <option value="">Tất cả thương hiệu</option>
              {brands.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>
          </FilterField>

          <FilterField label="Xuất xứ">
            <Select className="h-11 rounded-lg" onChange={(event) => onUpdate({ origin: event.target.value })} value={origin}>
              <option value="">Tất cả xuất xứ</option>
              {origins.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>
          </FilterField>

          <FilterField label="Giá tối đa">
            <Input
              className="h-11 rounded-lg"
              min={0}
              onChange={(event) => onUpdate({ maxPrice: event.target.value })}
              placeholder="1.000.000"
              type="number"
              value={maxPrice}
            />
          </FilterField>

          <FilterField label="Sắp xếp">
            <Select className="h-11 rounded-lg" onChange={(event) => onUpdate({ sort: event.target.value })} value={sort}>
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </FilterField>
        </div>

        <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-stone-950">
              <Filter className="h-4 w-4 text-emerald-700" />
              Đang áp dụng
            </div>
            {hasActiveFilters ? <span className="text-xs font-medium text-stone-500">{activeFilters.length} bộ lọc</span> : null}
          </div>
          {hasActiveFilters ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {activeFilters.map((item) => (
                <button
                  key={item.key}
                  className="inline-flex max-w-full items-center gap-1 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 shadow-sm transition hover:border-stone-300 hover:bg-stone-100"
                  type="button"
                  onClick={() => onUpdate({ [item.key]: "" })}
                >
                  <span className="truncate">{item.label}</span>
                  <X className="h-3.5 w-3.5 shrink-0 text-stone-400" />
                </button>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-sm leading-6 text-stone-500">Chưa chọn bộ lọc. Bắt đầu bằng từ khóa, danh mục hoặc khoảng giá.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function FilterField({ children, label }: { children: ReactNode; label: string }) {
  return (
    <label className="block text-sm font-semibold text-stone-800">
      {label}
      <div className="mt-2">{children}</div>
    </label>
  );
}
