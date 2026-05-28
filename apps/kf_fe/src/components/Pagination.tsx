"use client";

import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

type PaginationProps = {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSizeChange: (size: number) => void;
};

const sizeOptions = [5, 10, 20, 50];

export function Pagination({
  page,
  size,
  totalElements,
  totalPages,
  onPageChange,
  onSizeChange,
}: PaginationProps) {
  const canGoPrevious = page > 0;
  const canGoNext = page + 1 < totalPages;

  return (
    <div className="mt-4 flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-600">
        Tổng <span className="font-medium text-slate-950">{totalElements}</span>{" "}
        bản ghi, trang{" "}
        <span className="font-medium text-slate-950">
          {totalPages === 0 ? 0 : page + 1}/{totalPages}
        </span>
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={size}
          onChange={(event) => {
            onSizeChange(Number(event.target.value));
            onPageChange(0);
          }}
          className="h-9 w-auto"
        >
          {sizeOptions.map((option) => (
            <option key={option} value={option}>
              {option}/trang
            </option>
          ))}
        </Select>
        <Button
          onClick={() => onPageChange(page - 1)}
          disabled={!canGoPrevious}
          variant="outline"
          size="sm"
        >
          Trước
        </Button>
        <Button
          onClick={() => onPageChange(page + 1)}
          disabled={!canGoNext}
          variant="outline"
          size="sm"
        >
          Sau
        </Button>
      </div>
    </div>
  );
}
