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
  const pages = getVisiblePages(currentPage, safeTotalPages);

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-stone-200 bg-white/95 p-3 shadow-sm shadow-stone-950/5 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
      <div className="rounded-md bg-stone-50 px-3 py-2 text-sm text-stone-600">
        <span className="font-medium text-stone-950">{fromIndex}-{toIndex}</span>
        <span> / </span>
        <span className="font-medium text-stone-950">{totalElements}</span>
        <span> sản phẩm</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {showSize && setSize ? (
          <label className="flex items-center gap-2 text-sm font-medium text-stone-700">
            Mỗi trang
            <Select
              className="h-9 w-24 rounded-lg"
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

        <div className="inline-flex items-center rounded-lg border border-stone-200 bg-stone-50 p-1">
          <Button className="h-9 w-9 rounded-md px-0" variant="ghost" disabled={page <= 0} onClick={() => setPage(Math.max(page - 1, 0))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {pages.map((item, index) =>
            item === "..." ? (
              <span key={`${item}-${index}`} className="grid h-9 w-9 place-items-center text-sm text-stone-400">
                ...
              </span>
            ) : (
              <button
                key={item}
                className={`h-9 min-w-9 rounded-md px-3 text-sm font-semibold transition duration-200 ease-out active:scale-95 ${
                  item === currentPage
                    ? "bg-stone-950 text-white shadow-sm"
                    : "text-stone-600 hover:-translate-y-0.5 hover:bg-white hover:text-stone-950 hover:shadow-sm"
                }`}
                type="button"
                onClick={() => setPage(item - 1)}
              >
                {item}
              </button>
            ),
          )}
          <Button
            className="h-9 w-9 rounded-md px-0"
            variant="ghost"
            disabled={page + 1 >= safeTotalPages}
            onClick={() => setPage(Math.min(page + 1, safeTotalPages - 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function getVisiblePages(currentPage: number, totalPages: number) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages: Array<number | "..."> = [1];
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  if (start > 2) {
    pages.push("...");
  }

  for (let item = start; item <= end; item += 1) {
    pages.push(item);
  }

  if (end < totalPages - 1) {
    pages.push("...");
  }

  pages.push(totalPages);
  return pages;
}
