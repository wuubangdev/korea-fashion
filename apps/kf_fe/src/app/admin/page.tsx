import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { SeedDataButton } from "@/components/SeedDataButton";
import { StatCard } from "@/components/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { adminResourceGroupLabels, adminResourceGroups, adminResources } from "@/config/adminResources";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const stats = [
  {
    title: "Doanh thu hôm nay",
    value: "18.4M",
    description: "+12% so với hôm qua",
  },
  {
    title: "Đơn hàng mới",
    value: "24",
    description: "8 đơn đang chờ xử lý",
  },
  {
    title: "Tỷ lệ hoàn tất",
    value: "92%",
    description: "Đơn đã giao thành công trong 7 ngày",
  },
  {
    title: "Sản phẩm sắp hết",
    value: "11",
    description: "Cần kiểm tra tồn kho và biến thể",
  },
];

const managementAreas = [
  {
    href: "/admin/resources/orders",
    title: "Đơn hàng",
    description: "Duyệt đơn, gán shipper, cập nhật thanh toán và trạng thái giao hàng.",
    badge: "Ưu tiên",
  },
  {
    href: "/admin/resources/products",
    title: "Sản phẩm",
    description: "Quản lý giá bán, mô tả, hình ảnh, thương hiệu và xuất xứ.",
    badge: "Danh mục",
  },
  {
    href: "/admin/resources/categories",
    title: "Danh mục",
    description: "Sắp xếp nhóm hàng, bộ sưu tập và cấu trúc hiển thị ngoài cửa hàng.",
    badge: "Cửa hàng",
  },
  {
    href: "/admin/resources/users",
    title: "Người dùng",
    description: "Kiểm tra tài khoản, vai trò quản trị và thông tin khách hàng.",
    badge: "Truy cập",
  },
];

const recentOrders = [
  { code: "KF-1028", customer: "Minh Anh", total: "1.290.000 VND", status: "Chờ xử lý" },
  { code: "KF-1027", customer: "Thanh Trúc", total: "840.000 VND", status: "Đang giao" },
  { code: "KF-1026", customer: "Ngọc Hân", total: "2.150.000 VND", status: "Đã thanh toán" },
  { code: "KF-1025", customer: "Gia Bảo", total: "620.000 VND", status: "Cần gọi lại" },
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
        title="Tổng quan"
        description="Tổng quan vận hành cho nền tảng thương mại điện tử Korea Fashion."
        action={
          <div className="flex flex-wrap gap-3">
            <SeedDataButton />
            <Link href="/admin/resources/orders">
              <Button>Xử lý đơn hàng</Button>
            </Link>
          </div>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </section>

      <section className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Tất cả endpoint quản trị</CardTitle>
            <CardDescription>
              Danh sách resource được map từ các controller BE để admin truy cập nhanh.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5">
            {adminResourceGroups.map((group) => {
              const resources = adminResources.filter((resource) => resource.group === group);

              return (
                <div key={group}>
                  <div className="mb-2 flex items-center gap-2">
                    <h2 className="text-sm font-semibold text-slate-950">{adminResourceGroupLabels[group]}</h2>
                    <Badge>{resources.length}</Badge>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                    {resources.map((resource) => (
                      <Link
                        key={resource.slug}
                        href={`/admin/resources/${resource.slug}`}
                        className="rounded-md border border-slate-200 bg-white p-3 transition hover:border-slate-300 hover:bg-slate-50"
                      >
                        <div className="text-sm font-medium text-slate-950">{resource.label}</div>
                        <div className="mt-1 truncate text-xs text-slate-500">{resource.path}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </section>

      <section className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card>
          <CardHeader>
            <CardTitle>Cần quản trị</CardTitle>
            <CardDescription>
              Các khu vực chính để vận hành shop, xử lý đơn và cập nhật dữ liệu.
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
            <CardTitle>Tồn kho cần chú ý</CardTitle>
            <CardDescription>
              Sản phẩm có số lượng thấp nên được nhập thêm hoặc ẩn khỏi shop.
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
                  <Badge variant="warning">{item.stock} còn</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card>
          <CardHeader>
            <CardTitle>Đơn hàng gần đây</CardTitle>
            <CardDescription>
              Theo dõi nhanh các đơn mới nhất trước khi vào trang xử lý chi tiết.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-md border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">Mã đơn</th>
                    <th className="px-4 py-3 font-medium">Khách hàng</th>
                    <th className="px-4 py-3 font-medium">Tổng tiền</th>
                    <th className="px-4 py-3 font-medium">Trạng thái</th>
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
                        <Badge variant={order.status === "Cần gọi lại" ? "warning" : "secondary"}>
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
            <CardTitle>Công việc hôm nay</CardTitle>
            <CardDescription>
              Checklist vận hành để giữ shop ổn định trong ngày.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-slate-700">
              <Task label="Xác nhận đơn mới" value="8 việc" tone="amber" />
              <Task label="Cập nhật sản phẩm sắp hết" value="11 SKU" tone="rose" />
              <Task label="Kiểm tra tài khoản mới" value="5 user" tone="slate" />
              <Task label="Đối soát doanh thu" value="18.4M" tone="emerald" />
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
