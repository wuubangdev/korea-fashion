"use client";

import { AppShell } from "@/components/AppShell";
import { DataTable, type Column } from "@/components/DataTable";
import { DataToolbar } from "@/components/DataToolbar";
import { PageHeader } from "@/components/PageHeader";
import { Pagination } from "@/components/Pagination";
import { formatMoney } from "@/lib/format";
import { usePaginatedResource } from "@/hooks/usePaginatedResource";
import type { Product } from "@/types/api";

const columns: Column<Product>[] = [
  { key: "id", header: "ID", render: (item) => item.id, className: "w-20" },
  {
    key: "name",
    header: "Ten san pham",
    render: (item) => (
      <div>
        <div className="font-medium text-slate-950">{item.name}</div>
        <div className="line-clamp-1 text-xs text-slate-500">
          {item.description || "-"}
        </div>
      </div>
    ),
  },
  { key: "brand", header: "Thuong hieu", render: (item) => item.brand || "-" },
  { key: "origin", header: "Xuat xu", render: (item) => item.origin || "-" },
  {
    key: "price",
    header: "Gia",
    render: (item) => formatMoney(item.price),
    className: "text-right",
  },
];

export default function ProductsPage() {
  const resource = usePaginatedResource<Product>({ path: "/api/products" });

  return (
    <AppShell>
      <PageHeader
        title="San pham"
        description="Page mau lay du lieu tu /api/products voi phan trang, tim kiem, filter va sap xep."
      />
      <DataToolbar
        search={resource.search}
        sort={resource.sort}
        filterLabel="Xuat xu"
        filterValue={String(resource.filters?.origin ?? "")}
        filterOptions={[
          { label: "Han Quoc", value: "Korea" },
          { label: "Viet Nam", value: "Vietnam" },
          { label: "Trung Quoc", value: "China" },
        ]}
        onFilterChange={(value) => resource.updateFilter("origin", value)}
        onSearchChange={resource.setSearch}
        onSortChange={resource.setSort}
      />
      {resource.error ? <ErrorBox message={resource.error} /> : null}
      <DataTable
        columns={columns}
        data={resource.data.content}
        getRowKey={(item) => item.id}
        isLoading={resource.isLoading}
      />
      <Pagination
        page={resource.data.page}
        size={resource.data.size}
        totalElements={resource.data.totalElements}
        totalPages={resource.data.totalPages}
        onPageChange={resource.setPage}
        onSizeChange={resource.setSize}
      />
    </AppShell>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
      {message}
    </div>
  );
}
