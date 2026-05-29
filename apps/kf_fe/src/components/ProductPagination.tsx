"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

type ProductPaginationProps = {
  page: number;
  pageSizes?: number[];
  setPage: (page: number) => void;
  setSize?: (size: number) => void;
  showSize?: boolean;
  size: number;
  totalElements: number;
  totalPages: number;
};

export function ProductPagination({
  page,
  pageSizes = [12, 24, 36],
  setPage,
  setSize,
  showSize = true,
  size,
  totalElements,
  totalPages,
}: ProductPaginationProps) {
  const safeTotalPages = Math.max(totalPages || 1, 1);
  const currentPage = Math.min(page + 1, safeTotalPages);
  const fromIndex = totalElements === 0 ? 0 : page * size + 1;
  const toIndex = Math.min((page + 1) * size, totalElements);
  const canGoPrevious = page > 0;
  const canGoNext = page + 1 < safeTotalPages;

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-stone-200 bg-white px-3 py-3 shadow-sm shadow-stone-950/5 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm text-stone-600">
        <span className="font-semibold text-stone-950">{fromIndex}-{toIndex}</span>
        <span> trong </span>
        <span className="font-semibold text-stone-950">{totalElements}</span>
        <span> sản phẩm</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {showSize && setSize ? (
          <label className="flex items-center gap-2 text-sm text-stone-600">
            <span className="hidden sm:inline">Hiển thị</span>
            <Select
              className="h-9 w-20 rounded-md"
              value={String(size)}
              onChange={(event) => {
                setSize(Number(event.target.value));
                setPage(0);
              }}
            >
              {pageSizes.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>
          </label>
        ) : null}

        <div className="inline-flex items-center gap-1 rounded-md border border-stone-200 bg-stone-50 p-1">
          <Button
            aria-label="Trang trước"
            className="h-8 w-8 rounded px-0 shadow-none"
            variant="ghost"
            disabled={!canGoPrevious}
            onClick={() => setPage(Math.max(page - 1, 0))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="min-w-24 px-2 text-center text-sm font-medium text-stone-700">
            {currentPage} / {safeTotalPages}
          </div>
          <Button
            aria-label="Trang sau"
            className="h-8 w-8 rounded px-0 shadow-none"
            variant="ghost"
            disabled={!canGoNext}
            onClick={() => setPage(Math.min(page + 1, safeTotalPages - 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
