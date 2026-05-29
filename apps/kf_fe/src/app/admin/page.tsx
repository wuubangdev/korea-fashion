import Link from "next/link";
import { AlertTriangle, ClipboardList, Package, ReceiptText, UsersRound } from "lucide-react";
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
    title: "Sắp hết hàng",
    value: "11",
    description: "Cần kiểm tra tồn kho và biến thể",
  },
];

const priorityTasks = [
  {
    href: "/admin/resources/orders",
    icon: ReceiptText,
    title: "Xử lý đơn hàng",
    description: "Duyệt đơn mới, cập nhật thanh toán và trạng thái giao hàng.",
    badge: "8 việc",
  },
  {
    href: "/admin/resources/products",
    icon: Package,
    title: "Kiểm tra tồn kho",
    description: "Cập nhật SKU sắp hết, giá bán và trạng thái hiển thị.",
    badge: "11 SKU",
  },
  {
    href: "/admin/resources/users",
    icon: UsersRound,
    title: "Tài khoản mới",
    description: "Kiểm tra khách hàng, vai trò và quyền truy cập.",
    badge: "5 user",
  },
  {
    href: "/admin/resources/audit-logs",
    icon: ClipboardList,
    title: "Nhật ký hệ thống",
    description: "Theo dõi các thao tác quản trị gần đây.",
    badge: "Hệ thống",
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
        description="Những việc cần xử lý trước trong ngày, gom lại để màn hình admin dễ nhìn hơn."
        action={
          <div className="flex flex-wrap justify-end gap-2">
            <Link href="/admin/resources/orders">
              <Button>
                <ReceiptText className="h-4 w-4" />
                Xử lý đơn
              </Button>
            </Link>
            <SeedDataButton />
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
            <CardTitle>Việc ưu tiên</CardTitle>
            <CardDescription>
              Chỉ giữ các lối vào hay dùng nhất. Các chức năng còn lại nằm trong sidebar.
            </CardDescription>
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
            <CardTitle>Cần chú ý</CardTitle>
            <CardDescription>Mặt hàng tồn kho thấp nên xử lý trước khi tiếp tục bán.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stockAlerts.map((item) => (
                <div
                  key={item.sku}
                  className="flex items-center justify-between gap-4 rounded-md border border-stone-200 p-3"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-slate-950">{item.name}</div>
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
            <CardDescription>Theo dõi nhanh trước khi vào trang xử lý chi tiết.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-md border border-stone-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-stone-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">Mã đơn</th>
                    <th className="px-4 py-3 font-medium">Khách hàng</th>
                    <th className="px-4 py-3 font-medium">Tổng tiền</th>
                    <th className="px-4 py-3 font-medium">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 bg-white">
                  {recentOrders.map((order) => (
                    <tr key={order.code} className="hover:bg-stone-50/70">
                      <td className="px-4 py-3 font-medium text-slate-950">{order.code}</td>
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
            <CardTitle>Checklist hôm nay</CardTitle>
            <CardDescription>Những việc lặp lại hằng ngày để giữ shop ổn định.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-slate-700">
              <Task label="Xác nhận đơn mới" value="8 việc" tone="amber" />
              <Task label="Cập nhật hàng sắp hết" value="11 SKU" tone="rose" />
              <Task label="Kiểm tra tài khoản mới" value="5 user" tone="slate" />
              <Task label="Đối soát doanh thu" value="18.4M" tone="emerald" />
            </div>
            <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>Hãy ưu tiên các mục có nhãn vàng hoặc đỏ trước khi thao tác với dữ liệu phụ.</span>
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
