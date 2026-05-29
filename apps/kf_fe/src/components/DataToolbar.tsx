"use client";

import { Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

type FilterOption = {
  label: string;
  value: string;
};

type DataToolbarProps = {
  search: string;
  sort: string;
  onSearchChange: (value: string) => void;
  onSortChange: (value: string) => void;
  filterLabel?: string;
  filterValue?: string;
  filterOptions?: FilterOption[];
  onFilterChange?: (value: string) => void;
};

const sortOptions = [
  { label: "Mới nhất", value: "id,desc" },
  { label: "Cũ nhất", value: "id,asc" },
  { label: "Tên A-Z", value: "name,asc" },
  { label: "Tên Z-A", value: "name,desc" },
];

export function DataToolbar({
  search,
  sort,
  onSearchChange,
  onSortChange,
  filterLabel = "Bộ lọc",
  filterValue = "",
  filterOptions = [],
  onFilterChange,
}: DataToolbarProps) {
  return (
    <div className="mb-4 grid gap-3 rounded-md border border-stone-200 bg-[#fffdf8] p-3 md:grid-cols-[minmax(0,1fr)_180px_180px]">
      <label className="relative block">
        <span className="sr-only">Tìm kiếm</span>
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Tìm theo tên, mã, email..."
          className="pl-9"
        />
      </label>

      {filterOptions.length > 0 ? (
        <label className="relative block">
          <span className="sr-only">{filterLabel}</span>
          <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Select
            value={filterValue}
            onChange={(event) => onFilterChange?.(event.target.value)}
            className="pl-9"
          >
            <option value="">{filterLabel}</option>
            {filterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </label>
      ) : (
        <div className="hidden md:block" />
      )}

      <label className="block">
        <span className="sr-only">Sắp xếp</span>
        <Select
          value={sort}
          onChange={(event) => onSortChange(event.target.value)}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </label>
    </div>
  );
}
