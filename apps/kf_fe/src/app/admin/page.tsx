"use client";

import Link from "next/link";
import { AlertTriangle, ClipboardList, Package, ReceiptText, Tags, UsersRound } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { SeedDataButton } from "@/components/SeedDataButton";
import { StatCard } from "@/components/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useApiResource } from "@/hooks/useApiResource";
import { formatMoney } from "@/lib/format";
import type { Order, Product } from "@/types/api";

type AdminDashboardStats = {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalCategories: number;
  lowStockProducts: number;
  revenueTotal?: number | string;
};

const emptyStats: AdminDashboardStats = {
  lowStockProducts: 0,
  totalCategories: 0,
  totalOrders: 0,
  totalProducts: 0,
  totalUsers: 0,
};

export default function AdminPage() {
  const statsResource = useApiResource<AdminDashboardStats>({
    path: "/api/admin/dashboard/stats",
    query: { lowStockThreshold: 5 },
  });
  const lowStockResource = useApiResource<Product[]>({
    path: "/api/admin/dashboard/low-stock-products",
    query: { threshold: 5, size: 6 },
  });
  const recentOrdersResource = useApiResource<Order[]>({
    path: "/api/admin/dashboard/recent-orders",
    query: { size: 6 },
  });

  const stats = statsResource.data ?? emptyStats;
  const lowStockProducts = lowStockResource.data ?? [];
  const recentOrders = recentOrdersResource.data ?? [];
  const pendingOrders = recentOrders.filter((order) => ["NEW", "PENDING", "PROCESSING"].includes(String(order.status ?? ""))).length;

  const statCards = [
    {
      description: "Tong doanh thu tu don hang",
      title: "Doanh thu",
      value: formatMoney(stats.revenueTotal ?? 0),
    },
    {
      description: `${pendingOrders} don gan day can xu ly`,
      title: "Don hang",
      value: formatNumber(stats.totalOrders),
    },
    {
      description: `${formatNumber(stats.totalCategories)} danh muc dang quan ly`,
      title: "San pham",
      value: formatNumber(stats.totalProducts),
    },
    {
      description: "San pham co ton kho <= 5",
      title: "Sap het hang",
      value: formatNumber(stats.lowStockProducts),
    },
  ];

  const priorityTasks = [
    {
      badge: `${pendingOrders} viec`,
      description: "Duyet don moi, cap nhat thanh toan va trang thai giao hang.",
      href: "/admin/resources/orders",
      icon: ReceiptText,
      title: "Xu ly don hang",
    },
    {
      badge: `${stats.lowStockProducts} SKU`,
      description: "Cap nhat SKU sap het, gia ban va trang thai hien thi.",
      href: "/admin/resources/products",
      icon: Package,
      title: "Kiem tra ton kho",
    },
    {
      badge: formatNumber(stats.totalUsers),
      description: "Kiem tra khach hang, vai tro va quyen truy cap.",
      href: "/admin/resources/users",
      icon: UsersRound,
      title: "Tai khoan",
    },
    {
      badge: formatNumber(stats.totalCategories),
      description: "Quan ly nhom hang, menu danh muc va cau truc dieu huong.",
      href: "/admin/resources/categories",
      icon: Tags,
      title: "Danh muc",
    },
  ];

  return (
    <AppShell>
      <PageHeader
        title="Tong quan"
        description="Du lieu dashboard duoc lay truc tiep tu API admin."
        action={
          <div className="flex flex-wrap justify-end gap-2">
            <Link href="/admin/resources/orders">
              <Button>
                <ReceiptText className="h-4 w-4" />
                Xu ly don
              </Button>
            </Link>
            <SeedDataButton />
          </div>
        }
      />

      {statsResource.error || lowStockResource.error || recentOrdersResource.error ? (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {statsResource.error ?? lowStockResource.error ?? recentOrdersResource.error}
        </div>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </section>

      <section className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card>
          <CardHeader>
            <CardTitle>Viec uu tien</CardTitle>
            <CardDescription>Cac loi vao hay dung nhat, kem so lieu hien tai tu API.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {priorityTasks.map((task) => {
              const Icon = task.icon;

              return (
                <Link
                  key={task.href}
                  href={task.href}
                  className="rounded-md border border-stone-200 bg-white p-4 transition hover:border-stone-300 hover:bg-stone-50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 place-items-center rounded-md bg-emerald-50 text-emerald-700">
                        <Icon className="h-4 w-4" />
                      </span>
                      <h2 className="text-sm font-semibold text-slate-950">{task.title}</h2>
                    </div>
                    <Badge>{task.badge}</Badge>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{task.description}</p>
                </Link>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Can chu y</CardTitle>
            <CardDescription>Mat hang ton kho thap duoc lay tu API dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockProducts.length ? (
                lowStockProducts.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 rounded-md border border-stone-200 p-3"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-slate-950">{item.name}</div>
                      <div className="mt-1 text-xs text-slate-500">{item.sku ?? `ID ${item.id}`}</div>
                    </div>
                    <Badge variant="warning">{item.stockQuantity ?? 0} con</Badge>
                  </div>
                ))
              ) : (
                <p className="rounded-md border border-dashed border-stone-300 p-4 text-sm text-slate-500">
                  Chua co san pham sap het hang.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card>
          <CardHeader>
            <CardTitle>Don hang gan day</CardTitle>
            <CardDescription>Danh sach moi nhat tu API dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-md border border-stone-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-stone-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">Ma don</th>
                    <th className="px-4 py-3 font-medium">Khach hang</th>
                    <th className="px-4 py-3 font-medium">Tong tien</th>
                    <th className="px-4 py-3 font-medium">Trang thai</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 bg-white">
                  {recentOrders.length ? (
                    recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-stone-50/70">
                        <td className="px-4 py-3 font-medium text-slate-950">{order.orderCode ?? `#${order.id}`}</td>
                        <td className="px-4 py-3 text-slate-600">{order.customerName ?? order.customerPhone ?? "-"}</td>
                        <td className="px-4 py-3 text-slate-600">{formatMoney(order.grandTotal ?? order.total)}</td>
                        <td className="px-4 py-3">
                          <Badge variant={isAttentionStatus(order.status) ? "warning" : "secondary"}>
                            {order.status ?? "-"}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="px-4 py-6 text-center text-slate-500" colSpan={4}>
                        Chua co don hang gan day.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Checklist hom nay</CardTitle>
            <CardDescription>Cac viec lap lai hang ngay dua tren du lieu hien tai.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-slate-700">
              <Task label="Xac nhan don moi" value={`${pendingOrders} viec`} tone="amber" />
              <Task label="Cap nhat hang sap het" value={`${stats.lowStockProducts} SKU`} tone="rose" />
              <Task label="Kiem tra tai khoan" value={formatNumber(stats.totalUsers)} tone="slate" />
              <Task label="Doi soat doanh thu" value={formatMoney(stats.revenueTotal ?? 0)} tone="emerald" />
            </div>
            <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>Uu tien cac muc co so lieu bat thuong truoc khi thao tac voi du lieu phu.</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}

function Task({
  label,
  tone,
  value,
}: {
  label: string;
  tone: "amber" | "emerald" | "rose" | "slate";
  value: string;
}) {
  const tones = {
    amber: "bg-amber-50 text-amber-700",
    emerald: "bg-emerald-50 text-emerald-700",
    rose: "bg-rose-50 text-rose-700",
    slate: "bg-stone-100 text-slate-700",
  };

  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-stone-200 p-3">
      <span>{label}</span>
      <span className={`rounded-md px-2 py-1 text-xs font-medium ${tones[tone]}`}>
        {value}
      </span>
    </div>
  );
}

function formatNumber(value?: number) {
  return new Intl.NumberFormat("vi-VN").format(value ?? 0);
}

function isAttentionStatus(status?: string) {
  return ["NEW", "PENDING", "PROCESSING", "FAILED", "CANCELLED"].includes(String(status ?? ""));
}
