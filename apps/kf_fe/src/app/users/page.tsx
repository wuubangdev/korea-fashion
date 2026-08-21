"use client";

import { AppShell } from "@/components/AppShell";
import { DataTable, type Column } from "@/components/DataTable";
import { DataToolbar } from "@/components/DataToolbar";
import { PageHeader } from "@/components/PageHeader";
import { Pagination } from "@/components/Pagination";
import { StatusBadge } from "@/components/StatusBadge";
import { usePaginatedResource } from "@/hooks/usePaginatedResource";
import type { User } from "@/types/api";

const columns: Column<User>[] = [
  { key: "id", header: "ID", render: (item) => item.id, className: "w-20" },
  {
    key: "username",
    header: "Username",
    render: (item) => <span className="font-medium text-slate-950">{item.username}</span>,
  },
  { key: "email", header: "Email", render: (item) => item.email || "-" },
  {
    key: "roles",
    header: "Vai trò",
    render: (item) => (
      <div className="flex flex-wrap gap-1">
        {(item.roles?.length ? item.roles : ["N/A"]).map((role) => (
          <StatusBadge key={role} value={role} />
        ))}
      </div>
    ),
  },
];

export default function UsersPage() {
  const resource = usePaginatedResource<User>({ path: "/api/users" });

  return (
    <AppShell>
      <PageHeader
        title="Người dùng"
        description="Quản lý người dùng, vai trò và thông tin tài khoản."
      />
      <DataToolbar
        search={resource.search}
        sort={resource.sort}
        filterLabel="Vai trò"
        filterValue={String(resource.filters?.role ?? "")}
        filterOptions={[
          { label: "Admin", value: "ADMIN" },
          { label: "Member", value: "MEMBER" },
          { label: "Shipper", value: "SHIPPER" },
        ]}
        onFilterChange={(value) => resource.updateFilter("role", value)}
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
