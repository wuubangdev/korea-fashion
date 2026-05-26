"use client";

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
  { label: "Moi nhat", value: "id,desc" },
  { label: "Cu nhat", value: "id,asc" },
  { label: "Ten A-Z", value: "name,asc" },
  { label: "Ten Z-A", value: "name,desc" },
];

export function DataToolbar({
  search,
  sort,
  onSearchChange,
  onSortChange,
  filterLabel = "Bo loc",
  filterValue = "",
  filterOptions = [],
  onFilterChange,
}: DataToolbarProps) {
  return (
    <div className="mb-4 grid gap-3 rounded-lg border border-slate-200 bg-white p-4 md:grid-cols-[1fr_180px_180px]">
      <label className="block">
        <span className="sr-only">Tim kiem</span>
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Tim kiem..."
        />
      </label>

      {filterOptions.length > 0 ? (
        <label className="block">
          <span className="sr-only">{filterLabel}</span>
          <Select
            value={filterValue}
            onChange={(event) => onFilterChange?.(event.target.value)}
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
        <span className="sr-only">Sap xep</span>
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
