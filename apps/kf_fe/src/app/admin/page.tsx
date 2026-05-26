import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const stats = [
  {
    title: "San pham",
    value: "API",
    description: "Ket noi /api/products bang hook dung chung.",
  },
  {
    title: "Don hang",
    value: "Live",
    description: "Theo doi trang thai, shipper va tong tien.",
  },
  {
    title: "Nguoi dung",
    value: "Auth",
    description: "Doc token tu localStorage.kf_token.",
  },
];

const modules = [
  {
    href: "/products",
    title: "Quan ly san pham",
    description: "Bang du lieu co search, sort, filter xuat xu va phan trang.",
    badge: "Catalog",
  },
  {
    href: "/categories",
    title: "Quan ly danh muc",
    description: "Danh sach danh muc dung PageResult tu backend.",
    badge: "Master data",
  },
  {
    href: "/orders",
    title: "Quan ly don hang",
    description: "Trang mau cho trang thai don va trang thai giao hang.",
    badge: "Operation",
  },
  {
    href: "/users",
    title: "Quan ly nguoi dung",
    description: "Bang user co filter vai tro de mo rong sau.",
    badge: "Access",
  },
];

export default function AdminPage() {
  return (
    <AppShell>
      <PageHeader
        title="Admin dashboard"
        description="Trang admin mau dung bo component ui kieu shadcn: card, badge, loader, table, input, select va button."
      />

      <section className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-[1fr_340px]">
        <Card className="animate-in">
          <CardHeader>
            <CardTitle>Module quan tri</CardTitle>
            <CardDescription>
              Cac route mau da san sang de gan CRUD form va phan quyen.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {modules.map((module) => (
              <Link
                key={module.href}
                href={module.href}
                className="rounded-lg border border-slate-200 p-4 transition hover:border-slate-300 hover:bg-slate-50"
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-sm font-semibold text-slate-950">
                    {module.title}
                  </h2>
                  <Badge>{module.badge}</Badge>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {module.description}
                </p>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card className="animate-in">
          <CardHeader>
            <CardTitle>Trang thai tich hop</CardTitle>
            <CardDescription>
              Cac viec nen noi tiep sau khi co UI nen.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-slate-700">
              <div className="flex items-center justify-between gap-3">
                <span>API client</span>
                <Badge variant="success">Done</Badge>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Paginated hook</span>
                <Badge variant="success">Done</Badge>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Login form</span>
                <Badge variant="warning">Next</Badge>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>CRUD modal</span>
                <Badge variant="warning">Next</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}
