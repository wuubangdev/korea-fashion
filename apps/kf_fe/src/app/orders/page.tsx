"use client";

import { AppShell } from "@/components/AppShell";
import { DataTable, type Column } from "@/components/DataTable";
import { DataToolbar } from "@/components/DataToolbar";
import { PageHeader } from "@/components/PageHeader";
import { Pagination } from "@/components/Pagination";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDate, formatMoney } from "@/lib/format";
import { usePaginatedResource } from "@/hooks/usePaginatedResource";
import type { Order } from "@/types/api";

const columns: Column<Order>[] = [
  { key: "id", header: "ID", render: (item) => item.id, className: "w-20" },
  { key: "date", header: "Ngay dat", render: (item) => formatDate(item.orderDate) },
  { key: "status", header: "Trang thai", render: (item) => <StatusBadge value={item.status} /> },
  {
    key: "shipping",
    header: "Giao hang",
    render: (item) => <StatusBadge value={item.shippingStatus} />,
  },
  { key: "shipper", header: "Shipper", render: (item) => item.shipperId || "-" },
  {
    key: "total",
    header: "Tong tien",
    render: (item) => formatMoney(item.total),
    className: "text-right",
  },
];

export default function OrdersPage() {
  const resource = usePaginatedResource<Order>({ path: "/api/orders" });

  return (
    <AppShell>
      <PageHeader
        title="Don hang"
        description="Page mau theo doi don hang voi search, filter trang thai, sap xep va phan trang."
      />
      <DataToolbar
        search={resource.search}
        sort={resource.sort}
        filterLabel="Trang thai"
        filterValue={String(resource.filters?.status ?? "")}
        filterOptions={[
          { label: "Pending", value: "PENDING" },
          { label: "Paid", value: "PAID" },
          { label: "Shipping", value: "SHIPPING" },
          { label: "Completed", value: "COMPLETED" },
          { label: "Cancelled", value: "CANCELLED" },
        ]}
        onFilterChange={(value) => resource.updateFilter("status", value)}
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
