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
  const fromIndex = totalElements === 0 ? 0 : page * size + 1;
  const toIndex = Math.min((page + 1) * size, totalElements);

  return (
    <div className="flex flex-col gap-3 rounded-md border border-stone-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm text-stone-600">
        Hiển thị <span className="font-medium text-stone-950">{fromIndex}-{toIndex}</span> trong{" "}
        <span className="font-medium text-stone-950">{totalElements}</span> sản phẩm
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {showSize && setSize ? (
          <label className="flex items-center gap-2 text-sm font-medium text-stone-700">
            Mỗi trang
            <Select
              className="h-9 w-24"
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
        <Button variant="outline" disabled={page <= 0} onClick={() => setPage(Math.max(page - 1, 0))}>
          <ChevronLeft className="h-4 w-4" />
          Trước
        </Button>
        <div className="min-w-24 text-center text-sm font-medium text-stone-700">
          Trang {Math.min(page + 1, safeTotalPages)} / {safeTotalPages}
        </div>
        <Button variant="outline" disabled={page + 1 >= safeTotalPages} onClick={() => setPage(Math.min(page + 1, safeTotalPages - 1))}>
          Sau
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
