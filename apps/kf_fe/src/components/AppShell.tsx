import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  ChevronDown,
  ExternalLink,
  Home,
  Package,
  ReceiptText,
  Settings,
  ShoppingBag,
  UsersRound,
} from "lucide-react";
import { adminResourceGroupLabels, adminResourceGroups, adminResources } from "@/config/adminResources";
import { getAdminGroupLabel, getAdminResourceLabel } from "@/config/adminResourceDisplay";

const primaryNav = [
  { href: "/admin", icon: Home, label: "Tổng quan", meta: "Sức khỏe cửa hàng" },
  { href: "/admin/resources/orders", icon: ReceiptText, label: "Đơn hàng", meta: "Xử lý việc cần làm" },
  { href: "/admin/resources/products", icon: Package, label: "Sản phẩm", meta: "Giá, tồn kho, hình ảnh" },
  { href: "/admin/resources/categories", icon: ShoppingBag, label: "Danh mục", meta: "Nhóm hàng và menu" },
  { href: "/admin/resources/users", icon: UsersRound, label: "Khách hàng", meta: "Tài khoản và vai trò" },
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f6f7f4] text-slate-950 lg:grid lg:grid-cols-[272px_1fr]">
      <aside className="border-b border-stone-200 bg-[#fffdf8] lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
        <div className="flex h-full flex-col px-4 py-5">
          <div className="flex items-center justify-between gap-3">
            <Link href="/admin" className="min-w-0" aria-label="Korea Fashion admin">
              <Image
                src="/korea-fashion-logo.svg"
                alt="Korea Fashion"
                width={165}
                height={36}
                priority
                className="h-9 w-auto"
              />
              <div className="mt-1 text-xs font-medium uppercase text-slate-500">
                Quản trị bán hàng
              </div>
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-md border border-stone-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:border-stone-300 hover:text-slate-950"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Shop
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-2">
            <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3">
              <div className="text-xs font-medium text-emerald-700">Hôm nay</div>
              <div className="mt-1 text-lg font-semibold text-emerald-950">24</div>
              <div className="text-xs text-emerald-700">đơn mới</div>
            </div>
            <div className="rounded-md border border-amber-200 bg-amber-50 p-3">
              <div className="text-xs font-medium text-amber-700">Cần xử lý</div>
              <div className="mt-1 text-lg font-semibold text-amber-950">8</div>
              <div className="text-xs text-amber-700">việc</div>
            </div>
          </div>

          <nav className="mt-6 overflow-y-auto pr-1">
            <div className="px-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Làm việc nhanh
            </div>
            <div className="mt-2 space-y-1.5">
              {primaryNav.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 rounded-md px-3 py-2.5 transition hover:bg-stone-100"
                  >
                    <Icon className="h-4 w-4 shrink-0 text-slate-500" />
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-slate-900">{item.label}</span>
                      <span className="mt-0.5 block truncate text-xs text-slate-500">{item.meta}</span>
                    </span>
                  </Link>
                );
              })}
            </div>

            <details className="group mt-5 rounded-md border border-stone-200 bg-white">
              <summary className="flex list-none items-center justify-between gap-3 px-3 py-2.5 text-sm font-medium text-slate-800">
                <span className="inline-flex items-center gap-2">
                  <Settings className="h-4 w-4 text-slate-500" />
                  Tất cả chức năng
                </span>
                <ChevronDown className="h-4 w-4 text-slate-400 transition group-open:rotate-180" />
              </summary>
              <div className="border-t border-stone-200 px-2 py-2">
                {adminResourceGroups.map((group) => {
                  const resources = adminResources.filter((resource) => resource.group === group);

                  return (
                    <details key={group} className="group/nested rounded-md">
                      <summary className="flex list-none items-center justify-between rounded-md px-2 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500 hover:bg-stone-50">
                        {getAdminGroupLabel(group, adminResourceGroupLabels[group])}
                        <ChevronDown className="h-3.5 w-3.5 transition group-open/nested:rotate-180" />
                      </summary>
                      <div className="pb-2">
                        {resources.map((resource) => (
                          <Link
                            key={resource.slug}
                            href={`/admin/resources/${resource.slug}`}
                            className="block rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-stone-50 hover:text-slate-950"
                          >
                            {getAdminResourceLabel(resource.slug, resource.label)}
                          </Link>
                        ))}
                      </div>
                    </details>
                  );
                })}
              </div>
            </details>
          </nav>

          <div className="mt-6 rounded-md border border-stone-200 bg-white p-3 lg:mt-auto">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Hệ thống
            </div>
            <div className="mt-2 space-y-2 text-sm text-slate-700">
              <div className="flex items-center justify-between gap-3">
                <span>API</span>
                <span className="font-medium text-emerald-700">Hoạt động</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Phiên</span>
                <span className="font-medium text-slate-950">JWT</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="border-b border-stone-200 bg-[#fffdf8]/90 backdrop-blur">
          <div className="flex min-h-16 flex-col justify-center gap-1 px-4 py-4 sm:px-6 lg:px-8">
            <div className="text-sm font-medium text-slate-500">
              Bảng điều khiển quản trị
            </div>
            <div className="text-lg font-semibold tracking-tight">
              Quản lý cửa hàng Korea Fashion
            </div>
          </div>
        </header>
        <main className="w-full px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
