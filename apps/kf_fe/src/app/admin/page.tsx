import Link from "next/link";
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

const stats = [
  {
    title: "Doanh thu hom nay",
    value: "18.4M",
    description: "+12% so voi hom qua",
  },
  {
    title: "Don hang moi",
    value: "24",
    description: "8 don dang cho xu ly",
  },
  {
    title: "Ty le hoan tat",
    value: "92%",
    description: "Don da giao thanh cong trong 7 ngay",
  },
  {
    title: "San pham sap het",
    value: "11",
    description: "Can kiem tra ton kho va bien the",
  },
];

const managementAreas = [
  {
    href: "/orders",
    title: "Don hang",
    description: "Duyet don, gan shipper, cap nhat thanh toan va trang thai giao hang.",
    badge: "Uu tien",
  },
  {
    href: "/products",
    title: "San pham",
    description: "Quan ly gia ban, mo ta, hinh anh, thuong hieu va xuat xu.",
    badge: "Catalog",
  },
  {
    href: "/categories",
    title: "Danh muc",
    description: "Sap xep nhom hang, collection va cau truc hien thi tren storefront.",
    badge: "Shop",
  },
  {
    href: "/users",
    title: "Nguoi dung",
    description: "Kiem tra tai khoan, vai tro quan tri va thong tin khach hang.",
    badge: "Access",
  },
];

const recentOrders = [
  { code: "KF-1028", customer: "Minh Anh", total: "1.290.000 VND", status: "Cho xu ly" },
  { code: "KF-1027", customer: "Thanh Truc", total: "840.000 VND", status: "Dang giao" },
  { code: "KF-1026", customer: "Ngoc Han", total: "2.150.000 VND", status: "Da thanh toan" },
  { code: "KF-1025", customer: "Gia Bao", total: "620.000 VND", status: "Can goi lai" },
];

const stockAlerts = [
  { name: "Seoul cropped blazer", sku: "KF-BLZ-01", stock: 3 },
  { name: "Soft pleated skirt", sku: "KF-SKT-04", stock: 5 },
  { name: "Minimal knit cardigan", sku: "KF-CDG-02", stock: 2 },
];

export default function AdminPage() {
  return (
    <AppShell>
      <PageHeader
        title="Dashboard"
        description="Tong quan van hanh cho nen tang thuong mai dien tu Korea Fashion."
        action={
          <div className="flex flex-wrap gap-3">
            <SeedDataButton />
            <Link href="/orders">
              <Button>Xu ly don hang</Button>
            </Link>
          </div>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </section>

      <section className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card>
          <CardHeader>
            <CardTitle>Can quan tri</CardTitle>
            <CardDescription>
              Cac khu vuc chinh de van hanh shop, xu ly don va cap nhat du lieu.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {managementAreas.map((area) => (
              <Link
                key={area.href}
                href={area.href}
                className="rounded-md border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:bg-slate-50"
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-sm font-semibold text-slate-950">
                    {area.title}
                  </h2>
                  <Badge>{area.badge}</Badge>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {area.description}
                </p>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ton kho can chu y</CardTitle>
            <CardDescription>
              San pham co so luong thap nen duoc nhap them hoac an khoi shop.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stockAlerts.map((item) => (
                <div
                  key={item.sku}
                  className="flex items-center justify-between gap-4 rounded-md border border-slate-200 p-3"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-slate-950">
                      {item.name}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">{item.sku}</div>
                  </div>
                  <Badge variant="warning">{item.stock} con</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card>
          <CardHeader>
            <CardTitle>Don hang gan day</CardTitle>
            <CardDescription>
              Theo doi nhanh cac don moi nhat truoc khi vao trang xu ly chi tiet.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-md border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">Ma don</th>
                    <th className="px-4 py-3 font-medium">Khach hang</th>
                    <th className="px-4 py-3 font-medium">Tong tien</th>
                    <th className="px-4 py-3 font-medium">Trang thai</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {recentOrders.map((order) => (
                    <tr key={order.code}>
                      <td className="px-4 py-3 font-medium text-slate-950">
                        {order.code}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{order.customer}</td>
                      <td className="px-4 py-3 text-slate-600">{order.total}</td>
                      <td className="px-4 py-3">
                        <Badge variant={order.status === "Can goi lai" ? "warning" : "secondary"}>
                          {order.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cong viec hom nay</CardTitle>
            <CardDescription>
              Checklist van hanh de giu shop on dinh trong ngay.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-slate-700">
              <Task label="Xac nhan don moi" value="8 viec" tone="amber" />
              <Task label="Cap nhat san pham sap het" value="11 SKU" tone="rose" />
              <Task label="Kiem tra tai khoan moi" value="5 user" tone="slate" />
              <Task label="Doi soat doanh thu" value="18.4M" tone="emerald" />
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
    slate: "bg-slate-100 text-slate-700",
  };

  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-slate-200 p-3">
      <span>{label}</span>
      <span className={`rounded-md px-2 py-1 text-xs font-medium ${tones[tone]}`}>
        {value}
      </span>
    </div>
  );
}
