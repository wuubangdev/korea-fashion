"use client";

import { AppShell } from "@/components/AppShell";
import { DataTable, type Column } from "@/components/DataTable";
import { DataToolbar } from "@/components/DataToolbar";
import { PageHeader } from "@/components/PageHeader";
import { Pagination } from "@/components/Pagination";
import { usePaginatedResource } from "@/hooks/usePaginatedResource";
import type { Category } from "@/types/api";

const columns: Column<Category>[] = [
  { key: "id", header: "ID", render: (item) => item.id, className: "w-20" },
  { key: "code", header: "Ma", render: (item) => item.code || "-" },
  {
    key: "name",
    header: "Ten danh muc",
    render: (item) => <span className="font-medium text-slate-950">{item.name}</span>,
  },
  {
    key: "description",
    header: "Mo ta",
    render: (item) => item.description || "-",
  },
];

export default function CategoriesPage() {
  const resource = usePaginatedResource<Category>({ path: "/api/categories" });

  return (
    <AppShell>
      <PageHeader
        title="Danh muc"
        description="Page mau cho danh muc, dung chung hook phan trang va tim kiem."
      />
      <DataToolbar
        search={resource.search}
        sort={resource.sort}
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
