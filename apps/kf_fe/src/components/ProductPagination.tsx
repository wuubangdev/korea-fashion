"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
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
    <div className="flex flex-col gap-3 rounded-full border border-stone-200 bg-white/82 px-3 py-2 shadow-lg shadow-stone-950/5 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:pl-5">
      <div className="flex items-center gap-2 text-sm text-stone-600">
        <span className="h-2 w-2 rounded-full bg-rose-600" />
        <span>
          <span className="font-semibold text-stone-950">{fromIndex}-{toIndex}</span>
          <span> / </span>
          <span className="font-semibold text-stone-950">{totalElements}</span>
          <span> sản phẩm</span>
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {showSize && setSize ? (
          <label className="flex items-center gap-2 rounded-full bg-stone-100 py-1 pl-3 pr-1 text-sm text-stone-600">
            <span className="hidden sm:inline">Hiển thị</span>
            <Select
              className="h-8 w-[72px] rounded-full border-stone-200 bg-white px-3"
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

        <div className="inline-flex items-center gap-1 rounded-full bg-stone-100 p-1">
          <button
            aria-label="Trang trước"
            className="grid h-8 w-8 place-items-center rounded-full text-stone-600 transition hover:bg-white hover:text-stone-950 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:shadow-none"
            disabled={!canGoPrevious}
            onClick={() => setPage(Math.max(page - 1, 0))}
            type="button"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="min-w-20 rounded-full bg-white px-3 py-1.5 text-center text-sm font-semibold text-stone-800 shadow-sm">
            {currentPage}<span className="mx-1 text-stone-300">/</span>{safeTotalPages}
          </div>
          <button
            aria-label="Trang sau"
            className="grid h-8 w-8 place-items-center rounded-full text-stone-600 transition hover:bg-white hover:text-stone-950 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:shadow-none"
            disabled={!canGoNext}
            onClick={() => setPage(Math.min(page + 1, safeTotalPages - 1))}
            type="button"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
